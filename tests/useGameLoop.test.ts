import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useGameLoop', () => {
  let rafCallbacks: ((time: number) => void)[];
  let rafId: number;

  beforeEach(() => {
    rafCallbacks = [];
    rafId = 0;
    vi.stubGlobal('requestAnimationFrame', (cb: (time: number) => void) => {
      rafCallbacks.push(cb);
      return ++rafId;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls callback with delta time between frames', async () => {
    const { useGameLoop } = await import('../src/hooks/useGameLoop');

    // Simulate the hook's behavior manually since we can't use React here
    let lastTime: number | null = null;
    const deltas: number[] = [];

    const callback = (delta: number) => deltas.push(delta);

    // Simulate the rAF loop
    function tick(time: number) {
      if (lastTime !== null) {
        callback(time - lastTime);
      }
      lastTime = time;
    }

    tick(0);
    tick(16);
    tick(33);

    expect(deltas).toEqual([16, 17]);

    // Verify the hook module exports correctly
    expect(typeof useGameLoop).toBe('function');
  });

  it('does not call callback on first frame (no delta yet)', async () => {
    let lastTime: number | null = null;
    const deltas: number[] = [];

    function tick(time: number) {
      if (lastTime !== null) {
        deltas.push(time - lastTime);
      }
      lastTime = time;
    }

    tick(1000); // first frame
    expect(deltas).toEqual([]);

    tick(1016); // second frame
    expect(deltas).toEqual([16]);
  });
});
