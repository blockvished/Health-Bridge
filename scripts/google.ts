const accessToken = '';

async function createPostOnFirstLocation() {
  try {
    // Step 1: Get Accounts
    const accountsRes = await fetch('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!accountsRes.ok) {
      const errorText = await accountsRes.text();
      console.error('Error fetching accounts:\n', errorText);
      throw new Error(`Request failed: ${accountsRes.status}`);
    }

    const accountsData = await accountsRes.json();
    const accounts = accountsData.accounts;
    if (!accounts || accounts.length === 0) {
      console.log('No Google Business accounts found for this user.');
      return;
    }

    const accountName = accounts[0].name; // e.g., "accounts/1234567890"
    const accountId = accountName.split('/').pop();
    console.log('Using Account ID:', accountId);

    // Step 2: Get Locations
    const locationsRes = await fetch(`https://mybusinessbusinessinformation.googleapis.com/v1/locations?parent=${accountName}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!locationsRes.ok) {
      const errorText = await locationsRes.text();
      console.error('Error fetching locations:\n', errorText);
      throw new Error(`Request failed: ${locationsRes.status}`);
    }

    const locationsData = await locationsRes.json();
    const locations = locationsData.locations;
    if (!locations || locations.length === 0) {
      console.log('No locations found for this account.');
      return;
    }

    const locationName = locations[0].name; // e.g., "locations/1234567890123456789"
    const locationId = locationName.split('/').pop();
    console.log('Using Location ID:', locationId);

    // Step 3: Create a local post
    const postUrl = `https://mybusiness.googleapis.com/v4/${accountName}/locations/${locationId}/localPosts`;

    const postBody = {
      languageCode: 'en',
      summary: 'Hello from API: This is a test post!',
      callToAction: {
        actionType: 'LEARN_MORE',
        url: 'https://yourwebsite.com',
      },
    };

    const postRes = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postBody),
    });

    if (!postRes.ok) {
      const errorText = await postRes.text();
      console.error('Error creating post:\n', errorText);
      throw new Error(`Request failed: ${postRes.status}`);
    }

    const postData = await postRes.json();
    console.log('✅ Post created successfully:', postData);

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

createPostOnFirstLocation();