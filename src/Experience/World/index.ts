import { EventDispatcher } from 'three';
import Experience from '..';
import { Car } from './Car';
import Environment from './Environment';
import { Floor } from './Floor';
import { TestSphere } from './TestSphere';

export class World extends EventDispatcher {
  constructor() {
    super();

    this._experience = window.experience;

    this._experience.resources.addEventListener('ready', () => {
      this.environment = new Environment();
      this.floor = new Floor();
      this.car = new Car();
      this.testSphere = new TestSphere();
    });
  }

  private _experience: Experience;

  public environment!: Environment;

  public floor!: Floor;

  public car!: Car;

  public testSphere!: TestSphere;

  public update = () => {
    if (this.testSphere) this.testSphere.update();
    if (this.car) this.car.update();
  };
}
