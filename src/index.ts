import { SceneController } from './SceneController';
import { ObjectController } from './ObjectController';

class App {
  private sceneController: SceneController;
  private objectController: ObjectController;

  constructor() {
    this.sceneController = new SceneController();
    this.objectController = new ObjectController();
  }
}

new App();
