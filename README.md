# Getting Started with Token Swap

This project is a proof of concept demonstrating how to use Swing.xyz and Thirdweb to create a token swap. It is intended for demonstration purposes only.

## Project Overview

This project consists of two main components:
- **React Frontend**: Provides a user interface for interacting with the token swap functionality.
- **Node.js Backend**: Hosts an API endpoint to handle the token swap logic and communicate with Swing.xyz.

## Requirements
- Node.js v20.9.0 (may work on lower versions but tested on this version)
- Yarn (for dependency management - but should work also with npm or pnpm)

## To initialize the project

In the project directory, run:

`yarn install
    cd frontend
    yarn install
    cd ..`


### To start the service

Then to start the project run:
(in root folder):
`yarn dev`

Then in another terminal:
`cd frontend
    yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Backend service

The backend is a simple Express server with a single endpoint:

POST /api/swap: This endpoint accepts a JSON payload with the following parameters and returns a quote for swapping tokens.

```json
{
  "fromTokenAddress": "0x0000000000000000000000000000000000000000",
  "fromChainId": "1",
  "toTokenAddress": "0x0000000000000000000000000000000000000000",
  "toChainId": "137",
  "fromAmountWei": "1000000000000000000",
  "userAddress": "0xYourWalletAddress"
}
```