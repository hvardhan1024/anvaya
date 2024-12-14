import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CharacterControls } from "../components/characterControls"; // Adjust path if needed
import { KeyDisplay, W, A, S, D, SHIFT } from "../components/utils"; // Import KeyDisplay and controls
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { createTree } from "../components/tree";

document.getElementById("info-card2").style.display = 'none'

let camera; // Declare camera variable globally

// Raycaster and mouse vector initialization
const raycaster = new THREE.Raycaster();
let objectsToIntersect = [];
let currentIntersect = null;
const mouse = new THREE.Vector2(); // Store mouse coordinates

export function createGardenScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa8def0);

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  ); // Use global camera
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
  addHomeopathy(scene);
  addYoga(scene);

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

  window.addEventListener("resize", onWindowResize);

  // Mouse click event listener for raycasting
  window.addEventListener(
    "click",
    (event) => onMouseClick(event, scene),
    false
  ); // Pass scene here

  animate();

  return {
    scene,
    renderer,
    camera,
    cleanup: () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("click", onMouseClick);
    },
  };
}

function onMouseClick(event, scene) {
  // Accept scene as a parameter
  // Ensure camera is defined
  if (!camera) {
    console.error("Camera is not defined!");
    return;
  }

  // Convert mouse coordinates to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and mouse coordinates
  raycaster.setFromCamera(mouse, camera); // Correct usage

  // Cast the ray and check for intersections
  const intersects = raycaster.intersectObject(scene, true);

  if (intersects.length > 0) {
    const intersect = intersects[0];
    const point = intersect.point; // The coordinates of the intersection point

    // Log the intersection coordinates
    console.log("Mouse clicked at:", point);
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
  new GLTFLoader().load("/models/yoga/yoga_character.glb", (gltf) => {
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
      const animationClip = animations.find(
        (animation) => animation.name === "surya namaskara"
      );
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

function addHomeopathy(scene) {
  const coordinates = [
    // [-25.067827896408208, 1.402312182167159, -18.7675033915934],
    [-26.66578360884982, 1.402312173776966, -19.55693341172318, "akarakara"],
    // [-28.26307570625974, 1.4023121846806457, -20.06017810892425],
    [-29.77896268927036, 1.4023121800071645, -20.760372957668835, "aloe vera"],
    // [-31.17467401434882, 1.4023121713052515, -21.470244383414368],
    [
      -32.58947987740616,
      1.4023121696168332,
      -23.42104789446237,
      "alpinia calcarata",
    ],
    // [-32.038537931713265, 1.4023121717434845, -24.839853042136802],
    [-31.54445714040098, 1.402312173163259, -26.094667783151117, "arive dantu"],
    // [-30.98514114825248, 1.402312172731669, -27.441706088119663],
    [
      -30.464542747332636,
      1.4023121762899584,
      -28.83816781751784,
      "mexican poppy",
    ],
    // [-28.073499184592702, 1.4023121720590537, -29.37333396403401],
    [-26.53510342235665, 1.4023121652141883, -28.631594205183667, "fenugreek"],
    // [-24.943663146562958, 1.4023121711721935, -28.057497553869645],
    [-23.507851044665266, 1.4023121722764325, -27.476249929543354, "kalmegh"],
    // [-21.702887628555352, 1.4023121853766707, -26.91911930295456],
  ];
  for (let index = 0; index < coordinates.length; index++) {
    new GLTFLoader().load(
      `/models/plants/${coordinates[index][3]}.glb`,
      (gltf) => {
        const model = gltf.scene;

        // Set the model's original name in a custom property
        model.originalName = coordinates[index][3]; // Store the original name

        model.name = coordinates[index][3]; // Set the name for other logic if needed
        objectsToIntersect.push(model); // Add the model to objectsToIntersect
        model.position.set(
          coordinates[index][0],
          coordinates[index][1],
          coordinates[index][2]
        );
        model.scale.set(0.5, 0.5, 0.5);
        scene.add(model); // Add model to the scene

        console.log("Original Name (Stored):", model.originalName); // Just for debugging
      }
    );
  }
}

function addPlants(scene) {
  const coordinates = [
    [-10.5, 1.4, -11.2, "arjuna"],
    // [-13, 1.4, -12.99, "bael"],
    [-8.59, 1.4, -14.88, "bael"],
    // [-11, 1.4, -16.54, "calendula"],
    [-6.97, 1.4, -18.7, "brahmi"],
    // [0.66, 1.4, -15.72, "roxburgh"],
    [2.31, 1.4, -14.89, "calendula"],
    // [3.99, 1.4, -14.54, "roxburgh"],
    [5.82, 1.4, -13.57, "clove"],
    // [11.82, 1.4, -10.59, "roxburgh"],
    [9.54, 1.4, -5.23, "fenugreek"],
    // [10.46, 1.4, -6.88, "roxburgh"],
    [11, 1.4, -8.65, "roxburgh"],
    // [8.91, 1.4, -3.35, "roxburgh"],
    // [7.59, 1.4, -12.75, "roxburgh"],
    // [11.22, 1.4, -8.72, "roxburgh"]
  ];

  for (let index = 0; index < coordinates.length; index++) {
    new GLTFLoader().load(
      `/models/plants/${coordinates[index][3] || "roxburgh"}.glb`,
      (gltf) => {
        const model = gltf.scene;

        // Set the model's original name in a custom property
        model.originalName = coordinates[index][3]; // Store the original name

        model.name = coordinates[index][3]; // Set the name for other logic if needed
        objectsToIntersect.push(model); // Add the model to objectsToIntersect
        model.position.set(
          coordinates[index][0],
          coordinates[index][1],
          coordinates[index][2]
        );
        model.scale.set(0.5, 0.5, 0.5);
        scene.add(model); // Add model to the scene

        console.log("Original Name (Stored):", model.originalName); // Just for debugging
      }
    );
  }
}

function loadGround(scene) {
  new GLTFLoader().load("/models/garden-final.glb", (gltf) => {
    const model = gltf.scene;
    model.position.set(0, 1, 0);
    model.scale.set(3, 3, 3);
    scene.add(model);
  });

  new GLTFLoader().load("/models/garden_bounds.glb", (gltf) => {
    const model = gltf.scene;
    model.position.set(0, 1, 0);
    model.scale.set(3, 3, 3);

    // model.traverse((child) => {
    //     if (child.isMesh) {
    //         child.material.transparent = true;
    //         child.material.opacity = 0;
    //     }
    // });
  });

  const rgbeLoader = new RGBELoader();
  rgbeLoader.load("/models/envmap.hdr", (hdrTexture) => {
    hdrTexture.mapping = THREE.EquirectangularRefractionMapping;
    scene.background = hdrTexture;
    scene.environment = hdrTexture;
  });
}

function setupCharacter(scene, orbitControls, camera, keysPressed, keyDisplay) {
  new GLTFLoader().load("/models/tpp_character.glb", (gltf) => {
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
      .filter((a) => a.name !== "TPose")
      .forEach((a) => animationsMap.set(a.name, mixer.clipAction(a)));

    const characterControls = new CharacterControls(
      model,
      mixer,
      animationsMap,
      orbitControls,
      camera,
      "Idle"
    );

    document.addEventListener("keydown", (event) => {
      if (event.shiftKey) {
        characterControls.switchRunToggle();
      } else {
        const key = event.key.toLowerCase();
        keysPressed[key] = true;
        keyDisplay.down(key);
      }
    });

    document.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      keysPressed[key] = false;
      keyDisplay.up(key);
    });

    const clock = new THREE.Clock();
    function updateCharacter() {
      // Get all the objects intersected by the ray
      const intersects = raycaster.intersectObjects(objectsToIntersect, true);

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const point = intersect.point; // The coordinates of the intersection point

        // Log the intersection coordinates and the name of the object
        console.log("Mouse clicked at:", point);
        // console.log("Intersected object name:", intersect.object.originalName);
        console.log("Intersected object name:", intersect.object.name);

        let mappedValue = null;
        switch (intersect.object.name) {
          case "Plane038_2":
            mappedValue = "arjuna";
            break;
          case "Plane046_2":
            mappedValue = "bael";
            break;
          case "Plane041_1":
            mappedValue = "brahmi";
            break;
          case "Plane043_1":
            mappedValue = "calendula";
            break;
          case "Plane053_2":
            mappedValue = "clove";
            break;
          case "Plane006_3":
            mappedValue = "roxburgh fig";
            break;
          case "Plane061_1":
            mappedValue = "fenugreek";
            break;
          case "Plane066_2":
            mappedValue = "akarakara";
            break;
          case "Plane078_1":
            mappedValue = "aloe vera";
            break;
          case "Plane079_1":
            mappedValue = "alpinia calcarata";
            break;
          case "Plane092_1":
            mappedValue = "arive dantu";
            break;
          case "Plane068":
            mappedValue = "mexican poppy";
            break;
          case "Plane094":
            mappedValue = "kalmegh";
            break;
          default:
            mappedValue = "Unknown";
            break;
        }
        displayInfo(mappedValue)

      }

      const delta = clock.getDelta();
      characterControls.update(delta, keysPressed);
      requestAnimationFrame(updateCharacter);
    }
    updateCharacter();
  });
}


const plant_data = {
    "arjuna": {
        "scientificName": "Terminalia arjuna",
        "description": "A large deciduous tree known for its bark's medicinal properties, revered in Ayurveda for heart health.",
        "category": "Ayurveda",
        "medicalUsesAndBenefits": "Treats heart conditions, hypertension, and cholesterol. Antioxidant properties support overall cardiovascular health."
    },
    "brahmi": {
        "scientificName": "Bacopa monnieri",
        "description": "A creeping herb traditionally used to boost memory and cognitive function.",
        "category": "Ayurveda",
        "medicalUsesAndBenefits": "Enhances memory, reduces anxiety, and improves brain function. Effective in managing Alzheimer’s and epilepsy."
    },
    "roxburgh fig": {
        "scientificName": "Ficus auriculata",
        "description": "A tropical fig tree with edible fruits, rich in medicinal uses.",
        "category": "Ayurveda",
        "medicalUsesAndBenefits": "Improves digestive health, treats ulcers, and aids in diabetes management."
    },
    "calendula": {
        "scientificName": "Calendula officinalis",
        "description": "A vibrant flower known for its healing and anti-inflammatory properties.",
        "category": "Naturopathy",
        "medicalUsesAndBenefits": "Promotes wound healing, treats skin conditions, and reduces inflammation."
    },
    "bael": {
        "scientificName": "Aegle marmelos",
        "description": "A sacred tree in India with fruits and leaves used in traditional medicine.",
        "category": "Ayurveda",
        "medicalUsesAndBenefits": "Treats diarrhea, constipation, and digestive disorders. Strengthens the immune system."
    },
    "fenugreek": {
        "scientificName": "Trigonella foenum-graecum",
        "description": "An annual herb used in cooking and medicine for its seed and leaf benefits.",
        "category": "Ayurveda",
        "medicalUsesAndBenefits": "Controls blood sugar, boosts lactation in nursing mothers, and reduces inflammation."
    },
    "kalmegh": {
        "scientificName": "Andrographis paniculata",
        "description": "A bitter herb widely used in Ayurvedic and Unani systems for immunity and liver health.",
        "category": "Ayurveda and Unani",
        "medicalUsesAndBenefits": "Treats fever, strengthens the liver, and boosts immunity."
    },
    "mexican poppy": {
        "scientificName": "Argemone mexicana",
        "description": "A wildflower with distinct yellow flowers and spiky leaves, used traditionally for medicinal purposes.",
        "category": "Siddha",
        "medicalUsesAndBenefits": "Treats skin infections, improves digestion, and helps manage respiratory issues."
    },
    "aloe vera": {
        "scientificName": "Aloe barbadensis miller",
        "description": "A succulent plant known for its gel with multiple therapeutic uses.",
        "category": "Ayurveda, Naturopathy",
        "medicalUsesAndBenefits": "Soothes skin, promotes digestion, and boosts immunity."
    },
    "akarakara": {
        "scientificName": "Anacyclus pyrethrum",
        "description": "A perennial herb with roots used for medicinal purposes in traditional systems.",
        "category": "Ayurveda and Unani",
        "medicalUsesAndBenefits": "Acts as a natural aphrodisiac, improves oral health, and enhances cognitive function."
    },
    "alpinia calcarata": {
        "scientificName": "Alpinia calcarata",
        "description": "A perennial herb used in Ayurvedic medicine for its rhizomes.",
        "category": "Ayurveda",
        "medicalUsesAndBenefits": "Relieves respiratory conditions, improves digestion, and acts as an anti-inflammatory."
    },
    "arive dantu": {
        "scientificName": "Amaranthus viridis",
        "description": "A green leafy vegetable commonly used in Indian cooking and medicine.",
        "category": "Siddha and Ayurveda",
        "medicalUsesAndBenefits": "Boosts immunity, improves eye health, and provides essential nutrients."
    }
};

function displayInfo(name) {
    const infoClose2 = document.getElementById("info-close2");
    const infoCard2 = document.getElementById("info-card2");
    const plantName = document.querySelector('.plant-name');
    const scientificName = document.querySelector('.scientific-name');
    const description = document.querySelector('.description');
    const category = document.querySelector('.category');
    const medicalUsesAndBenefits = document.querySelector('.medicalUsesAndBenefits');

    // Toggle Info Card
    infoCard2.style.display = "block";

    // Populate the card with plant data
    plantName.innerHTML = name;
    // scientificName.innerHTML = plant_data[name]["scientificName"];
    description.innerHTML = plant_data[name]["description"];
    category.innerHTML = plant_data[name]["category"];
    medicalUsesAndBenefits.innerHTML = plant_data[name]["medicalUsesAndBenefits"];

    // Close button functionality
    infoClose2.addEventListener("click", () => {
        infoCard2.style.display = "none";
    });
}
