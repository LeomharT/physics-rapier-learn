import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier3d';
import { BoxGeometry, Material, Mesh, MeshStandardMaterial } from 'three';
import type Experience from '..';

const box = {
  hx: 20.0,
  hy: 0.1,
  hz: 20.0,
};

export class Floor {
  constructor() {
    this._setGeometry();
    this._setMaterial();
    this._setMesh();
    this._setRapierWorld();
  }

  private _experience: Experience = window.experience;

  private _geometry!: BoxGeometry;

  private _material!: Material;

  private _mesh!: Mesh;

  private _setGeometry = () => {
    this._geometry = new BoxGeometry(box.hx, box.hy, box.hz);
  };

  private _setMaterial = () => {
    this._material = new MeshStandardMaterial({
      color: '#002766',
    });
  };

  private _setMesh = () => {
    this._mesh = new Mesh(this._geometry, this._material);
    this._mesh.receiveShadow = true;
    this._experience.scene.add(this._mesh);
  };

  private _setRapierWorld = () => {
    const rigidBodyDesc = RigidBodyDesc.fixed();
    const rigidBody = this._experience.physics.instance.createRigidBody(rigidBodyDesc);

    const collider = ColliderDesc.cuboid(box.hx / 2.0, box.hy / 2.0, box.hz / 2.0);
    this._experience.physics.instance.createCollider(collider, rigidBody);
  };
}
