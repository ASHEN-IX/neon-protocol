import { useEffect, useRef, useState } from "react";
import { SoundManager } from "../../utils/soundManager";

export default function TerminalLoader({ onComplete }) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [loader, setLoader] = useState("");
  const canvasRef = useRef(null);

  SoundManager.init();

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Matrix rain in background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "アイウエオカキクケコ█▓▒░01∑∆Ω∞≈≠∂∫ΨΦΓ╬╫╪│┼";
    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(0);
    let animId = null;

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0,246,255,0.05)";
      ctx.font = "20px 'Share Tech Mono'";

      for (let i = 0; i < drops.length; i++) {
        const char = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(char, i * 20, drops[i] * 20);
        drops[i]++;

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    return () => cancelAnimationFrame(animId);
  }, []);

  // Type text "Project Neon awakens"
  useEffect(() => {
    const text = "PROJECT NEON AWAKENS";
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.substring(0, index));
        SoundManager.playTypeSound();
        index++;
      } else {
        clearInterval(interval);
        // Show loading animation
        setTimeout(() => {
          let loaderIndex = 0;
          const loaders = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
          const loaderInterval = setInterval(() => {
            setLoader(loaders[loaderIndex % loaders.length]);
            loaderIndex++;
          }, 150);

          // Complete after 3 seconds
          setTimeout(() => {
            clearInterval(loaderInterval);
            setDisplayText("");
            setLoader("");
            SoundManager.playSuccess();
            onComplete();
          }, 3000);
        }, 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Matrix rain background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0.1,
          pointerEvents: "none",
        }}
      />

      {/* Terminal container */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "min(800px, 90vw)",
          border: "2px solid rgba(192, 0, 255, 0.8)",
          borderRadius: 8,
          background: "rgba(2, 0, 12, 0.6)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          padding: "48px 56px",
          boxShadow:
            "0 0 60px rgba(192, 0, 255, 0.3), inset 0 0 60px rgba(0, 246, 255, 0.1)",
          animation: "fadeInScale 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        {/* Border glow animation */}
        <div
          style={{
            position: "absolute",
            inset: -2,
            border: "2px solid rgba(192, 0, 255, 0.8)",
            borderRadius: 8,
            pointerEvents: "none",
            boxShadow:
              "0 0 40px rgba(192, 0, 255, 0.4), inset 0 0 40px rgba(192, 0, 255, 0.2)",
            animation: "borderPulse 3s ease-in-out infinite",
          }}
        />

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
            NEON CORE INITIALIZATION
          </span>
        </div>

        {/* Main text area */}
        <div
          style={{
            minHeight: 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 32,
          }}
        >
          {/* Project Neon awakens text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ color: "#0ff", fontSize: 18 }}>▶</span>
            <span
              style={{
                color: "#c0f",
                fontSize: 28,
                letterSpacing: 2,
                fontWeight: "bold",
                textShadow: "0 0 20px rgba(192, 0, 255, 0.6)",
                minHeight: 35,
              }}
            >
              {displayText}
              {displayText.length < "PROJECT NEON AWAKENS".length && showCursor && (
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 28,
                    background: "#c0f",
                    marginLeft: 6,
                    boxShadow: "0 0 10px #c0f",
                  }}
                />
              )}
            </span>
          </div>

          {/* Loading animation */}
          {loader && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                paddingLeft: 30,
              }}
            >
              <span
                style={{
                  color: "#0ff",
                  fontSize: 20,
                  fontWeight: "bold",
                  animation: "spin 0.6s linear infinite",
                }}
              >
                {loader}
              </span>
              <span
                style={{
                  color: "#0ff",
                  fontSize: 14,
                  letterSpacing: 1.5,
                  textShadow: "0 0 8px #0ff",
                }}
              >
                INITIALIZING PROTOCOL...
              </span>
            </div>
          )}
        </div>

        {/* Status bar at bottom */}
        <div
          style={{
            marginTop: 32,
            paddingTop: 16,
            borderTop: "1px solid rgba(0, 246, 255, 0.2)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            color: "rgba(0, 246, 255, 0.6)",
            letterSpacing: 1,
          }}
        >
          <span>STATUS: ONLINE</span>
          <span>ENCRYPTION: ENABLED</span>
          <span>MODE: QUANTUM</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes borderPulse {
          0%, 100% {
            box-shadow: 0 0 40px rgba(192, 0, 255, 0.4), inset 0 0 40px rgba(192, 0, 255, 0.2);
          }
          50% {
            box-shadow: 0 0 60px rgba(192, 0, 255, 0.6), inset 0 0 60px rgba(192, 0, 255, 0.3);
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

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
