import React, { useRef, useState, useEffect } from 'react';
import '../Slide.css';

const IngestionSlide = () => {
    const containerRef = useRef(null);
    const validationRef = useRef(null);
    const dataSufficientRef = useRef(null);
    const strategicPlanRef = useRef(null);
    const planFailingRef = useRef(null);
    const tacticalReasoningRef = useRef(null);

    const [arrows, setArrows] = useState({
        valStart: { x: 0, y: 0 },
        valEnd: { x: 0, y: 0 },
        dsStart: { x: 0, y: 0 },
        dsEnd: { x: 0, y: 0 },
        pfTarget: { x: 0, y: 0 },
        pfTop: { x: 0, y: 0 },
        pfRight: { x: 0, y: 0 },
        spBottom: { x: 0, y: 0 },
        trLeft: { x: 0, y: 0 },
        stepMidX: 0,
        commonBottomY: 0
    });

    const updateArrows = () => {
        if (!containerRef.current || !validationRef.current || !dataSufficientRef.current || !planFailingRef.current || !strategicPlanRef.current || !tacticalReasoningRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const valRect = validationRef.current.getBoundingClientRect();
        const dsRect = dataSufficientRef.current.getBoundingClientRect();
        const pfRect = planFailingRef.current.getBoundingClientRect();
        const spRect = strategicPlanRef.current.getBoundingClientRect();
        const trRect = tacticalReasoningRef.current.getBoundingClientRect();

        // Helper to get relative coordinates
        const getRel = (rect, xPercent, yPercent) => ({
            x: (rect.left - containerRect.left) + (rect.width * xPercent),
            y: (rect.top - containerRect.top) + (rect.height * yPercent)
        });

        // Validation Arrow Start (Bottom Center)
        const valStart = getRel(valRect, 0.5, 1.0);

        // Data Sufficient Arrow Start (Right Center)
        const dsStart = getRel(dsRect, 1.0, 0.5);

        // Plan Failing Target (Bottom Center)
        const pfTarget = getRel(pfRect, 0.5, 1.0);

        // Plan Failing Top (Top Center)
        const pfTop = getRel(pfRect, 0.5, 0);

        // Plan Failing Right (Right Center)
        const pfRight = getRel(pfRect, 1.0, 0.5);

        // Strategic Plan Bottom (Bottom Center)
        const spBottom = getRel(spRect, 0.5, 1.0);

        // Tactical Reasoning Left (Left Center)
        const trLeft = getRel(trRect, 0, 0.5);

        // Midpoint X for the step connector
        const stepMidX = (pfRight.x + trLeft.x) / 2;

        // Calculate a common bottom path line
        const lowestY = Math.max(valRect.bottom, dsRect.bottom, pfRect.bottom) - containerRect.top;
        const commonBottomY = lowestY + 40;

        // Calculate right edge for Data Sufficient arrow (outside Synthesis box)
        const rightEdgeX = containerRect.width - 40;

        setArrows({
            valStart,
            dsStart,
            pfTarget,
            pfTop,
            pfRight,
            spBottom,
            trLeft,
            stepMidX,
            commonBottomY,
            rightEdgeX
        });
    };

    useEffect(() => {
        updateArrows();
        window.addEventListener('resize', updateArrows);
        const timer = setTimeout(updateArrows, 100);
        return () => {
            window.removeEventListener('resize', updateArrows);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="slide deep-dive-slide dd-ingestion">
            <div className="slide-header">
                <div className="deep-dive-badge">TECHNICAL STACK</div>
                <h2 className="slide-title">01. The Orchestrator</h2>
                <p className="slide-subtitle">We employ a Synthesis Gate to prevent hallucinations.</p>
            </div>

            <div className="knowledge-graph-container horizontal" ref={containerRef}>
                {/* Column 1: Planning */}
                <div className="flow-column col-planning">
                    <div className="column-header">Planning</div>
                    <div className="flow-node start">User Query</div>
                    <div className="flow-arrow">↓</div>
                    <div className="flow-node stage">Stage 1: Mission Briefing</div>
                    <div className="flow-arrow">↓</div>
                    <div className="flow-node stage">Stage 2: Deconstruct Request</div>
                    <div className="flow-arrow">↓</div>
                    <div className="flow-node stage" id="strategic-plan" ref={strategicPlanRef}>Stage 3: Strategic Plan</div>

                    {/* Plan Failing Diamond - centered below Planning column */}
                    <div className="plan-failing-wrapper">
                        {/* CSS line removed, replaced by SVG */}
                        <div className="decision-diamond plan-failing" ref={planFailingRef}>
                            <div className="diamond-content">Plan<br />Failing?</div>
                        </div>
                    </div>
                </div>

                <div className="flow-connector-horizontal">→</div>

                {/* Column 2: Execution */}
                <div className="flow-column col-execution">
                    <div className="column-header">Execution Engine</div>
                    <div className="core-loop-box">
                        <div className="loop-label">Core Loop</div>
                        <div className="flow-node stage-dark">Stage 4: Execution</div>
                        <div className="flow-arrow">↓</div>
                        <div className="flow-node action" ref={tacticalReasoningRef}>Tactical Reasoning</div>
                        <div className="flow-arrow">↓</div>
                        <div className="flow-node action">Agent Execution</div>
                        <div className="flow-arrow">↓</div>
                        <div className="flow-node action">Tool Execution</div>
                        <div className="flow-arrow">↓</div>
                        <div className="flow-node action validation-node" ref={validationRef}>Validation</div>
                    </div>
                </div>

                <div className="flow-connector-horizontal">→</div>

                {/* Column 3: Synthesis */}
                <div className="flow-column col-synthesis">
                    <div className="column-header">Synthesis</div>
                    <div className="decision-diamond data-sufficient" ref={dataSufficientRef}>
                        <div className="diamond-content">Data Sufficient?</div>
                    </div>
                    <div className="flow-arrow">↓</div>
                    <div className="flow-node stage">Stage 5: Synthesize Report</div>
                    <div className="flow-arrow">↓</div>
                    <div className="flow-node stage">Stage 6: Final Answer</div>
                </div>

                {/* SVG Connector Lines */}
                <svg
                    className="connector-svg"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 10
                    }}
                >
                    <defs>
                        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#b91c1c" />
                        </linearGradient>
                        <filter id="redGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#b91c1c" />
                        </marker>
                    </defs>

                    {/* Data Sufficient Arrow Path - Smooth Curve */}
                    <path
                        d={`
                            M ${arrows.dsStart.x} ${arrows.dsStart.y}
                            C ${arrows.rightEdgeX - 20} ${arrows.dsStart.y},
                              ${arrows.rightEdgeX} ${arrows.dsStart.y},
                              ${arrows.rightEdgeX} ${arrows.dsStart.y + 20}
                            L ${arrows.rightEdgeX} ${arrows.commonBottomY - 10}
                            C ${arrows.rightEdgeX} ${arrows.commonBottomY + 10},
                              ${arrows.rightEdgeX - 20} ${arrows.commonBottomY + 10},
                              ${arrows.rightEdgeX - 40} ${arrows.commonBottomY + 10}
                            L ${arrows.pfTarget.x + 20} ${arrows.commonBottomY + 10}
                            C ${arrows.pfTarget.x} ${arrows.commonBottomY + 10},
                              ${arrows.pfTarget.x} ${arrows.commonBottomY - 10},
                              ${arrows.pfTarget.x} ${arrows.pfTarget.y + 15}
                        `}
                        fill="none"
                        stroke="url(#redGradient)"
                        strokeWidth="1.5"
                        filter="url(#redGlow)"
                        strokeLinecap="round"
                        markerEnd="url(#arrowhead-red)"
                        opacity="0.8"
                    />
                    {/* Label: No (Data Sufficient) - Moved near start */}
                    <rect
                        x={arrows.dsStart.x + 15}
                        y={arrows.dsStart.y - 15}
                        width="20"
                        height="14"
                        fill="#0f172a"
                        opacity="0.8"
                    />
                    <text
                        x={arrows.dsStart.x + 25}
                        y={arrows.dsStart.y - 5}
                        fill="#ef4444"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                    >
                        NO
                    </text>

                    {/* Plan Failing -> Strategic Plan Arrow (Upward) - YES */}
                    <path
                        d={`
                            M ${arrows.pfTop.x} ${arrows.pfTop.y}
                            L ${arrows.spBottom.x} ${arrows.spBottom.y + 5}
                        `}
                        fill="none"
                        stroke="url(#redGradient)"
                        strokeWidth="1.5"
                        filter="url(#redGlow)"
                        strokeLinecap="round"
                        markerEnd="url(#arrowhead-red)"
                    />
                    {/* Label: YES - Centered */}
                    <rect
                        x={arrows.pfTop.x - 10}
                        y={(arrows.pfTop.y + arrows.spBottom.y) / 2 - 7}
                        width="20"
                        height="14"
                        fill="#0f172a" // Match bg color
                        opacity="0.8"
                    />
                    <text
                        x={arrows.pfTop.x}
                        y={(arrows.pfTop.y + arrows.spBottom.y) / 2 + 4}
                        fill="#ef4444"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                    >
                        YES
                    </text>

                    {/* Plan Failing -> Tactical Reasoning Arrow - NO - Rounded Step Connector */}
                    <path
                        d={`
                            M ${arrows.pfRight.x} ${arrows.pfRight.y}
                            L ${arrows.stepMidX - 20} ${arrows.pfRight.y}
                            Q ${arrows.stepMidX} ${arrows.pfRight.y} ${arrows.stepMidX} ${arrows.pfRight.y - 20}
                            L ${arrows.stepMidX} ${arrows.trLeft.y + 20}
                            Q ${arrows.stepMidX} ${arrows.trLeft.y} ${arrows.stepMidX + 20} ${arrows.trLeft.y}
                            L ${arrows.trLeft.x - 5} ${arrows.trLeft.y}
                        `}
                        fill="none"
                        stroke="url(#redGradient)"
                        strokeWidth="1.5"
                        filter="url(#redGlow)"
                        strokeLinecap="round"
                        markerEnd="url(#arrowhead-red)"
                    />
                    {/* Label: NO - On vertical segment */}
                    <rect
                        x={arrows.stepMidX - 10}
                        y={(arrows.pfRight.y + arrows.trLeft.y) / 2 - 7}
                        width="20"
                        height="14"
                        fill="#0f172a"
                        opacity="0.8"
                    />
                    <text
                        x={arrows.stepMidX}
                        y={(arrows.pfRight.y + arrows.trLeft.y) / 2 + 4}
                        fill="#ef4444"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                    >
                        NO
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default IngestionSlide;
