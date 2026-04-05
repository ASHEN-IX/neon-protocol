import { useEffect, useRef } from "react";

export default function MatrixRain({ strength = 0.3 }) {
  const canvasRef = useRef(null);

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
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 * strength})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "rgba(0,246,255,0.1)";
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

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [strength]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.05,
      }}
    />
  );
}
