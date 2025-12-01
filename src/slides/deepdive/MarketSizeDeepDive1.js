import React from 'react';
import '../Slide.css';

const MarketSizeDeepDive1 = () => {
  return (
    <div className="slide deep-dive-slide">
      <div className="slide-header">
        <div className="deep-dive-badge">METHODOLOGY</div>
        <h2 className="slide-title">Validating the $31B Legacy Stack</h2>
        <p className="slide-subtitle">The sum of value trapped in non-AI, human-centric tools.</p>
      </div>

      <div className="deep-dive-content">
        <div className="methodology-grid">

          {/* Segment A */}
          <div className="method-card">
            <div className="method-header">
              <span className="method-val text-money">$3B+</span>
              <span className="method-name">Analytics & Intelligence</span>
            </div>
            <div className="proof-logos">
              <div className="logo-pill">Dune 🦄 $1B</div>
              <div className="logo-pill">Nansen 🔍 $750M</div>
              <div className="logo-pill">Arkham 🦇 $150M</div>
            </div>
            <div className="gap-analysis">
              <span className="gap-label">THE GAP:</span>
              <p>Built for <strong>Humans</strong> (Read-Only). Agents cannot read dashboards.</p>
            </div>
          </div>

          {/* Segment B */}
          <div className="method-card">
            <div className="method-header">
              <span className="method-val text-money">$10B+</span>
              <span className="method-name">Indexing & Querying</span>
            </div>
            <div className="proof-logos">
              <div className="logo-pill">The Graph 🌐 $2B</div>
              <div className="logo-pill">Covalent 🔗</div>
              <div className="logo-pill">SQD 🦑</div>
            </div>
            <div className="gap-analysis">
              <span className="gap-label">THE GAP:</span>
              <p><strong>Raw Pipes.</strong> No semantic intelligence or verification.</p>
            </div>
          </div>

          {/* Segment C */}
          <div className="method-card">
            <div className="method-header">
              <span className="method-val text-money">$15B+</span>
              <span className="method-name">Oracles & Verifiability</span>
            </div>
            <div className="proof-logos">
              <div className="logo-pill">Chainlink 🔗 $10B</div>
              <div className="logo-pill">Pyth 🔮</div>
              <div className="logo-pill">Band 🎺</div>
            </div>
            <div className="gap-analysis">
              <span className="gap-label">THE GAP:</span>
              <p><strong>Slow & Expensive.</strong> Not designed for high-frequency agent actions.</p>
            </div>
          </div>

        </div>

        <div className="deep-dive-footer">
          <div className="conclusion-box">
            <span className="conclusion-icon">💡</span>
            <p><strong>Conclusion:</strong> The $31B market exists, but it is fragmented. Monolit captures value from all three segments by unifying them into a single <strong>Action Layer</strong>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSizeDeepDive1;
