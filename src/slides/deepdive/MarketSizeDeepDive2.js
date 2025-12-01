import React from 'react';
import '../Slide.css';

const MarketSizeDeepDive2 = () => {
  return (
    <div className="slide deep-dive-slide">
      <div className="slide-header">
        <div className="deep-dive-badge">METHODOLOGY</div>
        <h2 className="slide-title">Validating the $50B Agent Economy</h2>
        <p className="slide-subtitle">Calculating the "Blue Ocean" based on transaction volume, not just software sales.</p>
      </div>

      <div className="deep-dive-content">
        <div className="logic-chain">

          {/* Step 1 */}
          <div className="logic-node">
            <div className="node-number">1</div>
            <div className="node-content">
              <h3>The Precedent</h3>
              <div className="stat-highlight">
                <span className="stat-big">Virtuals</span>
                <span className="stat-val">$1B Cap</span>
              </div>
              <p><strong>Insight:</strong> Virtuals Protocol hit $1B in &lt;3 months. The market is pricing agent protocols at massive infrastructure premiums.</p>
              <div className="proof-tag">Validated by Market</div>
            </div>
          </div>

          <div className="logic-arrow">→</div>

          {/* Step 2 */}
          <div className="logic-node">
            <div className="node-number">2</div>
            <div className="node-content">
              <h3>The Volume Shift</h3>
              <div className="stat-highlight">
                <span className="stat-big">TradFi</span>
                <span className="stat-val">80% Algo</span>
              </div>
              <p><strong>Projection:</strong> Crypto is currently &lt;50% algorithmic. As it reaches parity, <strong>$Trillions</strong> in volume moves to autonomous bots.</p>
              <div className="proof-tag">Validated by History</div>
            </div>
          </div>

          <div className="logic-arrow">→</div>

          {/* Step 3 */}
          <div className="logic-node highlight-node">
            <div className="node-number">3</div>
            <div className="node-content">
              <h3>The Infrastructure Tax</h3>
              <div className="stat-highlight">
                <span className="stat-big">SAM</span>
                <span className="stat-val text-money">$50B+</span>
              </div>
              <p><strong>The Model:</strong> If Agents control $1T in flow, the "Data & Execution Tax" (Monolit) at just 0.05% represents a multi-billion dollar revenue stream.</p>
              <div className="proof-tag">Validated by Math</div>
            </div>
          </div>

        </div>

        <div className="validation-row">
          <div className="validation-card">
            <h4>Band Protocol Pivot</h4>
            <p>Pivoted to "AI Data" to chase a $200B broader AI market. Proves the shift is happening.</p>
          </div>
          <div className="validation-card">
            <h4>ElizaOS Growth</h4>
            <p>90+ Plugins created in months. The builders are already here and needing tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSizeDeepDive2;
