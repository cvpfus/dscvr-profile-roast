import express from "express";
import collectionRoutes from "./routes/collectionRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import llmRoutes from "./routes/llmRoutes.js";
import pluginRoutes from "./routes/pluginRoutes.js";
import { PORT, PRIVATE_KEY, SECRET_KEY } from "./config/index.js";
import cors from "cors";

const app = express();

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.use("/api/collection", collectionRoutes);
app.use("/api/asset", assetRoutes);
app.use("/api/llm", llmRoutes);
app.use("/api/plugin", pluginRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
