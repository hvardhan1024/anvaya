import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CharacterControls } from '../components/characterControls'; // Adjust path if needed
import { KeyDisplay, W, A, S, D, SHIFT } from '../components/utils'; // Import KeyDisplay and controls
import { RGBELoader } from 'three/examples/jsm/Addons.js';
import { createTree } from '../components/tree';

let camera;  // Declare camera variable globally

// Raycaster and mouse vector initialization
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();  // Store mouse coordinates

export function createGardenScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa8def0);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);  // Use global camera
    camera.position.set(0, 4, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.minDistance = 3;
    orbitControls.maxDistance = 5;
    orbitControls.enablePan = false;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
    orbitControls.update();

    setupLighting(scene);
    loadGround(scene);
    addPlants(scene);
    addHomeopathy(scene)
    addYoga(scene)

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

    // Mouse click event listener for raycasting
    window.addEventListener('click', (event) => onMouseClick(event, scene), false);  // Pass scene here

    animate();

    return {
        scene,
        renderer,
        camera,
        cleanup: () => {
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('click', onMouseClick);
        },
    };
}

function onMouseClick(event, scene) {  // Accept scene as a parameter
    // Ensure camera is defined
    if (!camera) {
        console.error('Camera is not defined!');
        return;
    }

    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse coordinates
    raycaster.setFromCamera(mouse, camera);  // Correct usage

    // Cast the ray and check for intersections
    const intersects = raycaster.intersectObject(scene, true);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        const point = intersect.point; // The coordinates of the intersection point

        // Log the intersection coordinates
        console.log('Mouse clicked at:', point);
    }
}

function setupLighting(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}


function addYoga(scene) {
    // Load the GLB model
    new GLTFLoader().load('/models/yoga/yoga_character.glb', (gltf) => {
        const model = gltf.scene;
        console.log(model);

        // Set model position and scale
        model.position.set(40, 1.13, -27.54);
        model.scale.set(1.5, 1.5, 1.5);

        // Add the model to the scene
        scene.add(model);

        // Load the animations
        const animations = gltf.animations;
        if (animations && animations.length) {
            // Create an AnimationMixer for playing animations
            const mixer = new THREE.AnimationMixer(model);

            // Find the 'suryanamaskar' animation (assuming it is named 'suryanamaskar')
            const animationClip = animations.find(animation => animation.name === 'surya namaskara');
            if (animationClip) {
                // Add the animation clip to the mixer
                mixer.clipAction(animationClip).play();
            }

            // Update the mixer on each frame in the animation loop
            function animate() {
                mixer.update(0.01); // You can adjust the time step here for the animation speed
                requestAnimationFrame(animate);
            }
            animate();
        }
    });
}

function addHomeopathy(scene){
    const coordinates = [
        [-25.067827896408208, 1.402312182167159, -18.7675033915934],
        [-26.66578360884982, 1.402312173776966, -19.55693341172318],
        [-28.26307570625974, 1.4023121846806457, -20.06017810892425],
        [-29.77896268927036, 1.4023121800071645, -20.760372957668835],
        [-31.17467401434882, 1.4023121713052515, -21.470244383414368],
        [-32.58947987740616, 1.4023121696168332, -23.42104789446237],
        [-32.038537931713265, 1.4023121717434845, -24.839853042136802],
        [-31.54445714040098, 1.402312173163259, -26.094667783151117],
        [-30.98514114825248, 1.402312172731669, -27.441706088119663],
        [-30.464542747332636, 1.4023121762899584, -28.83816781751784],
        [-28.073499184592702, 1.4023121720590537, -29.37333396403401],
        [-26.53510342235665, 1.4023121652141883, -28.631594205183667],
        [-24.943663146562958, 1.4023121711721935, -28.057497553869645],
        [-23.507851044665266, 1.4023121722764325, -27.476249929543354],
        [-21.702887628555352, 1.4023121853766707, -26.91911930295456]
    ];
    for (let index = 0; index < coordinates.length; index++) {
        new GLTFLoader().load('/models/plants/plant.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(coordinates[index][0], coordinates[index][1], coordinates[index][2]);
            model.scale.set(0.02, 0.02, 0.02);
            scene.add(model);
        });
        
      }
}

function addPlants(scene) {

    const coordinates = [ 
        [-9.98, 1.40, -11.20], 
        [-9.37, 1.40, -13.04], 
        [-8.59, 1.40, -14.88], 
        [-7.83, 1.40, -16.54], 
        [-6.97, 1.40, -18.70], 
        [0.66, 1.40, -15.72], 
        [2.31, 1.40, -14.89], 
        [3.99, 1.40, -14.54], 
        [5.82, 1.40, -13.57], 
        [11.82, 1.40, -10.59], 
        [11.05, 1.40, -0.873], 
        [10.46, 1.40, -6.88], 
        [9.79, 1.40, -5.10], 
        [8.91, 1.40, -3.35],
        [7.59,1.40,-12.75],
        [11.22,1.40,-8.72]
      ];

      for (let index = 0; index < coordinates.length; index++) {
        new GLTFLoader().load('/models/plants/plant.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(coordinates[index][0], coordinates[index][1], coordinates[index][2]);
            model.scale.set(0.02, 0.02, 0.02);
            scene.add(model);
        });
        
      }
   
}

function loadGround(scene) {
    new GLTFLoader().load('/models/garden-final.glb', (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 1, 0);
        model.scale.set(3, 3, 3);
        scene.add(model);
    });

    const cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
    const cubeGeoMesh = new THREE.MeshStandardMaterial({ color: 0xFFC0CB });
    const cubeGeo = new THREE.Mesh(cubeGeometry, cubeGeoMesh);
    cubeGeo.position.x = 20;
    cubeGeo.position.z = 60;
    scene.add(cubeGeo);

    const cubeGeometry2 = new THREE.BoxGeometry(10, 10, 10);
    const cubeGeoMesh2 = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
    const cubeGeo2 = new THREE.Mesh(cubeGeometry2, cubeGeoMesh2);
    cubeGeo2.position.x = 60;
    cubeGeo2.position.z = 20;
    scene.add(cubeGeo2);

    new GLTFLoader().load('/models/TEXT/garden.glb', (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 8, 0);
        model.scale.set(0.15, 0.15, 0.15);
        scene.add(model);
    });

    new GLTFLoader().load('/models/garden_bounds.glb', (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 1, 0);
        model.scale.set(3, 3, 3);
        scene.add(model);
    });

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/models/thisiscool.hdr', (hdrTexture) => {
        hdrTexture.mapping = THREE.EquirectangularRefractionMapping;
        scene.background = hdrTexture;
        scene.environment = hdrTexture;
    });
}

function setupCharacter(scene, orbitControls, camera, keysPressed, keyDisplay) {
    new GLTFLoader().load('/models/tpp_character.glb', (gltf) => {
        const model = gltf.scene;
        model.traverse((object) => {
            if (object.isMesh) object.castShadow = true;
        });
        model.position.z = 10;
        model.position.x = -14;
        model.position.y = 0.8;
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
