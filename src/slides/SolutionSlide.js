import React, { useState, useEffect } from 'react';
import './Slide.css';
import xLogo from '../assets/x_logo.png';
import btcLogo from '../assets/btc_logo.png';
import solLogo from '../assets/sol_logo.png';
import fantomLogo from '../assets/fantom_logo.png';
import cnnLogo from '../assets/cnn_logo.png';

const SolutionSlide = () => {
    const [stage, setStage] = useState(0);
    const [showOverlay, setShowOverlay] = useState(false);
    // 0: Silos (Manual/Legacy)
    // 1: Universal Ingestion (Full Mesh)
    // 2: Action Engine (Data Flow)
    // 3: Interconnected (P2P)

    useEffect(() => {
        const runSequence = async () => {
            setStage(0);
            setShowOverlay(false);
            await new Promise(r => setTimeout(r, 4000));
            setStage(1);
            await new Promise(r => setTimeout(r, 4000));
            setStage(2);
            await new Promise(r => setTimeout(r, 4000));
            setStage(3);
            await new Promise(r => setTimeout(r, 3000));
            setShowOverlay(true);
            await new Promise(r => setTimeout(r, 3000));
        };

        runSequence();
        const interval = setInterval(runSequence, 18000);
        return () => clearInterval(interval);
    }, []);

    // --- Node Configuration ---
    const dataNodes = [
        { id: 'x', x: 15, y: 15, img: xLogo },
        { id: 'sol', x: 32, y: 15, img: solLogo },
        { id: 'btc', x: 50, y: 15, img: btcLogo },
        { id: 'news', x: 68, y: 15, img: cnnLogo },
        { id: 'tokens', x: 85, y: 15, img: fantomLogo },
    ];

    const agentNodes = [
        { id: 'trade', x: 25, y: 80, label: 'Trader', icon: '📈', color: '#06b6d4', primaryData: ['sol', 'btc', 'tokens'] },
        { id: 'analyst', x: 50, y: 80, label: 'Analyst', icon: '🧠', color: '#8b5cf6', primaryData: ['x', 'news', 'btc'] },
        { id: 'social', x: 75, y: 80, label: 'Social', icon: '💬', color: '#10b981', primaryData: ['x', 'news'] },
    ];

    // --- Connection Logic ---
    const isPrimary = (agent, dataId) => agent.primaryData.includes(dataId);

    return (
        <div className="slide os-slide">
            <div className="slide-header">
                <h2 className="slide-title">Monolit OS</h2>
                <p className="slide-subtitle">Critical Infrastructure for the Agent Economy.</p>
            </div>

            <div className="os-split-layout">

                {/* Left Column: The Stack */}
                <div className="os-stack-col">
                    {/* Layer 3: Hands (ACP) */}
                    <div className={`solution-card row-action ${stage >= 3 ? 'active' : ''}`}>
                        <div className="card-indicator">⚡</div>
                        <div className="card-text">
                            <h3>THE FRAMEWORK</h3>
                            <h4>The Agent Coordination Protocol</h4>
                            <p>The interface for autonomous interaction. We will provide a unified, high-performance API that allows agents to query complex data and execute strategies without managing their own nodes.</p>

                        </div>
                    </div>

                    {/* Layer 2: Brain (Deterministic Action Engine) */}
                    <div className={`solution-card row-compute ${stage >= 2 ? 'active' : ''}`}>
                        <div className="card-indicator">🧠</div>
                        <div className="card-text">
                            <h3>THE ENGINE</h3>
                            <h4>Deterministic SQL Engine</h4>
                            <p>We solve the hallucination problem. We constrain LLMs to generate verifiable SQL against our indexed schema. This ensures outputs are deterministic, auditable, and safe for financial execution.</p>

                        </div>
                    </div>

                    {/* Layer 1: Eyes (Universal Data Lake) */}
                    <div className={`solution-card row-data ${stage >= 1 ? 'active' : ''}`}>
                        <div className="card-indicator">👁️</div>
                        <div className="card-text">
                            <h3>THE INDEXER</h3>
                            <h4>Universal Semantic Index</h4>
                            <p>Generic indexers treat data as text strings. We parse financial events. Our Schema Ingestion Engine detects protocol updates automatically, bridging the gap LLMs can't cross.</p>

                        </div>
                    </div>
                </div>

                {/* Right Column: The Mesh Animation */}
                <div className="agent-core-col">
                    <div className="network-viz-container">
                        <svg viewBox="0 0 100 100" className={`network-svg-mini ${showOverlay ? 'blurred' : ''}`}>

                            {/* --- EDGES --- */}

                            {/* Stage 0: Silos (Single Connection) */}
                            {stage === 0 && (
                                <g className="chaos-edges">
                                    {agentNodes.map((a, i) => {
                                        // Hardcoded single connection for chaos
                                        const d = dataNodes[i * 2 % dataNodes.length];
                                        return (
                                            <path
                                                key={`chaos-${a.id}`}
                                                d={`M ${d.x} ${d.y} Q 50 50 ${a.x} ${a.y}`}
                                                className="edge chaos"
                                            />
                                        );
                                    })}
                                </g>
                            )}

                            {/* Stage 1+: Full Mesh */}
                            {stage >= 1 && !showOverlay && (
                                <g className="mesh-edges">
                                    {agentNodes.map((a, i) =>
                                        dataNodes.map((d, j) => {
                                            const primary = isPrimary(a, d.id);
                                            // Elegant woven curves
                                            const cx = 50 + (j - 2) * 5; // Spread control points horizontally
                                            const cy = 50;
                                            return (
                                                <path
                                                    key={`mesh-${a.id}-${d.id}`}
                                                    d={`M ${d.x} ${d.y} Q ${cx} ${cy} ${a.x} ${a.y}`}
                                                    className={`edge mesh ${primary ? 'primary' : 'secondary'}`}
                                                />
                                            );
                                        })
                                    )}
                                </g>
                            )}

                            {/* Stage 3: P2P Edges */}
                            {stage >= 3 && !showOverlay && (
                                <g className="p2p-edges">
                                    <path d={`M ${agentNodes[0].x} ${agentNodes[0].y} Q 40 60 ${agentNodes[1].x} ${agentNodes[1].y}`} className="edge p2p" />
                                    <path d={`M ${agentNodes[1].x} ${agentNodes[1].y} Q 60 60 ${agentNodes[2].x} ${agentNodes[2].y}`} className="edge p2p" />
                                    <path d={`M ${agentNodes[0].x} ${agentNodes[0].y} Q 50 95 ${agentNodes[2].x} ${agentNodes[2].y}`} className="edge p2p" />
                                </g>
                            )}

                            {/* --- PACKETS --- */}
                            {stage >= 2 && !showOverlay && (
                                <g className="packets">
                                    {agentNodes.map(a =>
                                        dataNodes.filter(d => isPrimary(a, d.id)).map(d => (
                                            <React.Fragment key={`pkt-group-${a.id}-${d.id}`}>
                                                {/* Data to Agent */}
                                                <circle r="1" fill={a.color} className="packet-dot">
                                                    <animateMotion
                                                        dur={`${Math.random() * 0.5 + 0.5}s`}
                                                        repeatCount="indefinite"
                                                        path={`M ${d.x} ${d.y} L ${a.x} ${a.y}`}
                                                    />
                                                </circle>
                                                {/* Agent to Data (Reverse) */}
                                                <circle r="1" fill={a.color} className="packet-dot" opacity="0.7">
                                                    <animateMotion
                                                        dur={`${Math.random() * 0.5 + 0.5}s`}
                                                        repeatCount="indefinite"
                                                        path={`M ${a.x} ${a.y} L ${d.x} ${d.y}`}
                                                    />
                                                </circle>
                                            </React.Fragment>
                                        ))
                                    )}
                                </g>
                            )}

                            {/* --- NODES --- */}
                            {dataNodes.map(node => (
                                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                                    <image
                                        href={node.img}
                                        x="-5"
                                        y="-5"
                                        width="10"
                                        height="10"
                                        className="node-icon"
                                    />
                                </g>
                            ))}

                            {agentNodes.map(node => (
                                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                                    <circle
                                        r="6"
                                        className={`node-bg agent ${stage === 0 ? 'asleep' : 'awake'}`}
                                        style={{ stroke: stage > 0 ? node.color : '#ccc' }}
                                    />
                                    <text y="2" textAnchor="middle" fontSize="4">{node.icon}</text>
                                    <text y="10" textAnchor="middle" fontSize="3" fill="#666" fontWeight="bold">{node.label}</text>
                                </g>
                            ))}

                        </svg>

                        {/* Final Stage Overlay */}
                        <div className={`universe-overlay ${showOverlay ? 'visible' : ''}`}>
                            <h2 className="universe-title">Agent Economy Era</h2>
                        </div>
                    </div>

                    <div className="core-message">
                        {stage === 0 && <p>Agents struggle with manual connectors.</p>}
                        {stage === 1 && <p><strong>Universal Ingestion</strong> connects everything.</p>}
                        {stage === 2 && <p><strong>Action Engine</strong> powers intelligent flows.</p>}
                        {stage === 3 && <p className="highlight-clean">Interconnected Universe</p>}
                    </div>
                </div>

            </div>

            <div className="deep-dive-hint">
            </div>
        </div>
    );
};

export default SolutionSlide;
