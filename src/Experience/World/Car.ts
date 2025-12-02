import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier3d';
import { Vector3, type Group, type Object3DEventMap } from 'three';
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
    this.car.scale.set(0.3, 0.3, 0.3);

    const carMesh = this.car.getObjectByName('body') as Group;
    carMesh.position.set(0, 0, 0);
    carMesh.traverse((o) => {
      o.castShadow = true;
    });

    const wheelBLMesh = this.car.getObjectByName('wheel_backLeft') as Group;
    const wheelBRMesh = this.car.getObjectByName('wheel_backRight') as Group;
    const wheelFLMesh = this.car.getObjectByName('wheel_frontLeft') as Group;
    const wheelFRMesh = this.car.getObjectByName('wheel_frontRight') as Group;
    wheelBLMesh.position.set(0, 0, 0);
    wheelBRMesh.position.set(0, 0, 0);
    wheelFLMesh.position.set(0, 0, 0);
    wheelFRMesh.position.set(0, 0, 0);

    const rigidBodyCarBodyDesc = RigidBodyDesc.dynamic();
    const rigidBodyCarBody =
      this._experience.physics.instance.createRigidBody(rigidBodyCarBodyDesc);
    rigidBodyCarBody.setTranslation(new Vector3(0, 2, 0), true);

    const colliderDesc = ColliderDesc.convexHull();
  };
}
