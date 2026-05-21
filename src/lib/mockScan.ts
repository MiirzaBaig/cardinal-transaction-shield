import type { TxType } from "./mockData";

export type Severity = "info" | "warn" | "danger";
export type Verdict = "ALLOW" | "REVIEW" | "BLOCK";

export type SignalGroup =
  | "Recipient"
  | "Permissions"
  | "Simulation"
  | "Network"
  | "Contract";

export type Signal = {
  group: SignalGroup;
  label: string;
  detail: string;
  severity: Severity;
};

export type ScanInput = {
  type: TxType;
  chain: string;
  token: string;
  recipient: string;
  amount: string;
  unlimited?: boolean;
  spender?: string;
  fn?: string;
  presetId?: "safe" | "review" | "block";
};

export type ScanResult = {
  verdict: Verdict;
  score: number;
  summary: string;
  signals: Signal[];
};

const SAFE: ScanResult = {
  verdict: "ALLOW",
  score: 8,
  summary: "This transaction looks safe to send.",
  signals: [
    {
      group: "Recipient",
      label: "Recipient seen before",
      detail:
        "You've successfully sent to this address 4 times in the last 90 days.",
      severity: "info",
    },
    {
      group: "Permissions",
      label: "No token approvals requested",
      detail: "This transaction does not grant any spending permissions.",
      severity: "info",
    },
    {
      group: "Simulation",
      label: "Simulation succeeded",
      detail: "The transaction completes as expected with no unexpected transfers.",
      severity: "info",
    },
    {
      group: "Network",
      label: "Correct network",
      detail: "Your wallet and the recipient are both on Ethereum.",
      severity: "info",
    },
  ],
};

const REVIEW: ScanResult = {
  verdict: "REVIEW",
  score: 58,
  summary: "Review carefully before you sign — a few signals need your attention.",
  signals: [
    {
      group: "Permissions",
      label: "Unlimited spending approval",
      detail:
        "This grants the spender permission to move any amount of your USDT, indefinitely. Consider approving only what's needed.",
      severity: "warn",
    },
    {
      group: "Recipient",
      label: "New counterparty",
      detail:
        "You haven't interacted with this address before. The contract was deployed 6 days ago.",
      severity: "warn",
    },
    {
      group: "Simulation",
      label: "Simulation succeeded",
      detail: "The approval executes successfully on the simulated chain state.",
      severity: "info",
    },
    {
      group: "Contract",
      label: "Source code verified",
      detail: "The contract source is published and matches the deployed bytecode.",
      severity: "info",
    },
  ],
};

const BLOCK: ScanResult = {
  verdict: "BLOCK",
  score: 96,
  summary: "We blocked this transaction to protect your funds.",
  signals: [
    {
      group: "Recipient",
      label: "Address flagged as a drainer",
      detail:
        "This address appears in 3 community threat feeds and has drained funds from 412 wallets in the last 30 days.",
      severity: "danger",
    },
    {
      group: "Simulation",
      label: "Hidden transfer detected",
      detail:
        "The transaction moves more than what you authorized. Simulated outcome: your wallet loses 0.42 ETH plus all USDC balance.",
      severity: "danger",
    },
    {
      group: "Contract",
      label: "Obfuscated call data",
      detail:
        "The function selector is deliberately mislabeled to disguise its real behavior.",
      severity: "danger",
    },
    {
      group: "Permissions",
      label: "Requests full asset access",
      detail: "The contract attempts to gain unlimited approval over all your tokens.",
      severity: "danger",
    },
  ],
};

export function runMockScan(input: ScanInput): ScanResult {
  if (input.presetId === "safe") return SAFE;
  if (input.presetId === "review") return REVIEW;
  if (input.presetId === "block") return BLOCK;

  // Heuristic routing for freeform input
  const r = (input.recipient || "").toLowerCase();
  const amt = parseFloat(input.amount || "0");

  if (r.startsWith("0xdead") || r.includes("beef")) return BLOCK;
  if (input.type === "approval" && input.unlimited) return REVIEW;
  if (input.type === "contract") return REVIEW;
  if (amt > 5000 && input.token === "ETH") return REVIEW;
  if (!r || r.length < 10) {
    return {
      ...REVIEW,
      summary: "We can't fully verify this recipient — review before sending.",
    };
  }
  return SAFE;
}

export const SCAN_STEPS = [
  "Checking network",
  "Resolving recipient",
  "Reviewing permissions",
  "Running simulation",
  "Scoring risk",
] as const;

// Non-uniform pacing — feels like real work, not a fake loader.
export const SCAN_STEP_DURATIONS_MS = [400, 600, 800, 1000, 800];