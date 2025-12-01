import React, { useEffect, useState } from 'react';
import './Slide.css';

const RoadmapSlide = () => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setAnimate(true);
        }, 500);
    }, []);

    const quarters = [
        {
            id: 'q1',
            title: 'Q1 2026',
            subtitle: 'The Foundation (Data)',
            nodeTitle: 'Data & UI',
            items: [
                'AskMonolit V1 Launch',
                'BTC, EVM, Solana + 5 CEXs',
                '10k MAU'
            ]
        },
        {
            id: 'q2',
            title: 'Q2 2026',
            subtitle: 'The Ecosystem (Builders)',
            nodeTitle: 'Agent Tools',
            items: [
                'Agent Visual Studio',
                { text: 'IAO Launchpad Beta', highlight: true },
                'Smart Triggers (Webhooks)'
            ]
        },
        {
            id: 'q3',
            title: 'Q3 2026',
            subtitle: 'The Scale (Revenue)',
            nodeTitle: 'Scale & Raise',
            items: [
                { text: '$1M ARR / 2M Queries', highlight: true },
                'Community Indexer Beta',
                'Series A Round'
            ]
        },
        {
            id: 'q4',
            title: 'Q4 2026',
            subtitle: 'The Network (Liquidity)',
            nodeTitle: 'The Economy',
            items: [
                { text: 'Network Decentralization', gold: true },
                'Protocol Incentivization',
                '$3M ARR / 200k MAU'
            ]
        }
    ];

    return (
        <div className="slide roadmap-slide">
            <style>
                {`
                    .roadmap-container {
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                        justify-content: center;
                        position: relative;
                        padding: 0 40px;
                    }

                    .nodes-container {
                        display: flex;
                        justify-content: space-between;
                        position: relative;
                        z-index: 2;
                        margin: 0 20px;
                        align-items: flex-start;
                    }

                    .timeline-track {
                        position: absolute;
                        top: 116px; /* 80px (top) + 24px (margin) + 12px (half circle) */
                        left: 0;
                        right: 0;
                        height: 4px;
                        background: var(--color-border);
                        transform: translateY(-50%);
                        border-radius: 2px;
                        z-index: 1;
                    }

                    .timeline-fill {
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        background: linear-gradient(90deg, var(--color-accent), #a855f7, #ec4899);
                        width: 0%;
                        border-radius: 2px;
                        transition: width 2.5s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .timeline-fill.animate {
                        width: 100%;
                    }

                    .roadmap-node {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        width: 240px;
                        opacity: 0;
                        transform: translateY(20px);
                        transition: all 0.6s ease-out;
                        position: relative;
                        z-index: 2;
                    }

                    .roadmap-node.visible {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    .node-circle {
                        width: 24px;
                        height: 24px;
                        background: var(--color-surface);
                        border: 3px solid var(--color-border);
                        border-radius: 50%;
                        margin: 24px 0;
                        position: relative;
                        z-index: 2;
                        transition: all 0.4s ease;
                    }

                    .roadmap-node.active .node-circle {
                        background: var(--color-surface);
                        border-color: var(--color-accent);
                        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
                    }

                    .node-top {
                        text-align: center;
                        margin-bottom: 0;
                        height: 80px;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-end;
                    }

                    .quarter-title {
                        font-size: var(--text-xl);
                        font-weight: 800;
                        color: var(--color-text);
                        margin-bottom: 4px;
                    }

                    .quarter-subtitle {
                        font-size: var(--text-xs);
                        color: var(--color-text-muted);
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }

                    .node-bottom {
                        text-align: center;
                        margin-top: 0;
                    }

                    .node-title {
                        font-size: var(--text-lg);
                        font-weight: 700;
                        color: var(--color-text);
                        margin-bottom: 12px;
                    }

                    .node-items {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }

                    .node-item {
                        font-size: var(--text-sm);
                        color: var(--color-text-muted);
                        line-height: 1.4;
                        padding: 6px 10px;
                        border-radius: 6px;
                        background: var(--color-surface);
                        border: 1px solid var(--color-border);
                        font-weight: 500;
                    }

                    .node-item.highlight {
                        color: var(--color-accent);
                        background: rgba(59, 130, 246, 0.05);
                        border-color: rgba(59, 130, 246, 0.2);
                        font-weight: 700;
                    }

                    .node-item.gold {
                        color: #d97706;
                        background: rgba(245, 158, 11, 0.05);
                        border-color: rgba(245, 158, 11, 0.2);
                        font-weight: 700;
                    }

                    @media (max-width: 768px) {
                        .roadmap-container {
                            padding: 0 var(--space-4);
                            justify-content: flex-start;
                            padding-top: var(--space-4);
                        }

                        .nodes-container {
                            flex-direction: column;
                            gap: var(--space-6);
                            margin: 0;
                        }

                        .timeline-track {
                            display: none;
                        }

                        .roadmap-node {
                            width: 100%;
                            transform: none !important;
                            opacity: 1 !important;
                        }

                        .node-circle {
                            display: none;
                        }

                        .node-top {
                            height: auto;
                            margin-bottom: var(--space-2);
                        }

                        .node-bottom {
                            text-align: left;
                            background: var(--color-surface);
                            padding: var(--space-4);
                            border-radius: 12px;
                            border: 1px solid var(--color-border);
                        }

                        .node-items {
                            align-items: flex-start;
                        }
                        
                        .node-item {
                            width: 100%;
                        }
                    }
                `}
            </style>

            <div className="slide-header">
                <h2 className="slide-title">Execution Roadmap</h2>
                <p className="slide-subtitle">From Data Lake to Agent Economy: The path to $3M ARR.</p>
            </div>

            <div className="roadmap-container">
                <div className="nodes-container">
                    <div className="timeline-track">
                        <div className={`timeline-fill ${animate ? 'animate' : ''}`}></div>
                    </div>

                    {quarters.map((q, i) => (
                        <div
                            key={q.id}
                            className={`roadmap-node ${animate ? 'visible' : ''} ${animate ? 'active' : ''}`}
                            style={{ transitionDelay: `${i * 0.4}s` }}
                        >
                            <div className="node-top">
                                <div className="quarter-title">{q.title}</div>
                                <div className="quarter-subtitle">{q.subtitle}</div>
                            </div>

                            <div className="node-circle"></div>

                            <div className="node-bottom">
                                <div className="node-title">{q.nodeTitle}</div>
                                <ul className="node-items">
                                    {q.items.map((item, idx) => {
                                        const isObj = typeof item === 'object';
                                        const text = isObj ? item.text : item;
                                        const className = `node-item ${isObj && item.highlight ? 'highlight' : ''} ${isObj && item.gold ? 'gold' : ''}`;
                                        return (
                                            <li key={idx} className={className}>
                                                {text}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoadmapSlide;
