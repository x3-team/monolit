import React from 'react';
import { motion } from 'framer-motion';
import './Slide.css';

const TerminalThesisSlide = () => {
    return (
        <div className="slide deep-dive-slide thesis-slide">
            <div className="slide-header">
                <div className="deep-dive-badge">METHODOLOGY</div>
                <h2 className="slide-title">The Terminal Thesis</h2>
                <p className="slide-subtitle">Infrastructure creates the Lock-in. Execution captures the Revenue.</p>
            </div>

            <div className="thesis-grid">
                {/* Card 1: The Casino */}
                <motion.div
                    className="thesis-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="thesis-header">
                        <div className="thesis-icon">🎰</div>
                        <h3>THE CASINO</h3>
                        <div className="thesis-sub">(Asset Creation)</div>
                    </div>
                    <div className="thesis-body">
                        <div className="thesis-metric-block">
                            <div className="thesis-metric text-money">$60M+ Revenue</div>
                            <div className="thesis-metric-sub">(Virtuals Annualized)</div>
                        </div>
                        <div className="thesis-insight">
                            High velocity, but high churn. Users leave when 'Toy Agents' fail to deliver financial utility (Alpha Decay).
                        </div>
                        <div className="proof-logos">
                            <div className="logo-pill">Virtuals 🤖</div>
                            <div className="logo-pill">Pump.fun 💊</div>
                            <div className="logo-pill">Launchcoin 🚀</div>
                        </div>
                    </div>
                </motion.div>

                {/* Card 2: The Tool */}
                <motion.div
                    className="thesis-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="thesis-header">
                        <div className="thesis-icon">🛠️</div>
                        <h3>THE TOOL</h3>
                        <div className="thesis-sub">(Execution)</div>
                    </div>
                    <div className="thesis-body">
                        <div className="thesis-metric-block">
                            <div className="thesis-metric text-money">$300M+ Revenue</div>
                            <div className="thesis-metric-sub">(Axiom Annualized)</div>
                        </div>
                        <div className="thesis-insight">
                            High retention. Users pay for speed (1% fee). But these are 'Blind Pipes'—manual execution with zero data intelligence.
                        </div>
                        <div className="proof-logos">
                            <div className="logo-pill">Axiom ⚡</div>
                            <div className="logo-pill">BullX 🐂</div>
                            <div className="logo-pill">Photon 💡</div>
                        </div>
                    </div>
                </motion.div>

                {/* Card 3: The Synthesis */}
                <motion.div
                    className="thesis-card synthesis"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="thesis-header">
                        <div className="thesis-icon">💎</div>
                        <h3>THE SYNTHESIS</h3>
                        <div className="thesis-sub">(Monolit)</div>
                    </div>
                    <div className="thesis-body">
                        <div className="thesis-metric-block">
                            <div className="thesis-metric text-money-huge">SaaS + Volume Tax</div>
                            <div className="thesis-metric-sub">Data Lake + Execution Engine</div>
                        </div>
                        <div className="thesis-insight">
                            The Bloomberg Model. We use Data to verify Agents (Retention), then capture value at Creation (Launchpad) AND Execution (Routing).
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="thesis-footer">
                Axiom captures the flow. Virtuals captures the asset. Monolit captures both.
            </div>
        </div>
    );
};

export default TerminalThesisSlide;
