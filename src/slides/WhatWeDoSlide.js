import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Slide.css';
import AskMonolitDemo from '../components/AskMonolitDemo';

const stackLayers = [
  {
    id: 1,
    title: 'Knowledge Layer (Data Lake)',
    subtitle: 'Unified Intelligence',
    details: 'Aggregating On-Chain (8+ chains), CEXs, and Socials. The foundation that powers everything.',
    keywords: ['On-Chain', 'CEX', 'Socials', 'Real-time'],
    badge: 'LIVE',
    badgeColor: '#22c55e'
  },
  {
    id: 2,
    title: 'Action Layer (Execution)',
    subtitle: 'Automation & Triggers',
    details: 'The "Hands." Programmatic execution based on data logic. (e.g., "If Whale Buys + Twitter Positive → Copy Trade")',
    keywords: ['Automation', 'Triggers', 'Smart Execution'],
    badge: 'NEXT',
    badgeColor: '#3b82f6'
  },
  {
    id: 3,
    title: 'Monolit OS (The Operating System)',
    subtitle: 'Launchpad & Agent Economy',
    details: 'A decentralized environment for developers to create, share, and monetize agents. The "App Store" for autonomous crypto.',
    keywords: ['Marketplace', 'SDK', 'Monetization'],
    badge: 'VISION',
    badgeColor: '#a855f7'
  }
];

const WhatWeDoSlide = () => {
  const [step, setStep] = useState(0);
  const [hoveredLayer, setHoveredLayer] = useState(null);

  useEffect(() => {
    const timeline = [
      { delay: 0, next: 1 },     // Show problem immediately
      { delay: 3000, next: 2 },  // Solution emerges from problem
      { delay: 3000, next: 3 },  // Layer 1 (LIVE) appears
      { delay: 3000, next: 4 },  // Layer 2 (NEXT) appears
      { delay: 3000, next: 5 },  // Layer 3 (VISION) appears
      { delay: 3000, next: 6 },  // Wedge appears, layers shrink
      { delay: 3000, next: 7 }   // Final state
    ];

    let index = 0;
    const advance = () => {
      if (index < timeline.length) {
        setTimeout(() => {
          setStep(timeline[index].next);
          index++;
          advance();
        }, timeline[index].delay);
      }
    };

    advance();
  }, []);

  const showProblem = step >= 1;
  const showSolution = step >= 2;
  const showWedge = step >= 6;

  // Track which layer should show its description (during animation or on hover)
  const getExpandedLayer = () => {
    // During animation, auto-show description when layer appears
    if (step === 3) return 1; // Layer 1 just appeared
    if (step === 4) return 2; // Layer 2 just appeared
    if (step === 5) return 3; // Layer 3 just appeared

    // After animation, show on hover
    return hoveredLayer;
  };

  return (
    <div className="slide">
      <div className="slide-header">
        <h2 className="slide-title">What We Do</h2>
      </div>

      <div className="simple-stage">
        {/* Top Row: Problem & Solution */}
        <div className="top-row">
          <AnimatePresence>
            {showProblem && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="ps-card"
              >
                <h3 className="ps-label">THE PROBLEM</h3>
                <h4 className="ps-title">The Brain-Body Disconnect</h4>
                <p className="ps-text">
                  AI Agents are currently isolated. They cannot simultaneously verify on-chain data (Vision), analyze social sentiment (Context), and execute transactions (Action).
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSolution && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="ps-card"
              >
                <h3 className="ps-label">THE SOLUTION</h3>
                <h4 className="ps-title">Vertical Infrastructure</h4>
                <p className="ps-text">
                  We are the centralized pipe providing verified Data, logic-based Actions, and a deployment OS for the next generation of crypto agents.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Row: Layers + Wedge */}
        <div className="bottom-row">
          <motion.div
            animate={{ width: showWedge ? '65%' : '100%' }}
            transition={{ duration: 0.8 }}
            className="layers-container"
          >
            {stackLayers.map((layer, index) => (
              <AnimatePresence key={layer.id}>
                {step >= 3 + index && (
                  <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="simple-layer"
                    style={{ borderColor: layer.badgeColor }}
                    onMouseEnter={() => setHoveredLayer(layer.id)}
                    onMouseLeave={() => setHoveredLayer(null)}
                  >
                    <div className="simple-layer-header">
                      <span className="simple-badge" style={{ backgroundColor: layer.badgeColor }}>
                        {layer.badge}
                      </span>
                      <span className="simple-num">{layer.id}</span>
                    </div>
                    <h4 className="simple-layer-title">{layer.title}</h4>
                    <p className="simple-layer-subtitle">{layer.subtitle}</p>

                    {/* Description shown during animation */}
                    <AnimatePresence>
                      {getExpandedLayer() === layer.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                          className="simple-layer-expanded-content"
                        >
                          <p className="simple-layer-desc">{layer.details}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tags always present but shown on hover */}
                    <div className="simple-layer-tags">
                      {layer.keywords.map((kw, i) => (
                        <span key={i} className="simple-tag">{kw}</span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </motion.div>

          <AnimatePresence>
            {showWedge && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="simple-wedge"
              >
                <motion.div
                  animate={{
                    boxShadow: step === 7
                      ? ['0 0 0px rgba(245,158,11,0)', '0 0 20px rgba(245,158,11,0.6)', '0 0 0px rgba(245,158,11,0)']
                      : '0 0 0px rgba(245,158,11,0)'
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="simple-wedge-inner"
                  style={{ borderColor: step === 7 ? '#f59e0b' : 'var(--color-border)' }}
                >
                  <div>
                    <h3 className="simple-wedge-label">THE WEDGE</h3>
                    <h4 className="simple-wedge-title">AskMonolit</h4>
                    <p className="simple-wedge-text">
                      Natural language interface converting questions into verifiable on-chain insights.
                    </p>
                  </div>

                  {/* Interactive Demo */}
                  <div style={{ flex: 1, marginTop: '12px', minHeight: 0 }}>
                    <AskMonolitDemo />
                  </div>

                  <div className="simple-wedge-footer">
                    <span className="simple-wedge-badge-live">Live in Beta</span>
                    <a
                      href="https://ask.monolit.network"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="simple-wedge-btn"
                    >
                      Try it out
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDoSlide;
