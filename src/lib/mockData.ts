export type Chain = {
  id: string;
  name: string;
  short: string;
};

export const CHAINS: Chain[] = [
  { id: "ethereum", name: "Ethereum", short: "ETH" },
  { id: "base", name: "Base", short: "BASE" },
  { id: "arbitrum", name: "Arbitrum", short: "ARB" },
  { id: "polygon", name: "Polygon", short: "POL" },
];

export type Token = {
  symbol: string;
  name: string;
  balance: number;
  usd: number;
};

export const TOKENS: Token[] = [
  { symbol: "ETH", name: "Ether", balance: 4.218, usd: 3120 },
  { symbol: "USDC", name: "USD Coin", balance: 12480.55, usd: 1 },
  { symbol: "USDT", name: "Tether", balance: 3200.0, usd: 1 },
  { symbol: "DAI", name: "Dai", balance: 845.21, usd: 1 },
];

export type TxType = "transfer" | "approval" | "contract" | "swap";

export const MOCK_ADDRESS = "0x1c4f9b8a3e2d0c6e1a7f5b4a83c6d1e2f0a93f7d";
export const MOCK_ENS = "vault.cardinal.eth";

export type ActivityItem = {
  id: string;
  verdict: "ALLOW" | "REVIEW" | "BLOCK";
  recipient: string;
  label: string;
  amount: string;
  time: string;
};

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    verdict: "ALLOW",
    recipient: "0x7a2b…1c4e",
    label: "Transfer · USDC",
    amount: "1,200 USDC",
    time: "4m ago",
  },
  {
    id: "a2",
    verdict: "REVIEW",
    recipient: "0x52d1…f9a2",
    label: "Approval · USDT",
    amount: "Unlimited",
    time: "26m ago",
  },
  {
    id: "a3",
    verdict: "BLOCK",
    recipient: "0xdead…beef",
    label: "Contract call",
    amount: "0.42 ETH",
    time: "1h ago",
  },
  {
    id: "a4",
    verdict: "ALLOW",
    recipient: "0x9c01…ab2f",
    label: "Swap · ETH→USDC",
    amount: "0.8 ETH",
    time: "Yesterday",
  },
];

export type Preset = {
  id: "safe" | "review" | "block";
  label: string;
  description: string;
  fields: {
    type: TxType;
    chain: string;
    token: string;
    recipient: string;
    amount: string;
    unlimited?: boolean;
    spender?: string;
    fn?: string;
  };
};

export const PRESETS: Preset[] = [
  {
    id: "safe",
    label: "Safe transfer",
    description: "USDC to a known counterparty on Ethereum",
    fields: {
      type: "transfer",
      chain: "ethereum",
      token: "USDC",
      recipient: "0x7a2b08c1e6f93a14d5c8b042e10b3f291cd61c4e",
      amount: "1200",
    },
  },
  {
    id: "review",
    label: "Risky approval",
    description: "Unlimited USDT approval to a new spender",
    fields: {
      type: "approval",
      chain: "ethereum",
      token: "USDT",
      recipient: "0x52d18f3b29a7c641e9870b22a5d3c4e8f0e1f9a2",
      spender: "0x52d18f3b29a7c641e9870b22a5d3c4e8f0e1f9a2",
      amount: "0",
      unlimited: true,
    },
  },
  {
    id: "block",
    label: "Drainer contract",
    description: "Contract call to an address flagged as a known drainer",
    fields: {
      type: "contract",
      chain: "ethereum",
      token: "ETH",
      recipient: "0xdead0000000000000000000000000000000beef0",
      amount: "0.42",
      fn: "claim(bytes,address[])",
    },
  },
];

export function shortAddr(a: string) {
  if (!a) return "";
  if (a.length <= 12) return a;
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}