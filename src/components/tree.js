import * as THREE from 'three';


// Reusable materials and geometries for optimization
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // Brown color
const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 32);

const branchMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 }); // Green color
const branchGeometry = new THREE.SphereGeometry(1.5, 32, 32);



// Function to create a tree
export function createTree(positionX = 0, positionZ = 0) {
    const treeGroup = new THREE.Group();

    // Create the trunk
    const treeBase = new THREE.Mesh(trunkGeometry, trunkMaterial);
    treeBase.position.y = 2;
    treeGroup.add(treeBase);

    // Create branches
    const branch1 = new THREE.Mesh(branchGeometry, branchMaterial);
    branch1.position.set(0, 5, 0);
    treeGroup.add(branch1);

    const branch2 = new THREE.Mesh(branchGeometry, branchMaterial);
    branch2.position.set(-1.5, 4.5, 1.5);
    treeGroup.add(branch2);

    const branch3 = new THREE.Mesh(branchGeometry, branchMaterial);
    branch3.position.set(1.5, 4.5, -1.5);
    treeGroup.add(branch3);

    // Set tree group position
    treeGroup.position.set(positionX, 0, positionZ);

    return treeGroup;
}