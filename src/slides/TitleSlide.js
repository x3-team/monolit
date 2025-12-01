import React from 'react';
import './Slide.css';
import Monolith3D from '../components/Monolith3D';

const TitleSlide = () => {
  return (
    <div className="slide  slide__container-title slide-title">
      <style>
        {`
          .slide-title {
            gap: var(--space-5) !important;
          }

          .title-hook {
            font-size: var(--text-3xl);
            font-weight: 900;
            color: var(--color-text);
            margin-top: 0;
            letter-spacing: -0.01em;
            line-height: 1.1;
            text-transform: uppercase;
          }

          .title-problem {
            font-family: var(--font-mono);
            font-size: var(--text-base);
            font-weight: 500;
            color: var(--color-text-muted);
            margin-top: 0;
            max-width: 900px;
            line-height: 1.5;
            letter-spacing: -0.01em;
            opacity: 0.8;
          }
          .slide__title-container{
            display: flex;
            align-items:center;
            flex-direction: column;
          }
          .slide-title .slide-logo {
            margin-bottom: 0;
          }
          .slide__container-title{
            display: flex;
            
             @media (max-width: 768px) {
              justify-content: space-between!important;
             }
           

            min-height: 100% !important;

          }
          @media (max-width: 768px) {
            .title-hook {
              font-size: var(--text-xl);
            }
            .title-problem {
              white-space: normal;
              text-align: center;
              font-size: var(--text-sm);
            }
            .slide-logo {
              font-size: var(--text-4xl);
            }
          }
        `}
      </style>
      <div className="title-monolith">
        <Monolith3D />
      </div>
      <div className='slide__title-container'>
        <h1 className="slide-title-main slide-logo">
          <span className="logo-mono">MONO</span>
          <span className="logo-lit">LIT</span>
          <span className="logo-dot">.</span>
        </h1>

        <h2 className="title-hook">The Operating System for the Agent Economy.</h2>
        <p className="title-problem">We turn raw crypto history into deterministic, actionable Data for Humans and Machines.</p>

        <div className="slide-meta">
          <p>Seed Round Pitch</p>
          <p>November 2025</p>
          </div>
        </div>
    </div>
  );
};

export default TitleSlide;
