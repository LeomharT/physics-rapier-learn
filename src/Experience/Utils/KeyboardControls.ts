import { EventDispatcher } from 'three';

const Controls = {
  forward: 'forward',
  back: 'back',
  left: 'left',
  right: 'right',
};

const KeyboardKey: Record<string, string> = {
  w: 'KeyW',
  s: 'KeyS',
};

export class KeyboardControls extends EventDispatcher {
  constructor() {
    super();

    this.map.forEach((value) => {
      this.state[value.name] = false;
    });

    window.addEventListener('keydown', (e) => {
      const target = this.map.find((v) => v.keys.includes(KeyboardKey[e.key]));
      if (target) this.state[target.name] = true;
    });

    window.addEventListener('keyup', (e) => {
      const target = this.map.find((v) => v.keys.includes(KeyboardKey[e.key]));
      if (target) this.state[target.name] = false;
    });
  }

  public map = [
    { name: Controls.forward, keys: ['KeyW'] },
    { name: Controls.back, keys: ['KeyS'] },
  ];

  public state: Record<string, boolean> = {};
}
