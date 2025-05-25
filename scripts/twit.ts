// /src/lib/twitter.ts
export async function postTweet(
  accessToken: string,
  tweetText: string,
  imageUrl?: string
) {
  console.log("🔍 BEGIN: Posting to Twitter...");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body: any = {
    text: tweetText,
  };

  if (imageUrl) {
    console.log(
      "⚠️ NOTE: Image posting to Twitter requires media upload first"
    );
    // Note: For Twitter, you'd typically need to upload the media first and then attach the media ID
    // This is simplified and would need to be expanded for actual image posting
    body.media = { media_ids: [imageUrl] };
    console.log(
      "⚠️ WARNING: Current implementation treats imageUrl as mediaId which won't work"
    );
  }

  try {
    console.log("📤 Sending Twitter post request...");
    console.log("📦 Request body:", JSON.stringify(body));

    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("📊 Twitter response status:", response.status);
    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Failed to post tweet:", data);
      throw new Error(data.title || "Twitter API error");
    }

    console.log("✅ Twitter post successful:", data);
    return data;
  } catch (error) {
    console.error("❌ Exception in postTweet:", error);
    throw error;
  }
}