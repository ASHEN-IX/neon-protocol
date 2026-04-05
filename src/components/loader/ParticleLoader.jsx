import { useEffect, useRef, useState } from "react";
import { STATUSES } from "../../constants/protocolData";

export default function ParticleLoader({ onComplete }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(STATUSES[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let animationFrame;
    let completionTimeout;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const centerX = () => canvas.width / 2;
    const centerY = () => canvas.height / 2;

    resize();
    window.addEventListener("resize", resize);

    const particleCount = 340;

    const particles = Array.from({ length: particleCount }, (_, index) => {
      const angle = Math.random() * Math.PI * 2;
      const burstAngle = Math.random() * Math.PI * 2;
      const radius =
        Math.min(canvas.width, canvas.height) * (0.08 + Math.random() * 0.24);
      const startX = Math.random() * canvas.width;
      const startY = Math.random() * canvas.height;

      return {
        x: startX,
        y: startY,
        px: startX,
        py: startY,
        tx: centerX() + Math.cos(angle) * radius * 1.4,
        ty: centerY() + Math.sin(angle) * radius * 0.7,
        color: ["#ff00f2", "#00f6ff", "#39ff14", "#ff4fd8", "#7f7bff"][index % 5],
        size: 1.4 + Math.random() * 2.2,
        speed: 0.06 + Math.random() * 0.04,
        phase: Math.random() * Math.PI * 2,
        burstX: Math.cos(burstAngle) * (90 + Math.random() * 140),
        burstY: Math.sin(burstAngle) * (90 + Math.random() * 140),
      };
    });

    let start = null;
    let explosionStart = null;
    let lastTime = null;
    const loadDuration = 2400;
    const explosionDuration = 800;

    const draw = (timestamp) => {
      if (!start) {
        start = timestamp;
      }
      if (!lastTime) {
        lastTime = timestamp;
      }
      const timeScale = Math.min((timestamp - lastTime) / 16.666, 2.5);
      lastTime = timestamp;

      const rawProgress = Math.min((timestamp - start) / loadDuration, 1);
      const easedProgress =
        rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : -1 + (4 - 2 * rawProgress) * rawProgress;

      context.fillStyle = explosionStart ? "rgba(0,0,1,0.78)" : "rgba(0,0,1,0.62)";
      context.fillRect(0, 0, canvas.width, canvas.height);

      if (!explosionStart) {
        setProgress(Math.round(rawProgress * 100));
        setStatus(
          STATUSES[
            Math.min(Math.floor(rawProgress * STATUSES.length), STATUSES.length - 1)
          ]
        );

        context.globalCompositeOperation = "lighter";

        particles.forEach((particle) => {
          // Calculate frame-rate independent smooth lerping
          const currentSpeed = particle.speed * (0.8 + easedProgress * 1.5);
          const lerpFactor = 1 - Math.pow(1 - currentSpeed, timeScale);

          const nextX = particle.x + (particle.tx - particle.x) * lerpFactor;
          const nextY = particle.y + (particle.ty - particle.y) * lerpFactor;

          // Gentle smooth oscillation
          const oscillationX =
            Math.sin(timestamp * 0.0015 + particle.phase) * (1 - easedProgress) * 8;
          const oscillationY =
            Math.cos(timestamp * 0.0018 + particle.phase) * (1 - easedProgress) * 8;

          const drawX = nextX + oscillationX;
          const drawY = nextY + oscillationY;

          context.globalAlpha = 0.52;
          context.strokeStyle = particle.color;
          context.lineWidth = 1 + particle.size * 0.26;
          context.shadowColor = particle.color;
          context.shadowBlur = 22;
          context.beginPath();
          context.moveTo(particle.px, particle.py);
          context.lineTo(drawX, drawY);
          context.stroke();

          const neonCore = context.createRadialGradient(
            drawX,
            drawY,
            0,
            drawX,
            drawY,
            particle.size * 4.5
          );
          neonCore.addColorStop(0, "rgba(255,255,255,0.94)");
          neonCore.addColorStop(0.22, particle.color);
          neonCore.addColorStop(1, "transparent");

          context.beginPath();
          context.arc(
            drawX,
            drawY,
            particle.size * (0.85 + easedProgress * 0.95),
            0,
            Math.PI * 2
          );
          context.globalAlpha = 0.95;
          context.fillStyle = neonCore;
          context.fill();

          particle.px = drawX;
          particle.py = drawY;
          particle.x = nextX;
          particle.y = nextY;
        });

        context.globalAlpha = 1;
        context.globalCompositeOperation = "source-over";

        const glowGradient = context.createRadialGradient(
          centerX(),
          centerY(),
          0,
          centerX(),
          centerY(),
          220 * easedProgress
        );
        glowGradient.addColorStop(0, `rgba(255,0,242,${0.24 * easedProgress})`);
        glowGradient.addColorStop(0.5, `rgba(0,246,255,${0.14 * easedProgress})`);
        glowGradient.addColorStop(1, "transparent");

        context.fillStyle = glowGradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        if (rawProgress >= 1) {
          explosionStart = timestamp;
          setProgress(100);
          setStatus("NEON CORE OVERDRIVE");
          particles.forEach((particle) => {
            particle.x = particle.tx;
            particle.y = particle.ty;
            particle.px = particle.tx;
            particle.py = particle.ty;
          });
        }

        animationFrame = requestAnimationFrame(draw);
        return;
      }

      const explosionProgress = Math.min(
        (timestamp - explosionStart) / explosionDuration,
        1
      );
      const burstEase = 1 - Math.pow(1 - explosionProgress, 3);
      const fade = 1 - explosionProgress;

      context.globalCompositeOperation = "lighter";

      particles.forEach((particle) => {
        const fromX = particle.tx + particle.burstX * Math.max(burstEase - 0.08, 0);
        const fromY = particle.ty + particle.burstY * Math.max(burstEase - 0.08, 0);
        const toX = particle.tx + particle.burstX * burstEase;
        const toY = particle.ty + particle.burstY * burstEase;

        context.globalAlpha = Math.max(0, fade * 0.55);
        context.strokeStyle = particle.color;
        context.lineWidth = 1.2;
        context.shadowColor = particle.color;
        context.shadowBlur = 20;
        context.beginPath();
        context.moveTo(fromX, fromY);
        context.lineTo(toX, toY);
        context.stroke();

        context.globalAlpha = Math.max(0, fade);
        context.beginPath();
        context.arc(
          toX,
          toY,
          particle.size * (1 + burstEase * 1.8) * (0.8 + fade * 0.2),
          0,
          Math.PI * 2
        );
        context.fillStyle = particle.color;
        context.fill();

        const burstCore = context.createRadialGradient(
          toX,
          toY,
          0,
          toX,
          toY,
          particle.size * (5 + burstEase * 2)
        );
        burstCore.addColorStop(0, "rgba(255,255,255,0.9)");
        burstCore.addColorStop(0.28, particle.color);
        burstCore.addColorStop(1, "transparent");
        context.globalAlpha = Math.max(0, fade * 0.78);
        context.fillStyle = burstCore;
        context.beginPath();
        context.arc(toX, toY, particle.size * (2 + burstEase), 0, Math.PI * 2);
        context.fill();
      });

      const flashGradient = context.createRadialGradient(
        centerX(),
        centerY(),
        0,
        centerX(),
        centerY(),
        80 + Math.max(canvas.width, canvas.height) * 0.35 * burstEase
      );
      flashGradient.addColorStop(0, `rgba(255,255,255,${0.28 * fade})`);
      flashGradient.addColorStop(0.28, `rgba(0,246,255,${0.34 * fade})`);
      flashGradient.addColorStop(0.65, `rgba(255,0,242,${0.24 * fade})`);
      flashGradient.addColorStop(1, "transparent");

      context.globalAlpha = 1;
      context.fillStyle = flashGradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.globalCompositeOperation = "source-over";

      if (explosionProgress < 1) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        completionTimeout = setTimeout(onComplete, 130);
      }
    };

    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(completionTimeout);
      window.removeEventListener("resize", resize);
    };
  }, [onComplete]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          marginTop: "50vh",
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >
        <div
          style={{
            color: "#ff00f2",
            fontSize: 10,
            letterSpacing: 5,
            textShadow: "0 0 12px #ff00f2, 0 0 26px #00f6ff",
            animation: "blink 1.1s step-end infinite",
          }}
        >
          {status}
        </div>

        <div style={{ position: "relative", width: 280 }}>
          <div
            style={{
              width: "100%",
              height: 2,
              background: "rgba(255,0,242,0.22)",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #ff00f2, #00f6ff, #39ff14)",
                boxShadow: "0 0 18px #ff00f2",
                transition: "width 0.1s linear",
                borderRadius: 1,
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              right: 0,
              top: -18,
              color: "#00f6ff",
              fontSize: 10,
              letterSpacing: 2,
              textShadow: "0 0 10px #00f6ff",
            }}
          >
            {progress}%
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            width: 210,
            height: 56,
            top: -32,
            border: "1px solid #ff00f266",
            borderRadius: 4,
            boxShadow: "0 0 28px #ff00f255",
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        >
          {[
            { t: -1, l: -1, bt: "2px", bl: "2px" },
            { t: -1, r: -1, bt: "2px", br: "2px" },
            { b: -1, l: -1, bb: "2px", bl: "2px" },
            { b: -1, r: -1, bb: "2px", br: "2px" },
          ].map((corner, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                width: 12,
                height: 12,
                ...corner,
                borderTop: corner.bt ? `${corner.bt} solid #00f6ff` : undefined,
                borderLeft: corner.bl ? `${corner.bl} solid #00f6ff` : undefined,
                borderRight: corner.br ? `${corner.br} solid #00f6ff` : undefined,
                borderBottom: corner.bb ? `${corner.bb} solid #00f6ff` : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
