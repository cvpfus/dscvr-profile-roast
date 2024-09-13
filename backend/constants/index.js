export const DEVNET_RPC = "https://api.devnet.solana.com";
export const TEST_ADDRESS = "6XESPwnJx7H6VdcCWuD8icpiGJQBPL8ARmsMKMfiEwb";
export const TEST_ADDRESS_2 = "9y2jNCmiZzdGx3Za7DMrWwy4NU5CAtEcSCkYMRvGUQPm";
export const AKASH_API_URL =
  "https://chatapi.akash.network/api/v1/chat/completions";
export const CANISTER_ID = "h2bch-3yaaa-aaaab-qaama-cai";
export const AGENT_HOST = "https://edge1-proxy.dscvr.cloud";
export const REACTIONS = ["sad", "fire", "funny"];
export const COLLECTION_ADDRESS =
  "CZbjh8AmBk7BrwittznLHvv8BQD74AmGpmrTss2zg8Sp";
export const GRAPHQL_API_URL = "https://api.dscvr.one/graphql";

export const PROMPT = `
Give a roasting comment for a DSCVR user. Only give roasting for a DSCVR profile. Remember, don't give roasting comments on DSCVR platform.

Keep it one paragraph, and don't exceed 100 words. Include some emojis if it fits. Remember, just reply with your roasting comment. Don't start with something like "Here's a roasting for the DSCVR profile of XXX", just straight your roasting comment.

The data will be provided and each fields are explained below.
{
  date_now // Self explanatory.
  user_data {
    username // Self explanatory.
    created_at // The date and time the user was created.
    bio // The bio of the user.
    followers // The number of users that are following the user.
    following // The number of users that the user is following.
    active_streak // The highest day count that the user has clicked streak button every day without missing any single day. It's used to increase chances of receiving exclusive airdrops in DSCVR feeds.
    num_posts // The number of posts that the user has posted.
    contents { // Array of contents of the user (only shows maximum of 30 recent contents). A content can be either a post or a comment from the user.
      created_at // The date and time the post was created
      content_type // Type of the content, can be "post" or "comment".
      content // The content of the post. Please note that there is HTML stuff in this field (which is used to render the post in the app, so dont comment about HTML stuff)
      comments // Array of comments of the content
      upvotes // The number of the upvotes of the post
      downvotes // The number of the downvotes of the post
    }
  }
}

Here's the data:
`;