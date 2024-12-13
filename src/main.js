// import { loadScene } from './components/SceneLoader';

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

    camera.aspect= sizes.width/sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)

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


// loadScene('garden'); // Load the initial scene
// window.loadScene = loadScene; // Expose function globally for button click handling