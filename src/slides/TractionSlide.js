/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import tempImg from '../assets/temp.png';
import { motion } from 'framer-motion';
import './Slide.css';

const chartData = [
  { date: '2025-06-08', add: 897 },
  { date: '2025-06-13', add: 3500, annotation: 'First working prototype', displayDate: 'Jun 13, 2025' },
  { date: '2025-06-17', add: 4200, annotation: 'EVM & Solana integrations', displayDate: 'Jun 17, 2025' },
  { date: '2025-06-22', add: 501 },
  { date: '2025-06-29', add: 206 },
  { date: '2025-07-06', add: 725 },
  { date: '2025-07-13', add: 198 },
  { date: '2025-07-20', add: 3154 },
  { date: '2025-07-27', add: 703 },
  { date: '2025-08-03', add: 744 },
  { date: '2025-08-10', add: 934 },
  { date: '2025-08-17', add: 1079 },
  { date: '2025-08-22', add: 5500, annotation: 'Multi-agent architecture', displayDate: 'Aug 22, 2025' },
  { date: '2025-08-24', add: 827 },
  { date: '2025-08-31', add: 753 },
  { date: '2025-09-02', add: 6003, annotation: 'LangGraph migration', displayDate: 'Sep 2, 2025' },
  { date: '2025-09-09', add: 6500, annotation: 'Intention detector & Planner', displayDate: 'Sep 9, 2025' },
  { date: '2025-09-14', add: 747 },
  { date: '2025-09-21', add: 1221 },
  { date: '2025-09-28', add: 2671 },
  { date: '2025-10-01', add: 4092, annotation: 'Chainlit UI adoption', displayDate: 'Oct 1, 2025' },
  { date: '2025-10-09', add: 5000, annotation: 'SQL-of-Thought mechanism', displayDate: 'Oct 9, 2025' },
  { date: '2025-10-19', add: 1088 },
  { date: '2025-10-26', add: 715 },
  { date: '2025-11-02', add: 40 },
  { date: '2025-11-09', add: 2913 },
  { date: '2025-11-17', add: 7000, annotation: 'Agent reasoning enabled', displayDate: 'Nov 17, 2025' }
];

const TractionSlide = () => {
  // Calculate max value for scaling
  const maxVal = Math.max(...chartData.map(d => d.add));
  const scaleHeight = (val) => (val / maxVal) * 85; // Scale to 85% of container height

  return (
    <div className="slide traction-slide">
      <div className="slide-header">
        <h2 className="slide-title">Relentless Execution</h2>
        <p className="slide-subtitle">Shipping an enterprise-grade data lake in 16 weeks.</p>
      </div>

      <div className="traction-layout">
        {/* Left Column: Narrative */}
        <div className="traction-narrative">
          <div className="narrative-block">
            <h3>Proprietary Indexing</h3>
            <div className="sub-header">Context-Aware Parsing</div>
            <p>
              We don't burn cash on generic RPCs. We built custom parsers for complex instruction sets (e.g., Raydium CPMM), capturing 100% of financial context where others see noise.
            </p>
          </div>

          <div className="narrative-block">
            <h3>Capital Efficiency</h3>
            <div className="sub-header">Vertical Integration</div>
            <p>
              Competitors raised $10M+ and took years to build similar infrastructure.
              We built the core OS in 4 months with just 3 engineers and completely self-funded.
            </p>
            <div className="highlight-box">
              <strong>Why this matters:</strong> We are capital efficient. We don't burn cash; we convert it directly into product.
            </div>
          </div>

          <div className="narrative-block">
            <h3>The Scope</h3>
            <div className="sub-header">While others were hiring, we connected the ecosystem:</div>
            <ul className="scope-list">
              <li>
                <div>
                  <strong>Deep Indexing:</strong> Solana (Instruction level), EVM, Bitcoin.
                </div>
              </li>
              <li>
                <div>
                  <strong>Off-Chain Intelligence:</strong> Twitter, Telegram, News.
                </div>
              </li>
              <li>
                <div>
                  <strong>Market Data:</strong> Binance, Bybit, Polymarket.
                </div>
              </li>
            </ul>
            <div className="highlight-box">
              <strong>Result:</strong> A unified, queryable data lake, live today.
            </div>
          </div>
        </div>

        {/* Right Column: Visual */}
        <img src={tempImg} className='traction-img' alt="" />
        <div className="traction-visual">
          <div className="chart-container-dark">
            <div className="code-frequency-chart">
              {/* Y-Axis */}
              <div className="y-axis">
                <span>8k</span>
                <span>6k</span>
                <span>4k</span>
                <span>2k</span>
                <span>0</span>
              </div>

              {chartData.map((d, i) => {
                const isRightEdge = i > chartData.length - 6; // Check if it's near the right edge
                const isLeftEdge = i < 4; // Check if it's near the left edge
                return (
                  <div key={i} className="chart-bar-group">
                    {/* Green Bar (Up) */}
                    <motion.div
                      className="bar-add"
                      initial={{ height: 0 }}
                      animate={{ height: `${scaleHeight(d.add)}%` }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                    />

                    {/* Annotation */}
                    {d.annotation && (
                      <div
                        className={`chart-annotation ${isRightEdge ? 'align-right' : ''} ${isLeftEdge ? 'align-left' : ''}`}
                        style={{
                          bottom: `${scaleHeight(d.add) + 10}%`,
                          zIndex: 100 - i
                        }}
                      >
                        <div className="annotation-title">{d.annotation}</div>
                        <div className="annotation-date">{d.displayDate}</div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Time Scale */}
              <div className="time-scale">
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
              </div>
            </div>
          </div>
          <div className="chart-caption cursive">
            The "Heartbeat" of Monolit
          </div>
        </div>
      </div>
    </div>
  );
};

export default TractionSlide;
