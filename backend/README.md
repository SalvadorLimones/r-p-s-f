# fullstack-app-template backend

## system requirements:

- nodejs
- npm

## enviromental variables:

Create a .env file in the root folder, with the below variables:

- PORT={port}
- APP_URL={url-of-frontend}
- CONNECTION_STRING={mongo-connection-string}
- JWT_SECRET={secret}

The following values are needed in order for Google authentication to work:

- GOOGLE_CLIENT_ID={client-id}
- GOOGLE_CLIENT_SECRET={client-secret}
- GOOGLE_REDIRECT_URI={url-of-frontend}/callback/google
- GOOGLE_TOKEN_ENDPOINT=https://oauth2.googleapis.com/token
- GOOGLE_USER_ENDPOINT=null
- GOOGLE_USER_ID=null

To utilize the errorHandler middleware, Logflare needs to be configured properly with the following values:

- LOGFLARE_SOURCE_ID={source-id}
- LOGFLARE_API_KEY={api-key}

## dev start:

- npm i
- npm start
