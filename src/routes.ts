import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { Chain } from "./types/chains";
import { Token } from "./types/tokens";
import { QuoteResponse } from "./types/quote";
import {
  GetCrossChainSwapQuoteReponse,
  GetCrossChainSwapQuoteRequestParams,
} from "./types/api";
import { supportedChains, supportedTokens } from "./lib/swingData";

const NULL_ETH_ADDRESS = "0x0000000000000000000000000000000000000000";

export const getCrossChainSwapQuote = async (
  req: Request<any, any, GetCrossChainSwapQuoteRequestParams>,
  res: Response
) => {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
  }

  const {
    fromTokenAddress,
    fromChainId,
    toTokenAddress,
    toChainId,
    fromAmountWei,
    userAddress,
  } = req.body;

  const finalUserAddress = userAddress ?? NULL_ETH_ADDRESS;

  try {
    const fromChainData = supportedChains.find(
      (chain) => chain.id === fromChainId
    );
    const toChainData = supportedChains.find((chain) => chain.id === toChainId);
    const fromTokenData = supportedTokens.find(
      (token) =>
        token.address === fromTokenAddress &&
        token.chain === fromChainData?.slug
    );
    const toTokenData = supportedTokens.find(
      (token) =>
        token.address === toTokenAddress && token.chain === toChainData?.slug
    );

    if (!fromChainData || !toChainData || !fromTokenData || !toTokenData) {
      throw new Error("Invalid chain ID or token address");
    }

    const fromChain = fromChainData.slug;
    const toChain = toChainData.slug;

    const config = {
      params: {
        fromChain,
        fromTokenAddress,
        fromUserAddress: finalUserAddress,
        toChain,
        toTokenAddress,
        toUserAddress: finalUserAddress,
        tokenAmount: fromAmountWei,
        tokenSymbol: fromTokenData.symbol,
        toTokenSymbol: toTokenData.symbol,
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

    const approveResult = await axios.get(
      "https://swap.prod.swing.xyz/v0/transfer/approve",
      {
        params: {
          fromChain,
          tokenSymbol: fromTokenData.symbol,
          tokenAddress: fromTokenAddress,
          bridge: firstRoute.route[0].bridge,
          fromAddress: finalUserAddress,
          toChain,
          toTokenSymbol: toTokenData.symbol,
          toTokenAddress: toTokenAddress,
          tokenAmount: fromAmountWei,
          contractCall: true,
        },
      }
    );

    const sendTransactionResult = await axios.post(
      "https://swap.prod.swing.xyz/v0/transfer/send",
      {
        //source chain parameters
        fromChain,
        tokenSymbol: fromTokenData.symbol,
        fromTokenAddress,

        //destination chain parameters
        toChain,
        toTokenSymbol: toTokenData.symbol,
        toTokenAddress: toTokenAddress,

        //transfer parameters
        fromUserAddress: finalUserAddress,
        toUserAddress: finalUserAddress,
        tokenAmount: fromAmountWei,
        projectId: "token-swap", // create your project here: https://platform.swing.xyz/
        integration: firstRoute.quote.integration,
        type: firstRoute.quote.type,
        route: firstRoute.route,
        skipValidation: "true",
      }
    );

    const transactionRequest = [
      ...(Array.isArray(approveResult.data.tx)
        ? approveResult.data.tx
        : [approveResult.data.tx]),
      ...(Array.isArray(sendTransactionResult.data.tx)
        ? sendTransactionResult.data.tx
        : [sendTransactionResult.data.tx]),
    ];

    res.status(200).json({
      fees: parseFloat(bridgeFeeUSD),
      gasUSD,
      estimatedTime: duration,
      toAmountWei: amount,
      toAmountUSD: amountUSD,
      toToken,
      fromToken,
      transactionRequest,
    } as GetCrossChainSwapQuoteReponse);
  } catch (error) {
    console.error("Error fetching swap quote:", error);
    res.status(500).json({ error: "Error fetching swap quote" });
  }
};
