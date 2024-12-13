import { createGardenScene } from "../scenes/GardenScene";


let currentScene = null 


export function loadScene(){

    createGardenScene()

    createNavigationButtons()
}


function createNavigationButtons(){
    const navContainer = document.getElementById('navigation') || document.createElement('div');
    navContainer.id = 'navigation'
    navContainer.innerHTML = `<button onclick="loadScene('garden')">Garden</button>`
    
    document.body.appendChild(navContainer);
}