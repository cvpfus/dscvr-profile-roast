import {
  generateSigner,
  publicKey,
  transactionBuilder,
} from "@metaplex-foundation/umi";
import {
  create,
  update,
  updateV1,
  ExternalPluginAdapterSchema,
  transfer,
  transferV1,
  updateV2,
  fetchAsset,
  fetchCollection,
} from "@metaplex-foundation/mpl-core";

import { S3, UMI0 } from "../config/index.js";
import { COLLECTION_ADDRESS, TEST_ADDRESS } from "../constants/index.js";
import {
  getAllAssets,
  getAllAssetsByOwner,
  decodeSvg,
} from "../utils/asset.js";
import { PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import puppeteer from "puppeteer";
import { EMBED_FONT, HTML_TEMPLATE } from "../template/template.js";
import * as htmlToImage from "html-to-image";
import { generateRoast } from "../utils/roast.js";
import { getUmi } from "../utils/umi.js";

const mintAsset = async (req, res) => {
  try {
    const body = req.body;
    // TODO: add auth

    const missingFields = [];

    if (!body.userAddress) missingFields.push("userAddress");
    if (!body.username) missingFields.push("username");

    if (missingFields.length > 0)
      return res
        .status(400)
        .json({ error: `${missingFields.join(", ")} not provided` });

    let dataUrl;
    let browser;
    let roast;

    try {
      roast = await generateRoast(body.username);

      if (!roast?.content)
        return res.status(500).json({ error: "Failed to generate roast" });

      browser = await puppeteer.launch({
        args: [
          "--disable-web-security",
          "--disable-features=IsolateOrigins",
          "--disable-site-isolation-trials",
          "--no-sandbox",
          "--disable-setuid-sandbox",
        ],
        ignoreDefaultArgs: ["--disable-extensions"],
      });
      const page = await browser.newPage();

      await page.setContent(HTML_TEMPLATE);

      await page.addStyleTag({ path: "./template/output.css" });

      dataUrl = await page.evaluate(
        async (EMBED_FONT, username, roast) => {
          const header = document.getElementById("header");
          const content = document.getElementById("content");
          header.innerHTML = `${username} on DSCVR`;
          content.innerHTML = roast;
          const node = document.getElementById("container");
          return await htmlToImage.toSvg(node, {
            fontEmbedCSS: EMBED_FONT,
          });
        },
        EMBED_FONT,
        body.username,
        roast.content,
      );

      await browser.close();
    } catch (error) {
      if (browser) await browser.close();
      return res
        .status(500)
        .json({ error: error.message || "An unknown error occurred" });
    }

    const owner = publicKey(body.userAddress);

    const assetSigner = generateSigner(UMI0);

    const imagePath = `image/${assetSigner.publicKey}.svg`;
    const jsonPath = `metadata/${assetSigner.publicKey}.json`;

    await create(UMI0, {
      asset: assetSigner,
      collection: {
        publicKey: COLLECTION_ADDRESS,
      },
      owner: owner,
      name: `${body.username} - RoastMeAI NFT`,
      uri: `https://storage.cvpfus.xyz/${jsonPath}`,
      plugins: [
        {
          type: "Attributes",
          attributeList: [
            { key: "modelName", value: roast.modelName },
            { key: "roastResult", value: roast.content },
          ],
        },
        {
          type: "AppData",
          dataAuthority: {
            type: "Address",
            address: publicKey(TEST_ADDRESS),
          },
          schema: ExternalPluginAdapterSchema.Json,
        },
      ],
    }).sendAndConfirm(UMI0);

    const imageParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: imagePath,
      Body: decodeSvg(dataUrl),
      ContentType: "image/svg+xml",
    };

    const jsonParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: jsonPath,
      Body: JSON.stringify({
        name: `${body.username} - RoastMeAI NFT`,
        description: `Roast result for a DSCVR profile`,
        image: `https://storage.cvpfus.xyz/${imagePath}`,
        external_url: "https://cvpfus.xyz",
        attributes: [{ trait_type: "roastResult", value: roast.content }],
      }),
      ContentType: "application/json",
    };

    await S3.send(new PutObjectCommand(imageParams));
    await S3.send(new PutObjectCommand(jsonParams));

    return res.json({
      message: {
        imageUri: `https://storage.cvpfus.xyz/${imagePath}`,
        publicKey: assetSigner.publicKey,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "An unknown error occurred" });
  }
};

const getAssets = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1;

  const offset = (page - 1) * limit;

  try {
    const assets = await getAllAssets();

    const paginatedAssets = assets.slice(offset, offset + limit);

    const totalAssets = assets.length;
    const maxPage = Math.ceil(totalAssets / limit);

    return res.json({
      maxPage,
      assets: paginatedAssets.map((asset) => ({
        ...asset,
        programAddress: TEST_ADDRESS,
      })),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "An unknown error occurred" });
  }
};

const getAssetsByOwner = async (req, res) => {
  const owner = req.params.owner;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1;

  const offset = (page - 1) * limit;

  try {
    const assets = await getAllAssetsByOwner(owner);

    const paginatedAssets = assets.slice(offset, offset + limit);

    const totalAssets = assets.length;
    const maxPage = Math.ceil(totalAssets / limit);

    return res.json({ maxPage, assets: paginatedAssets });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "An unknown error occurred" });
  }
};

export const deleteOffchainData = async (req, res) => {
  const body = req.body;
  if (!body.publicKey)
    return res.status(400).json({ error: "publicKey not provided" });

  const umi = getUmi();

  try {
    const asset = await umi.rpc.getAsset(publicKey(body.publicKey));

    if (!asset.burnt)
      return res.status(500).json({
        error: "Failed to delete offchain data",
      });

    const deleteParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Delete: {
        Objects: [
          { Key: `metadata/${body.publicKey}.json` },
          { Key: `image/${body.publicKey}.svg` },
        ],
        Quiet: false,
      },
    };

    await S3.send(new DeleteObjectsCommand(deleteParams));

    return res.json({ message: "Offchain data has been successfully deleted" });
  } catch (error) {
    console.log("error", error.message);
    return res
      .status(500)
      .json({ error: error.message || "An unknown error occurred" });
  }
};

export default { mintAsset, getAssets, getAssetsByOwner, deleteOffchainData };
