import { useEffect, useState } from "react";
import { RIDDLE_LINES, ANSWER } from "../../constants/protocolData";
import CipherReveal from "../effects/CipherReveal";

export default function TerminalRiddle({
  input,
  setInput,
  onSubmit,
  error,
  solved,
}) {
  const [commandText, setCommandText] = useState("");
  const [showRiddle, setShowRiddle] = useState(false);

  // Auto-type "show riddle" command
  useEffect(() => {
    const command = "show riddle";
    let index = 0;
    const interval = setInterval(() => {
      if (index <= command.length) {
        setCommandText(command.substring(0, index));
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowRiddle(true), 300);
      }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 30,
        width: "min(1000px, 95vw)",
        maxHeight: "90vh",
        fontFamily: "'Share Tech Mono', monospace",
        animation: "fadeInScale 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
      }}
    >
      {/* Border glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "1px solid rgba(192, 0, 255, 0.8)",
          borderRadius: 8,
          pointerEvents: "none",
          boxShadow: "0 0 30px rgba(192, 0, 255, 0.4), inset 0 0 30px rgba(192, 0, 255, 0.15)",
          animation: "borderPulse 3s ease-in-out infinite",
        }}
      />

      {/* Terminal screen */}
      <div
        style={{
          position: "relative",
          background: "rgba(2, 0, 12, 0.4)",
          border: "1px solid rgba(192, 0, 255, 0.5)",
          borderRadius: 8,
          padding: "48px 56px",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow:
            "0 0 60px rgba(192, 0, 255, 0.25), inset 0 0 60px rgba(0, 246, 255, 0.08)",
          overflow: "hidden",
        }}
      >
        {/* Terminal header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 32,
            paddingBottom: 18,
            borderBottom: "1px solid rgba(192, 0, 255, 0.3)",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#0ff",
              boxShadow: "0 0 12px #0ff",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              color: "#0ff",
              fontSize: 15,
              letterSpacing: 3,
              textTransform: "uppercase",
              fontWeight: "bold",
              textShadow: "0 0 10px #0ff",
            }}
          >
            NEON PROTOCOL TERMINAL
          </span>
        </div>

        {/* Command line */}
        <div
          style={{
            marginBottom: showRiddle ? 28 : 0,
            minHeight: 40,
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#0ff", marginRight: 12, fontSize: 18 }}>
            ▶
          </span>
          <span style={{ color: "#c0f", fontSize: 16, letterSpacing: 1 }}>
            {commandText}
          </span>
          {!showRiddle && (
            <span
              style={{
                display: "inline-block",
                width: 10,
                height: 20,
                background: "#c0f",
                marginLeft: 6,
                animation: "blink 0.8s step-end infinite",
                boxShadow: "0 0 8px #c0f",
              }}
            />
          )}
        </div>

        {/* Riddle output */}
        {showRiddle && (
          <div
            style={{
              animation: "fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
            <div
              style={{
                marginBottom: 16,
                paddingBottom: 14,
                borderBottom: "1px solid rgba(0, 246, 255, 0.2)",
              }}
            >
              <div
                style={{
                  color: "#0ff",
                  fontSize: 13,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 20,
                  textShadow: "0 0 10px #0ff",
                  fontWeight: "bold",
                }}
              >
                ▸ RIDDLE DECRYPTED ▸
              </div>

              {RIDDLE_LINES.map((line, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    marginBottom: 14,
                    paddingLeft: 16,
                    borderLeft: `3px solid ${
                      index === 4 ? "rgba(0, 255, 255, 0.8)" : "rgba(192, 0, 255, 0.5)"
                    }`,
                    animation: `fadeInLeft 0.6s cubic-bezier(0.22, 1, 0.36, 1) both`,
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "rgba(192, 0, 255, 0.7)",
                      minWidth: 22,
                      fontWeight: "bold",
                    }}
                  >
                    [{String(index + 1).padStart(2, "0")}]
                  </span>
                  <CipherReveal
                    text={line}
                    delay={600 + index * 60}
                    speed={20}
                    color={index === 4 ? "#0ff" : "#c9b0ff"}
                    finalColor={index === 4 ? "#0ff" : undefined}
                    style={{
                      fontSize: index === 4 ? 16 : 15,
                      letterSpacing: index === 4 ? 2 : 0.5,
                      fontFamily: index === 4 ? "'Orbitron', sans-serif" : "inherit",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Input section */}
            <div style={{ marginTop: 28 }}>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#0ff", fontSize: 18 }}>▶</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSubmit();
                    }
                  }}
                  placeholder="answer..."
                  className="terminal-input"
                  style={{
                    flex: 1,
                    background: "rgba(192, 0, 255, 0.08)",
                    border: "2px solid rgba(192, 0, 255, 0.4)",
                    color: "#c0f",
                    fontFamily: "inherit",
                    padding: "14px 18px",
                    borderRadius: 6,
                    fontSize: 15,
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxShadow:
                      input && !error
                        ? "0 0 16px rgba(192, 0, 255, 0.5)"
                        : "none",
                  }}
                />
                <button
                  onClick={onSubmit}
                  disabled={solved}
                  style={{
                    padding: "12px 24px",
                    background: solved
                      ? "rgba(57, 255, 20, 0.25)"
                      : "rgba(192, 0, 255, 0.25)",
                    border: `2px solid ${solved ? "#39ff14" : "#c0f"}`,
                    color: solved ? "#39ff14" : "#c0f",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: "bold",
                    borderRadius: 6,
                    cursor: solved ? "default" : "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: solved
                      ? "0 0 16px rgba(57, 255, 20, 0.4)"
                      : "0 0 12px rgba(192, 0, 255, 0.4)",
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                  }}
                >
                  {solved ? "✓ SOLVED" : "SUBMIT"}
                </button>
              </div>

              {error && (
                <div
                  style={{
                    marginTop: 14,
                    color: "#ff4fd8",
                    fontSize: 13,
                    textShadow: "0 0 8px rgba(255, 79, 216, 0.7)",
                    animation: "shake 0.4s ease-in-out",
                  }}
                >
                  ✗ {error}
                </div>
              )}

              {solved && (
                <div
                  style={{
                    marginTop: 14,
                    color: "#39ff14",
                    fontSize: 13,
                    textShadow: "0 0 10px rgba(57, 255, 20, 0.8)",
                    animation: "fadeInUp 0.5s ease both",
                  }}
                >
                  ✓ PROTOCOL UNLOCKED
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }

        @keyframes borderPulse {
          0%, 100% {
            box-shadow: 0 0 20px #c0f, inset 0 0 20px rgba(192, 0, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 40px #c0f, inset 0 0 40px rgba(192, 0, 255, 0.2);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }

        .terminal-input:focus {
          border-color: #c0f !important;
          box-shadow: 0 0 16px rgba(192, 0, 255, 0.5) !important;
          background: rgba(192, 0, 255, 0.1) !important;
        }

        .terminal-input::placeholder {
          color: rgba(192, 0, 255, 0.4);
        }
      `}</style>
    </div>
  );
}
