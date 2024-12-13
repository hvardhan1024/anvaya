import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CharacterControls } from '../components/characterControls'; // Adjust path if needed
import { KeyDisplay, W, A, S, D, SHIFT } from '../components/utils'; // Import KeyDisplay and controls
import { RGBELoader } from 'three/examples/jsm/Addons.js';

export function createGardenScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa8def0);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.minDistance = 5;
    orbitControls.maxDistance = 7;
    orbitControls.enablePan = false;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
    orbitControls.update();

    setupLighting(scene);
    loadGround(scene);

    const keysPressed = {}; // For tracking key presses
    const keyDisplay = new KeyDisplay(); // Visualize key presses
    setupCharacter(scene, orbitControls, camera, keysPressed, keyDisplay);

    const clock = new THREE.Clock();

    function animate() {
        const delta = clock.getDelta();
        orbitControls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);

    animate();

    return {
        scene,
        renderer,
        camera,
        cleanup: () => {
            window.removeEventListener('resize', onWindowResize);
        },
    };
}

function setupLighting(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}

function loadGround(scene) {
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 }); // Green for the garden
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const doorGeometry = new THREE.PlaneGeometry(5,10)
    const doorMaterial = new THREE.MeshStandardMaterial({color: 0xff0000})
    const doorToHerbalGarden = new THREE.Mesh(doorGeometry,doorMaterial)
    doorToHerbalGarden.position.z = 20
    doorToHerbalGarden.position.x = 2
    scene.add(doorToHerbalGarden)

    const gltfLoader = new GLTFLoader()

    // let pathWay = null
    // gltfLoader.load(
    //     '/models/path_bounds.glb',
    //     (glb)=>{
    //         pathWay= glb.scene
    //         pathWay.scale.set(10,10,10)
    //         // pathWay.position.y = 2
    //         scene.add(pathWay)
    //     }
    // )

    // let gardenBase = null
    // gltfLoader.load(
    //     '/models/garden_final.glb',
    //     (glb)=>{
    //         gardenBase = glb.scene
    //         gardenBase.scale.set(10,10,10)
    //         scene.add(gardenBase)
    //     }
    // )


 // Load the HDR image
// const rgbeLoader = new RGBELoader();
// rgbeLoader.load(
//     '/environmentMap/forest.exr', // Path to your HDR file
//     (texture) => {
//         texture.mapping = THREE.EquirectangularReflectionMapping;
//         scene.background = texture; // Set background to HDR texture
//         scene.environment = texture; // Set environment map to HDR texture
//         console.log(texture);
//     },
//     undefined,
//     (error) => {
//         console.error('Error loading HDR image:', error);
//     }
// );



}

function setupCharacter(scene, orbitControls, camera, keysPressed, keyDisplay) {
    new GLTFLoader().load('/models/char3.glb', (gltf) => {
        const model = gltf.scene;
        model.traverse((object) => {
            if (object.isMesh) object.castShadow = true;
        });
        model.position.z= 50
        model.position.y = 0.8
        scene.add(model);

        const mixer = new THREE.AnimationMixer(model);
        const animationsMap = new Map();
        gltf.animations
            .filter((a) => a.name !== 'TPose')
            .forEach((a) => animationsMap.set(a.name, mixer.clipAction(a)));

        const characterControls = new CharacterControls(
            model,
            mixer,
            animationsMap,
            orbitControls,
            camera,
            'Idle'
        );

        document.addEventListener('keydown', (event) => {
            if (event.shiftKey) {
                characterControls.switchRunToggle();
            } else {
                const key = event.key.toLowerCase();
                keysPressed[key] = true;
                keyDisplay.down(key);
            }
        });

        document.addEventListener('keyup', (event) => {
            const key = event.key.toLowerCase();
            keysPressed[key] = false;
            keyDisplay.up(key);
        });

        const clock = new THREE.Clock();
        function updateCharacter() {
            const delta = clock.getDelta();
            characterControls.update(delta, keysPressed);
            requestAnimationFrame(updateCharacter);
        }
        updateCharacter();
    });
}