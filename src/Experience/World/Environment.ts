import { DirectionalLight } from 'three';
import type Experience from '..';

export default class Environment {
  constructor() {
    this._experience = window.experience;

    this._setSunLight();
  }

  private _experience: Experience;

  private _sunLight!: DirectionalLight;

  private _setSunLight() {
    this._sunLight = new DirectionalLight('#ffffff', 4.0);
    this._sunLight.castShadow = true;
    this._sunLight.shadow.camera.far = 15;
    this._sunLight.shadow.mapSize.set(1024, 1024);
    this._sunLight.shadow.normalBias = 0.05;
    this._sunLight.position.set(3.5, 2, -1.25);

    const clone = this._sunLight.clone();
    clone.position.x = -3.5;

    this._experience.scene.add(this._sunLight);
    this._experience.scene.add(clone);
  }
}
