import { EventDispatcher } from "three";

type SizesEmitEvent = {
  resize: {};
};

export class Sizes extends EventDispatcher<SizesEmitEvent> {
  constructor() {
    super();

    this.updateSizes();

    window.addEventListener("resize", () => {
      this.dispatchEvent({ type: "resize" });
      this.updateSizes();
    });
  }

  public width: number = 0;

  public height: number = 0;

  public pixelRatio: number = 1;

  public updateSizes() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  }
}
