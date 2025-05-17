const postTweet = async (accessToken: string, tweetText: string) => {
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: tweetText,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Failed to post tweet:', data);
    throw new Error(data.title || 'Twitter API error');
  }

  return data;
};

postTweet('', 'Hello, world! using Twitter API v2')