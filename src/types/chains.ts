import { Token } from "./tokens";

export type Chain = {
  id: string;
  slug: string;
  name: string;
  logo: string;
  type: string;
  singleChainSwap: boolean;
  singleChainStaking: boolean;
  nativeToken: Token;
  txExplorer: string;
  tokenExplorer: string;
  rpcUrl: string;
};
