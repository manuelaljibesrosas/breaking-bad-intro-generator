/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*.glsl" {
  const value: string;
  export default value;
}

declare module "three/addons/misc/Timer" {
  class Timer {
    private _previousTime;
    private _currentTime;
    private _startTime;
    private _delta;
    private _elapsed;
    private _timescale;
    private _usePageVisibilityAPI;
    private _pageVisibilityHandler;

    constructor();

    getDelta(): number;
    getElapsed(): number;
    getTimescale(): number;
    setTimescale(timescale: number): this;
    reset(): this;
    dispose(): this;
    update(timestamp?: number): this;
  }

  class FixedTimer extends Timer {
    constructor(fps?: number);
    update(): this;
  }

  function now(): number;
  function handleVisibilityChange(): void;
}
