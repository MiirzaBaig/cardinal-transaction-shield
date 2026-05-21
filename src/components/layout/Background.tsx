export function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-70" />
      <div
        className="absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.22), rgba(99,102,241,0.06) 55%, transparent 75%)",
        }}
      />
      <div
        className="absolute bottom-[-200px] right-[-200px] h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(6,182,212,0.10), transparent 70%)",
        }}
      />
    </div>
  );
}