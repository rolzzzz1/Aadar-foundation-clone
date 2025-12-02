exports.handler = async function (event, context) {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

    if (!accessToken || !accountId) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Instagram token or account ID missing from server environment" }),
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
      return {
        statusCode: response.status || 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: data.error.message || "Failed to fetch posts", details: data.error }),
      };
    }

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

