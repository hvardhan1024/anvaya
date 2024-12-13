import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { A, D, DIRECTIONS, S, W } from './utils';

export class CharacterControls {

    constructor(model, mixer, animationsMap, orbitControl, camera, currentAction) {
        this.model = model;
        this.mixer = mixer;
        this.animationsMap = animationsMap;
        this.currentAction = currentAction;
        this.toggleRun = true; // Default value for toggleRun
        this.walkDirection = new THREE.Vector3();
        this.rotateAngle = new THREE.Vector3(0, 1, 0);
        this.rotateQuarternion = new THREE.Quaternion();
        this.cameraTarget = new THREE.Vector3();
        this.fadeDuration = 0.2; // Default fade duration
        this.runVelocity = 16; // Run speed
        this.walkVelocity = 3.4; // Walk speed

        // Set up animations
        this.animationsMap.forEach((value, key) => {
            if (key === currentAction) {
                value.play();
            }
        });

        // Set up orbit controls and camera
        this.orbitControl = orbitControl;
        this.camera = camera;

        // Update the camera target to initial position
        this.updateCameraTarget(0, 0);
    }

    // Toggle between running and walking
    switchRunToggle() {
        this.toggleRun = !this.toggleRun;
    }

    // Update method for movement and animation
    update(delta, keysPressed) {
        const directionPressed = DIRECTIONS.some(key => keysPressed[key] === true);
        let play = '';

        if (directionPressed && this.toggleRun) {
            play = 'Run';
        } else if (directionPressed) {
            play = 'Walk';
        } else {
            play = 'Idle';
        }

        if (this.currentAction !== play) {
            const toPlay = this.animationsMap.get(play);
            const current = this.animationsMap.get(this.currentAction);

            // Transition between animations
            current.fadeOut(this.fadeDuration);
            toPlay.reset().fadeIn(this.fadeDuration).play();
            // console.log([...this.animationsMap.keys()]);

            this.currentAction = play;
        }

        this.mixer.update(delta);

        if (this.currentAction === 'Run' || this.currentAction === 'Walk') {
            // Calculate direction towards camera
            const angleYCameraDirection = Math.atan2(
                (this.camera.position.x - this.model.position.x),
                (this.camera.position.z - this.model.position.z)
            );

            // Direction offset for diagonal movement
            const directionOffset = this.directionOffset(keysPressed);

            // Rotate model to face the direction
            this.rotateQuarternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirection + directionOffset);
            this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2);

            // Calculate movement direction
            this.camera.getWorldDirection(this.walkDirection);
            this.walkDirection.y = 0;
            this.walkDirection.normalize();
            this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

            // Set velocity based on running or walking
            const velocity = this.currentAction === 'Run' ? this.runVelocity : this.walkVelocity;

            // Move model & camera
            const moveX = this.walkDirection.x * velocity * delta;
            const moveZ = this.walkDirection.z * velocity * delta;
            this.model.position.x += moveX;
            this.model.position.z += moveZ;
            this.updateCameraTarget(moveX, moveZ);
        }
    }

    // Update camera position based on the model's movement
    updateCameraTarget(moveX, moveZ) {
        this.camera.position.x += moveX;
        this.camera.position.z += moveZ;

        this.cameraTarget.x = this.model.position.x;
        this.cameraTarget.y = this.model.position.y + 1;
        this.cameraTarget.z = this.model.position.z;
        this.orbitControl.target = this.cameraTarget;
    }

    // Determine the movement direction offset based on key presses
    directionOffset(keysPressed) {
        let directionOffset = 0; // default to 'w'

        if (keysPressed[W]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4; // 'w+a'
            } else if (keysPressed[D]) {
                directionOffset = -Math.PI / 4; // 'w+d'
            }
        } else if (keysPressed[S]) {
            if (keysPressed[A]) {
                directionOffset = Math.PI / 4 + Math.PI / 2; // 's+a'
            } else if (keysPressed[D]) {
                directionOffset = -Math.PI / 4 - Math.PI / 2; // 's+d'
            } else {
                directionOffset = Math.PI; // 's'
            }
        } else if (keysPressed[A]) {
            directionOffset = Math.PI / 2; // 'a'
        } else if (keysPressed[D]) {
            directionOffset = -Math.PI / 2; // 'd'
        }

        return directionOffset;
    }
}