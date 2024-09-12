import { generateRoast } from "../utils/roast.js";

const getRoast = async (req, res) => {
  const body = req.body;
  if (!body.username)
    return res.status(400).json({ message: "username not provided" });

  try {
    const roast = await generateRoast(body.username);
    if (!roast)
      return res.status(500).json({ error: "Failed to generate roast" });
    return res.json({ message: roast });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "An unknown error occurred" });
  }
};

export default { getRoast };
