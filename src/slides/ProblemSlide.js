import React, { useState, useEffect } from 'react';
import './Slide.css';
import duneLogo from '../assets/dune.png';
import arkhamLogo from '../assets/arkham.png';
import thegraphLogo from '../assets/thegraph.png';
import uniswapLogo from '../assets/uniswap.png';
import aaveLogo from '../assets/aave.png';
import gnosisLogo from '../assets/gnosis.png';
import agentRobot from '../assets/agent_robot.png';

const ProblemSlide = () => {
  const [activeState, setActiveState] = useState(1); // 1: Entropy, 2: Blindspot, 3: Gap, 4: Chaos

  // Auto-cycle states
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveState(prev => (prev % 4) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getLayerClass = (layerId) => {
    // layerId: 1, 2, 3
    if (activeState === 4) return 'active'; // Chaos mode: all active
    if (activeState === layerId) return 'active';
    if (activeState > layerId) return 'blurred';
    return 'hidden'; // Future states are hidden
  };

  return (
    <div className="slide problem-slide">
      <div className="slide-header">
        <h2 className="slide-title">The Missing Infrastructure for the Agent Era</h2>
        <p className="slide-subtitle"> Transition from Human Analytics to Agent Execution.</p>
      </div>

      <div className="problem-layout-new">
        {/* Left Column: The Animation Specification */}
        <div className="problem-viz-container">
          <div className={`viz-stage stage-${activeState}`}>
            {/* Central Agent Node */}
            <div className={`agent-node-center ${activeState === 4 ? 'shaking-hard' : (activeState === 1 ? 'shaking' : '')}`}>
              <div className="agent-ascii">[ ●_● ]</div>
              <div className="agent-label">AGENT</div>
            </div>

            {/* State 1: The Noise (Data Entropy) */}
            <div className={`viz-layer layer-entropy ${getLayerClass(1)}`}>
              <div className="source-group">
                <img src={duneLogo} className="source-logo" alt="Dune" />
                <img src={arkhamLogo} className="source-logo" alt="Arkham" />
                <img src={thegraphLogo} className="source-logo" alt="The Graph" />
              </div>
              <div className="particles-container">
                <div className="particle p1">&lt;html&gt;</div>
                <div className="particle p2">404 Error</div>
                <div className="particle p3">image.png</div>
                <div className="particle p4">Rate Limit</div>
                <div className="particle p5">Timeout</div>
                <div className="particle p6">403 Forbidden</div>
              </div>
            </div>

            {/* State 2: The Failure (Execution Blindspot) */}
            <div className={`viz-layer layer-execution ${getLayerClass(2)}`}>
              <div className="market-group">
                <img src={uniswapLogo} className="market-logo" alt="Uniswap" />
                <img src={aaveLogo} className="market-logo" alt="Aave" />
                <img src={gnosisLogo} className="market-logo" alt="Gnosis" />
              </div>
              <div className="transaction-arrow-container">
                <div className="tx-arrow"></div>
                <div className="tx-break">💥</div>
              </div>
              <div className="error-badges">
                <div className="error-badge badge-revert">REVERT</div>
                <div className="error-badge badge-slippage">SLIPPAGE &gt; 10%</div>
                <div className="error-badge badge-gas">GAS SPIKE</div>
                <div className="error-badge badge-mev">MEV ATTACK</div>
                <div className="error-badge badge-nonce">STUCK NONCE</div>
                <div className="error-badge badge-funds">NO FUNDS</div>
              </div>
            </div>

            {/* State 3: The Babel (Coordination Gap) */}
            <div className={`viz-layer layer-coordination ${getLayerClass(3)}`}>
              <div className="peer-agent peer-left">
                <div className="peer-icon">🤖</div>
                <div className="speech-bubble">01010</div>
              </div>
              <div className="peer-agent peer-right">
                <div className="peer-icon">👾</div>
                <div className="speech-bubble">"你好"</div>
              </div>
              <div className="connection-lines">
                <div className="conn-line line-left"></div>
                <div className="conn-line line-right"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: The Logic (Text Cards) */}
        <div className="problem-content-col">
          <div
            className={`problem-card ${activeState === 1 ? 'active' : ''}`}
            onMouseEnter={() => setActiveState(1)}
          >
            <div className="card-indicator">1</div>
            <div className="card-text">
              <h3>The Data Entropy</h3>
              <h4>The Unstructured Data Barrier</h4>
              <p>Blockchains emit raw hex data and HTML. LLMs require structured, semantic context to function. Current agents rely on brittle scrapers that break whenever a UI updates.</p>
            </div>
          </div>

          <div
            className={`problem-card ${activeState === 2 ? 'active' : ''}`}
            onMouseEnter={() => setActiveState(2)}
          >
            <div className="card-indicator">2</div>
            <div className="card-text">
              <h3>The Execution Blindspot</h3>
              <h4>The "Black Box" Execution Risk</h4>
              <p>EIP-7702 gave Agents Execution, but they lack Data. Blind transactions lead to unacceptably high rates of failure.</p>
            </div>
          </div>

          <div
            className={`problem-card ${activeState === 3 ? 'active' : ''}`}
            onMouseEnter={() => setActiveState(3)}
          >
            <div className="card-indicator">3</div>
            <div className="card-text">
              <h3>The Coordination Gap</h3>
              <h4>Missing the "ACP" Layer</h4>
              <p>Current frameworks lack an Agent Coordination Protocol. Without a shared language of truth, agents are siloed—unable to handshake, route, or collaborate.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSlide;
