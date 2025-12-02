exports.handler = async function (event, context) {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

    // Log for debugging (token length only, not the actual token)
    console.log("Function called - Token exists:", !!accessToken, "Account ID:", accountId);

    if (!accessToken || !accountId) {
      console.error("Missing environment variables - Token:", !!accessToken, "Account ID:", !!accountId);
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Instagram token or account ID missing from server environment",
          details: {
            hasToken: !!accessToken,
            hasAccountId: !!accountId,
          },
        }),
      };
    }

    // Get limit from query params if provided, default to 6
    const limit = event.queryStringParameters?.limit || "6";

    const params = new URLSearchParams({
      fields: "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username",
      limit: limit,
      access_token: accessToken,
    });

    const url = `https://graph.facebook.com/v23.0/${accountId}/media?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (data.error) {
      console.error("Instagram API Error:", JSON.stringify(data.error, null, 2));
      return {
        statusCode: response.status || 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: data.error.message || "Failed to fetch posts",
          details: data.error,
          code: data.error.code,
        }),
      };
    }

    console.log("Successfully fetched", data.data?.length || 0, "posts");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: err.message || "Error fetching posts" }),
    };
  }
};

