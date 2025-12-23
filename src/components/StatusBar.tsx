import { useState, useEffect } from "react";

export default function StatusBar() {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Loading System Context...";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      // Hide cursor after typing is complete and show final status
      const timer = setTimeout(() => {
        setShowCursor(false);
        setIsComplete(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText]);

  return (
    <>
      <style>{`
        .status-bar {
          width: 100%;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
        }

        .status-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .status-text {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: ui-monospace, 'Cascadia Code', monospace;
        }

        .status-label {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .status-value {
          font-size: 0.875rem;
          color: rgba(0, 255, 255, 0.9);
          font-weight: 500;
        }

        .cursor {
          color: rgba(0, 255, 255, 0.9);
          animation: blink 1s infinite;
          margin-left: 0.125rem;
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }

        .status-data {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .data-point {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .data-label {
          font-family: ui-monospace, 'Cascadia Code', monospace;
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .data-value {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 768px) {
          .status-data {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <div className="status-bar">
        <div className="status-content">
          <div className="status-text">
            {isComplete ? (
              <>
                <span className="status-label">Status:</span>
                <span className="status-value">System Context Loaded</span>
              </>
            ) : (
              <>
                <span className="status-label">Status:</span>
                <span className="status-value">
                  {displayedText}
                  {showCursor && <span className="cursor">|</span>}
                </span>
              </>
            )}
          </div>
          {isComplete && (
            <div className="status-data">
              <div className="data-point">
                <span className="data-label">Focus:</span>
                <span className="data-value">Agentic AI & Large Scale Systems</span>
              </div>
              <div className="data-point">
                <span className="data-label">Building:</span>
                <span className="data-value">Real-Time Inference Engines</span>
              </div>
              <div className="data-point">
                <span className="data-label">Reading:</span>
                <span className="data-value">Godel, Escher, Bach</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

