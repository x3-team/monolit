import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AskMonolitDemo = () => {
  const [status, setStatus] = useState('idle');
  const [displayedText, setDisplayedText] = useState('');

  const fullQuery = "Find accumulating whales on Base chain";

  const processingSteps = [
    { id: 1, text: "Parsing Intent (NLP)" },
    { id: 2, text: "Querying Base Node" },
    { id: 3, text: "Filtering > $50k Swaps" },
  ];

  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    let timeout;

    const runSequence = async () => {
      setStatus('typing');
      setDisplayedText('');
      setCompletedSteps([]);

      // Typing Effect
      for (let i = 0; i <= fullQuery.length; i++) {
        await new Promise(r => setTimeout(r, 50));
        setDisplayedText(fullQuery.slice(0, i));
      }

      await new Promise(r => setTimeout(r, 500));
      setStatus('processing');

      // Simulate Tool Execution
      for (const step of processingSteps) {
        await new Promise(r => setTimeout(r, 600));
        setCompletedSteps(prev => [...prev, step.id]);
      }

      await new Promise(r => setTimeout(r, 400));
      setStatus('done');

      timeout = setTimeout(() => {
        runSequence();
      }, 5000);
    };

    runSequence();

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ask-monolit-demo">

      {/* Header */}
      <div className="demo-header">
        <div className="demo-dots">
          <div className="demo-dot" />
          <div className="demo-dot" />
          <div className="demo-dot" />
        </div>
        <span className="demo-version">AskMonolit v1.0</span>
      </div>

      <div className="demo-content">

        {/* User Input */}
        <div className="demo-message-row">
          <div className="demo-avatar">You</div>
          <div className="demo-message-bubble">
            {displayedText}
            {status === 'typing' && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="demo-cursor"
              />
            )}
          </div>
        </div>

        {/* Processing Steps */}
        <AnimatePresence>
          {(status === 'processing' || status === 'done') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="demo-processing"
            >
              {processingSteps.map((step) => (
                <div key={step.id} className="demo-step">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="demo-step-icon"
                    style={{
                      color: completedSteps.includes(step.id) ? 'var(--color-text)' : 'var(--color-text-light)'
                    }}
                  >
                    {completedSteps.includes(step.id) ? "✓" : "○"}
                  </motion.div>
                  <span
                    className="demo-step-text"
                    style={{
                      color: completedSteps.includes(step.id) ? 'var(--color-text-muted)' : 'var(--color-text-light)'
                    }}
                  >
                    {step.text}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result Card */}
        <AnimatePresence>
          {status === 'done' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="demo-result"
            >
              <div className="demo-result-header">
                <span className="demo-result-title">High Conviction</span>
                <span className="demo-result-time">0.4s execution</span>
              </div>

              <div className="demo-tokens">
                <div className="demo-token">
                  <div className="demo-token-info">
                    <div className="demo-token-icon" />
                    <span className="demo-token-name">BRETT</span>
                  </div>
                  <div className="demo-token-data">
                    <div className="demo-token-amount">+$1.2M Inflow</div>
                    <div className="demo-token-meta">Last 1h • 3 Whales</div>
                  </div>
                </div>

                <div className="demo-token demo-token-secondary">
                  <div className="demo-token-info">
                    <div className="demo-token-icon" />
                    <span className="demo-token-name">DEGEN</span>
                  </div>
                  <div className="demo-token-data">
                    <div className="demo-token-amount">+$450K Inflow</div>
                  </div>
                </div>
              </div>

              <div className="demo-actions">
                <button className="demo-btn demo-btn-primary">Copy Trade</button>
                <button className="demo-btn demo-btn-secondary">Set Alert</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Scanning effect */}
      {status === 'processing' && (
        <motion.div
          initial={{ top: 0 }}
          animate={{ top: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="demo-scan"
        />
      )}
    </div>
  );
};

export default AskMonolitDemo;
