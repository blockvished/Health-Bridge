const ACCESS_TOKEN = "";
const POST_TEXT   = "Hello LinkedIn 👋 This post is from the latest API!";

async function getAuthorURN(token: string): Promise<string> {
  // 1️⃣ Fetch profile via /userinfo
  const res = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("Failed fetching userinfo:", data);
    throw new Error(data.message || "LinkedIn userinfo error");
  }
  // data.sub is the member ID
  const urn = `urn:li:person:${data.sub}`;
  console.log("🆔 Author URN:", urn);
  return urn;
}

async function postUGC(token: string, authorURN: string, text: string) {
  // 2️⃣ Create the UGC post
  const url = "https://api.linkedin.com/v2/ugcPosts";
  const body = {
    author: authorURN,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("Post failed:", data);
    throw new Error(data.message || "LinkedIn post error");
  }
  console.log("✅ Post successful:", data);
}

(async () => {
  try {
    const authorURN = await getAuthorURN(ACCESS_TOKEN);
    await postUGC(ACCESS_TOKEN, authorURN, POST_TEXT);
  } catch (err) {
    console.error("💥 Error:", err);
  }
})();
