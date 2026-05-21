import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppTopBar } from "@/components/layout/AppTopBar";
import { Sidebar } from "@/components/app/Sidebar";
import { Stepper, type Stage } from "@/components/app/Stepper";
import { TxComposer, type ComposerState } from "@/components/app/TxComposer";
import { ScanProgress } from "@/components/app/ScanProgress";
import { ResultPanel } from "@/components/app/ResultPanel";
import { SubmittedPanel } from "@/components/app/SubmittedPanel";
import { DetailsDrawer } from "@/components/app/DetailsDrawer";
import { PRESETS } from "@/lib/mockData";
import { runMockScan, type ScanResult } from "@/lib/mockScan";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({
  component: AppPage,
  head: () => ({
    meta: [{ title: "Cardinal — Workspace" }],
  }),
});

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
  const [collapsed, setCollapsed] = useState(false);

  const [composer, setComposer] = useState<ComposerState>(initialComposer);
  const [activePreset, setActivePreset] = useState<string | undefined>();
  const [stage, setStage] = useState<Stage | "submitted" | "cancelled">("compose");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [drawer, setDrawer] = useState(false);

  const onPickPreset = (id: "safe" | "review" | "block") => {
    const p = PRESETS.find((x) => x.id === id)!;
    setActivePreset(id);
    setStage("compose");
    setResult(null);
    setComposer({
      ...initialComposer,
      ...p.fields,
      unlimited: !!p.fields.unlimited,
      spender: p.fields.spender ?? "",
      fn: p.fields.fn ?? "",
    });
  };

  const onScan = () => {
    const res = runMockScan({
      ...composer,
      presetId: activePreset as "safe" | "review" | "block" | undefined,
    });
    setResult(res);
    setStage("scanning");
  };

  const onScanDone = () => setStage("verdict");

  const onReset = () => {
    setComposer(initialComposer);
    setActivePreset(undefined);
    setResult(null);
    setStage("compose");
  };

  const onProceed = () => {
    toast.success("Transaction submitted", {
      description: "Mock broadcast · no real transaction was sent.",
    });
    setStage("submitted");
  };

  const onCancel = () => {
    toast("Transaction cancelled", {
      description: "Cardinal blocked the request.",
    });
    setStage("cancelled");
  };

  const onPickActivity = () => {
    // mock: surface a review verdict
    setActivePreset("review");
    onPickPreset("review");
  };

  return (
    <div className="flex h-screen flex-col bg-[var(--background)]">
      <AppTopBar
        connected={connected}
        onToggleConnect={() => setConnected((v) => !v)}
        chain={chain}
        onChain={setChain}
        mode={mode}
        onMode={setMode}
      />

      <div className="flex flex-1 overflow-hidden">
        <div
          className="shrink-0 transition-[width] duration-200"
          style={{ width: collapsed ? 56 : 288 }}
        >
          <Sidebar
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed((v) => !v)}
            activePreset={activePreset}
            onPickPreset={onPickPreset}
            onCustom={onReset}
            onPickActivity={onPickActivity}
          />
        </div>

        {/* Workspace */}
        <main className="relative flex-1 overflow-y-auto">
          {/* Ambient wash, scoped to workspace */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(139,92,246,0.18), transparent 70%)",
              }}
            />
          </div>

          <div className="relative z-10 mx-auto flex min-h-full max-w-[920px] flex-col px-6 py-8">
            {/* Workspace header */}
            <div className="mb-5 flex items-center justify-between">
              <Stepper stage={stage} />
              <div className="hidden items-center gap-2 text-[11.5px] text-muted-foreground md:flex">
                <span className="font-mono uppercase tracking-[0.16em]">Scenario</span>
                <span className="rounded-md border hairline px-2 py-0.5 text-foreground/85">
                  {activePreset
                    ? PRESETS.find((p) => p.id === activePreset)?.label
                    : "Custom transaction"}
                </span>
              </div>
            </div>

            {/* Workspace surface */}
            <div className="surface-raise overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                {stage === "compose" && (
                  <motion.div
                    key="compose"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22 }}
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
                      onProceed={onProceed}
                      onCancel={onCancel}
                    />
                  </motion.div>
                )}
                {(stage === "submitted" || stage === "cancelled") && (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <SubmittedPanel kind={stage} onReset={onReset} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="mt-4 text-center text-[11.5px] text-muted-foreground">
              Mock data · No real transactions are sent in this preview.
            </p>
          </div>
        </main>
      </div>

      <DetailsDrawer open={drawer} onClose={() => setDrawer(false)} result={result} />
    </div>
  );
}