import express from "express";
import assetController from "../controllers/assetController.js";

const router = express.Router();

router.route("/").post(assetController.mintAsset);
router.route("/all").get(assetController.getAssets);
router.route("/all/:owner").get(assetController.getAssetsByOwner);

export default router;
