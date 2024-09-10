import { generateSigner } from "@metaplex-foundation/umi";
import { createCollection } from "@metaplex-foundation/mpl-core";

import { PASSWORD, UMI0 } from "../config/index.js";
import { getAllCollections } from "../utils/collection.js";

const addCollection = async (req, res) => {
  try {
    const body = req.body;
    if (!body.password) return res.status(401).json({ error: "unauthorized" });
    if (body.password !== PASSWORD)
      return res.status(401).json({ error: "wrong password" });

    const collectionSigner = generateSigner(UMI0);
    await createCollection(UMI0, {
      collection: collectionSigner,
      name: "My Collection",
      uri: "https://example.com/my-collection.json",
    }).sendAndConfirm(UMI0);

    res.json({ message: "collection created" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCollections = async (_, res) => {
  try {
    const collections = await getAllCollections();

    res.json(collections);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default { addCollection, getCollections };
