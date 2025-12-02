import type { Group, Object3DEventMap } from 'three';
import type { GLTF } from 'three/examples/jsm/Addons.js';
import type Experience from '..';

export class Car {
  constructor() {
    this._experience = window.experience;
    this._resource = this._experience.resources.items.carModel;

    this._setScene();
  }

  private _experience: Experience;

  private _resource: GLTF;

  public car!: Group<Object3DEventMap>;

  private _setScene = () => {
    this.car = this._resource.scene;

    this._experience.scene.add(this.car);
  };
}
