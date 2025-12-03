import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
import { Pane } from 'tweakpane';

export class DebugPane {
  constructor() {
    this.instance = new Pane({ title: 'Debug Params' });
    this.instance.element!.parentElement!.style.width = '380px';

    this.instance.registerPlugin(EssentialsPlugin);
    this.fpsGraph = this.instance.addBlade({
      view: 'fpsgraph',
      label: undefined,
      rows: 4,
    });
  }

  public instance!: Pane;

  public fpsGraph: any;
}
