import { EventDispatcher } from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/Addons.js';

const sources = [
  {
    name: 'carModel',
    type: 'gltf',
    path: 'sedanSports.glb',
  },
] as const;

export type ResourcesLoaders = {
  gltfLoader: GLTFLoader;
};

export type ResourcesItems = {
  carModel: GLTF;
};

export type ResourcesEvents = {
  ready: {};
};

export default class Resources extends EventDispatcher<ResourcesEvents> {
  constructor() {
    super();

    this._setLoaders();
    this._startLoading();
  }

  public loaders: ResourcesLoaders = {} as ResourcesLoaders;

  public items: ResourcesItems = {} as ResourcesItems;

  public toLoad: number = sources.length;

  public loaded: number = 0;

  private _setLoaders() {
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.gltfLoader.setPath('/assets/models/');
  }

  private _startLoading() {
    for (const source of sources) {
      switch (source.type) {
        case 'gltf': {
          this.loaders.gltfLoader.load(source.path, (data) => {
            this._sourceLoaded(source, data);
          });
          break;
        }
        default:
          break;
      }
    }
  }

  private _sourceLoaded<T>(source: (typeof sources)[number], data: T) {
    this.items[source.name] = data as any;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.dispatchEvent({ type: 'ready' });
    }
  }
}
