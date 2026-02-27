import { useState, useEffect } from 'react';

interface UseImageCarouselProps {
  images: string[];
  interval?: number;
}

export function useImageCarousel({ images, interval = 2500 }: UseImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 300);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return { currentIndex, isTransitioning, totalImages: images.length };
}
