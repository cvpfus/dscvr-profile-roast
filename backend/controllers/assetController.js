import { generateSigner, publicKey } from "@metaplex-foundation/umi";
import {
  create,
  ExternalPluginAdapterSchema,
} from "@metaplex-foundation/mpl-core";

import { S3, txBuilder, UMI0 } from "../config/index.js";
import {
  COLLECTION_ADDRESS,
  TEST_ADDRESS,
  TEST_ADDRESS_2,
} from "../constants/index.js";
import {
  getAllAssets,
  getAllAssetsByOwner,
  decodeSvg,
} from "../utils/asset.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import puppeteer from "puppeteer";
import { EMBED_FONT, HTML_TEMPLATE } from "../template/template.js";
import * as htmlToImage from "html-to-image";
import chromium from "chrome-aws-lambda";

const mintAsset = async (req, res) => {
  try {
    const body = req.body;
    // TODO: add auth

    const missingFields = [];

    if (!body.userAddress) missingFields.push("userAddress");

    if (missingFields.length > 0)
      return res
        .status(400)
        .json({ error: `${missingFields.join(", ")} not provided` });

    let dataUrl;
    let browser;

    try {
      browser = await chromium.puppeteer.launch({
        args: [
          "--disable-web-security",
          "--disable-features=IsolateOrigins",
          "--disable-site-isolation-trials",
          "--no-sandbox",
          "--disable-setuid-sandbox",
        ],
        ignoreDefaultArgs: ["--disable-extensions"],
        headless: true,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
      });
      const page = await browser.newPage();

      await page.setContent(HTML_TEMPLATE);

      await page.addStyleTag({ path: "./template/output.css" });

      dataUrl = await page.evaluate(async (EMBED_FONT) => {
        const node = document.getElementById("container");
        return await htmlToImage.toSvg(node);
      }, EMBED_FONT);

      await browser.close();
    } catch (error) {
      if (browser) await browser.close();
      return res
        .status(500)
        .json({ error: error.message || "An unknown error occurred" });
    }

    const owner = publicKey(body.userAddress);

    const id = nanoid();

    const imagePath = `image/${id}.svg`;
    const jsonPath = `metadata/${id}.json`;

    const imageParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: imagePath,
      Body: decodeSvg(dataUrl),
      ContentType: "image/svg+xml",
    };

    await S3.send(new PutObjectCommand(imageParams));

    const jsonParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: jsonPath,
      Body: JSON.stringify({
        name: "Test",
        description: "Description",
        image: `https://storage.cvpfus.xyz/${imagePath}`,
        external_url: "https://cvpfus.xyz",
      }),
      ContentType: "application/json",
    };

    // TODO: add attributes fields
    await S3.send(new PutObjectCommand(jsonParams));

    const assetSigner = generateSigner(UMI0);

    const transaction = await create(UMI0, {
      asset: assetSigner,
      collection: {
        publicKey: COLLECTION_ADDRESS,
      },
      owner: publicKey(TEST_ADDRESS_2),
      name: id,
      uri: `https://storage.cvpfus.xyz/${jsonPath}`,
      plugins: [
        {
          type: "AppData",
          dataAuthority: {
            type: "Address",
            address: publicKey(TEST_ADDRESS),
          },
          schema: ExternalPluginAdapterSchema.Json,
        },
      ],
    }).buildAndSign(UMI0);

    const signature = await UMI0.rpc.sendTransaction(transaction);
    await txBuilder.confirm(UMI0, signature);

    return res.json({
      message: {
        imageUri: `https://storage.cvpfus.xyz/${imagePath}`,
        publicKey: transaction.message.accounts[1],
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

export default { mintAsset, getAssets, getAssetsByOwner };
