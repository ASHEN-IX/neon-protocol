import { useCallback, useEffect, useRef, useState } from "react";
import TerminalLoader from "../components/loader/TerminalLoader";
import GridScan from "../components/effects/GridScan";
import TerminalRiddleEnhanced from "../components/panels/TerminalRiddleEnhanced";
import MatrixRain from "../components/effects/MatrixRain";
import { ANSWER } from "../constants/protocolData";

export default function NeonProtocolPage() {
  const [loadingPhase, setLoadingPhase] = useState("loading");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [solved, setSolved] = useState(false);
  const transitionTimeoutRef = useRef(null);

  const handleSubmit = useCallback(() => {
    if (!input.trim()) {
      setError("Enter an answer");
      return;
    }
    if (input.trim() === ANSWER) {
      setSolved(true);
      setError("");
    } else {
      setError("Incorrect answer. Try again.");
    }
  }, [input]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const handleLoaderComplete = useCallback(() => {
    setLoadingPhase("transition");
    transitionTimeoutRef.current = setTimeout(() => {
      setLoadingPhase("done");
    }, 760);
  }, []);

  const isSceneVisible = loadingPhase !== "loading";
  const showLoader = loadingPhase !== "done";

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          opacity: isSceneVisible ? 1 : 0,
          transform: isSceneVisible ? "scale(1)" : "scale(1.015)",
          filter: isSceneVisible ? "brightness(1)" : "brightness(0.45) blur(3px)",
          transition:
            "opacity 760ms cubic-bezier(0.22, 1, 0.36, 1), transform 760ms cubic-bezier(0.22, 1, 0.36, 1), filter 760ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "opacity, transform, filter",
        }}
      >
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#392e4e"
          gridScale={0.1}
          scanColor="#ff9ffc"
          scanOpacity={0.4}
          enablePost
          bloomIntensity={0.6}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
          style={{ position: "fixed", inset: 0, zIndex: 0 }}
        />
      </div>

      {showLoader && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1200,
            opacity: loadingPhase === "transition" ? 0 : 1,
            transition: "opacity 760ms cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: loadingPhase === "transition" ? "none" : "auto",
          }}
        >
          <TerminalLoader onComplete={handleLoaderComplete} />
        </div>
      )}

      {loadingPhase === "done" && (
        <>
          <MatrixRain strength={0.2} />
          <TerminalRiddleEnhanced
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            error={error}
            solved={solved}
          />
        </>
      )}
    </>
  );
}
