import React from 'react';
import './Slide.css';

const EcosystemSlide = () => {
    return (
        <div className="slide ecosystem-slide">
            <div className="slide-header">
                <h2 className="slide-title">The Ecosystem: Internet Capital Markets</h2>
                <p className="slide-subtitle">We don't just host agents. We launch them as liquid assets.</p>
            </div>

            <div className="ecosystem-container">
                {/* Left Column: Text Content */}
                <div className="ecosystem-text">
                    <div className="text-block">
                        <h3>The "Cursor for DeFi"</h3>
                        <p>
                            Just as Cursor allowed non-engineers to code apps, our Studio allows non-quants to deploy financial strategies. Everyone can become a Hedge Fund.
                        </p>
                    </div>

                    <div className="text-block">
                        <h3>Initial Agent Offerings (IAO)</h3>
                        <p>
                            We tokenize the workforce. Creators raise capital; Users co-own agent revenue streams via tokens.
                        </p>
                    </div>

                    <div className="text-block">
                        <h3>The Agent Marketplace</h3>
                        <p>
                            Plug into top-performing agents. Subscribe to their signals, copy-trade their strategies, or integrate their intelligence via API.
                        </p>
                    </div>
                </div>

                {/* Right Column: Pro Trading Terminal */}
                <div className="ecosystem-visual">
                    <div className="terminal-container glass-panel">
                        {/* Header */}
                        <div className="terminal-header">
                            <span className="term-title">Monolit Terminal</span>
                            <div className="term-stats">
                                <span className="stat-item">Live Agents: <span className="highlight">14,203</span></span>
                                <span className="stat-item">24h Vol: <span className="highlight green">$42M</span></span>
                            </div>
                        </div>

                        {/* Navigation Bar */}
                        <div className="terminal-nav">
                            <div className="nav-tab">Marketplace</div>
                            <div className="nav-tab">Launchpad <span className="live-dot"></span></div>
                            <div className="nav-tab active">My Positions</div>
                            <div className="nav-tab">Visual Studio</div>
                        </div>

                        <div className="terminal-split-view">
                            {/* Left Panel: Market Data Table */}
                            <div className="terminal-panel market-panel">
                                <table className="terminal-table">
                                    <thead>
                                        <tr>
                                            <th>Agent</th>
                                            <th>Strategy</th>
                                            <th>Risk</th>
                                            <th>7d Yield</th>
                                            <th>M.Cap</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="highlight-row">
                                            <td>
                                                <div className="ticker-cell">
                                                    <span className="symbol">$SNIPE</span>
                                                </div>
                                            </td>
                                            <td>Mempool Arb</td>
                                            <td><span className="risk-badge high">High</span></td>
                                            <td className="green">+412%</td>
                                            <td>$2.1M</td>
                                            <td>
                                                <div className="status-badge running">
                                                    <span className="status-dot"></span>Running
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="ticker-cell">
                                                    <span className="symbol">$YIELD</span>
                                                </div>
                                            </td>
                                            <td>Stable Farmer</td>
                                            <td><span className="risk-badge low">Low</span></td>
                                            <td className="green">+12%</td>
                                            <td>$15M</td>
                                            <td>
                                                <div className="status-badge running">
                                                    <span className="status-dot"></span>Running
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="ticker-cell">
                                                    <span className="symbol">$COPY</span>
                                                </div>
                                            </td>
                                            <td>Whale Mirror</td>
                                            <td><span className="risk-badge med">Med</span></td>
                                            <td className="green">+84%</td>
                                            <td>$800k</td>
                                            <td>
                                                <div className="status-badge paused">
                                                    <span className="status-dot"></span>Paused
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Right Panel: Execution Stream */}
                            <div className="terminal-panel stream-panel">
                                <div className="panel-header">Live Execution Stream</div>
                                <div className="log-stream">
                                    <div className="log-item">
                                        <span className="time">[10:42:01]</span>
                                        <span className="symbol">$SNIPE</span> detected arb opp on Raydium...
                                    </div>
                                    <div className="log-item">
                                        <span className="time">[10:42:02]</span>
                                        Executing swap <span className="tx">(Tx: 0x4a...)</span>
                                    </div>
                                    <div className="log-item success">
                                        <span className="time">[10:42:03]</span>
                                        Profit: +0.4 SOL (Verified)
                                    </div>
                                    <div className="log-item">
                                        <span className="time">[10:42:05]</span>
                                        <span className="symbol">$YIELD</span> rebalancing Aave position...
                                    </div>
                                    <div className="log-item">
                                        <span className="time">[10:42:08]</span>
                                        <span className="symbol">$COPY</span> following wallet 0x8b...
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Status Bar */}
                        <div className="terminal-footer">
                            <div className="footer-item">
                                <span className="icon">≡</span> PRESET 3
                            </div>
                            <div className="footer-item">
                                <span className="icon">Wallet</span> 0x...8a
                            </div>
                            <div className="footer-item success">
                                <span className="status-dot-sm"></span> Connection is stable
                            </div>
                            <div className="footer-spacer"></div>
                            <div className="footer-item">
                                <span className="label">ETH</span> $2,928
                            </div>
                            <div className="footer-item">
                                <span className="label">SOL</span> $136.04
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EcosystemSlide;
