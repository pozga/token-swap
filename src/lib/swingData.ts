import axios from "axios";
import { Chain } from "../types/chains";
import { Token } from "../types/tokens";

// Use these types to store supported chains and tokens
export let supportedChains: Chain[] = [];
export let supportedTokens: Token[] = [];

const commonParams = {
  headers: {
    "x-swing-environment": "production",
  },
};

// Function to fetch and store supported chains and tokens
const fetchSupportedChainsAndTokens = async () => {
  try {
    // Fetch supported chains
    const chainsResponse = await axios.get(
      "https://platform.swing.xyz/api/v1/chains",
      commonParams
    );
    supportedChains = chainsResponse.data;

    // Fetch supported tokens
    const tokensResponse = await axios.get(
      "https://platform.swing.xyz/api/v1/tokens",
      commonParams
    );
    supportedTokens = tokensResponse.data;

    console.log("Supported chains and tokens fetched and stored.");
  } catch (error) {
    console.error("Error fetching supported chains and tokens:", error);
  }
};

// Fetch supported chains and tokens on server start
fetchSupportedChainsAndTokens();
