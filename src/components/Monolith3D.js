import React, { useEffect, useState, useRef } from 'react';
import './Monolith3D.css';

const Monolith3D = () => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.7);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const availableHeight = rect.height;
      const availableWidth = rect.width;

      // Base monolith size (1:4:9 ratio)
      const baseWidth = 90;
      const baseHeight = 360;

      // Detect device type
      const isMobile = window.innerWidth <= 768;
      const isSmallMobile = window.innerWidth <= 480;
      const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

      let targetHeight, targetWidth;

      if (isSmallMobile) {
        targetHeight = Math.min(availableHeight * 0.9, 700);
        targetWidth = Math.min(availableWidth * 0.7, 175);
      } else if (isMobile) {
        targetHeight = Math.min(availableHeight * 0.95, 800);
        targetWidth = Math.min(availableWidth * 0.75, 200);
      } else if (isTablet) {
        targetHeight = Math.min(availableHeight * 0.65, 280);
        targetWidth = Math.min(availableWidth * 0.45, 80);
      } else {
        targetHeight = Math.min(availableHeight * 0.75, 320);
        targetWidth = Math.min(availableWidth * 0.5, 90);
      }

      const scaleByHeight = targetHeight / baseHeight;
      const scaleByWidth = targetWidth / baseWidth;

      const finalScale = Math.min(scaleByHeight, scaleByWidth, 1);

      setScale(finalScale);
    };

    setTimeout(calculateScale, 100);

    const handleResize = () => {
      requestAnimationFrame(calculateScale);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(calculateScale, 200);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', calculateScale);
    };
  }, []);

  return (
    <div className="monolith-pres-container" ref={containerRef}>
      <div className="monolith-section">
        <div
          className="monolith-wrapper"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center'
          }}
        >
          <div className="monolith">
            <div className="monolith-face monolith-front"></div>
            <div className="monolith-face monolith-back"></div>
            <div className="monolith-face monolith-left"></div>
            <div className="monolith-face monolith-right"></div>
            <div className="monolith-face monolith-top"></div>
            <div className="monolith-face monolith-bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monolith3D;
