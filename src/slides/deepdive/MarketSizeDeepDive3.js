import React from 'react';
import '../Slide.css';

const MarketSizeDeepDive3 = () => {
  return (
    <div className="slide">
      <div className="slide-header">
        <h2 className="slide-title">Growth Projections</h2>
        <p className="slide-note">5-year market expansion forecast</p>
      </div>

      <div className="traction-stats">
        <div className="stat-card">
          <div className="stat-number">28%</div>
          <div className="stat-label">CAGR</div>
          <div className="stat-period">2024-2029</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">$95B</div>
          <div className="stat-label">Projected Market</div>
          <div className="stat-period">By 2029</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">3.2x</div>
          <div className="stat-label">Growth Multiple</div>
          <div className="stat-period">Next 5 years</div>
        </div>
      </div>

      <div className="market-approach">
        <h3>Key Growth Drivers</h3>
        <p>Digital transformation initiatives, cloud migration, AI adoption, regulatory compliance requirements, and remote work acceleration.</p>
      </div>
    </div>
  );
};

export default MarketSizeDeepDive3;
