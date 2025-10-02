// Multi-strand DNA visualization generator
const strandMaterials = [
    new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0xff8000, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0x8000ff, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0xff0080, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0x80ff00, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0x0080ff, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0xff8000, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0x8000ff, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0xff0080, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0x80ff00, shininess: 100 }),
    new THREE.MeshPhongMaterial({ color: 0x0080ff, shininess: 100 })
];

const basePairMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 100
});

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 70;

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#dna-canvas'),
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 50;
controls.maxDistance = 140;
controls.maxPolarAngle = Math.PI / 2;

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

function createMultiStrandDNA(strandCount) {
    const dnaGroup = new THREE.Group();
    const radius = 6;
    const turns = 2;
    const segments = 100;
    const radiusMultiplier = Math.max(1, strandCount / 4);

    for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * Math.PI * 2 * turns;
        const z = (i / segments - 0.5) * 25;

        for (let strand = 0; strand < strandCount; strand++) {
            const angle = t + (strand * 2 * Math.PI / strandCount);
            const x = Math.cos(angle) * radius * radiusMultiplier;
            const y = Math.sin(angle) * radius * radiusMultiplier;

            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.25, 12, 12),
                strandMaterials[strand % strandMaterials.length]
            );
            sphere.position.set(x, y, z);
            dnaGroup.add(sphere);

            if (i < segments && strand < strandCount - 1) {
                const nextStrand = (strand + 1) % strandCount;
                const nextAngle = t + (nextStrand * 2 * Math.PI / strandCount);
                const nextX = Math.cos(nextAngle) * radius * radiusMultiplier;
                const nextY = Math.sin(nextAngle) * radius * radiusMultiplier;

                const basePair = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.08, 0.08, radius * 0.5 * radiusMultiplier, 6, 1, true),
                    basePairMaterial
                );
                basePair.position.set((x + nextX) / 2, (y + nextY) / 2, z);
                basePair.lookAt(nextX, nextY, z);
                basePair.rotateX(Math.PI / 2);
                dnaGroup.add(basePair);
            }

            if (i > 0) {
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

const dna = createMultiStrandDNA(10);
scene.add(dna);

function handleResize() {
    const canvasContainer = document.getElementById('canvas-container');
    const rect = canvasContainer.getBoundingClientRect();
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(rect.width, rect.height);
}

window.addEventListener('resize', handleResize);
handleResize();

function animate() {
    requestAnimationFrame(animate);
    dna.rotation.y += 0.002;
    controls.update();
    renderer.render(scene, camera);
    if (document.getElementById('loading')) {
        document.getElementById('loading').style.display = 'none';
    }
}

animate();
