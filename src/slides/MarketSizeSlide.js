import React from 'react';
import './Slide.css';

const MarketSizeSlide = ({ hasDeepDive }) => {
  return (
    <div className="slide market-slide">
      <div className="slide-header">
        <h2 className="slide-title">Capitalizing on the Convergence</h2>
        <p className="slide-subtitle">Preparing the Crypto Stack for the Agent-First Era.</p>
      </div>

      <div className="market-content">
        {/* Left Column: The Numbers */}
        <div className="market-left">
          <div className="market-metric">
            <span className="metric-value text-money">$31B</span>
            <span className="metric-label">Blockchain Data Market</span>
            <span className="metric-sub">CAGR 43%</span>
          </div>

          <div className="metric-divider">+</div>

          <div className="market-metric">
            <span className="metric-value text-money text-money-huge">$50B+</span>
            <span className="metric-label">AI Agent Economy (2030)</span>
          </div>
        </div>

        {/* Right Column: The Drivers */}
        <div className="market-right">
          <div className="market-card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>The Analytics Era</h3>
              <p>Incumbents like Dune ($1B) and Nansen ($750M) validated the market for human-read data. This market is capped by the number of human analysts. It cannot scale to handle high-frequency autonomous agents.</p>
            </div>
          </div>

          <div className="market-card">
            <div className="card-icon">🧠</div>
            <div className="card-content">
              <h3>The AGI Deadline</h3>
              <p>Leaders like Dario Amodei (Anthropic) predict AGI capabilities by 2027. The emerging Agent Economy requires a new infrastructure layer that translates raw blockchain data into executable logic.</p>
            </div>
          </div>

          <div className="market-card highlight-card">
            <div className="card-icon">📈</div>
            <div className="card-content">
              <h3>43% CAGR</h3>
              <p>Data infrastructure lags behind adoption. We are building the bridge between the $31B legacy stack and the $50B agent future.</p>
            </div>
          </div>
        </div>
      </div>

      {hasDeepDive && (
        <div className="slide-tips">
          <p>Press ↓ for Methodology Deep Dive</p>
        </div>
      )}
    </div>
  );
};

export default MarketSizeSlide;
