import { loadScene } from './components/SceneLoader';

function simulateKeyboardEvent(key, eventType) {
    const event = new KeyboardEvent(eventType, {
      key: key,
      code: key.toUpperCase(),
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(event);
  }
  
  const keys = ["w", "a", "s", "d"];
  
  let checkInterval = setInterval(() => {
    keys.forEach((key) => {
      const element = document.querySelector(`.key-display.control-${key}`);
      console.log(element);
      if (element) {
        // Handle mouse click events
        element.addEventListener("click", () => {
          console.log("Mouse click detected");
          simulateKeyboardEvent(key, "keydown");
        });
  
        // Handle mouse up events
        element.addEventListener("mouseup", () => {
          console.log("Mouse up detected");
          simulateKeyboardEvent(key, "keyup");
        });
  
        // Handle touch start events
        element.addEventListener("touchstart", (e) => {
          console.log("Touch start detected");
          e.preventDefault();  // Prevent default touch behavior
          simulateKeyboardEvent(key, "keydown");
        });
  
        // Handle touch end events
        element.addEventListener("touchend", (e) => {
          console.log("Touch end detected");
          e.preventDefault();  // Prevent default touch behavior
          simulateKeyboardEvent(key, "keyup");
        });
  
        // Once the element is found and event listeners are added, stop the interval check
        clearInterval(checkInterval);
      }
    });
  }, 1000); // Check every 1 second
  
  
  


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize',()=>{
    sizes.width = window.innerWidth
    sizes.height=window.innerHeight

    // camera.aspect= sizes.width/sizes.height
    // camera.updateProjectionMatrix()

    // renderer.setSize(sizes.width, sizes.height)

})
// full screen
window.addEventListener('dblclick',()=>{
    console.log('hello')
    if(!document.fullscreenElement){
        document.body.requestFullscreen()
    }else{
        document.exitFullscreen()
    }
})


loadScene('garden'); // Load the initial scene
window.loadScene = loadScene; // Expose function globally for button click handling