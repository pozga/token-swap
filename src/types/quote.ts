export type Fee = {
  type: string;
  amount: string;
  amountUSD: string;
  chainSlug: string;
  tokenSymbol: string;
  tokenAddress: string;
  decimals: number;
  deductedFromSourceToken: boolean;
};

export type Quote = {
  integration: string;
  type: string;
  bridgeFee: string;
  bridgeFeeInNativeToken: string;
  amount: string;
  decimals: number;
  amountUSD: string;
  bridgeFeeUSD: string;
  bridgeFeeInNativeTokenUSD: string;
  fees: Fee[];
};

export type Route = {
  bridge: string;
  bridgeTokenAddress: string;
  steps: string[];
  name?: string;
  part: number;
};

export type Distribution = {
  [key: string]: number;
};

export type RouteDetails = {
  duration: number;
  gas: string;
  quote: Quote;
  route: Route[];
  distribution: Distribution;
  gasUSD: string;
};

export type QuoteToken = {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI: string;
};

export type QuoteChain = {
  chainId: number;
  name: string;
  slug: string;
  protocolType: string;
};

export type QuoteResponse = {
  routes: RouteDetails[];
  fromToken: QuoteToken;
  fromChain: QuoteChain;
  toToken: QuoteToken;
  toChain: QuoteChain;
};
