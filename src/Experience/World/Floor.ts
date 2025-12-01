import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier3d';
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three';
import type Experience from '..';

export class Floor {
  constructor() {
    this._setGeometry();
    this._setMaterial();
    this._setMesh();
    this._setRapierWorld();
  }

  private _experience: Experience = window.experience;

  private _geometry!: BoxGeometry;

  private _material!: MeshBasicMaterial;

  private _mesh!: Mesh;

  public collider!: ColliderDesc;

  private _setGeometry = () => {
    this._geometry = new BoxGeometry(5, 0.12, 5);
  };

  private _setMaterial = () => {
    this._material = new MeshBasicMaterial({
      color: '#002766',
      wireframe: true,
    });
  };

  private _setMesh = () => {
    this._mesh = new Mesh(this._geometry, this._material);
    this._experience.scene.add(this._mesh);
  };

  private _setRapierWorld = () => {
    const rigidBodyDesc = RigidBodyDesc.fixed();
    const rigidBody = this._experience.physics.instance.createRigidBody(rigidBodyDesc);

    this.collider = ColliderDesc.cuboid(5.0, 0.12, 5.0);
    this._experience.physics.instance.createCollider(this.collider, rigidBody);
  };
}
