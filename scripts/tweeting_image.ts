const IMG =
  "C:\\Users\\Administrator\\Documents\\LiveDoctors\\private_uploads\\social_posts\\1\\marcus.webp";

import fetch from "node-fetch";
import fs from "fs";
import OAuth from "oauth-1.0a";
import crypto from "crypto";

// 1) Configure OAuth 1.0a
const oauth = new OAuth({
  consumer: {
    key: process.env.TWITTER_CLIENT_ID!,
    secret: process.env.TWITTER_CLIENT_SECRET!,
  },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

async function uploadMediaBase64(
  accessToken: string,
  accessSecret: string,
  filePath: string
): Promise<string> {
  const b64 = fs.readFileSync(filePath, { encoding: "base64" });
  const url = "https://upload.twitter.com/1.1/media/upload.json";

  // Prepare OAuth header
  const request_data = { url, method: "POST" };
  const authHeader = oauth.toHeader(
    oauth.authorize(request_data, { key: accessToken, secret: accessSecret })
  );
  authHeader["Content-Type"] = "application/x-www-form-urlencoded";

  // Encode body
  const body = new URLSearchParams({ media_data: b64 }).toString();

  // Send
  const res = await fetch(url, {
    method: "POST",
    headers: authHeader,
    body,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Upload failed ${res.status}: ${text}`);
  const data = JSON.parse(text);
  if (!data.media_id_string) throw new Error("No media_id");
  return data.media_id_string;
}

async function postTweetWithImage(
  accessToken: string,
  accessSecret: string,
  text: string,
  mediaId: string
) {
  const url = "https://api.twitter.com/1.1/statuses/update.json";
  const request_data = { url, method: "POST" };
  const authHeader = oauth.toHeader(
    oauth.authorize(request_data, { key: accessToken, secret: accessSecret })
  );
  authHeader["Content-Type"] = "application/x-www-form-urlencoded";

  const body = new URLSearchParams({
    status: text,
    media_ids: mediaId,
  }).toString();

  const res = await fetch(url, {
    method: "POST",
    headers: authHeader,
    body,
  });
  const txt = await res.text();
  if (!res.ok) throw new Error(`Tweet failed ${res.status}: ${txt}`);
  return JSON.parse(txt);
}

(async () => {
  const ACCESS_TOKEN = `1883202377509163008-T3vGue2nGLmwrGGPIENRpDejBgbP15`;
  const ACCESS_SECRET = "xT5NrFJDGRGWktDtWuSmn4gEJaei65FcENX0lzYIWTCLZ";
  const IMAGE_PATH =
    "C:\\Users\\Administrator\\Documents\\LiveDoctors\\private_uploads\\social_posts\\1\\marcus.webp";

  const mediaId = await uploadMediaBase64(
    ACCESS_TOKEN,
    ACCESS_SECRET,
    IMAGE_PATH
  );
  console.log("Media ID:", mediaId);

  const tweet = await postTweetWithImage(
    ACCESS_TOKEN,
    ACCESS_SECRET,
    "Hello with an image!",
    mediaId
  );
  console.log("Tweet result:", tweet);
})();
