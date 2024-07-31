import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { Chain } from "./types/chains";
import { Token } from "./types/tokens";
import { QuoteResponse } from "./types/quote";
import { GetCrossChainSwapQuoteReponse } from "./types/api";

// Use these types to store supported chains and tokens
let supportedChains: { [key: string]: Chain } = {};
let supportedTokens: { [key: string]: Token } = {};

const NULL_ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

// Function to fetch and store supported chains and tokens
const fetchSupportedChainsAndTokens = async () => {
  try {
    // Fetch supported chains
    const chainsResponse = await axios.get(
      "https://platform.swing.xyz/api/v1/chains",
      {
        headers: {
          "x-swing-environment": "production",
        },
      }
    );

    chainsResponse.data.forEach((chain: Chain) => {
      supportedChains[chain.id] = chain;
    });

    // Fetch supported tokens
    const tokensResponse = await axios.get(
      "https://platform.swing.xyz/api/v1/tokens",
      {
        headers: {
          "x-swing-environment": "production",
        },
      }
    );

    tokensResponse.data.forEach((token: Token) => {
      supportedTokens[token.address] = token;
    });

    console.log("Supported chains and tokens fetched and stored.");
  } catch (error) {
    console.error("Error fetching supported chains and tokens:", error);
  }
};

// Fetch supported chains and tokens on server start
fetchSupportedChainsAndTokens();

export const getCrossChainSwapQuote = async (req: Request, res: Response) => {
  const {
    fromTokenAddress,
    fromChainId,
    toTokenAddress,
    toChainId,
    fromAmountWei,
  } = req.body;

  const fromUserAddress = NULL_ETH_ADDRESS;
  const toUserAddress = NULL_ETH_ADDRESS;

  try {
    const fromChain = supportedChains[fromChainId].id;
    const toChain = supportedChains[toChainId].id;
    const fromTokenSymbol = supportedTokens[fromTokenAddress]?.symbol;
    const toTokenSymbol = supportedTokens[toTokenAddress]?.symbol;

    if (!fromChain || !toChain || !fromTokenSymbol || !toTokenSymbol) {
      throw new Error("Invalid chain ID or token address");
    }

    const config = {
      params: {
        fromChain,
        fromTokenAddress,
        fromUserAddress,
        toChain,
        toTokenAddress,
        toUserAddress,
        tokenAmount: fromAmountWei,
        tokenSymbol: fromTokenSymbol,
        toTokenSymbol: toTokenSymbol,
      },
      headers: {
        "x-swing-environment": "production",
      },
    };

    // Get Quote from Swing.xyz
    const response = await axios.get<QuoteResponse>(
      "https://swap.prod.swing.xyz/v0/transfer/quote",
      config
    );
    // Most crude method
    const { toToken, fromToken } = response.data;
    const firstRoute = response.data.routes[0];
    const { amount, amountUSD, bridgeFeeUSD } = firstRoute.quote;
    const { duration, gasUSD } = firstRoute;

    const allowanceResult = await axios.get(
      "https://swap.prod.swing.xyz/v0/transfer/allowance",
      {
        params: {
          fromChain,
          tokenSymbol: fromTokenSymbol,
          tokenAddress: fromTokenAddress,
          bridge: firstRoute.route[0].bridge,
          fromAddress: NULL_ETH_ADDRESS,
          toChain,
          toTokenSymbol: toTokenSymbol,
          toTokenAddress: toTokenAddress,
          contractCall: true,
        },
      }
    );

    const approveResult = await axios.get(
      "https://swap.prod.swing.xyz/v0/transfer/approve",
      {
        params: {
          fromChain,
          tokenSymbol: fromTokenSymbol,
          tokenAddress: fromTokenAddress,
          bridge: firstRoute.route[0].bridge,
          fromAddress: NULL_ETH_ADDRESS,
          toChain,
          toTokenSymbol: toTokenSymbol,
          toTokenAddress: toTokenAddress,
          tokenAmount: fromAmountWei,
          contractCall: true,
        },
      }
    );

    console.log(allowanceResult, approveResult);

    res.status(200).json({
      fees: parseFloat(bridgeFeeUSD),
      gasUSD,
      estimatedTime: duration,
      toAmountWei: amount,
      toAmountUSD: amountUSD,
      toToken,
      fromToken,
    } as GetCrossChainSwapQuoteReponse);
  } catch (error) {
    console.error("Error fetching swap quote:", error);
    res.status(500).json({ error: "Error fetching swap quote" });
  }
};
