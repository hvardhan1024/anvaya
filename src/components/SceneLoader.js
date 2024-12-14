import { createGardenScene } from "../scenes/GardenScene";
import { createHerbalLabScene } from "../scenes/HerbalLabScene";
import { createHomeopathyLabScene } from "../scenes/HomeopathyLabScene";
import { createYogaLabScene } from "../scenes/YogaLabScene";




let currentScene = null 


export function loadScene(sceneName) {
    if (currentScene) {
      document.body.removeChild(currentScene.renderer.domElement);
    }
  
    switch (sceneName) {
      case 'garden':
        currentScene = createGardenScene();
        break;
      case 'herbalLab':
        currentScene = createHerbalLabScene();
        break;
      case 'yogaLab':
        currentScene = createYogaLabScene();
        break;
      case 'homeopathy':
        currentScene = createHomeopathyLabScene();
        break;
    }


    // createNavigationButtons()
}

function createNavigationButtons() {
    const navContainer = document.getElementById('navigation') || document.createElement('div');
    navContainer.id = 'navigation';
    navContainer.innerHTML = `
      <button onclick="loadScene('garden')">Garden</button>
      <button onclick="loadScene('herbalLab')">Herbal Lab</button>
      <button onclick="loadScene('yogaLab')">Yoga Lab</button>
      <button onclick="loadScene('homeopathy')">Homeopathy Lab</button>
    `;
    document.body.appendChild(navContainer);
  }
  