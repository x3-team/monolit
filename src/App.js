import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Presentation from './components/Presentation';
import slides from './slides/slides';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDeepDive, setIsDeepDive] = useState(false);
  const [deepDiveSlides, setDeepDiveSlides] = useState([]);
  const [deepDiveCurrentSlide, setDeepDiveCurrentSlide] = useState(0);
  const [parentSlideIndex, setParentSlideIndex] = useState(0);

  const activeSlides = isDeepDive ? deepDiveSlides : slides;
  const activeCurrentSlide = isDeepDive ? deepDiveCurrentSlide : currentSlide;

  const nextSlide = useCallback(() => {
    if (isDeepDive) {
      setDeepDiveCurrentSlide((prev) =>
        prev < deepDiveSlides.length - 1 ? prev + 1 : prev
      );
    } else {
      setCurrentSlide((prev) =>
        prev < slides.length - 1 ? prev + 1 : prev
      );
    }
  }, [isDeepDive, deepDiveSlides.length]);

  const prevSlide = useCallback(() => {
    if (isDeepDive) {
      setDeepDiveCurrentSlide((prev) =>
        prev > 0 ? prev - 1 : prev
      );
    } else {
      setCurrentSlide((prev) =>
        prev > 0 ? prev - 1 : prev
      );
    }
  }, [isDeepDive]);

  const goToSlide = useCallback((index) => {
    if (isDeepDive) {
      if (index >= 0 && index < deepDiveSlides.length) {
        setDeepDiveCurrentSlide(index);
      }
    } else {
      if (index >= 0 && index < slides.length) {
        setCurrentSlide(index);
      }
    }
  }, [isDeepDive, deepDiveSlides.length]);

  const enterDeepDive = useCallback(() => {
    const currentSlideData = slides[currentSlide];
    if (currentSlideData.hasDeepDive && currentSlideData.deepDiveSlides) {
      setParentSlideIndex(currentSlide);
      setDeepDiveSlides(currentSlideData.deepDiveSlides);
      setDeepDiveCurrentSlide(0);
      setIsDeepDive(true);
    }
  }, [currentSlide]);

  const exitDeepDive = useCallback(() => {
    setIsDeepDive(false);
    setDeepDiveCurrentSlide(0);
    setCurrentSlide(parentSlideIndex);
  }, [parentSlideIndex]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isDeepDive && slides[currentSlide].hasDeepDive) {
          enterDeepDive();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (isDeepDive) {
          exitDeepDive();
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSlide(activeSlides.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, enterDeepDive, exitDeepDive, isDeepDive, currentSlide, activeSlides.length]);

  return (
    <div className="app">
      <Presentation
        slides={activeSlides}
        currentSlide={activeCurrentSlide}
        onNext={nextSlide}
        onPrev={prevSlide}
        onGoTo={goToSlide}
        onDeepDive={enterDeepDive}
        onBackToMain={exitDeepDive}
        isDeepDive={isDeepDive}
        parentSlideTitle={isDeepDive ? slides[parentSlideIndex].title : null}
      />
    </div>
  );
}

export default App;
