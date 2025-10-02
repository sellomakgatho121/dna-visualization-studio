// Multi-strand DNA visualization generator
// Materials for different strands
const strandMaterials = [
    new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 100 }), // Green
    new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 100 }), // Blue
    new THREE.MeshPhongMaterial({ color: 0xff8000, shininess: 100 }), // Orange
    new THREE.MeshPhongMaterial({ color: 0x8000ff, shininess: 100 }), // Purple
    new THREE.MeshPhongMaterial({ color: 0xff0080, shininess: 100 }), // Pink
    new THREE.MeshPhongMaterial({ color: 0x80ff00, shininess: 100 }), // Lime
    new THREE.MeshPhongMaterial({ color: 0x0080ff, shininess: 100 }), // Cyan
    new THREE.MeshPhongMaterial({ color: 0xff8000, shininess: 100 }), // Orange
    new THREE.MeshPhongMaterial({ color: 0x8000ff, shininess: 100 }), // Purple
    new THREE.MeshPhongMaterial({ color: 0xff0080, shininess: 100 }), // Pink
    new THREE.MeshPhongMaterial({ color: 0x80ff00, shininess: 100 }), // Lime
    new THREE.MeshPhongMaterial({ color: 0x0080ff, shininess: 100 })  // Cyan
];

const basePairMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 100
});

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 55; // Adjusted for 7 strands

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
controls.minDistance = 35;
controls.maxDistance = 110;
controls.maxPolarAngle = Math.PI / 2;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create multi-strand DNA
function createMultiStrandDNA(strandCount) {
    const dnaGroup = new THREE.Group();
    const radius = 6; // Base radius
    const turns = 2;
    const segments = 100;

    // Calculate radius multiplier based on strand count for better visualization
    const radiusMultiplier = Math.max(1, strandCount / 4);

    for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * Math.PI * 2 * turns;
        const z = (i / segments - 0.5) * 25;

        // Create strands in a circular pattern
        for (let strand = 0; strand < strandCount; strand++) {
            const angle = t + (strand * 2 * Math.PI / strandCount);
            const x = Math.cos(angle) * radius * radiusMultiplier;
            const y = Math.sin(angle) * radius * radiusMultiplier;

            // Create backbone sphere
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.25, 12, 12),
                strandMaterials[strand % strandMaterials.length]
            );
            sphere.position.set(x, y, z);
            dnaGroup.add(sphere);

            // Add base pairs between adjacent strands (for visualization)
            if (i < segments && strand < strandCount - 1) {
                const nextStrand = (strand + 1) % strandCount;
                const nextAngle = t + (nextStrand * 2 * Math.PI / strandCount);
                const nextX = Math.cos(nextAngle) * radius * radiusMultiplier;
                const nextY = Math.sin(nextAngle) * radius * radiusMultiplier;

                // Base pair between adjacent strands
                const basePair = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.08, 0.08, radius * 0.5 * radiusMultiplier, 6, 1, true),
                    basePairMaterial
                );
                basePair.position.set((x + nextX) / 2, (y + nextY) / 2, z);
                basePair.lookAt(nextX, nextY, z);
                basePair.rotateX(Math.PI / 2);
                dnaGroup.add(basePair);
            }

            // Connect backbone spheres with cylinders
            if (i > 0) {
                // Find previous sphere for this strand
                const prevSphereIndex = i * strandCount - strandCount + strand;
                const prevSphere = dnaGroup.children[prevSphereIndex];

                if (prevSphere) {
                    const distance = sphere.position.distanceTo(prevSphere.position);
                    const cylinder = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.06, 0.06, distance, 6, 1, false),
                        strandMaterials[strand % strandMaterials.length]
                    );
                    cylinder.position.lerpVectors(prevSphere.position, sphere.position, 0.5);
                    cylinder.lookAt(sphere.position);
                    cylinder.rotateX(Math.PI / 2);
                    dnaGroup.add(cylinder);
                }
            }
        }
    }

    return dnaGroup;
}

// Create 7-strand DNA
const dna = createMultiStrandDNA(7);
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
