import { fetchAssetsByOwner } from "@metaplex-foundation/mpl-core";
import { TEST_ADDRESS_2 } from "../constants/index.js";
import { UMI0 } from "../config/index.js";
import rateLimit from "express-rate-limit";

export const getAllAssets = async () => {
  return await fetchAssetsByOwner(UMI0, TEST_ADDRESS_2);
};

export const getAllAssetsByOwner = async (owner) => {
  return await fetchAssetsByOwner(UMI0, owner);
};

export const decodeSvg = (dataString) => {
  return decodeURIComponent(dataString.split(",")[1]);
};

export const apiRateLimiter = rateLimit({
  windowMs: 6 * 60 * 60 * 1000,
  max: 1,
  message: JSON.stringify({
    error: "You have exceeded the 5 mints in 6 hours limit",
  }),
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
