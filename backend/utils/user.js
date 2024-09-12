import axios from "axios";
import { GRAPHQL_API_URL } from "../constants/index.js";

export const getFirstTwoLetters = (username) => {
  return username.substring(0, 2).toUpperCase();
};

export const formatFollowerCount = (num) => {
  if (num <= 1) return `${num} follower`;
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k followers";
  }
  return `${num.toString()} followers`;
};

const getUserInfo = async (username) => {
  const query = `
    query ($username: String!) {
      userByName(name: $username) {
        id
        username
        bio
        followerCount
        wallets {
          walletChainType
          walletType
          address
          isPrimary
        }
        iconUrl
      }
    }
`;

  return await axios.post(GRAPHQL_API_URL, {
    query,
    variables: {
      username,
    },
  });
};

export const validatedUserInfo = async (username) => {
  let userIcon;

  const userInfoResponse = await getUserInfo(username);

  if (userInfoResponse.data.errors || !userInfoResponse.data.data.userByName)
    throw new Error("Error fetching user info");

  const userByName = userInfoResponse.data.data.userByName;
  const userWallets = userByName.wallets;
  userIcon = userByName.iconUrl;

  if (!userIcon) {
    userIcon = `https://ui-avatars.com/api/?name=${username}&size=256&background=random`;
  }

  if (userWallets.length === 0)
    throw new Error("User has not paired the wallet");

  const userSolanaWallets = userWallets
    .filter((wallet) => wallet.walletChainType === "solana")
    .map((wallet) => wallet.address.toLowerCase());

  if (!userSolanaWallets) throw new Error("Wallet chain is not supported");

  return {
    wallets: userSolanaWallets,
    followerCount: userByName.followerCount,
    iconUrl: userIcon,
  };
};
