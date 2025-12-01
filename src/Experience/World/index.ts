import { ColliderDesc, RigidBody, RigidBodyDesc } from '@dimforge/rapier3d';
import { EventDispatcher, Mesh, MeshBasicMaterial, Quaternion, SphereGeometry } from 'three';
import type Experience from '..';
import { Floor } from './Floor';

export class World extends EventDispatcher {
  constructor() {
    super();

    this._experience = window.experience;

    this.floor = new Floor();

    this.test = new Mesh(
      new SphereGeometry(0.1, 32, 32),
      new MeshBasicMaterial({ color: '#722ed1', wireframe: true })
    );
    this.test.position.set(0, 1, 0);
    this._experience.scene.add(this.test);

    const rigidBodyDesc = RigidBodyDesc.dynamic();
    rigidBodyDesc.setTranslation(0.0, 1.0, 0.0);
    this._rigidBody = this._experience.physics.instance.createRigidBody(rigidBodyDesc);

    const rigidBody = ColliderDesc.ball(0.1);
    rigidBody.setMass(1.0);
    rigidBody.setRestitution(1.05);

    this._experience.physics.instance.createCollider(rigidBody, this._rigidBody);
  }

  private _experience: Experience;

  private _rigidBody: RigidBody;

  private test: Mesh;

  public floor: Floor;

  public update = () => {
    const position = this._rigidBody.translation();
    const rotation = this._rigidBody.rotation();

    this.test.position.copy(position);
    this.test.setRotationFromQuaternion(
      new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    );
  };
}
