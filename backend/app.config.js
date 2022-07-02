const config = {
  auth: {
    google: {
      client_id:
        process.env.GOOGLE_CLIENT_ID ||
        "940759968390-adatai7857f9o4vu7e5u53i6g4bk0rfl.apps.googleusercontent.com",
      client_secret:
        process.env.GOOGLE_CLIENT_SECRET ||
        "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",
      redirect_uri:
        process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/callback",
      token_endpoint: "https://oauth2.googleapis.com/token",
      user_endpoint: null,
      user_id: null,
    },
    github: {
      client_id: process.env.GIT_CLIENT_ID || "ec24a971e0b051cb18f4",
      client_secret:
        process.env.GIT_CLIENT_SECRET ||
        "baa74a186ad69427cb6e01d5bdc2e1a2ba901e92",
      redirect_uri:
        process.env.GIT_REDIRECT_URI || "http://localhost:3000/callback/github",
      token_endpoint: "https://github.com/login/oauth/access_token",
      user_endpoint: "http://api.github.com/user",
      user_id: "id",
    },
    /*   facebook: {
      clientId: "",
      clientSecret: "",
      redirectUri: "",
      tokenEndpoint: "",
    }, */
  },
};

module.exports = config;
