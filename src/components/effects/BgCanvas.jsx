import { useEffect, useRef } from "react";

export default function BgCanvas({ mouse }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const tickRef = useRef(0);
  const mouseRef = useRef(mouse);

  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      const { width, height } = canvas;
      const tick = tickRef.current++;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      context.clearRect(0, 0, width, height);

      const backgroundGradient = context.createRadialGradient(
        width / 2 + mouseX * 50,
        height * 0.4 + mouseY * 30,
        0,
        width / 2,
        height / 2,
        width * 0.9
      );
      backgroundGradient.addColorStop(0, "rgba(9,0,28,1)");
      backgroundGradient.addColorStop(0.5, "rgba(2,0,10,1)");
      backgroundGradient.addColorStop(1, "rgba(0,0,4,1)");
      context.fillStyle = backgroundGradient;
      context.fillRect(0, 0, width, height);

      const vanishingX = width / 2 + mouseX * 28;
      const vanishingY = height * 0.6 + mouseY * 18;
      const spread = width * 1.3;
      const columns = 18;
      const rows = 10;

      context.shadowBlur = 4;

      for (let column = 0; column <= columns; column += 1) {
        const baseX = -spread / 2 + (column / columns) * spread + width / 2;
        const opacity = 0.22 + 0.18 * Math.sin(tick * 0.022 + column * 0.35);

        context.strokeStyle = `rgba(160,0,255,${opacity})`;
        context.lineWidth = 0.9;
        context.shadowColor = "#c0f";

        context.beginPath();
        context.moveTo(vanishingX, vanishingY);
        context.lineTo(baseX, height + 20);
        context.stroke();
      }

      for (let row = 1; row <= rows; row += 1) {
        const factor = row / rows;
        const y = vanishingY + factor * (height + 20 - vanishingY);
        const leftX = vanishingX - (factor * spread) / 2;
        const rightX = vanishingX + (factor * spread) / 2;
        const opacity = 0.18 + 0.14 * Math.sin(tick * 0.026 + row * 0.5);

        context.strokeStyle = `rgba(0,200,255,${opacity})`;
        context.lineWidth = 0.7;
        context.shadowColor = "#0ff";

        context.beginPath();
        context.moveTo(leftX, y);
        context.lineTo(rightX, y);
        context.stroke();
      }

      [
        { bx: 0.18, by: 0.25, r: 150, c: "#c0f", s: 0.7 },
        { bx: 0.82, by: 0.18, r: 110, c: "#0ff", s: 0.9 },
        { bx: 0.5, by: 0.72, r: 85, c: "#f0c", s: 1.1 },
        { bx: 0.12, by: 0.7, r: 65, c: "#0f9", s: 0.6 },
        { bx: 0.87, by: 0.68, r: 60, c: "#a0f", s: 0.8 },
      ].forEach((orb) => {
        const orbX =
          orb.bx * width + mouseX * 20 + Math.sin(tick * 0.008 * orb.s) * 22;
        const orbY =
          orb.by * height + mouseY * 14 + Math.cos(tick * 0.009 * orb.s) * 18;

        const gradient = context.createRadialGradient(orbX, orbY, 0, orbX, orbY, orb.r);
        const alpha = 0.11 + 0.05 * Math.sin(tick * 0.015 * orb.s);

        gradient.addColorStop(
          0,
          `${orb.c}${Math.round(alpha * 255)
            .toString(16)
            .padStart(2, "0")}`
        );
        gradient.addColorStop(1, "transparent");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(orbX, orbY, orb.r, 0, Math.PI * 2);
        context.fill();
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
    />
  );
}
