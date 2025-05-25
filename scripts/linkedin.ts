export async function getAuthorURN(token: string): Promise<string> {
  console.log("🔍 BEGIN: Fetching LinkedIn author URN...");
  try {
    const res = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("📊 LinkedIn userinfo response status:", res.status);

    if (!res.ok) {
      console.error("❌ Failed fetching LinkedIn userinfo:", data);
      throw new Error(data.message || "LinkedIn userinfo error");
    }

    // data.sub is the member ID
    const urn = `urn:li:person:${data.sub}`;
    console.log("✅ LinkedIn Author URN successfully retrieved:", urn);
    return urn;
  } catch (error) {
    console.error("❌ Exception in getAuthorURN:", error);
    throw error;
  }
}

export async function postUGC(
  token: string,
  authorURN: string,
  text: string,
  imageUrl?: string
) {
  console.log("🔍 BEGIN: Posting to LinkedIn UGC...");
  console.log("📝 Content:", text);
  console.log("🖼️ Image URL:", imageUrl || "None");

  const url = "https://api.linkedin.com/v2/ugcPosts";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = {
    author: authorURN,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: imageUrl ? "IMAGE" : "NONE",
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  if (imageUrl) {
    console.log("🖼️ Adding image to LinkedIn post:", imageUrl);
    body.specificContent["com.linkedin.ugc.ShareContent"].media = [
      {
        status: "READY",
        description: {
          text: "Image",
        },
        media: imageUrl,
        title: {
          text: "Posted Image",
        },
      },
    ];
  }

  try {
    console.log("📤 Sending LinkedIn UGC post request...");
    console.log("📦 Request body:", JSON.stringify(body));

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });

    console.log("📊 LinkedIn post response status:", res.status);
    const data = await res.json();

    if (!res.ok) {
      console.error("❌ LinkedIn post failed:", data);
      throw new Error(data.message || "LinkedIn post error");
    }

    console.log("✅ LinkedIn post successful:", data);
    return data;
  } catch (error) {
    console.error("❌ Exception in postUGC:", error);
    throw error;
  }
}