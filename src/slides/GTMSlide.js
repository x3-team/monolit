import React from 'react';
import { motion } from 'framer-motion';
import './Slide.css';

const GTMSlide = () => {
    return (
        <div className="slide gtm-slide">
            <div className="slide-header">
                <h2 className="slide-title">Go-To-Market Strategy</h2>
                <p className="slide-subtitle">Converting Viral Utility into Platform Lock-In.</p>
            </div>

            <div className="gtm-flywheel-layout">
                {/* Unified Arrow Layer */}
                <svg className="flywheel-arrows" viewBox="0 0 1000 600" fill="none">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.8)" />
                        </marker>
                    </defs>

                    {/* Arrow 1: Top to Right */}
                    <path d="M640,120 Q850,150 850,320" stroke="url(#grad1)" strokeWidth="4" markerEnd="url(#arrowhead)" className="arrow-path" />

                    {/* Arrow 2: Right to Left */}
                    <path d="M750,480 Q500,600 250,480" stroke="url(#grad2)" strokeWidth="4" markerEnd="url(#arrowhead)" className="arrow-path" />

                    {/* Arrow 3: Left to Top */}
                    <path d="M150,320 Q150,120 360,120" stroke="url(#grad3)" strokeWidth="4" markerEnd="url(#arrowhead)" className="arrow-path" />
                </svg>

                {/* Center Badge */}
                <div className="flywheel-center">
                    <div className="center-glow"></div>
                    <span className="center-text">Customer Acquisition Engine</span>
                </div>

                {/* Card 1: Acquisition (Top Center) */}
                <motion.div
                    className="gtm-card flywheel-card card-top"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="card-header">
                        <div className="gtm-badge pink">ACQUISITION (The Wedge)</div>
                        <h3>The 'Share-to-Earn' Loop</h3>
                    </div>
                    <div className="card-body">
                        <ul className="gtm-list">
                            <li>
                                <strong>Instant Dashboards</strong>
                                <p>Users generate and share boards, driving organic traffic for points.</p>
                            </li>
                            <li>
                                <strong>Embedded Signal</strong>
                                <p>Bots integrated into trading Discords/TG as default "alpha" providers.</p>
                            </li>
                        </ul>
                    </div>
                </motion.div>

                {/* Card 2: Retention (Bottom Right) */}
                <motion.div
                    className="gtm-card flywheel-card card-right"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="card-header">
                        <div className="gtm-badge blue">RETENTION (The Standard)</div>
                        <h3>Developer Lock-In</h3>
                    </div>
                    <div className="card-body">
                        <ul className="gtm-list">
                            <li>
                                <strong>The Monolit SDK</strong>
                                <p>Native integration into Agent frameworks (Virtuals, ai16z).</p>
                            </li>
                            <li>
                                <strong>Agent Hackathons</strong>
                                <p>Incentivized builds to populate the Registry.</p>
                            </li>
                        </ul>
                    </div>
                </motion.div>

                {/* Card 3: Defensibility (Bottom Left) */}
                <motion.div
                    className="gtm-card flywheel-card card-left"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="card-header">
                        <div className="gtm-badge green">DEFENSIBILITY (The Moat)</div>
                        <h3>Data Network Effects</h3>
                    </div>
                    <div className="card-body">
                        <ul className="gtm-list">
                            <li>
                                <strong>Schema Bounties</strong>
                                <p>Crowdsourcing maintenance of long-tail protocol parsers.</p>
                            </li>
                            <li>
                                <strong>Data Citation</strong>
                                <p>Agents cite Monolit Query IDs as proof of reasoning.</p>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GTMSlide;
