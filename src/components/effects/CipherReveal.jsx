import { useEffect, useRef, useState } from "react";
import { CYPHER_CHARS } from "../../constants/protocolData";

function scrambleText(text) {
  return text
    .split("")
    .map((char) =>
      char === " "
        ? " "
        : CYPHER_CHARS[Math.floor(Math.random() * CYPHER_CHARS.length)]
    )
    .join("");
}

export default function CipherReveal({
  text,
  delay = 0,
  speed = 30,
  color = "#c9b0ff",
  finalColor,
  style = {},
}) {
  const [revealedText, setRevealedText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setRevealedText("");
    setCipherText("");

    let tickInterval;
    const startTimeout = setTimeout(() => {
      setCipherText(scrambleText(text));

      tickInterval = setInterval(() => {
        indexRef.current += 1;
        setRevealedText(text.slice(0, indexRef.current));

        const remaining = text.slice(indexRef.current);
        setCipherText(remaining ? scrambleText(remaining) : "");

        if (indexRef.current >= text.length) {
          clearInterval(tickInterval);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (tickInterval) {
        clearInterval(tickInterval);
      }
    };
  }, [text, delay, speed]);

  return (
    <span style={{ fontFamily: "'Share Tech Mono', monospace", ...style }}>
      <span style={{ color: finalColor || color }}>{revealedText}</span>
      <span style={{ color: "#0ff7", opacity: 0.75 }}>{cipherText}</span>
    </span>
  );
}
