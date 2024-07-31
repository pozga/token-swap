import { QuoteToken } from "./quote";

export type GetCrossChainSwapQuoteReponse = {
  fees: number;
  estimatedTime: number | undefined;
  toAmountWei: string;
  toAmountUSD: string;
  gasUSD: string;
  toToken: QuoteToken;
  fromToken: QuoteToken;
};
