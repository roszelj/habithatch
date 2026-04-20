import { useEffect, useRef } from 'react';

export function useGameLoop(callback: (delta: number) => void) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    let lastTime: number | null = null;
    let frameId: number;

    function tick(time: number) {
      if (lastTime !== null) {
        const delta = time - lastTime;
        callbackRef.current(delta);
      }
      lastTime = time;
      frameId = requestAnimationFrame(tick);
    }

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);
}
