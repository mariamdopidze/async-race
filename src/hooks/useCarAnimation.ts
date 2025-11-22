// src/hooks/useCarAnimation.ts
import { useRef } from 'react';

export const useCarAnimation = () => {
  const animationId = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  const animate = (
    duration: number,
    onUpdate: (progress: number) => void,
    onFinish: () => void
  ) => {
    if (animationId.current !== null) {
      cancelAnimationFrame(animationId.current);
    }

    startTime.current = null;

    const frame = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      onUpdate(progress);

      if (progress < 1) {
        animationId.current = requestAnimationFrame(frame);
      } else {
        onFinish();
        animationId.current = null;
      }
    };

    animationId.current = requestAnimationFrame(frame);
  };

  const stop = () => {
    if (animationId.current !== null) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
      startTime.current = null;
    }
  };

  return { animate, stop };
};