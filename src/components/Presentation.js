import React from 'react';
import './Presentation.css';

const Presentation = ({
  slides,
  currentSlide,
  onNext,
  onPrev,
  onGoTo,
  onDeepDive,
  onBackToMain,
  isDeepDive,
  parentSlideTitle
}) => {
  const currentSlideData = slides[currentSlide];
  const SlideComponent = currentSlideData.component;
  const hasDeepDive = currentSlideData.hasDeepDive && !isDeepDive;

  const prevSlideTitle = currentSlide > 0 ? slides[currentSlide - 1].title : null;
  const nextSlideTitle = currentSlide < slides.length - 1 ? slides[currentSlide + 1].title : null;
  const upTitle = isDeepDive ? parentSlideTitle : null;
  const downTitle = hasDeepDive ? 'Deep Dive' : null;

  return (
    <div className="presentation">
      {/* Main Slide Area */}
      <main className="slide-container presentation__container">
        <div className="slide-content">
          <SlideComponent />
        </div>
      </main>

      {/* Navigation Area */}
      <div className="navigation-area">
        {/* Previous Slide Title */}
        {prevSlideTitle && (
          <div className="floating-title prev-slide-title">
            {prevSlideTitle}
          </div>
        )}

        {/* Up Arrow Title */}
        {upTitle && (
          <div className="floating-title up-slide-title">
            {upTitle}
          </div>
        )}

        {/* Main Navigation Bar */}
        <nav className="presentation-nav">
          {/* Up Arrow (Deep Dive Return) - Top of nav bar */}
          {isDeepDive && (
            <button
              className="nav-button nav-vertical"
              onClick={onBackToMain}
              aria-label="Back to main"
              title="Back to overview"
            >
              <span className="arrow">↑</span>
            </button>
          )}

          {/* Horizontal Navigation Row */}
          <div className="nav-horizontal-row">
            <button
              className="nav-button"
              onClick={onPrev}
              disabled={currentSlide === 0}
              aria-label="Previous slide"
            >
              <span className="arrow">←</span>
            </button>

            <div className="slide-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => onGoTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              className="nav-button"
              onClick={onNext}
              disabled={currentSlide === slides.length - 1}
              aria-label="Next slide"
            >
              <span className="arrow">→</span>
            </button>
          </div>

          {/* Down Arrow (Deep Dive Enter) - Bottom of nav bar */}
          {hasDeepDive && (
            <button
              className="nav-button nav-vertical"
              onClick={onDeepDive}
              aria-label="Deep dive"
              title="Explore details"
            >
              <span className="arrow">↓</span>
            </button>
          )}
        </nav>

        {/* Down Arrow Title */}
        {downTitle && (
          <div className="floating-title down-slide-title">
            {downTitle}
          </div>
        )}

        {/* Next Slide Title */}
        {nextSlideTitle && (
          <div className="floating-title next-slide-title">
            {nextSlideTitle}
          </div>
        )}
      </div>

      {/* Slide Counter */}
      <div className="slide-counter">
        {currentSlide + 1} / {slides.length}
        {isDeepDive && <span className="deep-dive-indicator"> • Deep Dive</span>}
      </div>

      {/* Keyboard Shortcuts */}
      <div className="keyboard-hint-container">
        <div className="keyboard-hint">
          Use ← → or Space to navigate{hasDeepDive && ' • ↓ for details'}{isDeepDive && ' • ↑ to go back'}
        </div>
      </div>

      {/* Confidential Notice */}
      <div className="confidential-notice">
        CONFIDENTIAL - FOR INVESTOR USE ONLY
      </div>
    </div>
  );
};

export default Presentation;
