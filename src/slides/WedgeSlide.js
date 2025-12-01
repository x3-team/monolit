import React, { useState, useEffect, useRef } from 'react';
import './Slide.css';

const WedgeSlide = () => {
    const [step, setStep] = useState(0);
    const [typedText, setTypedText] = useState('');
    const fullText = "Highest funding rates tokens on ByBit";
    const scrollRef = useRef(null);
    const isMounted = useRef(true);
    const timeoutRef = useRef(null);
    const [liveStats, setLiveStats] = useState({ topRate: 0.143, vol: 42 });

    useEffect(() => {
        isMounted.current = true;

        const wait = (ms) => new Promise(resolve => {
            timeoutRef.current = setTimeout(resolve, ms);
        });

        const runSequence = async () => {
            if (!isMounted.current) return;

            // Reset
            setStep(0);
            setTypedText('');

            // Step 1: Typing
            await wait(500);
            if (!isMounted.current) return;
            setStep(1);

            for (let i = 0; i <= fullText.length; i++) {
                if (!isMounted.current) return;
                setTypedText(fullText.slice(0, i));
                await wait(20); // Faster typing
            }

            // Step 2: Submit & Thinking (Reasoning)
            await wait(300);
            if (!isMounted.current) return;
            setStep(2); // Show User Message

            await wait(300);
            if (!isMounted.current) return;
            setStep(3); // Start Reasoning (Intention)

            await wait(400);
            if (!isMounted.current) return;
            setStep(4); // Planning

            await wait(400);
            if (!isMounted.current) return;
            setStep(5); // Tool Execution

            await wait(500);
            if (!isMounted.current) return;
            setStep(6); // Synthesis

            // Step 3: Ready to Generate
            await wait(400);
            if (!isMounted.current) return;
            setStep(7); // Show "Generate Dashboard" button

            // Step 4: Simulate Click
            await wait(800);
            if (!isMounted.current) return;
            setStep(8); // Click animation

            // Step 5: Show Dashboard
            await wait(1000);
            if (!isMounted.current) return;
            setStep(9); // Show Dashboard

            // Loop
            await wait(8000); // Wait before restarting
            if (isMounted.current) {
                runSequence();
            }
        };

        runSequence();

        return () => {
            isMounted.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Auto-scroll removed to prevent "scrolled down" effect
    // The container will now grow with content


    // Live Data Simulation
    useEffect(() => {
        if (step >= 9) {
            const interval = setInterval(() => {
                setLiveStats(prev => ({
                    topRate: 0.143 + (Math.random() * 0.005 - 0.0025),
                    vol: 42 + (Math.random() * 0.5 - 0.25)
                }));
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [step]);

    return (
        <div className="slide wedge-slide">
            <div className="slide-header">
                <h2 className="slide-title">The Wedge: AskMonolit</h2>
                <p className="slide-subtitle">Unlocking the 99% of the market that can't write SQL.</p>
            </div>

            <div className="wedge-container">
                <div className="wedge-narrative">
                    <div className="narrative-section">
                        <h3>The "1% Rule"</h3>
                        <p>
                            Dune Analytics has ~1M monthly visitors, but fewer than 1% ever create a query. Why? Because SQL is a wall. The market is stuck in 'Read-Only' mode.
                        </p>
                    </div>

                    <div className="narrative-section">
                        <h3>Everyone is an Analyst</h3>
                        <p>
                            We remove the syntax barrier. By using Natural Language, we turn every visitor into a creator.
                        </p>
                        <div className="highlight-box">
                            <strong>Opportunity:</strong> We don't just compete with Dune; we expand the market by 100x.
                        </div>
                    </div>

                    <div className="narrative-section">
                        <h3>The Viral Growth Engine</h3>
                        <p>
                            We don't share chat logs. We generate dynamic, professional Dashboards in seconds.
                        </p>
                        <div className="highlight-box">
                            <strong>Mechanism:</strong> Users share these to flex their alpha, turning every user into a creator without needing SQL.
                        </div>
                    </div>
                </div>

                <div className="wedge-demo">
                    <div className="chat-interface-rich large">
                        <div className="chat-header">
                            <div className="header-left">
                                <div className="dot red"></div>
                                <div className="dot yellow"></div>
                                <div className="dot green"></div>
                            </div>
                            <div className="header-center">
                                <span className="header-title">AskMonolit</span>
                            </div>
                            <div className="header-right">
                                <span className="header-date">2025-11-18 21:53</span>
                            </div>
                        </div>

                        <div className="chat-body" ref={scrollRef}>
                            {/* Initial Greeting */}
                            <div className="chat-message ai">
                                <div className="avatar ai-avatar">M</div>
                                <div className="message-content">
                                    <p>I'm your intelligent crypto data analysis companion. Ask me anything!</p>
                                </div>
                            </div>

                            {/* User Message */}
                            {(step >= 1) && (
                                <div className="chat-message user">
                                    <div className="message-content">
                                        <p>{typedText}<span className={`cursor-blink ${step > 1 ? 'hidden' : ''}`}>|</span></p>
                                    </div>
                                    <div className="avatar user-avatar">U</div>
                                </div>
                            )}

                            {/* Agent Reasoning - Compact */}
                            {(step >= 3) && (
                                <div className="agent-reasoning compact">
                                    <div className="reasoning-header">
                                        <span className="reasoning-icon">🧠</span>
                                        <span>Agent Reasoning</span>
                                    </div>
                                    <div className="reasoning-steps-horizontal">
                                        <div className={`r-step ${step >= 3 ? 'active' : ''}`}>
                                            <span className="step-icon">🎯</span> Intention
                                        </div>
                                        <div className="arrow-divider">→</div>
                                        <div className={`r-step ${step >= 4 ? 'active' : ''}`}>
                                            <span className="step-icon">🗺️</span> Plan
                                        </div>
                                        <div className="arrow-divider">→</div>
                                        <div className={`r-step ${step >= 5 ? 'active' : ''}`}>
                                            <span className="step-icon">🛠️</span> Tool
                                        </div>
                                        <div className="arrow-divider">→</div>
                                        <div className={`r-step ${step >= 6 ? 'active' : ''}`}>
                                            <span className="step-icon">✨</span> Synthesis
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* AI Response: Ready to Generate */}
                            {(step >= 7) && (
                                <div className="chat-message ai fade-in">
                                    <div className="avatar ai-avatar">M</div>
                                    <div className="message-content wide">
                                        <p>Top 5 tokens with highest funding rates on ByBit (Linear Perp):</p>

                                        <div className="data-table-container">
                                            <table className="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Rank</th>
                                                        <th>Symbol</th>
                                                        <th>Funding Rate (%)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>10000QUBIC</td>
                                                        <td className="highlight-green">
                                                            <div className="bar-cell">
                                                                <span>0.143%</span>
                                                                <div className="bar-track">
                                                                    <div className="mini-bar" style={{ width: '100%' }}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>2</td>
                                                        <td>4USDT</td>
                                                        <td>
                                                            <div className="bar-cell">
                                                                <span>0.077%</span>
                                                                <div className="bar-track">
                                                                    <div className="mini-bar" style={{ width: '54%' }}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>3</td>
                                                        <td>ARCUSDT</td>
                                                        <td>
                                                            <div className="bar-cell">
                                                                <span>0.043%</span>
                                                                <div className="bar-track">
                                                                    <div className="mini-bar" style={{ width: '30%' }}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="insights-box">
                                            <h4>Key Insights:</h4>
                                            <ul>
                                                <li><strong>Bullish Outlier:</strong> QUBIC (0.14%) indicates extreme long demand.</li>
                                                <li><strong>Trend:</strong> Sharp drop-off after top 2 tokens.</li>
                                            </ul>
                                        </div>

                                        <div className="action-area">
                                            <p className="action-prompt">Ready to visualize this data?</p>
                                            <div className="button-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                                                <button className={`generate-btn ${step >= 8 ? 'clicked' : ''}`}>
                                                    <span className="btn-icon">✨</span> Generate Dashboard
                                                </button>
                                                {/* Cursor Simulation - Inside button wrapper for precise positioning */}
                                                {step === 7 && (
                                                    <div className="cursor-hand">
                                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8.46457 14.1213C8.07404 14.5118 8.07404 15.145 8.46457 15.5355C8.85509 15.926 9.48825 15.926 9.87878 15.5355L15.5356 9.87862C15.9262 9.4881 15.9262 8.85493 15.5356 8.46441C15.1451 8.07388 14.5119 8.07388 14.1214 8.46441L8.46457 14.1213Z" fill="#000000" />
                                                            <path d="M6.34315 17.6569C5.95262 18.0474 5.95262 18.6805 6.34315 19.0711C6.73367 19.4616 7.36683 19.4616 7.75736 19.0711L13.4142 13.4142C13.8047 13.0237 13.8047 12.3905 13.4142 12C13.0237 11.6095 12.3905 11.6095 12 12L6.34315 17.6569Z" fill="#000000" />
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M12.7279 5.63604C12.7279 2.52124 10.2067 0 7.09188 0C3.97709 0 1.45584 2.52124 1.45584 5.63604V12.7279C1.45584 13.5042 0.826569 14.1335 0.0502525 14.1335C-0.726064 14.1335 -1.35534 13.5042 -1.35534 12.7279V5.63604C-1.35534 0.968815 2.42466 -2.81118 7.09188 -2.81118C11.7591 -2.81118 15.5391 0.968815 15.5391 5.63604V12.7279C15.5391 13.5042 14.9098 14.1335 14.1335 14.1335C13.3572 14.1335 12.7279 13.5042 12.7279 12.7279V5.63604Z" fill="#000000" />
                                                            <path d="M21.2132 8.48528L9.89949 19.799" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                                            <path d="M21.2132 8.48528L16.9706 8.48528" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                                            <path d="M21.2132 8.48528L21.2132 12.7279" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Dashboard Overlay - Full Screen */}
                        <div className={`dashboard-overlay ${step >= 9 ? 'visible' : ''}`}>
                            <div className="dashboard-fullscreen glass-panel">
                                <div className="dash-header-full">
                                    <div className="dash-title-group">
                                        <span className="dash-title-large">ByBit Funding Analysis</span>
                                        <span className="dash-badge-live">LIVE</span>
                                    </div>
                                    <div className="dash-actions">
                                        <span className="dash-user">@crypto_whale</span>
                                    </div>
                                </div>

                                <div className="dash-grid">
                                    {/* Key Stats Row */}
                                    <div className="dash-row stats-row">
                                        <div className="stat-card">
                                            <span className="stat-label">Top Rate</span>
                                            <span className="stat-value green">{liveStats.topRate.toFixed(3)}%</span>
                                            <span className="stat-sub">$QUBIC</span>
                                        </div>
                                        <div className="stat-card">
                                            <span className="stat-label">Avg Rate</span>
                                            <span className="stat-value">0.05%</span>
                                            <span className="stat-sub">Market Avg</span>
                                        </div>
                                        <div className="stat-card">
                                            <span className="stat-label">Vol (24h)</span>
                                            <span className="stat-value">${liveStats.vol.toFixed(1)}M</span>
                                            <span className="stat-sub">+12%</span>
                                        </div>
                                    </div>

                                    {/* Main Chart Area */}
                                    <div className="dash-row chart-row">
                                        <div className="chart-card main-chart">
                                            <div className="chart-header">Funding Rate Distribution</div>
                                            <div className="css-bar-chart">
                                                <div className="bar-group">
                                                    <div className="bar-fill" style={{ height: '100%' }}></div>
                                                    <span className="bar-label">QUBIC</span>
                                                </div>
                                                <div className="bar-group">
                                                    <div className="bar-fill" style={{ height: '60%' }}></div>
                                                    <span className="bar-label">4USDT</span>
                                                </div>
                                                <div className="bar-group">
                                                    <div className="bar-fill" style={{ height: '40%' }}></div>
                                                    <span className="bar-label">ARC</span>
                                                </div>
                                                <div className="bar-group">
                                                    <div className="bar-fill" style={{ height: '25%' }}></div>
                                                    <span className="bar-label">TRB</span>
                                                </div>
                                                <div className="bar-group">
                                                    <div className="bar-fill" style={{ height: '15%' }}></div>
                                                    <span className="bar-label">Others</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="chart-card list-card">
                                            <div className="chart-header">Top Movers</div>
                                            <div className="mini-list">
                                                <div className="list-item">
                                                    <span className="item-name">$QUBIC</span>
                                                    <span className="item-val green">+12%</span>
                                                </div>
                                                <div className="list-item">
                                                    <span className="item-name">$SOL</span>
                                                    <span className="item-val green">+4%</span>
                                                </div>
                                                <div className="list-item">
                                                    <span className="item-name">$BTC</span>
                                                    <span className="item-val gray">+1%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="dash-footer">
                                    <button className="remix-btn-large">
                                        <span className="remix-icon">🔀</span> Remix this Dashboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WedgeSlide;
