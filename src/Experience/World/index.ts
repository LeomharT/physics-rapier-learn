import { EventDispatcher, IcosahedronGeometry, Mesh, MeshBasicMaterial } from 'three';
import type Experience from '..';

export class World extends EventDispatcher {
  constructor() {
    super();

    this._experience = window.experience;

    const test = new Mesh(
      new IcosahedronGeometry(1.1, 3),
      new MeshBasicMaterial({ color: 'blue' })
    );
    test.position.set(0, 0, 0);

    this._experience.scene.add(test);
  }

  private _experience: Experience;
}
