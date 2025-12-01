import { Pane } from 'tweakpane';

export class DebugPane {
  constructor() {
    this.instance = new Pane({ title: 'Debug Params' });
    this.instance.element!.parentElement!.style.width = '380px';
  }

  public instance!: Pane;
}
