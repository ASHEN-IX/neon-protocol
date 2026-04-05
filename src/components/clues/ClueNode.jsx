import { useState } from "react";

export default function ClueNode({
  icon,
  label,
  hint,
  x,
  y,
  found,
  onFind,
  mouse,
}) {
  const [hovered, setHovered] = useState(false);
  const moveX = hovered ? mouse.x * 9 : 0;
  const moveY = hovered ? mouse.y * 9 : 0;

  return (
    <div
      onClick={() => !found && onFind()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) translate(${moveX}px,${moveY}px) scale(${hovered ? 1.1 : 1})`,
        transition: "transform 0.28s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: found ? "default" : "pointer",
        zIndex: 20,
        userSelect: "none",
      }}
    >
      {!found && (
        <div
          style={{
            position: "absolute",
            inset: -16,
            borderRadius: "50%",
            border: `1px solid ${hovered ? "#c0f" : "#c0f4"}`,
            boxShadow: hovered ? "0 0 20px #c0f, 0 0 50px #c0f3" : "none",
            animation: "orbPulse 2.6s ease-in-out infinite",
            transition: "all 0.3s",
          }}
        />
      )}

      <div
        style={{
          background: found
            ? "linear-gradient(135deg,rgba(0,255,180,0.18),rgba(0,200,255,0.14))"
            : hovered
              ? "linear-gradient(135deg,rgba(192,0,255,0.22),rgba(0,200,255,0.16))"
              : "rgba(8,0,20,0.75)",
          border: `1px solid ${found ? "#00ffb2" : hovered ? "#c0f" : "#3a1a6e"}`,
          borderRadius: 12,
          padding: "12px 16px",
          backdropFilter: "blur(14px)",
          minWidth: 118,
          textAlign: "center",
          boxShadow: found
            ? "0 0 28px #0f94,0 0 60px #0f91"
            : hovered
              ? "0 0 32px #c0f5"
              : "0 0 10px #c0f2",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
        <div
          style={{
            fontFamily: "'Share Tech Mono',monospace",
            fontSize: 9,
            letterSpacing: 2.5,
            color: found ? "#00ffb2" : hovered ? "#d0a0ff" : "#6040a0",
            textTransform: "uppercase",
          }}
        >
          {found ? "DECODED" : label}
        </div>

        {found && (
          <div
            style={{
              marginTop: 8,
              paddingTop: 7,
              borderTop: "1px solid #0ff3",
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: 11,
              color: "#0ff",
              lineHeight: 1.6,
              animation: "fadeUp 0.4s ease both",
            }}
          >
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}
