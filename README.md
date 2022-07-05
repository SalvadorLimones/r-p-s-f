# ROCK PAPER SCISSORS FUTURE APP

-This repository contains the front and backend code for an app i originally created as an exam project at Codecool.The game is built on the well-known „rock, paper, scissors” game, with a little twist: compared to the classical version of the game the player will find an extra feature. In every round, s/he has to pick one of the tools for the other player that s/he has to avoid in the next round. If the other player – despite the „avoid” sign – chooses that item, the first player earns half a point in that round.
-The gameplay is accessable after the user registers and logs in, and the user can choose either to play championship games with a randomly assigned other player who is online as well or to play a friendly game with any of the players on his/her firend-list.

-

The app utilizes the Google OpenID flow for user authentication, and relies on a MongoDB server for storing user data, as well as information about the games.

[The application is online and playable on:](https://starfish-app-2-wy545.ondigitalocean.app/).

## Frontend

The frontend is a simple React app. It can be started up on the localhost by installing the dependencies, then calling the run command. To put it more simply, all you need to get the frontend running locally on your computer is:

- npm i
- npm start

### Environment variables

-REACT_APP_API_URL={url-of-backend + "/api"}
-REACT_APP_GOOGLE_BASE_URL=https://accounts.google.com/o/oauth2/v2/auth
-REACT_APP_CLIENT_ID={client-id}

## Backend

### System requirements:

- nodejs
- npm

### Environment variables

The backend folder contains the code of the API, running on Express.js. In order for it to work properly, a **.env** file needs to be added to the root of this folder, containing the following values:

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

### Starting the app

In both the backend and frontend folders - after properly setting up (both) **.env** file, the app can be fired up using these commands:

- npm i
- npm start
