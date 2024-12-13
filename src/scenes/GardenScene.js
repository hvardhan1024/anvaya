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
