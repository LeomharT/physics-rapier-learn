import {
  ColliderDesc,
  JointData,
  Vector3 as RapierVector3,
  RigidBody,
  RigidBodyDesc,
} from '@dimforge/rapier3d';
import { Mesh, Object3D, Quaternion, Vector3, type Group } from 'three';
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
    const carPosition = new Vector3(0, 1, 0);

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

    // Car body
    const carBodyDesc = RigidBodyDesc.dynamic();
    carBodyDesc.setTranslation(carPosition.x, carPosition.y, carPosition.z);
    carBodyDesc.setCanSleep(true);
    const carBody = rapier.createRigidBody(carBodyDesc);

    // Whell body
    const wheelBLBodyDesc = RigidBodyDesc.dynamic();
    wheelBLBodyDesc.setTranslation(-1 + carPosition.x, 1 + carPosition.y, 1 + carPosition.z);
    wheelBLBodyDesc.setCanSleep(false);
    const wheelBLBody = rapier.createRigidBody(wheelBLBodyDesc);

    const carColliderDesc = ColliderDesc.convexHull(new Float32Array(positions))!;
    carColliderDesc.setMass(1.0);
    carColliderDesc.setRestitution(0.5);

    const wheelBLColliderDesc = ColliderDesc.cylinder(0.1, 0.3);
    wheelBLColliderDesc.setRotation(
      new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), -Math.PI / 2)
    );
    wheelBLColliderDesc.setTranslation(-0.2, 0, 0);
    wheelBLColliderDesc.setRestitution(0.5);

    rapier.createCollider(carColliderDesc, carBody);
    rapier.createCollider(wheelBLColliderDesc, wheelBLBody);

    // Joints
    rapier.createImpulseJoint(
      JointData.revolute(
        new RapierVector3(-0.55, 0, 0.63),
        new RapierVector3(0, 0, 0),
        new RapierVector3(-1, 0, 0)
      ),
      carBody,
      wheelBLBody,
      true
    );

    this._dynamicBodies.push([carMesh, carBody]);
    this._dynamicBodies.push([wheelBLMesh, wheelBLBody]);
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
