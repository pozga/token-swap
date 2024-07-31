import { QuoteToken } from "./quote";

export type GetCrossChainSwapQuoteReponse = {
  fees: number;
  estimatedTime: number | undefined;
  toAmountWei: string;
  toAmountUSD: string;
  gasUSD: string;
  toToken: QuoteToken;
  fromToken: QuoteToken;
  transactionRequest: {
    method: string;
    params: any[];
    to: string;
  }[];
};

export type GetCrossChainSwapQuoteRequestParams = {
  fromTokenAddress: string;
  fromChainId: string;
  toTokenAddress: string;
  toChainId: string;
  fromAmountWei: string;
  userAddress: string;
};
