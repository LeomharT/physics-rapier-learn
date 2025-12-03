import { ColliderDesc, RigidBody, RigidBodyDesc } from '@dimforge/rapier3d';
import { Mesh, Object3D, Vector3, type Group } from 'three';
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

  public _dynamicBodies: [Object3D, RigidBody][] = [];

  private _setScene = () => {
    const rapier = this._experience.physics.instance;

    const car = this._resource.scene;

    const carMesh = car.getObjectByName('body') as Group;
    carMesh.position.set(0, 0, 0);
    carMesh.traverse((o) => {
      o.castShadow = true;
    });

    const wheelBLMesh = car.getObjectByName('wheel_backLeft') as Group;
    const wheelBRMesh = car.getObjectByName('wheel_backRight') as Group;
    const wheelFLMesh = car.getObjectByName('wheel_frontLeft') as Group;
    const wheelFRMesh = car.getObjectByName('wheel_frontRight') as Group;
    wheelBLMesh.position.set(0, 0, 0);
    wheelBRMesh.position.set(0, 0, 0);
    wheelFLMesh.position.set(0, 0, 0);
    wheelFRMesh.position.set(0, 0, 0);

    const group = [carMesh, wheelBLMesh, wheelBRMesh, wheelFLMesh, wheelFRMesh];
    group.forEach((obj) => {
      obj.scale.setScalar(0.3);
    });

    this._experience.scene.add(...group);

    // Car vertex position for rigid body
    const v = new Vector3();
    const positions: number[] = [];

    carMesh.updateMatrixWorld(true);
    carMesh.traverse((obj) => {
      if (obj instanceof Mesh) {
        const attrPosition = obj.geometry.getAttribute('position');

        for (let i = 0; i < attrPosition.count; i++) {
          v.fromBufferAttribute(attrPosition, i);
          v.applyMatrix4(obj.parent!.matrixWorld);
          positions.push(...v);
        }
      }
    });

    const carBodyDesc = RigidBodyDesc.dynamic();
    carBodyDesc.setTranslation(0, 1, 0);
    carBodyDesc.setCanSleep(false);
    const carBody = rapier.createRigidBody(carBodyDesc);

    const carColliderDesc = ColliderDesc.convexHull(new Float32Array(positions))!;
    carColliderDesc.setMass(1.0);
    carColliderDesc.setRestitution(0.5);

    rapier.createCollider(carColliderDesc, carBody);

    this._dynamicBodies.push([carMesh, carBody]);
  };

  public update() {
    this._dynamicBodies.forEach((value) => {
      const mesh = value[0];
      const body = value[1];

      const position = body.translation();
      const rotation = body.rotation();

      mesh.position.copy(position);
      mesh.quaternion.copy(rotation);
    });
  }
}
