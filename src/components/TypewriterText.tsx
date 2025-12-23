import { useState, useEffect } from "react";

export default function TypewriterText() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Applied AI Architect";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);

      return () => clearTimeout(timer);
    } else {
      // Hide cursor after typing is complete
      const timer = setTimeout(() => {
        setShowCursor(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText]);

  return (
    <h2 className="hero-subtitle">
      {displayedText}
      {showCursor && <span className="cursor">|</span>}
    </h2>
  );
}

