export const DEVNET_RPC = "https://api.devnet.solana.com";
export const TEST_ADDRESS = "6XESPwnJx7H6VdcCWuD8icpiGJQBPL8ARmsMKMfiEwb";
export const TEST_ADDRESS_2 = "9y2jNCmiZzdGx3Za7DMrWwy4NU5CAtEcSCkYMRvGUQPm";
export const AKASH_API_URL2 =
  "https://chatapi.akash.network/api/v1/chat/completions";
export const AKASH_API_URL = "https://chat.akash.network/api/chat";
export const CANISTER_ID = "h2bch-3yaaa-aaaab-qaama-cai";
export const AGENT_HOST = "https://edge1-proxy.dscvr.cloud";
export const REACTIONS = ["sad", "fire", "funny"];
export const COLLECTION_ADDRESS =
  "BjnBYifQPeksFJVTgBTaLaL5e7TYdFfPRWywv2GvkUiC";

export const PROMPT = `
Give a short and harsh roasting for a profile of web3 social media app called DSCVR (it's like twitter but in web3). Only give harsh roasting for a DSCVR profile. Don't give harsh comments on DSCVR platform.

Keep it one paragraph.

The data will be provided and each fields are explained below.
{
  date_now // Self explanatory
  user_data: {
    username // Self explanatory
    created_at // The date and time the user was created
    bio // The bio of the user
    followers // The number of users that are following the user
    following // The number of users that the user is following
    active_streak // The maximum of streaks that the user has clicked every day. It's used to increase chances of receiving exclusive airdrops in DSCVR feeds.
    num_posts // The number of posts that the user has posted
    posts { // Array of posts of the user (only shows maximum of 30 recent posts)
      created_at // The date and time the post was created
      content // The content of the post. Please note that there is HTML stuff in this field (which is used to render the post in the app, so dont comment about HTML stuff)
      comments // Array of comments of the post
      upvotes // The number of the upvotes of the post
      downvotes // The number of the downvotes of the post
    }
  }
}
`;

export const PROMPT2 = `
Give a short and harsh roasting for a profile of web3 social media app called DSCVR (it's like twitter but in web3). Only give harsh roasting for a DSCVR profile. Don't give harsh comments on DSCVR platform.

Keep it one paragraph. Remember, just reply with your harsh comment. Don't start with something like "Here's a harsh roasting for the DSCVR profile of XXX", just straight your harsh comment.

The data will be provided and each fields are explained below.
{
  date_now // Self explanatory.
  user_data: {
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

export const PROMPT3 = `
Give a short and uplifting compliment for a profile of a web3 social media app called DSCVR (it's like Twitter but in web3). Only give positive and encouraging comments for a DSCVR profile. Don't provide compliments on the DSCVR platform itself.

Keep it one paragraph.

The data will be provided and each fields are explained below.
{
  date_now // Self explanatory
  user_data: {
    username // Self explanatory
    created_at // The date and time the user was created
    bio // The bio of the user
    followers // The number of users that are following the user
    following // The number of users that the user is following
    active_streak // The maximum of streaks that the user has clicked every day. It's used to increase chances of receiving exclusive airdrops in DSCVR feeds.
    num_posts // The number of posts that the user has posted
    posts { // Array of posts of the user (only shows maximum of 30 recent posts)
      created_at // The date and time the post was created
      content // The content of the post. Please note that there is HTML stuff in this field (which is used to render the post in the app, so dont comment about HTML stuff)
      comments // Array of comments of the post
      upvotes // The number of the upvotes of the post
      downvotes // The number of the downvotes of the post
    }
  }
}

Here's the data:
`;
