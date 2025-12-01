import React from 'react';
import '../Slide.css';
import clickhouseLogo from '../../assets/clickhouse.png';
import qdrantLogo from '../../assets/qdrant.png';
import postgresLogo from '../../assets/postgres.png';
import redisLogo from '../../assets/redis.png';

const IntelligenceSlide = () => {
    // Data Ingestion Engine Slide
    return (
        <div className="slide deep-dive-slide dd-intelligence">
            <div className="slide-header">
                <div className="deep-dive-badge">TECHNICAL STACK</div>
                <h2 className="slide-title">02. Data Ingestion Engine</h2>
                <p className="slide-subtitle">High-Concurrency Swarm & Hybrid Storage Layer</p>
            </div>

            <div className="ingestion-engine-layout">
                {/* Column 1: The Ingestion */}
                <div className="engine-column col-swarm">
                    <div className="column-header">
                        <h3>The Ingestion</h3>
                        <span className="tech-tag">Go-Based</span>
                    </div>

                    <div className="worker-stack">
                        <div className="worker-block">
                            <div className="worker-header">
                                <span className="worker-icon">↯</span>
                                <h4>EVM Indexer</h4>
                            </div>
                            <p className="worker-sub">Block Listeners & DeFi Parsers</p>
                        </div>

                        <div className="worker-block">
                            <div className="worker-header">
                                <span className="worker-icon">⟁</span>
                                <h4>Autonomous Fillers</h4>
                            </div>
                            <p className="worker-sub">Polymarket, Bybit, Dropstab</p>
                        </div>

                        <div className="worker-block">
                            <div className="worker-header">
                                <span className="worker-icon">✉</span>
                                <h4>Social Parsers</h4>
                            </div>
                            <p className="worker-sub">Telegram/Social Ingestion</p>
                        </div>
                    </div>
                </div>

                {/* Connector Column 1-2 */}
                <div className="engine-connector">
                    <div className="pipe-flow"></div>
                </div>

                {/* Column 2: Hybrid Storage */}
                <div className="engine-column col-storage">
                    <div className="column-header">
                        <h3>Hybrid Storage</h3>
                        <span className="tech-tag">Optimised for speed</span>
                    </div>

                    <div className="db-cluster">
                        <div className="db-node clickhouse">
                            <img src={clickhouseLogo} alt="ClickHouse" className="db-img" />
                            <div className="db-info">
                                <h4>ClickHouse</h4>
                                <p>Market Analytics & Time-Series</p>
                            </div>
                        </div>

                        <div className="db-node qdrant">
                            <img src={qdrantLogo} alt="Qdrant" className="db-img" />
                            <div className="db-info">
                                <h4>Qdrant</h4>
                                <p>Vector Embeddings & Semantic Search</p>
                            </div>
                        </div>

                        <div className="db-node postgres">
                            <img src={postgresLogo} alt="PostgreSQL" className="db-img" />
                            <div className="db-info">
                                <h4>PostgreSQL</h4>
                                <p>Relational Metadata</p>
                            </div>
                        </div>

                        <div className="db-node redis">
                            <img src={redisLogo} alt="Redis" className="db-img" />
                            <div className="db-info">
                                <h4>Redis</h4>
                                <p>Real-time Hot Cache</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Connector Column 2-3 */}
                <div className="engine-connector">
                    <div className="pipe-flow"></div>
                </div>

                {/* Column 3: Orchestration */}
                <div className="engine-column col-orchestration">
                    <div className="column-header">
                        <h3>Orchestration</h3>
                        <span className="tech-tag">API Gateway</span>
                    </div>

                    <div className="worker-stack">
                        <div className="worker-block">
                            <div className="worker-header">
                                <span className="worker-icon">⟳</span>
                                <h4>Token Resolver Logic</h4>
                            </div>
                        </div>

                        <div className="worker-block">
                            <div className="worker-header">
                                <span className="worker-icon">⌁</span>
                                <h4>WebSocket Manager</h4>
                            </div>
                        </div>

                        <div className="worker-block">
                            <div className="worker-header">
                                <span className="worker-icon">☗</span>
                                <h4>Auth Service</h4>
                            </div>
                        </div>

                        <div className="output-arrow">
                            <span className="arrow-symbol">→</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="slide-footer-tech">
                <p>A multi-service architecture containerized via Docker. Optimized for sub-second retrieval across on-chain and vector data sources.</p>
            </div>
        </div>
    );
};

export default IntelligenceSlide;
