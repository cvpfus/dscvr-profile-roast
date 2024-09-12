import { AKASH_API_KEY, groq } from "../config/index.js";
import axios from "axios";
import { AKASH_API_URL2 } from "../constants/index.js";

export const akashGenerateContent = async (prompt) => {
  try {
    const config = {
      headers: {
        Authorization: AKASH_API_KEY,
      },
    };

    const data = {
      model: "Meta-Llama-3-1-405B-Instruct-FP8",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    const response = await axios.post(AKASH_API_URL2, data, config);

    return response.data.choices[0].message.content;
  }
  catch (error) {
    return error;
  }
};

export const groqGenerateContent = async (prompt) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-groq-70b-8192-tool-use-preview",
    });

    return chatCompletion.choices[0].message.content;
  }
  catch (error) {
    return error;
  }
};
