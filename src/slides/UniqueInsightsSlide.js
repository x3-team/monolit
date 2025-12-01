import React from 'react';
import './Slide.css';

const UniqueInsightsSlide = () => {
  return (
    <div className="slide">
      <div className="slide-header">
        <h2 className="slide-title">Unique Insights</h2>
        <p className="slide-note">Non-obvious things you've learned</p>
      </div>

      <div className="insights-list">
        <div className="insight-card">
          <div className="insight-number">1</div>
          <div className="insight-content">
            <h3>Insight Title</h3>
            <p>Non-obvious learning about the problem, customer, or solution. Use specific numbers and facts.</p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-number">2</div>
          <div className="insight-content">
            <h3>Insight Title</h3>
            <p>Non-obvious learning about the problem, customer, or solution. Use specific numbers and facts.</p>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-number">3</div>
          <div className="insight-content">
            <h3>Insight Title</h3>
            <p>Non-obvious learning about the problem, customer, or solution. Use specific numbers and facts.</p>
          </div>
        </div>
      </div>

      <div className="slide-tips">
        <p>Avoid generic statements - be specific</p>
        <p>Support with data and concrete examples</p>
      </div>
    </div>
  );
};

export default UniqueInsightsSlide;
