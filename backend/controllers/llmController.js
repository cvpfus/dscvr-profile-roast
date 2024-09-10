import { AKASH_API_KEY } from "../config/index.js";
import axios from "axios";
import {AKASH_API_URL, AKASH_API_URL2, PROMPT, PROMPT2, PROMPT3} from "../constants/index.js";
import { getRoastData } from "../utils/roast.js";

const generateRoast = async (req, res) => {
  const body = req.body;
  if (!body.username)
    return res.status(400).json({ message: "username not provided" });

  const config = {
    headers: {
      Authorization: AKASH_API_KEY,
    },
  };

  const roastData = await getRoastData(body.username);

  const prompt = `
  ${PROMPT2}
  
  ${roastData}
  `;

  const data = {
    model: "Meta-Llama-3-1-405B-Instruct-FP8",
    messages: [
      {
        role: "user",
        content: prompt
      },
    ],
  };

  try {
    const response = await axios.post(AKASH_API_URL2, data, config);

    return res.json({message: response.data.choices[0].message.content});
  }
  catch (error) {
    return res.status(500).json({error: error.message || "An unknown error occurred"})
  }
};

export default { generateRoast };
