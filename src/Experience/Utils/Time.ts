import { Clock, EventDispatcher } from 'three';

export class Time extends EventDispatcher<{ tick: {} }> {
  constructor() {
    super();

    this.clock = new Clock();

    // Wait one frame
    requestAnimationFrame(() => {
      this.tick();
    });
  }

  public clock: Clock;

  public tick() {
    this.dispatchEvent({ type: 'tick' });

    // Animation
    requestAnimationFrame(() => {
      this.tick();
    });
  }
}
