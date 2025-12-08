export default async function handler(req, res) {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const accountId = process.env.INSTAGRAM_ACCOUNT_ID;

    // Log for debugging (token length only, not the actual token)
    console.log("Function called - Token exists:", !!accessToken, "Account ID:", accountId);

    if (!accessToken || !accountId) {
      console.error(
        "Missing environment variables - Token:",
        !!accessToken,
        "Account ID:",
        !!accountId
      );
      return res.status(500).json({
        error: "Instagram token or account ID missing from server environment",
        details: {
          hasToken: !!accessToken,
          hasAccountId: !!accountId,
        },
      });
    }

    // Get limit from query params if provided, default to 6
    const limit = req.query.limit || "6";

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
      return res.status(response.status || 500).json({
        error: data.error.message || "Failed to fetch posts",
        details: data.error,
        code: data.error.code,
      });
    }

    console.log("Successfully fetched", data.data?.length || 0, "posts");

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Error fetching posts" });
  }
}
