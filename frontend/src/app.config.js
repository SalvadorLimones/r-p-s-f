const _config = {
  dev: {
    api_url:
      process.env.REACT_APP_API_URL ||
      "https://starfish-app-o5xid.ondigitalocean.app/api",
    google_client_id:
      "589986974868-mog8kd8qlf1lftigl8akeue7u3gj6hsv.apps.googleusercontent.com",
    google_base_url: "https://accounts.google.com/o/oauth2/v2/auth",
  },
  prod: {
    api_url:
      process.env.REACT_APP_API_URL ||
      "https://starfish-app-o5xid.ondigitalocean.app/api",
    google_client_id:
      process.env.REACT_APP_CLIENT_ID ||
      "589986974868-mog8kd8qlf1lftigl8akeue7u3gj6hsv.apps.googleusercontent.com",
    google_base_url:
      process.env.REACT_APP_GOOGLE_BASE_URL ||
      "https://accounts.google.com/o/oauth2/v2/auth",
  },
};

const config =
  process.env.NODE_ENV === "development" ? _config.dev : _config.prod;

export default config;
