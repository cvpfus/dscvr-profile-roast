import "dotenv/config";
import bs58 from "bs58";

export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const SECRET_KEY = bs58.decode(PRIVATE_KEY);
