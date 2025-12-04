import {
  ColliderDesc,
  JointData,
  MotorModel,
  PrismaticImpulseJoint,
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
    this._setDebug();
  }

  private _experience: Experience;

  private _resource: GLTF;

  private _dynamicBodies: [Object3D, RigidBody][] = [];

  private _joints: PrismaticImpulseJoint[] = [];

  private _setScene = () => {
    const carPosition = new Vector3(0, 0.5, 0);

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
    carBodyDesc.enabled = true;
    carBodyDesc.setTranslation(carPosition.x, carPosition.y, carPosition.z);
    carBodyDesc.setCanSleep(true);

    // Whell body
    const wheelBLBodyDesc = RigidBodyDesc.dynamic();
    wheelBLBodyDesc.enabled = true;
    wheelBLBodyDesc.setTranslation(-1 + carPosition.x, 1 + carPosition.y, 1 + carPosition.z);
    wheelBLBodyDesc.setCanSleep(false);

    const wheelBRBodyDesc = RigidBodyDesc.dynamic();
    wheelBRBodyDesc.enabled = true;
    wheelBRBodyDesc.setTranslation(1 + carPosition.x, 1 + carPosition.y, 1 - carPosition.z);
    wheelBRBodyDesc.setCanSleep(false);

    const wheelFLBodyDesc = RigidBodyDesc.dynamic();
    wheelFLBodyDesc.enabled = true;
    wheelFLBodyDesc.setTranslation(-1 + carPosition.x, 1 + carPosition.y, -1 + carPosition.z);
    wheelFLBodyDesc.setCanSleep(false);

    const wheelFRBodyDesc = RigidBodyDesc.dynamic();
    wheelFRBodyDesc.enabled = true;
    wheelFRBodyDesc.setTranslation(1 + carPosition.x, 1 + carPosition.y, -1 + carPosition.z);
    wheelFRBodyDesc.setCanSleep(false);

    const carBody = rapier.createRigidBody(carBodyDesc);
    const wheelBLBody = rapier.createRigidBody(wheelBLBodyDesc);
    const wheelBRBody = rapier.createRigidBody(wheelBRBodyDesc);
    const wheelFLBody = rapier.createRigidBody(wheelFLBodyDesc);
    const wheelFRBody = rapier.createRigidBody(wheelFRBodyDesc);

    // Axes
    const axelFLBody = rapier.createRigidBody(
      RigidBodyDesc.dynamic()
        .setTranslation(carPosition.x - 0.55, carPosition.y, carPosition.z - 0.63)
        .setCanSleep(false)
    );
    const axelFRBody = rapier.createRigidBody(
      RigidBodyDesc.dynamic()
        .setTranslation(carPosition.x + 0.55, carPosition.y, carPosition.z - 0.63)
        .setCanSleep(false)
    );

    //
    const carColliderDesc = ColliderDesc.convexHull(new Float32Array(positions))!;
    carColliderDesc.setMass(1.0);
    carColliderDesc.setRestitution(0.0);
    carColliderDesc.setFriction(3);
    carColliderDesc.setCollisionGroups(131073);

    const wheelBLColliderDesc = ColliderDesc.cylinder(0.1, 0.3);
    wheelBLColliderDesc.setRotation(
      new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), -Math.PI / 2)
    );
    wheelBLColliderDesc.setTranslation(-0.2, 0, 0);
    wheelBLColliderDesc.setRestitution(0.01);
    wheelBLColliderDesc.setFriction(2);
    wheelBLColliderDesc.setCollisionGroups(262145);

    const wheelBRColliderDesc = ColliderDesc.cylinder(0.1, 0.3);
    wheelBRColliderDesc.setRotation(
      new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2)
    );
    wheelBRColliderDesc.setTranslation(0.2, 0, 0);
    wheelBRColliderDesc.setRestitution(0.01);
    wheelBRColliderDesc.setFriction(2);
    wheelBRColliderDesc.setCollisionGroups(262145);

    const wheelFLColliderDesc = ColliderDesc.cylinder(0.1, 0.3);
    wheelFLColliderDesc.setRotation(
      new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2)
    );
    wheelFLColliderDesc.setTranslation(-0.2, 0, 0);
    wheelFLColliderDesc.setRestitution(0.01);
    wheelFLColliderDesc.setFriction(2.5);
    wheelFLColliderDesc.setCollisionGroups(262145);

    const wheelFRColliderDesc = ColliderDesc.cylinder(0.1, 0.3);
    wheelFRColliderDesc.setRotation(
      new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2)
    );
    wheelFRColliderDesc.setTranslation(0.2, 0, 0);
    wheelFRColliderDesc.setRestitution(0.01);
    wheelFRColliderDesc.setFriction(2.5);
    wheelFRColliderDesc.setCollisionGroups(262145);

    // Axle of the front wheel
    const axelFLShape = ColliderDesc.cuboid(0.1, 0.1, 0.1)
      .setRotation(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2))
      .setMass(0.1)
      .setCollisionGroups(589823);
    const axelFRShape = ColliderDesc.cuboid(0.1, 0.1, 0.1)
      .setRotation(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2))
      .setMass(0.1)
      .setCollisionGroups(589823);

    rapier.createCollider(carColliderDesc, carBody);
    rapier.createCollider(wheelBLColliderDesc, wheelBLBody);
    rapier.createCollider(wheelBRColliderDesc, wheelBRBody);
    rapier.createCollider(wheelFLColliderDesc, wheelFLBody);
    rapier.createCollider(wheelFRColliderDesc, wheelFRBody);
    rapier.createCollider(axelFLShape, axelFLBody);
    rapier.createCollider(axelFRShape, axelFRBody);

    const frontAxis = new RapierVector3(1, 0, 0);
    const backAxis = new RapierVector3(-1, 0, 0);
    const anchor2 = new RapierVector3(0, 0, 0);

    // Joints
    rapier.createImpulseJoint(
      JointData.revolute(new RapierVector3(-0.55, 0, 0.63), anchor2, backAxis),
      carBody,
      wheelBLBody,
      true
    );
    rapier.createImpulseJoint(
      JointData.revolute(new RapierVector3(0.55, 0, 0.63), anchor2, backAxis),
      carBody,
      wheelBRBody,
      true
    );
    // rapier.createImpulseJoint(
    //   JointData.revolute(new RapierVector3(-0.55, 0, -0.63), anchor2, frontAxis),
    //   carBody,
    //   wheelFLBody,
    //   true
    // );
    // rapier.createImpulseJoint(
    //   JointData.revolute(new RapierVector3(0.55, 0, -0.63), anchor2, frontAxis),
    //   carBody,
    //   wheelFRBody,
    //   true
    // );

    this._dynamicBodies.push([carMesh, carBody]);
    this._dynamicBodies.push([wheelBLMesh, wheelBLBody]);
    this._dynamicBodies.push([wheelBRMesh, wheelBRBody]);
    this._dynamicBodies.push([wheelFLMesh, wheelFLBody]);
    this._dynamicBodies.push([wheelFRMesh, wheelFRBody]);
    this._dynamicBodies.push([new Object3D(), axelFRBody]);
    this._dynamicBodies.push([new Object3D(), axelFLBody]);

    // Motor
    const wheelBLMotor = rapier.createImpulseJoint(
      JointData.revolute(new Vector3(-0.55, 0, 0.63), new Vector3(0, 0, 0), new Vector3(-1, 0, 0)),
      carBody,
      wheelBLBody,
      true
    );
    const wheelBRMotor = rapier.createImpulseJoint(
      JointData.revolute(new Vector3(0.55, 0, 0.63), new Vector3(0, 0, 0), new Vector3(-1, 0, 0)),
      carBody,
      wheelBRBody,
      true
    );
    // attach steering axels to car. These will be configurable motors.
    const wheelFLAxel = rapier.createImpulseJoint(
      JointData.revolute(new Vector3(-0.55, 0, -0.63), new Vector3(0, 0, 0), new Vector3(0, 1, 0)),
      carBody,
      axelFLBody,
      true
    );
    (wheelFLAxel as PrismaticImpulseJoint).configureMotorModel(MotorModel.ForceBased);

    const wheelFRAxel = rapier.createImpulseJoint(
      JointData.revolute(new Vector3(0.55, 0, -0.63), new Vector3(0, 0, 0), new Vector3(0, 1, 0)),
      carBody,
      axelFRBody,
      true
    );
    (wheelFRAxel as PrismaticImpulseJoint).configureMotorModel(MotorModel.ForceBased);

    // attach front wheel to steering axels
    rapier.createImpulseJoint(
      JointData.revolute(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 0, 0)),
      axelFLBody,
      wheelFLBody,
      true
    );
    rapier.createImpulseJoint(
      JointData.revolute(new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 0, 0)),
      axelFRBody,
      wheelFRBody,
      true
    );

    this._joints.push(
      wheelBLMotor as PrismaticImpulseJoint,
      wheelBRMotor as PrismaticImpulseJoint,
      wheelFLAxel as PrismaticImpulseJoint,
      wheelFRAxel as PrismaticImpulseJoint
    );
  };

  private _setDebug = () => {
    const folder = this._experience.debugPane.instance.addFolder({ title: '🚗 Car' });
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

    if (this._experience.keyboardControls.state.forward) {
      // Velocity
      const FORWARD_VELOCITY = 50.0;
      this._joints[0].configureMotorVelocity(FORWARD_VELOCITY, 2.0);
      this._joints[1].configureMotorVelocity(FORWARD_VELOCITY, 2.0);
    } else if (this._experience.keyboardControls.state.back) {
      const FORWARD_VELOCITY = -50.0;
      this._joints[0].configureMotorVelocity(FORWARD_VELOCITY, 2.0);
      this._joints[1].configureMotorVelocity(FORWARD_VELOCITY, 2.0);
    } else {
      const FORWARD_VELOCITY = 0.0;
      this._joints[0].configureMotorVelocity(FORWARD_VELOCITY, 0.0);
      this._joints[1].configureMotorVelocity(FORWARD_VELOCITY, 0.0);
    }

    let targetSteer = 0;
    if (this._experience.keyboardControls.state.left) {
      targetSteer += 0.6;
    }
    if (this._experience.keyboardControls.state.right) {
      targetSteer -= 0.6;
    }
    (this._joints[2] as PrismaticImpulseJoint).configureMotorPosition(targetSteer, 100, 10.0);

    (this._joints[3] as PrismaticImpulseJoint).configureMotorPosition(targetSteer, 100, 10.0);
  }
}
