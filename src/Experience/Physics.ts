import { World as RapierWorld } from '@dimforge/rapier3d';

export class Physics {
  constructor() {
    this._setRapierWorld();
  }

  public instance!: RapierWorld;

  private _setRapierWorld = () => {
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    this.instance = new RapierWorld(gravity);
  };

  public update = () => {
    this.instance.step();
  };
}
