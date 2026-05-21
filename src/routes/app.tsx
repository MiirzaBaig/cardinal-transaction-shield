import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { PageBackground } from "@/components/layout/Background";
import { WalletRail } from "@/components/app/WalletRail";
import { ActivityFeed } from "@/components/app/ActivityFeed";
import { SignalsLog } from "@/components/app/SignalsLog";
import { TxComposer, type ComposerState } from "@/components/app/TxComposer";
import { DemoPresetBar } from "@/components/app/DemoPresetBar";
import { ScanProgress } from "@/components/app/ScanProgress";
import { ResultPanel } from "@/components/app/ResultPanel";
import { DetailsDrawer } from "@/components/app/DetailsDrawer";
import { PRESETS } from "@/lib/mockData";
import { runMockScan, type ScanResult } from "@/lib/mockScan";

export const Route = createFileRoute("/app")({
  component: AppPage,
  head: () => ({
    meta: [{ title: "Cardinal — Transaction Control Center" }],
  }),
});

type Stage = "compose" | "scanning" | "verdict";

const initialComposer: ComposerState = {
  type: "transfer",
  chain: "ethereum",
  token: "USDC",
  recipient: "",
  amount: "",
  unlimited: false,
  spender: "",
  fn: "",
};

function AppPage() {
  const [connected, setConnected] = useState(true);
  const [chain, setChain] = useState("ethereum");
  const [mode, setMode] = useState<"Standard" | "Strict" | "Watch-only">("Standard");
  const [composer, setComposer] = useState<ComposerState>(initialComposer);
  const [activePreset, setActivePreset] = useState<string | undefined>();
  const [stage, setStage] = useState<Stage>("compose");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [drawer, setDrawer] = useState(false);

  const onPickPreset = (id: "safe" | "review" | "block") => {
    const p = PRESETS.find((x) => x.id === id)!;
    setActivePreset(id);
    setComposer({
      ...initialComposer,
      ...p.fields,
      unlimited: !!p.fields.unlimited,
      spender: p.fields.spender ?? "",
      fn: p.fields.fn ?? "",
    });
  };

  const onScan = () => {
    setStage("scanning");
    const res = runMockScan({
      ...composer,
      presetId: activePreset as "safe" | "review" | "block" | undefined,
    });
    // result computed up-front; ScanProgress controls reveal timing
    setResult(res);
  };

  const onScanDone = () => setStage("verdict");

  const onReset = () => {
    setComposer(initialComposer);
    setActivePreset(undefined);
    setResult(null);
    setStage("compose");
  };

  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <AppTopBar
        connected={connected}
        onToggleConnect={() => setConnected((v) => !v)}
        chain={chain}
        onChain={setChain}
        mode={mode}
        onMode={setMode}
      />

      <div className="relative z-10 mx-auto max-w-[1380px] px-5 py-6">
        {/* Page heading */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Control center
            </span>
            <h1 className="mt-1.5 font-display text-[34px] font-medium leading-none tracking-tight">
              Scan before you send
            </h1>
          </div>
          <p className="hidden max-w-sm text-right text-[13px] leading-relaxed text-muted-foreground md:block">
            Compose a transaction, run it through Cardinal, and get a clear allow,
            review, or block — before you sign.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)_340px]">
          {/* Left: wallet rail */}
          <WalletRail
            connected={connected}
            onConnect={() => setConnected(true)}
            onNewScan={onReset}
          />

          {/* Center: state machine */}
          <div className="flex flex-col gap-4">
            <DemoPresetBar active={activePreset} onPick={onPickPreset} />

            <div className="surface-raise overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                {stage === "compose" && (
                  <motion.div
                    key="compose"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    <TxComposer
                      value={composer}
                      onChange={(v) => {
                        setComposer(v);
                        setActivePreset(undefined);
                      }}
                      onScan={onScan}
                      onReset={onReset}
                    />
                  </motion.div>
                )}
                {stage === "scanning" && (
                  <motion.div
                    key="scan"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ScanProgress onDone={onScanDone} />
                  </motion.div>
                )}
                {stage === "verdict" && result && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <ResultPanel
                      result={result}
                      onReset={onReset}
                      onDetails={() => setDrawer(true)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: signals + activity */}
          <div className="flex flex-col gap-4">
            <SignalsLog scanning={stage === "scanning"} />
            <ActivityFeed />
          </div>
        </div>
      </div>

      <DetailsDrawer open={drawer} onClose={() => setDrawer(false)} result={result} />
    </div>
  );
}