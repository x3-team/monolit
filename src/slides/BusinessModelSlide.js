import React from 'react';
import { motion } from 'framer-motion';
import './Slide.css';

const BusinessModelSlide = () => {
    return (
        <div className="slide business-model-slide">
            <div className="slide-header">
                <h2 className="slide-title">The Revenue Engine</h2>
                <p className="slide-subtitle">Scaling from SaaS ARR to Protocol Volume Fees.</p>
            </div>

            <div className="revenue-engine-container">
                {/* Card 1: The Wedge */}
                <motion.div
                    className="engine-card wedge-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="card-header">
                        <div className="engine-badge blue">THE WEDGE (Day 1)</div>
                        <h3>Direct Data Monetization</h3>
                        <div className="focus-text">Metric: High-Margin ARR</div>
                    </div>
                    <div className="card-body">
                        <ul className="revenue-list">
                            <li>
                                <div className="icon-wrapper blue-icon">
                                    {/* User Icon */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </div>
                                <div>
                                    <strong>AskMonolit Pro ($249/mo)</strong>
                                    <p>Institutional-grade subscription for natural-language analytics and dashboard creation.</p>
                                </div>
                            </li>
                            <li>
                                <div className="icon-wrapper blue-icon">
                                    {/* Lightning Icon */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                                </div>
                                <div>
                                    <strong>API Compute Credits</strong>
                                    <p>Usage-based pricing (pay-per-query) for developers consuming our semantic index.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </motion.div>

                {/* Arrow 1 */}
                <div className="engine-arrow">→</div>

                {/* Card 2: The Scale */}
                <motion.div
                    className="engine-card scale-card"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="card-header">
                        <div className="engine-badge gold">THE SCALE (Q2 2026)</div>
                        <h3>Platform Services</h3>
                        <div className="focus-text">Metric: Developer Retention</div>
                    </div>
                    <div className="card-body">
                        <ul className="revenue-list">
                            <li>
                                <div className="icon-wrapper gold-icon">
                                    {/* Bell Icon */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                </div>
                                <div>
                                    <strong>Smart Trigger Streams</strong>
                                    <p>Recurring fees for real-time webhooks. Agents subscribe to on-chain triggers to execute logic.</p>
                                </div>
                            </li>
                            <li>
                                <div className="icon-wrapper gold-icon">
                                    {/* Server/Database Icon */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>
                                </div>
                                <div>
                                    <strong>Priority Indexing</strong>
                                    <p>B2B fees for protocols to fast-track schema ingestion and guarantee sub-50ms latency.</p>
                                </div>
                            </li>
                            <li>
                                <div className="icon-wrapper gold-icon">
                                    {/* Integration/Plug Icon */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                                </div>
                                <div>
                                    <strong>AskMonolit Integrations</strong>
                                    <p>Enterprise API licensing for exchanges and DeFi protocols to embed natural language analytics.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </motion.div>

                {/* Arrow 2 */}
                <div className="engine-arrow">→</div>

                {/* Card 3: The Network */}
                <motion.div
                    className="engine-card network-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="card-header">
                        <div className="engine-badge purple">THE NETWORK (Q3 2026)</div>
                        <h3>Protocol Economics</h3>
                        <div className="focus-text">Metric: Volume Take-Rate</div>
                    </div>
                    <div className="card-body">
                        <ul className="revenue-list">
                            <li>
                                <div className="icon-wrapper purple-icon">
                                    {/* Rocket Icon */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
                                </div>
                                <div>
                                    <strong>Agent Deployment Fees</strong>
                                    <p>Percentage of capital raised via the Monolit Launchpad (Initial Agent Offerings).</p>
                                </div>
                            </li>
                            <li>
                                <div className="icon-wrapper purple-icon">
                                    {/* Routing/Flow Icon */}
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                                </div>
                                <div>
                                    <strong>Routing & Execution</strong>
                                    <p>Take-rate on transaction volume routed through the Monolit Intent Engine.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BusinessModelSlide;
