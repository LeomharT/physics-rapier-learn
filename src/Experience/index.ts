import { Scene } from 'three';
import { Camera } from './Camera';
import { Renderer } from './Renderer';
import { DebugPane, Sizes, Time } from './Utils';
import { World } from './World';

declare global {
  interface Window {
    experience: Experience;
  }
}

export default class Experience {
  constructor() {
    // Global access
    window.experience = this;

    //
    this.debugPane = new DebugPane();

    this.sizes = new Sizes();

    this.time = new Time();

    this.renderer = new Renderer();
    this.canvas = this.renderer.instance.domElement;

    this.scene = new Scene();

    this.camera = new Camera();

    this.world = new World();

    // Events
    this.sizes.addEventListener('resize', this.renderer.resize);
    this.time.addEventListener('tick', this._update);
  }

  public canvas: HTMLCanvasElement;

  public debugPane: DebugPane;

  public sizes: Sizes;

  public time: Time;

  public scene: Scene;

  public camera: Camera;

  public renderer: Renderer;

  public world: World;

  private _update = () => {
    const elapsedTime = this.time.clock.getElapsedTime();

    // Render
    this.renderer.render();

    // Update
    this.camera.update(elapsedTime);

    // World
  };
}
