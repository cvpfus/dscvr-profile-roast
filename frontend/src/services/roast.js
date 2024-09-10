import axios from "axios";

const BASE_URL = "https://omen.tail81c24b.ts.net/api/api/llm";

const generateRoast = async (username) => {
  const data = {
    username,
  };

  try {
    return await axios.post(BASE_URL, data);
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export default { generateRoast };
