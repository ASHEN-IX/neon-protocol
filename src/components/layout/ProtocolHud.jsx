export default function ProtocolHud({ solved }) {
  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 18,
          left: 20,
          zIndex: 40,
          fontFamily: "'Share Tech Mono',monospace",
          fontSize: 10,
          color: "#c0f8",
          letterSpacing: 2,
          lineHeight: 2,
        }}
      >
        <div style={{ color: "#c0f", textShadow: "0 0 8px #c0f" }}>◈ NEON PROTOCOL</div>
        <div style={{ color: "#c0f5" }}>v2.7.3 — BREACH MODE</div>
      </div>

      <div
        style={{
          position: "fixed",
          top: 18,
          right: 20,
          zIndex: 40,
          fontFamily: "'Share Tech Mono',monospace",
          fontSize: 10,
          color: "#0ff8",
          letterSpacing: 2,
          textAlign: "right",
          lineHeight: 2,
        }}
      >
        <div
          style={{
            color: solved ? "#0f9" : "#f05",
            textShadow: `0 0 8px ${solved ? "#0f9" : "#f05"}`,
            animation: solved ? "none" : "blink 1s step-end infinite",
          }}
        >
          {solved ? "● SECURED" : "● UNSECURED"}
        </div>
        <div style={{ color: "#0ff5" }}>LAB-7 // CIPHER ACTIVE</div>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 14,
          left: 0,
          right: 0,
          zIndex: 40,
          display: "flex",
          justifyContent: "center",
          gap: 32,
          fontFamily: "'Share Tech Mono',monospace",
          fontSize: 9,
          color: "#c0f4",
          letterSpacing: 2,
        }}
      >
        <span>◈ CLICK NODES TO DECODE</span>
        <span style={{ color: "#0ff4" }}>◈ ENTER NUMBER → EXECUTE</span>
        <span>◈ PRESS ENTER TO SUBMIT</span>
      </div>
    </>
  );
}
