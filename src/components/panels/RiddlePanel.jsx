import CipherReveal from "../effects/CipherReveal";
import { RIDDLE_LINES } from "../../constants/protocolData";

export default function RiddlePanel({
  cluesFound,
  input,
  setInput,
  onSubmit,
  error,
  solved,
}) {
  const decodedClues = cluesFound.filter(Boolean).length;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: 30,
        width: "min(600px,88vw)",
        fontFamily: "'Share Tech Mono',monospace",
        animation: "flickerIn 0.9s ease both",
      }}
    >
      <div
        style={{
          height: 2,
          background:
            "linear-gradient(90deg,transparent,#c0f,#0ff,#c0f,transparent)",
          boxShadow: "0 0 18px #c0f",
          animation: "barPulse 3s ease-in-out infinite",
        }}
      />
      <div
        style={{
          background: "rgba(4,0,16,0.93)",
          border: "1px solid #c0f3",
          borderTop: "none",
          borderRadius: "0 0 14px 14px",
          padding: "26px 30px 28px",
          backdropFilter: "blur(22px)",
          boxShadow: "0 20px 80px #c0f1,inset 0 0 60px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div
            style={{
              color: "#c0f",
              fontSize: 10,
              letterSpacing: 5,
              textShadow: "0 0 10px #c0f",
              marginBottom: 4,
              animation: "blink 2s step-end infinite",
            }}
          >
            ◈ ◈ ◈ NEON PROTOCOL ACTIVE ◈ ◈ ◈
          </div>
          <div style={{ color: "#c0f4", fontSize: 9, letterSpacing: 3 }}>
            || CIPHER TASK — DECRYPT THE SEQUENCE ||
          </div>
        </div>

        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg,transparent,#c0f4,transparent)",
            marginBottom: 20,
          }}
        />

        <div style={{ marginBottom: 22 }}>
          {RIDDLE_LINES.map((line, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 10,
                marginBottom: 6,
                paddingLeft: 10,
                borderLeft: `2px solid ${index === 4 ? "#0ff5" : "#c0f3"}`,
              }}
            >
              <span style={{ fontSize: 10, color: "#c0f6", minWidth: 16 }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <CipherReveal
                text={line}
                delay={600 + index * 560}
                speed={26}
                color={index === 4 ? "#0ff" : "#c9b0ff"}
                finalColor={index === 4 ? "#0ff" : undefined}
                style={{
                  fontSize: index === 4 ? 13 : 14,
                  letterSpacing: index === 4 ? 2 : 0.3,
                  fontFamily:
                    index === 4
                      ? "'Orbitron',sans-serif"
                      : "'Share Tech Mono',monospace",
                }}
              />
            </div>
          ))}
        </div>

        <div
          style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 16 }}
        >
          {cluesFound.map((found, index) => (
            <div
              key={index}
              style={{
                width: 38,
                height: 4,
                borderRadius: 2,
                background: found ? "#0f9" : "#c0f2",
                boxShadow: found ? "0 0 10px #0f9" : "none",
                transition: "all 0.5s ease",
              }}
            />
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            color: "#5030a0",
            fontSize: 10,
            letterSpacing: 2.5,
            marginBottom: 18,
          }}
        >
          {decodedClues < 4
            ? `↳ EXPLORE THE LAB  [${decodedClues}/4 NODES DECODED]`
            : "↳ ALL CLUES DECODED — ENTER THE FINAL SEQUENCE"}
        </div>

        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg,transparent,#c0f3,transparent)",
            marginBottom: 20,
          }}
        />

        {!solved ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "#c0f5", fontSize: 26, lineHeight: 1 }}>[</span>
              <input
                type="text"
                maxLength={3}
                value={input}
                onChange={(event) =>
                  setInput(event.target.value.replace(/[^0-9]/g, ""))
                }
                onKeyDown={(event) => event.key === "Enter" && onSubmit()}
                placeholder="?"
                style={{
                  background: "rgba(0,0,0,0.75)",
                  border: `1.5px solid ${error ? "#f05" : decodedClues === 4 ? "#0ff" : "#c0f"}`,
                  borderRadius: 6,
                  color: "#0ff",
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 24,
                  letterSpacing: 10,
                  textAlign: "center",
                  padding: "8px 14px",
                  width: 100,
                  outline: "none",
                  boxShadow: error
                    ? "0 0 22px #f054"
                    : decodedClues === 4
                      ? "0 0 20px #0ff6"
                      : "0 0 14px #c0f4",
                  animation: error ? "shake 0.35s ease" : "none",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
              />
              <span style={{ color: "#c0f5", fontSize: 26, lineHeight: 1 }}>]</span>
            </div>

            <button
              onClick={onSubmit}
              style={{
                background: "transparent",
                border: `1.5px solid ${decodedClues === 4 ? "#0ff" : "#c0f"}`,
                color: decodedClues === 4 ? "#0ff" : "#c0f",
                fontFamily: "'Orbitron',monospace",
                fontSize: 10,
                letterSpacing: 4,
                padding: "9px 28px",
                cursor: "pointer",
                borderRadius: 4,
                textTransform: "uppercase",
                boxShadow: decodedClues === 4
                  ? "0 0 20px #0ff4"
                  : "0 0 10px #c0f3",
                transition: "all 0.25s",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.boxShadow = "0 0 40px #c0f,0 0 80px #c0f3";
                event.currentTarget.style.background = "rgba(192,0,255,0.12)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.boxShadow =
                  decodedClues === 4 ? "0 0 20px #0ff4" : "0 0 10px #c0f3";
                event.currentTarget.style.background = "transparent";
              }}
            >
              EXECUTE PROTOCOL
            </button>

            {error && (
              <div
                style={{
                  color: "#f05",
                  fontSize: 10,
                  letterSpacing: 2,
                  animation: "fadeUp 0.3s ease",
                }}
              >
                ⚠ SEQUENCE REJECTED — REANALYZE
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: "#0ff",
                fontFamily: "'Orbitron',sans-serif",
                fontSize: 18,
                letterSpacing: 8,
                textShadow: "0 0 20px #0ff,0 0 60px #0ff8",
                animation: "solvedPulse 1.8s ease-in-out infinite",
                marginBottom: 10,
              }}
            >
              ✓ PROTOCOL UNLOCKED
            </div>
            <div style={{ color: "#0f94", fontSize: 10, letterSpacing: 3 }}>
              THE FINAL DANCE BEGINS AT 21:00
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg,transparent,#0ff,#c0f,transparent)",
          boxShadow: "0 0 10px #0ff",
        }}
      />
    </div>
  );
}
