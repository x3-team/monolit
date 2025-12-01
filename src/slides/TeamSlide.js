import React from 'react';
import './Slide.css';
import pavelImg from '../assets/team_pavel.png';
import sergeyImg from '../assets/team_sergey.jpg';
import georgyImg from '../assets/team_georgy.jpg';
import yaroslavImg from '../assets/team_yaroslav.png';
import makarImg from '../assets/team_makar.jpg';

const TeamSlide = () => {
  return (
    <div className="slide team-slide">
      <style>
        {`
                    .team-slide {
                        display: flex;
                        flex-direction: column;
                        gap: var(--space-6);
                        padding: var(--space-8) var(--space-4) var(--space-4) var(--space-4) !important;
                    }

                    .team-container {
                        display: flex;
                        flex-direction: column;
                        gap: var(--space-2);
                        flex: 1;
                        justify-content: center;
                        padding: 0 var(--space-8);
                    }

                    .founders-row {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: var(--space-4);
                        justify-content: center;
                        max-width: 900px;
                        margin: 0 auto;
                        width: 100%;
                    }

                    .core-row {
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr;
                        gap: var(--space-4);
                        justify-content: center;
                        max-width: 1000px;
                        margin: 0 auto;
                        width: 100%;
                    }

                    .team-card {
                        background: var(--color-surface);
                        border: 1px solid var(--color-border);
                        border-radius: 16px;
                        padding: var(--space-5);
                        display: flex;
                        flex-direction: column;
                        gap: var(--space-3);
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                        height: 100%;
                    }

                    .team-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                        border-color: var(--color-accent);
                    }

                    .card-header {
                        display: flex;
                        align-items: center;
                        gap: var(--space-4);
                        margin-bottom: var(--space-2);
                    }

                    .avatar {
                        width: 60px;
                        height: 60px;
                        font-size: 32px;
                        background: var(--color-bg);
                        border: 1px solid var(--color-border);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }

                    .avatar img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .info {
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                    }

                    .name {
                        font-size: var(--text-xl);
                        font-weight: 800;
                        color: var(--color-text);
                    }

                    .role {
                        font-size: var(--text-sm);
                        font-weight: 600;
                        color: var(--color-accent);
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }

                    .bio-section {
                        display: flex;
                        flex-direction: column;
                        gap: var(--space-2);
                    }

                    .bio-text {
                        font-size: var(--text-sm);
                        color: var(--color-text-muted);
                        line-height: 1.5;
                    }

                    .socials {
                        display: flex;
                        gap: var(--space-3);
                        margin-top: auto;
                    }

                    .social-link {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        font-size: 12px;
                        font-weight: 600;
                        color: var(--color-text-muted);
                        text-decoration: none;
                        padding: 6px 12px;
                        background: rgba(0,0,0,0.03);
                        border: 1px solid transparent;
                        border-radius: 20px;
                        transition: all 0.2s ease;
                        line-height: 1;
                        cursor: pointer;
                        font-family: inherit;
                    }

                    .social-link:hover {
                        background: var(--color-surface);
                        color: var(--color-text);
                        border-color: var(--color-border);
                        transform: translateY(-1px);
                        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    }

                    .core-card {
                        padding: var(--space-5);
                    }

                    .core-card .avatar {
                        width: 48px;
                        height: 48px;
                        font-size: 24px;
                    }

                    .core-card .name {
                        font-size: var(--text-lg);
                    }

                    .footer-quote {
                        text-align: center;
                        font-size: var(--text-lg);
                        color: var(--color-text);
                        font-weight: 500;
                        font-style: italic;
                        margin-top: var(--space-4);
                        padding-bottom: var(--space-2);
                        opacity: 0.8;
                    }

                    @media (max-width: 768px) {
                        .team-slide {
                            padding: var(--space-4) !important;
                        }
                        .team-container {
                            padding: 0;
                        }
                        .founders-row, .core-row {
                            grid-template-columns: 1fr;
                        }
                    }
                `}
      </style>

      <div className="slide-header">
        <h2 className="slide-title">The Team</h2>
        <p className="slide-subtitle">Crypto natives building the infrastructure we needed.</p>
      </div>

      <div className="team-container">
        {/* Row 1: Founders */}
        <div className="founders-row">
          <div className="team-card">
            <div className="card-header">
              <div className="avatar">
                <img src={pavelImg} alt="Pavel" />
              </div>
              <div className="info">
                <div className="name">Pavel</div>
                <div className="role">Co-Founder • Strategy & Ecosystem</div>
              </div>
            </div>
            <div className="bio-section">
              <div className="bio-text">
                <strong>Founder:</strong> Odyss3y Accelerator, incubated 15+ DeFi projects.
              </div>
              <div className="bio-text">
                <strong>Operator:</strong> Scaled proprietary algo-trading desk to $3M monthly volume on Solana.
              </div>
              <div className="bio-text">
                <strong>Education:</strong> PhD Candidate in CS. Physics Olympiad winner.
              </div>
            </div>
            <div className="socials">
              <a href="https://x.com/dcanerate" target="_blank" rel="noopener noreferrer" className="social-link">𝕏 Twitter</a>
              <a href="https://linkedin.com/in/litovchenkop/" target="_blank" rel="noopener noreferrer" className="social-link">💼 LinkedIn</a>
            </div>
          </div>

          <div className="team-card">
            <div className="card-header">
              <div className="avatar">
                <img src={sergeyImg} alt="Sergey" />
              </div>
              <div className="info">
                <div className="name">Sergey</div>
                <div className="role">Co-Founder • Architecture & DeFi</div>
              </div>
            </div>
            <div className="bio-section">
              <div className="bio-text">
                <strong>Architect:</strong> Built historical data engine ingesting 200TB+ of Solana transaction history.
              </div>
              <div className="bio-text">
                <strong>DeFi:</strong> Top-2 Rank in LayerZero Sybil Detection program.
              </div>
              <div className="bio-text">
                <strong>Education:</strong> National Economics Olympiad gold medalist.
              </div>
              <div className="bio-text">
                <strong>Research:</strong> Author of 10k+ sub crypto-research channel.
              </div>
            </div>
            <div className="socials">
              <a href="https://t.me/allchaindao" target="_blank" rel="noopener noreferrer" className="social-link">✈️ Telegram</a>
            </div>
          </div>
        </div>

        {/* Row 2: Core */}
        <div className="core-row">
          <div className="team-card core-card">
            <div className="card-header">
              <div className="avatar">
                <img src={georgyImg} alt="Georgy" />
              </div>
              <div className="info">
                <div className="name">Georgy</div>
                <div className="role">Head of AI</div>
              </div>
            </div>
            <div className="bio-text">
              Ex-FinTech ML Lead. Specialized in transformer models for financial time-series. CS Olympiad winner.
            </div>
          </div>

          <div className="team-card core-card">
            <div className="card-header">
              <div className="avatar">
                <img src={makarImg} alt="Makar" />
              </div>
              <div className="info">
                <div className="name">Makar</div>
                <div className="role">Backend Lead</div>
              </div>
            </div>
            <div className="bio-text">
              Data Infrastructure & APIs.
            </div>
          </div>

          <div className="team-card core-card">
            <div className="card-header">
              <div className="avatar">
                <img src={yaroslavImg} alt="Yaroslav" />
              </div>
              <div className="info">
                <div className="name">Yaroslav</div>
                <div className="role">DevOps</div>
              </div>
            </div>
            <div className="bio-text">
              Cloud Security & Scalability.
            </div>
          </div>
        </div>

        <div className="footer-quote">
          "We built Monolit because we lived the pain of fragmented data while trading millions in volume."
        </div>
      </div>
    </div>
  );
};

export default TeamSlide;
