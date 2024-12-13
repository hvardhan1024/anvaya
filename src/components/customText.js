import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let fontPromise = null;

// Function to load the font with a promise
function loadFont(url) {
  const fontLoader = new FontLoader();
  return new Promise((resolve, reject) => {
    fontLoader.load(
      url,
      (font) => resolve(font),
      undefined,
      (error) => reject(error)
    );
  });
}

// Initialize the font loading process
async function ensureFontLoaded() {
  if (!fontPromise) {
    fontPromise = loadFont('/fonts/helvetiker_regular.typeface.json');
  }
  return fontPromise;
}

// Function to create 3D text
export async function create3DText(scene, text, x, y, z, size = 1) {
  try {
    const font = await ensureFontLoaded(); // Wait for the font to load

    const textGeometry = new TextGeometry(text, {
      font: font,
      size: size,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 3,
    });

    textGeometry.computeBoundingBox();
    textGeometry.center(); // Center the text geometry

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Set position
    textMesh.position.set(x, y, z);

    // Add to the scene
    scene.add(textMesh);
  } catch (error) {
    console.error("Error creating 3D text:", error);
  }
}
