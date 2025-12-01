import React from 'react';
import './Slide.css';

const AskSlide = () => {
  return (
    <div className="slide ask-slide">
      <style>
        {`
                    .ask-slide {
                        display: flex;
                        flex-direction: column;
                        gap: var(--space-4);
                    }

                    .ask-container {
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr;
                        gap: var(--space-4);
                        flex: 1;
                        align-items: stretch;
                        padding: 0;
                        margin-bottom: var(--space-8);
                    }

                    .ask-card {
                        background: var(--color-surface);
                        border: 1px solid var(--color-border);
                        border-radius: 24px;
                        padding: var(--space-6);
                        display: flex;
                        flex-direction: column;
                        gap: var(--space-4);
                        transition: transform 0.2s ease;
                    }

                    .ask-card:hover {
                        transform: translateY(-4px);
                    }

                    .card-title {
                        font-size: var(--text-xs);
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.1em;
                        color: var(--color-text-muted);
                    }

                    .card-header-text {
                        font-size: var(--text-2xl);
                        font-weight: 900;
                        color: var(--color-text);
                        line-height: 1.1;
                    }

                    /* Card 1: The Instrument (Gold) */
                    .card-deal {
                        border: 2px solid #f59e0b;
                        background: linear-gradient(180deg, rgba(245, 158, 11, 0.03) 0%, var(--color-surface) 100%);
                        box-shadow: 0 10px 30px rgba(245, 158, 11, 0.1);
                    }

                    .card-deal .card-title {
                        color: #f59e0b;
                    }

                    .deal-amount {
                        font-size: 4.5rem;
                        font-weight: 900;
                        color: var(--color-text);
                        line-height: 1;
                        letter-spacing: -0.03em;
                    }

                    .deal-sub {
                        font-size: var(--text-lg);
                        font-weight: 600;
                        color: var(--color-text-muted);
                    }

                    .token-warrant-box {
                        margin-top: auto;
                        background: #f59e0b;
                        color: white;
                        padding: var(--space-3);
                        border-radius: 12px;
                        font-weight: 800;
                        text-align: center;
                        font-size: var(--text-base);
                        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                    }

                    /* Card 2: Use of Funds */
                    .funds-list {
                        display: flex;
                        flex-direction: column;
                        gap: var(--space-3);
                        margin-top: var(--space-2);
                    }

                    .funds-item {
                        display: flex;
                        align-items: center;
                        gap: var(--space-3);
                        font-size: var(--text-base);
                        font-weight: 600;
                        color: var(--color-text);
                    }

                    /* .funds-item::before removed to eliminate grey dots */

                    /* Card 3: The Milestones (Green) */
                    .card-outcome {
                        border: 2px solid #10b981;
                        background: linear-gradient(180deg, rgba(16, 185, 129, 0.03) 0%, var(--color-surface) 100%);
                        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.1);
                    }

                    .card-outcome .card-title {
                        color: #10b981;
                    }

                    .milestone-list {
                        display: flex;
                        flex-direction: column;
                        gap: var(--space-4);
                        margin-top: var(--space-2);
                    }

                    .milestone-item {
                        font-size: var(--text-xl);
                        font-weight: 800;
                        color: var(--color-text);
                        display: flex;
                        align-items: center;
                        gap: var(--space-3);
                    }

                    .check-icon {
                        color: #10b981;
                        font-size: var(--text-xl);
                    }
                `}
      </style>

      <div className="slide-header">
        <h2 className="slide-title">The Ask</h2>
        <p className="slide-subtitle">Fueling the next stage of growth.</p>
      </div>

      <div className="ask-container">
        {/* Card 1: The Instrument */}
        <div className="ask-card card-deal">
          <div className="card-title">The Instrument</div>
          <div className="deal-amount">$5M</div>
          <div className="deal-sub">$30M Valuation</div>
          <div className="deal-sub" style={{ fontSize: '16px', marginTop: '8px' }}>SAFE + Token Warrants</div>
        </div>

        {/* Card 2: Use of Funds */}
        <div className="ask-card">
          <div className="card-title">Use of Funds</div>
          <div className="card-header-text">Scaling Execution</div>
          <div className="funds-list">
            <div className="funds-item">60% Engineering
              <br />
              Scaling the Eng team & Indexing Ops</div>
            <div className="funds-item">20% Infrastructure
              <br />
              LLM/Node compute</div>
            <div className="funds-item">20% GTM & DevRel
              <br />
              Hiring the first Head of Growth to engage the Agent builder community</div>
            <div className="funds-item" style={{ marginTop: '12px', color: '#10b981' }}>12+ month runway</div>
          </div>
        </div>

        {/* Card 3: The Milestones */}
        <div className="ask-card card-outcome">
          <div className="card-title">The Milestones</div>
          <div className="card-header-text">Series A Targets</div>
          <div className="milestone-list">
            <div className="milestone-item">
              <span className="check-icon">✓</span> $1M ARR (SaaS + API)
            </div>
            <div className="milestone-item">
              <span className="check-icon">✓</span> 100k Active Users
            </div>
            <div className="milestone-item">
              <span className="check-icon">✓</span> Protocol Decentralization
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskSlide;
