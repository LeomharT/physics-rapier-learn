import { EventDispatcher, WebGLRenderer } from 'three';
import type Experience from '.';

export class Renderer extends EventDispatcher {
  constructor() {
    super();

    this._experience = window.experience;

    this._setInstance();
  }

  private _experience: Experience;

  public instance!: WebGLRenderer;

  private _setInstance = () => {
    this.instance = new WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.instance.setClearColor('#211D20');
    this.instance.setSize(this._experience.sizes.width, this._experience.sizes.height);
    this.instance.setPixelRatio(this._experience.sizes.pixelRatio);
  };

  public render = () => {
    this.instance.render(this._experience.scene, this._experience.camera.instance);
  };

  public resize = () => {
    this.instance.setSize(this._experience.sizes.width, this._experience.sizes.height);
  };
}
