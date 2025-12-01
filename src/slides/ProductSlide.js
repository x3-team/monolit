import React from 'react';
import './Slide.css';

const ProductSlide = () => {
    return (
        <div className="slide product-slide">
            <div className="slide-header">
                <h2 className="slide-title">The Monolit Operating System</h2>
                <p className="slide-subtitle">Read. Write. Reason.</p>
            </div>

            {/* Main Architecture View */}
            <div className="arch-container">

                {/* Column 1: Input */}
                <div className="arch-column col-input">
                    <div className="col-header">
                        <span className="col-icon">🌪️</span>
                        <h3>Raw Entropy</h3>
                    </div>
                    <div className="col-visual visual-chaos">
                        <span>⛓️</span><span>📊</span><span>🐦</span>
                        <span>🏦</span><span>💬</span><span>📉</span>
                    </div>
                    <div className="col-desc">
                        8+ Chains, CEXs, Socials
                    </div>
                </div>

                <div className="arch-flow-arrow">→</div>

                {/* Column 2: Core */}
                <div className="arch-column col-core">
                    <div className="col-header">
                        <span className="col-icon">🧠</span>
                        <h3>Semantic Kernel</h3>
                    </div>
                    <div className="col-visual visual-core">
                        <div className="core-processor">
                            <div className="core-inner"></div>
                        </div>
                    </div>
                    <div className="col-desc">
                        Normalization & Reasoning
                    </div>
                </div>

                <div className="arch-flow-arrow">→</div>

                {/* Column 3: Output */}
                <div className="arch-column col-output">
                    <div className="col-header">
                        <span className="col-icon">🤖</span>
                        <h3>Agent Economy</h3>
                    </div>
                    <div className="col-visual visual-output">
                        <div className="output-card">AskMonolit</div>
                        <div className="output-card">SDK</div>
                    </div>
                    <div className="col-desc">
                        Actionable Intelligence
                    </div>
                </div>
            </div>

            <div className="deep-dive-hint">
                <span>⬇️ Press Down for Deep Dive</span>
            </div>
        </div>
    );
};

export default ProductSlide;
