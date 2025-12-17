import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xEEEEEE);

// Create a camera
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Update camera based on aspect ratio
const updateCameraForAspect = () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    
    if (aspect < 1) {
        // Portrait mode: zoom out to keep cube visible
        camera.fov = 35;
        camera.position.z = 10;
    } else {
        // Landscape mode: default settings
        camera.fov = 20;
        camera.position.z = 5;
    }
    
    camera.updateProjectionMatrix();
};

// Apply initial aspect ratio settings
updateCameraForAspect();

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

// Handle window resize
const onWindowResize = () => {
    updateCameraForAspect();
    renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener('resize', onWindowResize);

// Start animation initially
startAnimation();

// Add hover event listeners to pause and resume animation
const container = document.getElementById('threejs-container-hello');
container.addEventListener('mouseenter', stopAnimation);
container.addEventListener('mouseleave', startAnimation);