import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier3d';
import {
  Color,
  Material,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Quaternion,
  Uniform,
  Vector3,
  type IUniform,
} from 'three';
import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import type Experience from '../../';
import floorFragmentShader from './shader/fragment.glsl?raw';
import floorVertexShader from './shader/vertex.glsl?raw';

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

  private _geometry!: PlaneGeometry;

  private _material!: Material;

  private _mesh!: Mesh;

  private _uniforms: Record<string, IUniform<any>> = {
    uNoiseTexture: new Uniform(this._experience.resources.items.noiseTexture),
    uColor: new Uniform(new Color('#237804')),
  };

  private _setGeometry = () => {
    this._geometry = new PlaneGeometry(box.hx, box.hz, 64, 64);
  };

  private _setMaterial = () => {
    this._material = new CustomShaderMaterial({
      baseMaterial: MeshStandardMaterial,
      color: '#002766',
      vertexShader: floorVertexShader,
      fragmentShader: floorFragmentShader,
      uniforms: this._uniforms,
    });
  };

  private _setMesh = () => {
    this._mesh = new Mesh(this._geometry, this._material);
    this._mesh.receiveShadow = true;
    this._mesh.rotation.x = -Math.PI / 2;
    this._experience.scene.add(this._mesh);
  };

  private _setRapierWorld = () => {
    const rigidBodyDesc = RigidBodyDesc.fixed();
    const rigidBody = this._experience.physics.instance.createRigidBody(rigidBodyDesc);

    const v = new Vector3();
    const positions: number[] = [];
    this._mesh.updateMatrixWorld(true);
    this._mesh.traverse((obj) => {
      if (obj instanceof Mesh) {
        const attrPosition = obj.geometry.getAttribute('position');

        for (let i = 0; i < attrPosition.count; i++) {
          v.fromBufferAttribute(attrPosition, i);
          v.applyMatrix4(obj.parent!.matrixWorld);
          positions.push(...v);
        }
      }
    });

    const colliderDesc = ColliderDesc.convexHull(new Float32Array(positions))!;
    colliderDesc.setRotation(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2));
    this._experience.physics.instance.createCollider(colliderDesc, rigidBody);
  };
}
