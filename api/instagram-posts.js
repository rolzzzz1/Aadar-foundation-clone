const axios = require("axios");
const { getDevHttpsAgent } = require("./_lib/httpsAgent");

module.exports = async function handler(req, res) {
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

    const agent = getDevHttpsAgent();
    const response = await axios.get(url, {
      headers: { Accept: "application/json" },
      timeout: 30000,
      ...(agent ? { httpsAgent: agent } : {}),
    });

    const data = response.data;

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
    if (err.response && err.response.data) {
      const data = err.response.data;
      const apiError = data.error || data;
      console.error("Instagram API HTTP error:", err.response.status, JSON.stringify(apiError));
      return res.status(err.response.status || 500).json({
        error: apiError.message || "Failed to fetch posts",
        details: apiError,
        code: apiError.code,
      });
    }

    const cause = err && err.cause ? err.cause : err;
    const code = cause && cause.code ? String(cause.code) : "";
    const msg = err && err.message ? String(err.message) : "Error fetching posts";
    console.error("instagram-posts error:", msg, code || "");
    return res.status(500).json({
      error:
        code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE"
          ? "Cannot reach Instagram API (SSL certificate error). Set RAZORPAY_INSECURE_TLS=true in .env for local dev, then restart npm start."
          : msg,
      ...(code ? { code } : {}),
    });
  }
};
