import axios from "axios";
import {
  burn,
  fetchAssetsByCollection,
  fetchAssetsByOwner,
} from "@metaplex-foundation/mpl-core";
import toast from "react-hot-toast";
import { COLLECTION_ADDRESS, LIMIT } from "@/constants/index.js";
import { isEmpty } from "lodash-es";

const BASE_URL = "https://omen.tail81c24b.ts.net/api/api/asset";

const addAsset = async ({ userAddress, username }) => {
  const data = {
    userAddress,
    username,
  };

  try {
    return await axios.post(BASE_URL, data);
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "An unknown error occurred",
    );
  }
};

const removeAsset = async ({ umi, asset }) => {
  try {
    await burn(umi, {
      asset: {
        publicKey: asset.publicKey,
      },
      collection: {
        publicKey: asset.updateAuthority.address,
      },
    }).sendAndConfirm(umi);

    await axios.delete(`${BASE_URL}/deleteOffchainData`, {
      data: {
        publicKey: asset.publicKey,
      },
    });
    toast.success(`Asset burned 🔥`);
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "An unknown error occurred",
    );
  }
};

const getAssets = async ({ umi, page }) => {
  const offset = (page - 1) * LIMIT;

  try {
    const assets = await fetchAssetsByCollection(umi, COLLECTION_ADDRESS);

    const paginatedAssets = assets.slice(offset, offset + LIMIT);

    paginatedAssets.sort((a, b) => {
      if (a.appDatas && b.appDatas) {
        const aLength = Object.values(b.appDatas[0].data ?? {}).length ?? 0;
        const bLength = Object.values(a.appDatas[0].data ?? {}).length ?? 0;
        return aLength - bLength;
      }
      return true;
    });

    const totalAssets = assets.length;
    const maxPage = Math.ceil(totalAssets / LIMIT);

    const assetsWithImage = await Promise.all(
      paginatedAssets.map(async (asset) => {
        try {
          const response = await axios.get(asset.uri);
          return {
            ...asset,
            imageUri: response.data.image,
          };
        } catch (error) {
          console.error(error.message);
          return {
            ...asset,
            imageUri: "",
          };
        }
      }),
    );

    return {
      maxPage,
      assets: assetsWithImage.map((asset) => ({
        ...asset,
        appDatas:
          asset.appDatas && asset.appDatas[0].data
            ? asset.appDatas[0].data
            : {},
      })),
    };
  } catch (error) {
    toast.error(
      error.response?.data?.error ||
        error.message ||
        "An unknown error occurred",
    );
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "An unknown error occurred",
    );
  }
};

const getAssetsByOwner = async ({ umi, address, page }) => {
  const offset = (page - 1) * LIMIT;

  try {
    const assets = await fetchAssetsByOwner(umi, address);

    const paginatedAssets = assets.slice(offset, offset + LIMIT);

    const totalAssets = assets.length;
    const maxPage = Math.ceil(totalAssets / LIMIT);

    const assetsWithImage = await Promise.all(
      paginatedAssets.map(async (asset) => {
        try {
          const response = await axios.get(asset.uri);
          return {
            ...asset,
            imageUri: response.data.image,
          };
        } catch (error) {
          toast.error(error.message);
          console.error(error.message);
          return {
            asset,
          };
        }
      }),
    );

    return { maxPage, assets: assetsWithImage };
  } catch (error) {
    toast.error(
      error.response?.data?.error ||
        error.message ||
        "An unknown error occurred",
    );
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "An unknown error occurred",
    );
  }
};

export default { addAsset, removeAsset, getAssets, getAssetsByOwner };
