import { ColliderDesc, RigidBodyDesc, type RigidBody } from '@dimforge/rapier3d';
import { Mesh, MeshBasicMaterial, Quaternion, SphereGeometry, Vector3 } from 'three';
import type Experience from '..';

export class TestSphere {
  constructor() {
    this._experience = window.experience;

    this._setMesh();
    this._setRapier();
    this._debug();
  }

  static RADIUS: number = 0.1;

  private _experience: Experience;

  public mesh!: Mesh;

  public rigidBody!: RigidBody;

  private _setMesh = () => {
    const geometry = new SphereGeometry(TestSphere.RADIUS, 32, 32);
    const material = new MeshBasicMaterial({
      color: '#722ed1',
    });

    this.mesh = new Mesh(geometry, material);
    this._experience.scene.add(this.mesh);
  };

  private _setRapier = () => {
    const rigidBodyDesc = RigidBodyDesc.dynamic();
    rigidBodyDesc.setTranslation(0, 2.0, 0);

    this.rigidBody = this._experience.physics.instance.createRigidBody(rigidBodyDesc);

    const colliderDesc = ColliderDesc.ball(TestSphere.RADIUS);
    colliderDesc.setMass(1.0);
    colliderDesc.setRestitution(1.01);

    this._experience.physics.instance.createCollider(colliderDesc, this.rigidBody);
  };

  private _debug = () => {
    const folder = this._experience.debugPane.instance.addFolder({ title: 'Test Sphere' });
    folder
      .addButton({
        label: 'Reset Position',
        title: 'Reset',
      })
      .on('click', () => {
        this.rigidBody.resetForces(true);
        this.rigidBody.setTranslation(new Vector3(1.0, 3.0, -1.0), false);
      });
  };

  public update = () => {
    const translation = this.rigidBody.translation();
    const rotation = this.rigidBody.rotation();

    this.mesh.position.copy(translation);
    this.mesh.rotation.setFromQuaternion(
      new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    );
  };
}
