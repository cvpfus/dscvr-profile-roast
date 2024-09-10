import axios from "axios";

const BASE_URL = "https://omen.tail81c24b.ts.net/api/api/plugin";

const addReaction = async ({
  username,
  signature,
  reaction,
  userAddress,
  assetAddress,
}) => {
  try {
    return await axios.post(BASE_URL, {
      username,
      signature,
      reaction,
      userAddress,
      assetAddress,
    });
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

const removeReaction = async ({
  username,
  signature,
  reaction,
  userAddress,
  assetAddress,
}) => {
  try {
    return await axios.delete(BASE_URL, {
      data: {
        username,
        signature,
        reaction,
        userAddress,
        assetAddress,
      },
    });
  } catch (error) {
    throw new Error(error.response.data.error);
  }
};

export default { addReaction, removeReaction };
