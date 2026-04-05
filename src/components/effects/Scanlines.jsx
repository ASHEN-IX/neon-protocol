export default function Scanlines() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9000,
          background:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.13) 2px,rgba(0,0,0,0.13) 4px)",
        }}
      />
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          height: 3,
          zIndex: 8900,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg,transparent,rgba(192,0,255,0.4),rgba(0,255,255,0.3),transparent)",
          animation: "scanBeam 7s linear infinite",
        }}
      />
    </>
  );
}
