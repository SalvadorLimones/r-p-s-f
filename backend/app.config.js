const config = {
  auth: {
    google: {
      client_id:
        process.env.GOOGLE_CLIENT_ID ||
        "589986974868-mog8kd8qlf1lftigl8akeue7u3gj6hsv.apps.googleusercontent.com",
      client_secret:
        process.env.GOOGLE_CLIENT_SECRET ||
        "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",
      redirect_uri:
        process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/callback",
      token_endpoint: "https://oauth2.googleapis.com/token",
      user_endpoint: null,
      user_id: null,
    },
  },
};

module.exports = config;
