// 5-Strand DNA (Pentaplex) visualization
// Uses the same multi-strand generator as 4-strand but with strandCount = 5

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 45; // Adjusted for 5 strands

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#dna-canvas'),
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Orbital controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 25;
controls.maxDistance = 90;
controls.maxPolarAngle = Math.PI / 2;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create 5-strand DNA (Pentaplex)
const dna = createMultiStrandDNA(5);
scene.add(dna);

// Handle window resize
function handleResize() {
    const canvasContainer = document.getElementById('canvas-container');
    const rect = canvasContainer.getBoundingClientRect();
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height);
}

window.addEventListener('resize', handleResize);
handleResize(); // Initial sizing

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate DNA slowly
    dna.rotation.y += 0.002;

    // Required if controls.enableDamping is set to true
    controls.update();

    renderer.render(scene, camera);

    // Hide loading text when everything is rendered
    if (document.getElementById('loading')) {
        document.getElementById('loading').style.display = 'none';
    }
}

// Start animation
animate();
