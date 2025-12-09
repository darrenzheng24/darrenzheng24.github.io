import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xEEEEEE);

// Create a camera
const camera = new THREE.PerspectiveCamera(20,  window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('threejs-container-hello').appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

let animationFrameId;

const animate = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
};

const startAnimation = () => {
    if (!animationFrameId) {
        animate();
    }
};

const stopAnimation = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
};

// Start animation initially
startAnimation();

// Add hover event listeners to pause and resume animation
const container = document.getElementById('threejs-container-hello');
container.addEventListener('mouseenter', stopAnimation);
container.addEventListener('mouseleave', startAnimation);