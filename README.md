# CRUD Example App (React Native)

> **This Layr example app is deprecated.**

A simple example showing how to build a full-stack CRUD app with Layr and React Native.

## Install

Make sure you have [React Native development environment](https://reactnative.dev/docs/environment-setup) properly set up.

Make sure you have [Docker](https://www.docker.com/) installed as it is used to run the database (MongoDB) when running the app in development mode.

Install the npm dependencies:

```sh
npm install
```

## Usage

### Running the app in development mode

Start the development environment:

```sh
BACKEND_URL=http://localhost:16578 \
  MONGODB_STORE_CONNECTION_STRING=mongodb://test:test@localhost:16579/test \
  npm run start
```

Run the app in the iOS simulator:

```sh
npm run run:ios
```

### Debugging

#### Server

Add the following environment variables when starting the development environment:

```sh
DEBUG=layr:* DEBUG_DEPTH=10
```
