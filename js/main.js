// Materials
const phosphateMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    shininess: 100
});

const sugarMaterial = new THREE.MeshPhongMaterial({
    color: 0x0000ff,
    shininess: 100
});

const baseMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 100
});

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 30;

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
controls.minDistance = 15;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI / 2;

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Create DNA strand
function createDNA() {
    const dnaGroup = new THREE.Group();
    const radius = 5;
    const turns = 2;
    const segments = 100;

    // Create backbones and base pairs
    for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * Math.PI * 2 * turns;
        const x = Math.cos(t) * radius;
        const y = Math.sin(t) * radius;
        const z = (i / segments - 0.5) * 20;

        // First backbone (sugar-phosphate)
        const sphere1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            i % 2 === 0 ? sugarMaterial : phosphateMaterial
        );
        sphere1.position.set(x, y, z);
        dnaGroup.add(sphere1);

        // Second backbone (sugar-phosphate), opposite side
        const sphere2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            i % 2 === 0 ? phosphateMaterial : sugarMaterial
        );
        sphere2.position.set(-x, -y, z);
        dnaGroup.add(sphere2);

        // Base pairs
        if (i < segments) {
            const basePair = new THREE.Mesh(
                new THREE.CylinderGeometry(0.1, 0.1, radius * 1.8, 8, 1, true),
                baseMaterial
            );
            basePair.position.set(0, 0, z);
            basePair.lookAt(x, y, z);
            basePair.rotateX(Math.PI / 2);
            dnaGroup.add(basePair);
        }

        // Connect backbone spheres with cylinders
        if (i > 0) {
            // First backbone connection
            const prevPos1 = dnaGroup.children[dnaGroup.children.length - 4]?.position;
            if (prevPos1) {
                const distance1 = sphere1.position.distanceTo(prevPos1);
                const cylinder1 = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.1, 0.1, distance1, 8, 1, false),
                    i % 2 === 0 ? sugarMaterial : phosphateMaterial
                );
                cylinder1.position.lerpVectors(prevPos1, sphere1.position, 0.5);
                cylinder1.lookAt(sphere1.position);
                cylinder1.rotateX(Math.PI / 2);
                dnaGroup.add(cylinder1);
            }

            // Second backbone connection
            const prevPos2 = dnaGroup.children[dnaGroup.children.length - 4]?.position;
            if (prevPos2) {
                const distance2 = sphere2.position.distanceTo(prevPos2);
                const cylinder2 = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.1, 0.1, distance2, 8, 1, false),
                    i % 2 === 0 ? phosphateMaterial : sugarMaterial
                );
                cylinder2.position.lerpVectors(prevPos2, sphere2.position, 0.5);
                cylinder2.lookAt(sphere2.position);
                cylinder2.rotateX(Math.PI / 2);
                dnaGroup.add(cylinder2);
            }
        }
    }

    return dnaGroup;
}

// Create and add DNA to scene
const dna = createDNA();
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
