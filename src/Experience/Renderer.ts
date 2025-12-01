import {
  ACESFilmicToneMapping,
  EventDispatcher,
  NoToneMapping,
  ReinhardToneMapping,
  WebGLRenderer,
} from 'three';
import type Experience from '.';

export class Renderer extends EventDispatcher {
  constructor() {
    super();

    this._experience = window.experience;

    this._setInstance();
    this._setPane();
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

  private _setPane() {
    const pane = this._experience.debugPane.instance.addFolder({ title: '🗃️ Renderer' });
    pane.expanded = false;
    pane.addBinding(this.instance, 'toneMapping', {
      label: 'Tone Mapping',
      options: [
        { text: 'NoToneMapping', value: NoToneMapping },
        { text: 'ACESFilmicToneMapping', value: ACESFilmicToneMapping },
        { text: 'ReinhardToneMapping', value: ReinhardToneMapping },
      ],
    });
    pane.addBinding(this.instance, 'toneMappingExposure', {
      label: 'Tone Mapping Exposure',
      step: 0.001,
      min: 1.0,
      max: 5.0,
    });
  }

  public render = () => {
    this.instance.render(this._experience.scene, this._experience.camera.instance);
  };

  public resize = () => {
    this.instance.setSize(this._experience.sizes.width, this._experience.sizes.height);
  };
}
