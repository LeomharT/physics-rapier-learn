import { World as RapierWorld } from '@dimforge/rapier3d';
import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments } from 'three';
import type Experience from '.';

export class Physics {
  constructor() {
    this._experience = window.experience;

    this._setRapierWorld();
    this._setMesh();
    this._setPane();
  }

  private _experience: Experience;

  public debug: boolean = true;

  private _mesh!: LineSegments;

  public instance!: RapierWorld;

  public gravity = { x: 0.0, y: -9.81, z: 0.0 };

  private _setRapierWorld = () => {
    this.instance = new RapierWorld(this.gravity);
  };

  private _setMesh = () => {
    this._mesh = new LineSegments(
      new BufferGeometry(),
      new LineBasicMaterial({
        color: 0xffffff,
        vertexColors: true,
      })
    );
    this._mesh.frustumCulled = false;
    this._experience.scene.add(this._mesh);
  };

  private _setPane = () => {
    const folder = this._experience.debugPane.instance.addFolder({ title: '⚛️ Rapier Physics' });
    folder.addBinding(this, 'debug', {
      label: 'Debug',
    });
    folder.addBinding(this.gravity, 'y', {
      label: 'Gravity Y',
      step: 0.001,
      min: -10,
      max: 10,
    });
  };

  public update = () => {
    this.instance.step();

    const { vertices, colors } = this.instance.debugRender();
    this._mesh.geometry.setAttribute('position', new BufferAttribute(vertices, 3));
    this._mesh.geometry.setAttribute('color', new BufferAttribute(colors, 4));

    this._mesh.visible = this.debug;
  };
}
