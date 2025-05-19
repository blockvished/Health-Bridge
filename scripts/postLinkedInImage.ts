import fs from "fs";
import fetch from "node-fetch"; // install with: npm install node-fetch@2

const ACCESS_TOKEN = "AQVQN-9ld1t0Z6HXigkpPw-kscjqfNKIq4qftQxT4o2Q_RzXOUmKeeyEdtlXNOtf-0oByTUw_alETcGtIFgakIN2_rFavc8OvI7S9q3cRfnBZZOVkvYdXDiOZRfy9DN7b3pouzxzA3-q5ZeiNWRlvfWHx09qksBQuvAKnaxXYkJhrI62y7u_JYpIvps1fQgES7TVMwttsrnpMSX7XkFKvayP3_RjZHa6ST65dgGwXWrqaUGvCXLBNYVAGBC_oCZVD2wKpcIxzYd3oanBhGbAYRu5x-hZM3KJWfguyng5-_KLBvTMI5p2acaOAZ111AgrAfOfM-ipDVgwCcOsD2Fl2ilKjIhPMg";
const POST_TEXT = "Hello LinkedIn 👋 This post includes an image via API!";
const IMAGE_PATH = "C:\Users\Administrator\Documents\LiveDoctors\private_uploads\social_posts\1\marcus.webp"; // change to your image file path

async function getAuthorURN(token: string): Promise<string> {
  const res = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("Failed fetching userinfo:", data);
    throw new Error(data.message || "LinkedIn userinfo error");
  }
  return `urn:li:person:${data.sub}`;
}

async function registerImageUpload(token: string, authorURN: string) {
  const url = "https://api.linkedin.com/v2/assets?action=registerUpload";
  const body = {
    registerUploadRequest: {
      owner: authorURN,
      recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
      serviceRelationships: [
        {
          relationshipType: "OWNER",
          identifier: "urn:li:userGeneratedContent",
        },
      ],
      supportedUploadMechanism: ["SYNCHRONOUS_UPLOAD"],
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
    console.error("Image registration failed:", data);
    throw new Error(data.message || "LinkedIn image registration error");
  }

  const uploadUrl = data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
  const asset = data.value.asset;
  return { uploadUrl, asset };
}

async function uploadImage(uploadUrl: string, imageBuffer: Buffer) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "image/png",
      "Content-Length": imageBuffer.length.toString(),
    },
    body: imageBuffer,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Image upload failed:", errorText);
    throw new Error("Failed to upload image");
  }
}

async function postUGCWithImage(token: string, authorURN: string, text: string, asset: string) {
  const url = "https://api.linkedin.com/v2/ugcPosts";
  const body = {
    author: authorURN,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: "IMAGE",
        media: [
          {
            status: "READY",
            description: { text: "Image description" },
            media: asset,
            title: { text: "Image Title" },
          },
        ],
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
  console.log("✅ Post with image successful:", data);
}

(async () => {
  try {
    const authorURN = await getAuthorURN(ACCESS_TOKEN);
    const imageBuffer = fs.readFileSync(IMAGE_PATH);

    const { uploadUrl, asset } = await registerImageUpload(ACCESS_TOKEN, authorURN);
    await uploadImage(uploadUrl, imageBuffer);
    await postUGCWithImage(ACCESS_TOKEN, authorURN, POST_TEXT, asset);
  } catch (err) {
    console.error("💥 Error:", err);
  }
})();
