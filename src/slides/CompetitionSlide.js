import React from 'react';
import { motion } from 'framer-motion';
import './Slide.css';

const CompetitionSlide = () => {
    const competitors = [
        {
            id: 'legacy',
            title: 'Legacy Analytics',
            logos: ['Dune', 'Nansen'],
            user: 'Human Analysts',
            velocity: 'Minutes/Hours',
            scope: 'Fragmented',
            verify: 'Trust the Dashboard',
            interface: 'SQL Required',
            tagline: 'Great for dashboards, useless for automation.'
        },
        {
            id: 'infra',
            title: 'Raw Infrastructure',
            logos: ['SQD', 'The Graph'],
            user: 'Backend Devs',
            velocity: '<1s (Raw)',
            scope: 'On-Chain Only',
            verify: 'Economic / PoA',
            interface: 'GraphQL / Code',
            tagline: 'Pipes without a brain.'
        },
        {
            id: 'search',
            title: 'Social AI',
            logos: ['Kaito', 'Arkham'],
            user: 'Traders',
            velocity: 'Real-time',
            scope: 'Social Heavy',
            verify: 'None',
            interface: 'Search Bar',
            tagline: 'Sentiment is not financial truth.'
        }
    ];

    return (
        <div className="slide competition-slide">
            <div className="slide-header">
                <h2 className="slide-title">The Unfair Advantage</h2>
                <p className="slide-subtitle">The only unified platform for the Agent Era.</p>
            </div>

            <div className="comp-grid">
                {/* Competitor Columns */}
                {competitors.map((comp) => (
                    <motion.div
                        key={comp.id}
                        className="comp-column"
                        whileHover={{ y: -5 }}
                    >
                        <div className="comp-header">
                            <div className="comp-logos">
                                {comp.logos.map(logo => (
                                    <span key={logo} className="comp-logo-pill">{logo}</span>
                                ))}
                            </div>
                            <h3>{comp.title}</h3>
                        </div>
                        <div className="comp-rows">
                            <div className="comp-row">
                                <span className="label">User</span>
                                <span className="value">{comp.user}</span>
                            </div>
                            <div className="comp-row">
                                <span className="label">Velocity</span>
                                <span className="value">{comp.velocity}</span>
                            </div>
                            <div className="comp-row">
                                <span className="label">Scope</span>
                                <span className="value">{comp.scope}</span>
                            </div>
                            <div className="comp-row">
                                <span className="label">Verify</span>
                                <span className="value">{comp.verify}</span>
                            </div>
                            <div className="comp-row">
                                <span className="label">Interface</span>
                                <span className="value">{comp.interface}</span>
                            </div>
                        </div>
                        <div className="comp-tagline">
                            "{comp.tagline}"
                        </div>
                    </motion.div>
                ))}

                {/* Monolit Column */}
                <motion.div
                    className="comp-column monolit-column"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="comp-header">
                        <div className="monolit-logo-large">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            MONOLIT OS
                        </div>
                    </div>
                    <div className="comp-rows">
                        <div className="comp-row highlight">
                            <span className="label">User</span>
                            <span className="value">AI Agents & Traders</span>
                        </div>
                        <div className="comp-row highlight">
                            <span className="label">Velocity</span>
                            <span className="value">(&lt;50ms) Index / Optimistic Logic</span>
                        </div>
                        <div className="comp-row highlight">
                            <span className="label">Scope</span>
                            <span className="value">Unified (Chain + Social)</span>
                        </div>
                        <div className="comp-row highlight">
                            <span className="label">Verify</span>
                            <span className="value">Deterministic SQL</span>
                        </div>
                        <div className="comp-row highlight">
                            <span className="label">Interface</span>
                            <span className="value">Natural Language</span>
                        </div>
                    </div>
                    <div className="comp-tagline monolit-tagline">
                        "The Bloomberg Terminal for Agents."
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CompetitionSlide;
