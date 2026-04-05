import { useEffect, useRef, useState } from "react";
import { RIDDLE_LINES, ANSWER, CLUES } from "../../constants/protocolData";
import CipherReveal from "../effects/CipherReveal";
import { SoundManager } from "../../utils/soundManager";

const ATTEMPT_STORAGE_KEY = "neon_protocol_attempt_v1";

function readAttemptSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ATTEMPT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || parsed.consumed !== true || !Array.isArray(parsed.history)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writeAttemptSnapshot(snapshot) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(ATTEMPT_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore storage write failures.
  }
}

export default function TerminalRiddle({
  input,
  setInput,
  onSubmit: originalOnSubmit,
  error,
  solved,
}) {
  const persistedAttemptRef = useRef(readAttemptSnapshot());
  const persistedAttempt = persistedAttemptRef.current;
  const [commandText, setCommandText] = useState("");
  const [showRiddle, setShowRiddle] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [terminalPos, setTerminalPos] = useState({ x: 0, y: 0 });
  const [attempts, setAttempts] = useState(persistedAttempt ? 1 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [hasFlicker, setHasFlicker] = useState(false);
  const [revealedAnswer, setRevealedAnswer] = useState("");
  const [history, setHistory] = useState(
    persistedAttempt && Array.isArray(persistedAttempt.history)
      ? persistedAttempt.history
      : []
  );
  const [protocolText, setProtocolText] = useState("");
  const [showProtocolMessage, setShowProtocolMessage] = useState(false);
  const [terminalFade, setTerminalFade] = useState(1);
  const [terminalKey, setTerminalKey] = useState(0);
  const [attemptConsumed, setAttemptConsumed] = useState(Boolean(persistedAttempt));
  const terminalRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  SoundManager.init();

  // Auto-type command
  useEffect(() => {
    if (attemptConsumed) {
      setCommandText("");
      setShowRiddle(false);
      return undefined;
    }

    const command = "show riddle";
    let index = 0;
    const interval = setInterval(() => {
      if (index <= command.length) {
        setCommandText(command.substring(0, index));
        SoundManager.playTypeSound();
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowRiddle(true), 300);
      }
    }, 150);
    return () => clearInterval(interval);
  }, [attemptConsumed, terminalKey]);

  // Random flicker effect
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setHasFlicker(true);
        setTimeout(() => setHasFlicker(false), 100);
      }
    }, 2000);
    return () => clearInterval(flickerInterval);
  }, []);

  // Reveal answer character by character on solve
  useEffect(() => {
    if (solved && revealedAnswer.length < ANSWER.length) {
      const timeout = setTimeout(() => {
        setRevealedAnswer((prev) => {
          const next = ANSWER.substring(0, prev.length + 1);
          SoundManager.playBeep(523.25 + prev.length * 100, 100);
          return next;
        });
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [solved, revealedAnswer]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - terminalPos.x, y: e.clientY - terminalPos.y };
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    setTerminalPos({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDragMove);
      document.addEventListener("mouseup", handleDragEnd);
      return () => {
        document.removeEventListener("mousemove", handleDragMove);
        document.removeEventListener("mouseup", handleDragEnd);
      };
    }
  }, [isDragging]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "?") {
        setShowHints(!showHints);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showHints]);

  const handleSubmit = () => {
    if (attemptConsumed || isSubmitting || solved || !input.trim()) return;

    const originalInput = input.trim();
    const userAttempt = `> attempt 1: "${originalInput}"`;

    setAttemptConsumed(true);
    setAttempts(1);
    writeAttemptSnapshot({
      consumed: true,
      attempts: 1,
      input: originalInput,
      result: "pending",
      history: [userAttempt],
      updatedAt: Date.now(),
    });

    // Fade out old terminal
    setTerminalFade(0);

    setTimeout(() => {
      // Reset and create new terminal with fade in
      setTerminalKey((prev) => prev + 1);
      setTerminalFade(1);
      setCommandText("");
      setShowRiddle(false);
      setProtocolText("");
      setShowProtocolMessage(false);
      setInput("");

      setIsSubmitting(true);
      SoundManager.playBeep(400, 50);
      setAttempts(1);

      const newHistory = [userAttempt];
      setHistory(newHistory);

      // Start typing "trying protocol"
      setTimeout(() => {
        let index = 0;
        const protocolCommand = "trying protocol";
        const protocolInterval = setInterval(() => {
          if (index <= protocolCommand.length) {
            setProtocolText(protocolCommand.substring(0, index));
            SoundManager.playTypeSound();
            index++;
          } else {
            clearInterval(protocolInterval);
            // Show protocol message
            setTimeout(() => {
              setShowProtocolMessage(true);
              const messageHistory = [
                ...newHistory,
                `> ${protocolCommand}`,
                "",
                "Wait for the form to awaken,",
                "For this is where your answer shall be taken.",
              ];
              setHistory(messageHistory);

              // After showing message, validate answer
              setTimeout(() => {
                originalOnSubmit(originalInput);
                const finalHistory = [...messageHistory];
                const isCorrect = originalInput === ANSWER;
                if (originalInput === ANSWER) {
                  SoundManager.playSuccess();
                  finalHistory.push("");
                  finalHistory.push("✓ PROTOCOL DECRYPTED - NEON CORE ACTIVATED");
                } else {
                  SoundManager.playError();
                  finalHistory.push("");
                  finalHistory.push("✗ invalid credentials - access denied");
                }
                setHistory(finalHistory);
                setIsSubmitting(false);
                setProtocolText("");
                setShowProtocolMessage(false);
                setShowRiddle(false);
                writeAttemptSnapshot({
                  consumed: true,
                  attempts: 1,
                  input: originalInput,
                  result: isCorrect ? "success" : "error",
                  history: finalHistory,
                  updatedAt: Date.now(),
                });
              }, 2000);
            }, 300);
          }
        }, 150);
      }, 400);
    }, 400);
  };

  const shareSuccess = () => {
    const text = `🔐 I CRACKED THE NEON PROTOCOL! 🔐\n\n⏱️ Attempts: ${attempts + 1}\n💻 Final Answer: ${ANSWER}\n\n#NeonProtocol #Cyberpunk #RiddleGame`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const glitchClass = error && !solved ? "glitch" : "";

  return (
    <>
      {/* Flicker effect overlay */}
      {hasFlicker && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            pointerEvents: "none",
            background: "rgba(255,255,255,0.1)",
          }}
        />
      )}

      <div
        ref={terminalRef}
        onMouseDown={handleDragStart}
        style={{
          position: "fixed",
          top: `calc(50% + ${terminalPos.y}px)`,
          left: `calc(50% + ${terminalPos.x}px)`,
          transform: "translate(-50%, -50%)",
          zIndex: 30,
          width: "min(1000px, 95vw)",
          maxHeight: "90vh",
          fontFamily: "'Share Tech Mono', monospace",
          animation: "fadeInScale 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
          cursor: isDragging ? "grabbing" : "grab",
          opacity: hasFlicker ? 0.8 : terminalFade,
          filter: hasFlicker ? "brightness(1.2)" : "brightness(1)",
          transition: "opacity 400ms ease-in-out, filter 100ms",
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
            boxShadow:
              "0 0 30px rgba(192, 0, 255, 0.4), inset 0 0 30px rgba(192, 0, 255, 0.15)",
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
            overflow: "auto",
            maxHeight: "85vh",
          }}
          className={glitchClass}
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
              userSelect: "none",
            }}
            onMouseDown={(e) => e.stopPropagation()}
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
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                color: "rgba(0,246,255,0.6)",
                opacity: showHints ? 1 : 0.5,
              }}
            >
              Press ? for help
            </span>
          </div>

          {/* Help hints */}
          {showHints && (
            <div
              style={{
                marginBottom: 20,
                padding: 12,
                background: "rgba(0, 246, 255, 0.05)",
                border: "1px solid rgba(0, 246, 255, 0.2)",
                borderRadius: 4,
                fontSize: 12,
                color: "rgba(0, 246, 255, 0.7)",
                animation: "fadeInUp 0.3s ease",
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div style={{ marginBottom: 8, fontWeight: "bold" }}>
                ▸ AVAILABLE CLUES:
              </div>
              {CLUES.map((clue, i) => (
                <div key={i} style={{ marginBottom: 6, paddingLeft: 8 }}>
                  {clue.icon} {clue.label}: {clue.hint}
                </div>
              ))}
            </div>
          )}

          {/* Command history and protocol output */}
          {(history.length > 0 || protocolText) && (
            <div
              style={{
                marginBottom: 20,
                padding: 12,
                background: "rgba(192, 0, 255, 0.03)",
                border: "1px solid rgba(192, 0, 255, 0.1)",
                borderRadius: 4,
                maxHeight: 180,
                overflow: "auto",
                fontSize: 12,
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              {history.map((h, i) => (
                <div key={i} style={{ color: h.startsWith("✓") ? "#39ff14" : h.startsWith("✗") ? "#ff4fd8" : "#c0f", marginBottom: 4, minHeight: h === "" ? 4 : "auto" }}>
                  {h}
                </div>
              ))}

              {/* Live typing of "trying protocol" */}
              {protocolText && (
                <div style={{ color: "#0ff", marginBottom: 4, fontWeight: "bold" }}>
                  &gt; {protocolText}
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 14,
                      background: "#0ff",
                      marginLeft: 4,
                      animation: "blink 0.8s step-end infinite",
                    }}
                  />
                </div>
              )}

              {/* Protocol message appears after typing completes */}
              {showProtocolMessage && (
                <>
                  <div style={{ color: "#0ff", marginTop: 12, marginBottom: 8, fontStyle: "italic", lineHeight: 1.6, animation: "fadeInUp 0.4s ease" }}>
                    Wait for the form to awaken,
                  </div>
                  <div style={{ color: "#0ff", marginBottom: 4, fontStyle: "italic", text: "center", lineHeight: 1.6, animation: "fadeInUp 0.4s ease 0.1s both" }}>
                    For this is where your answer shall be taken.
                  </div>
                </>
              )}
            </div>
          )}

          {/* Command line */}
          {!attemptConsumed && (
            <div
              style={{
                marginBottom: showRiddle ? 28 : 0,
                minHeight: 40,
                display: "flex",
                alignItems: "center",
              }}
              onMouseDown={(e) => e.stopPropagation()}
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
          )}

          {/* Riddle output */}
          {showRiddle && (
            <div
              style={{
                animation: "fadeInUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
              }}
              onMouseDown={(e) => e.stopPropagation()}
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
                        fontFamily:
                          index === 4 ? "'Orbitron', sans-serif" : "inherit",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Attempts counter */}
              <div
                style={{
                  marginBottom: 16,
                  paddingBottom: 14,
                  borderBottom: "1px solid rgba(0, 246, 255, 0.2)",
                  color: "#0ff",
                  fontSize: 12,
                  textShadow: "0 0 6px #0ff",
                }}
              >
                ATTEMPTS: {attempts}/5
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
                    onChange={(e) => {
                      setInput(e.target.value);
                      SoundManager.playTypeSound();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                    placeholder="answer..."
                    className="terminal-input"
                    disabled={solved || isSubmitting}
                    style={{
                      flex: 1,
                      background: "rgba(192, 0, 255, 0.08)",
                      border: `2px solid ${
                        error && !solved
                          ? "rgba(255, 79, 216, 0.6)"
                          : "rgba(192, 0, 255, 0.4)"
                      }`,
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
                      opacity: solved || isSubmitting ? 0.6 : 1,
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={solved || isSubmitting || !input.trim()}
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
                      cursor:
                        solved || isSubmitting ? "default" : "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: solved
                        ? "0 0 16px rgba(57, 255, 20, 0.4)"
                        : "0 0 12px rgba(192, 0, 255, 0.4)",
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    {solved ? "✓ SOLVED" : isSubmitting ? "..." : "SUBMIT"}
                  </button>
                </div>

                {error && !solved && (
                  <div
                    style={{
                      marginTop: 14,
                      color: "#ff4fd8",
                      fontSize: 13,
                      textShadow: "0 0 8px rgba(255, 79, 216, 0.7)",
                      animation: "shake 0.4s ease-in-out",
                    }}
                    className={glitchClass}
                  >
                    ✗ {error}
                  </div>
                )}

                {solved && (
                  <div style={{ marginTop: 20 }}>
                    <div
                      style={{
                        marginBottom: 14,
                        color: "#39ff14",
                        fontSize: 13,
                        textShadow: "0 0 10px rgba(57, 255, 20, 0.8)",
                        animation: "fadeInUp 0.5s ease both",
                      }}
                    >
                      ✓ PROTOCOL UNLOCKED
                    </div>

                    {/* Character reveal */}
                    <div
                      style={{
                        padding: 12,
                        background: "rgba(57, 255, 20, 0.1)",
                        border: "1px solid rgba(57, 255, 20, 0.3)",
                        borderRadius: 4,
                        marginBottom: 14,
                        fontSize: 14,
                        color: "#39ff14",
                        letterSpacing: 3,
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {revealedAnswer}
                      {revealedAnswer.length < ANSWER.length && (
                        <span
                          style={{
                            display: "inline-block",
                            width: 10,
                            height: 20,
                            background: "#39ff14",
                            marginLeft: 6,
                            animation: "blink 0.8s step-end infinite",
                          }}
                        />
                      )}
                    </div>

                    {/* Share button */}
                    <button
                      onClick={shareSuccess}
                      style={{
                        width: "100%",
                        padding: "12px 20px",
                        background: "rgba(0, 246, 255, 0.15)",
                        border: "2px solid #0ff",
                        color: "#0ff",
                        fontFamily: "inherit",
                        fontSize: 12,
                        fontWeight: "bold",
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        textTransform: "uppercase",
                        letterSpacing: 1.5,
                        boxShadow: "0 0 12px rgba(0, 246, 255, 0.3)",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.boxShadow =
                          "0 0 20px rgba(0, 246, 255, 0.6)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow =
                          "0 0 12px rgba(0, 246, 255, 0.3)";
                      }}
                    >
                      🔐 SHARE SUCCESS
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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
            box-shadow: 0 0 30px rgba(192, 0, 255, 0.4), inset 0 0 30px rgba(192, 0, 255, 0.15);
          }
          50% {
            box-shadow: 0 0 60px rgba(192, 0, 255, 0.6), inset 0 0 60px rgba(192, 0, 255, 0.25);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-6px);
          }
          75% {
            transform: translateX(6px);
          }
        }

        .terminal-input:focus {
          border-color: #c0f !important;
          box-shadow: 0 0 20px rgba(192, 0, 255, 0.6) !important;
          background: rgba(192, 0, 255, 0.15) !important;
        }

        .terminal-input::placeholder {
          color: rgba(192, 0, 255, 0.4);
        }

        .terminal-input:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .glitch {
          position: relative;
          animation: glitch 0.15s ease-in-out;
        }

        @keyframes glitch {
          0%, 100% {
            text-shadow: 0 0 0 transparent;
          }
          25% {
            text-shadow: 2px 2px 0 #ff00ff;
          }
          50% {
            text-shadow: -2px -2px 0 #00ffff;
          }
          75% {
            text-shadow: 2px -2px 0 #ffff00;
          }
        }
      `}</style>
    </>
  );
}
