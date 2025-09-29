// Materials for triple helix
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

const thirdStrandMaterial = new THREE.MeshPhongMaterial({
    color: 0xff8000, // Orange for third strand
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

// Create Triple Helix DNA
function createDNA() {
    const dnaGroup = new THREE.Group();
    const radius = 5;
    const turns = 2;
    const segments = 100;

    // Create three strands at 120-degree intervals
    for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * Math.PI * 2 * turns;
        const z = (i / segments - 0.5) * 20;

        // Strand 1 (Green - Phosphate/Sugar alternating)
        const angle1 = t;
        const x1 = Math.cos(angle1) * radius;
        const y1 = Math.sin(angle1) * radius;

        const strand1Sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            i % 2 === 0 ? sugarMaterial : phosphateMaterial
        );
        strand1Sphere.position.set(x1, y1, z);
        dnaGroup.add(strand1Sphere);

        // Strand 2 (Blue - Phosphate/Sugar alternating)
        const angle2 = t + (2 * Math.PI / 3); // 120 degrees
        const x2 = Math.cos(angle2) * radius;
        const y2 = Math.sin(angle2) * radius;

        const strand2Sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16),
            i % 2 === 0 ? phosphateMaterial : sugarMaterial
        );
        strand2Sphere.position.set(x2, y2, z);
        dnaGroup.add(strand2Sphere);

        // Strand 3 (Orange - Third strand in major groove)
        const angle3 = t + (4 * Math.PI / 3); // 240 degrees
        const x3 = Math.cos(angle3) * (radius * 1.3); // Slightly larger radius for major groove
        const y3 = Math.sin(angle3) * (radius * 1.3);

        const strand3Sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 12, 12), // Slightly smaller
            thirdStrandMaterial
        );
        strand3Sphere.position.set(x3, y3, z);
        dnaGroup.add(strand3Sphere);

        // Watson-Crick base pairs (between strand 1 and 2)
        if (i < segments) {
            // Base pair between strand 1 and 2
            const basePair12 = new THREE.Mesh(
                new THREE.CylinderGeometry(0.1, 0.1, radius * 1.6, 8, 1, true),
                baseMaterial
            );
            basePair12.position.set((x1 + x2) / 2, (y1 + y2) / 2, z);
            basePair12.lookAt(x1, y1, z);
            basePair12.rotateX(Math.PI / 2);
            dnaGroup.add(basePair12);

            // Hoogsteen base pairs (between strand 3 and the duplex)
            const basePair3 = new THREE.Mesh(
                new THREE.CylinderGeometry(0.08, 0.08, radius * 0.8, 6, 1, true),
                new THREE.MeshPhongMaterial({
                    color: 0xffa500, // Orange-tinted for Hoogsteen pairs
                    shininess: 100
                })
            );
            // Position between strand 3 and the center of strands 1&2
            const centerX = (x1 + x2) / 2;
            const centerY = (y1 + y2) / 2;
            const dirX = x3 - centerX;
            const dirY = y3 - centerY;
            const distance = Math.sqrt(dirX * dirX + dirY * dirY);
            basePair3.position.set(centerX + dirX * 0.4, centerY + dirY * 0.4, z);
            basePair3.lookAt(x3, y3, z);
            basePair3.rotateX(Math.PI / 2);
            dnaGroup.add(basePair3);
        }

        // Connect backbone spheres with cylinders
        if (i > 0) {
            // Get previous positions (need to find them in the children array)
            const prevIndex = dnaGroup.children.length - 4; // Previous set of 3 spheres + 2 base pairs
            if (prevIndex >= 0) {
                const prevStrand1 = dnaGroup.children[prevIndex - 2]; // Adjust indices based on object order
                const prevStrand2 = dnaGroup.children[prevStrand1 ? prevIndex - 1 : prevIndex];
                const prevStrand3 = dnaGroup.children[prevStrand2 ? prevIndex : prevIndex + 1];

                if (prevStrand1 && prevStrand2 && prevStrand3) {
                    // Connect strand 1
                    const distance1 = strand1Sphere.position.distanceTo(prevStrand1.position);
                    const cylinder1 = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.1, 0.1, distance1, 8, 1, false),
                        i % 2 === 0 ? sugarMaterial : phosphateMaterial
                    );
                    cylinder1.position.lerpVectors(prevStrand1.position, strand1Sphere.position, 0.5);
                    cylinder1.lookAt(strand1Sphere.position);
                    cylinder1.rotateX(Math.PI / 2);
                    dnaGroup.add(cylinder1);

                    // Connect strand 2
                    const distance2 = strand2Sphere.position.distanceTo(prevStrand2.position);
                    const cylinder2 = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.1, 0.1, distance2, 8, 1, false),
                        i % 2 === 0 ? phosphateMaterial : sugarMaterial
                    );
                    cylinder2.position.lerpVectors(prevStrand2.position, strand2Sphere.position, 0.5);
                    cylinder2.lookAt(strand2Sphere.position);
                    cylinder2.rotateX(Math.PI / 2);
                    dnaGroup.add(cylinder2);

                    // Connect strand 3
                    const distance3 = strand3Sphere.position.distanceTo(prevStrand3.position);
                    const cylinder3 = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.08, 0.08, distance3, 6, 1, false),
                        thirdStrandMaterial
                    );
                    cylinder3.position.lerpVectors(prevStrand3.position, strand3Sphere.position, 0.5);
                    cylinder3.lookAt(strand3Sphere.position);
                    cylinder3.rotateX(Math.PI / 2);
                    dnaGroup.add(cylinder3);
                }
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
