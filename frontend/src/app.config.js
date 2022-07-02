const _config = {
  dev: {
    api_url: "http://localhost:4000/api",
    google_client_id:
      "940759968390-adatai7857f9o4vu7e5u53i6g4bk0rfl.apps.googleusercontent.com",
    google_base_url: "https://accounts.google.com/o/oauth2/v2/auth",
  },
  prod: {
    api_url: process.env.REACT_APP_API_URL || "http://localhost:4000/api",
    google_client_id:
      process.env.REACT_APP_CLIENT_ID ||
      "940759968390-adatai7857f9o4vu7e5u53i6g4bk0rfl.apps.googleusercontent.com",
    google_base_url:
      process.env.REACT_APP_GOOGLE_BASE_URL ||
      "https://accounts.google.com/o/oauth2/v2/auth",
  },
};

const config =
  process.env.NODE_ENV === "development" ? _config.dev : _config.prod;

export default config;
