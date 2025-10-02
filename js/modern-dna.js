// Modern DNA Visualization with Enhanced Controls
let scene, camera, renderer, controls, dnaGroup;
let isRotating = true;
let animationId;

// Strand materials with vibrant colors
const strandMaterials = [
    new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 100, emissive: 0x003300 }),
    new THREE.MeshPhongMaterial({ color: 0x0000ff, shininess: 100, emissive: 0x000033 })
];

const basePairMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 100,
    emissive: 0x330000
});

// Initialize the scene
function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);

    // Camera setup
    const container = document.getElementById('canvas-container');
    camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 40);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('dna-canvas'),
        antialias: true,
        alpha: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 20;
    controls.maxDistance = 100;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.5;

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(5, 10, 7.5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x4CAF50, 0.3);
    fillLight.position.set(-5, -5, -5);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0x2196F3, 0.3);
    backLight.position.set(0, 5, -10);
    scene.add(backLight);

    // Add point lights for extra glow
    const pointLight1 = new THREE.PointLight(0x00ff00, 0.5, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0000ff, 0.5, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Create DNA structure
    createDoubleHelix();

    // Hide loading indicator
    document.getElementById('loading').style.display = 'none';

    // Event listeners
    setupEventListeners();

    // Start animation
    animate();
}

// Create double helix DNA structure
function createDoubleHelix() {
    dnaGroup = new THREE.Group();
    
    const radius = 5;
    const height = 40;
    const turns = 3;
    const segments = 150;
    const basePairsPerTurn = 10;

    // Create two strands
    for (let strand = 0; strand < 2; strand++) {
        const strandGeometry = new THREE.BufferGeometry();
        const positions = [];
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const angle = t * turns * Math.PI * 2 + strand * Math.PI;
            const y = (t - 0.5) * height;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            positions.push(x, y, z);
        }
        
        strandGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        const strandLine = new THREE.Line(
            strandGeometry,
            new THREE.LineBasicMaterial({ color: strandMaterials[strand].color, linewidth: 2 })
        );
        dnaGroup.add(strandLine);
        
        // Add spheres along the strand
        for (let i = 0; i <= segments; i += 3) {
            const t = i / segments;
            const angle = t * turns * Math.PI * 2 + strand * Math.PI;
            const y = (t - 0.5) * height;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const sphereGeometry = new THREE.SphereGeometry(0.4, 16, 16);
            const sphere = new THREE.Mesh(sphereGeometry, strandMaterials[strand]);
            sphere.position.set(x, y, z);
            sphere.castShadow = true;
            dnaGroup.add(sphere);
        }
    }
    
    // Create base pairs
    const totalBasePairs = turns * basePairsPerTurn;
    for (let i = 0; i < totalBasePairs; i++) {
        const t = i / totalBasePairs;
        const angle = t * turns * Math.PI * 2;
        const y = (t - 0.5) * height;
        
        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;
        
        const basePairGeometry = new THREE.CylinderGeometry(0.2, 0.2, radius * 2, 8);
        const basePair = new THREE.Mesh(basePairGeometry, basePairMaterial);
        
        basePair.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
        basePair.rotation.z = Math.PI / 2;
        basePair.rotation.y = angle;
        basePair.castShadow = true;
        
        dnaGroup.add(basePair);
    }
    
    scene.add(dnaGroup);
}

// Animation loop
function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (isRotating && dnaGroup) {
        dnaGroup.rotation.y += 0.005;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Setup event listeners
function setupEventListeners() {
    // Toggle rotation button
    const toggleBtn = document.getElementById('toggleRotation');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            isRotating = !isRotating;
            const svg = toggleBtn.querySelector('svg');
            if (isRotating) {
                toggleBtn.innerHTML = `
                    <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Pause
                `;
            } else {
                toggleBtn.innerHTML = `
                    <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Play
                `;
            }
        });
    }
    
    // Reset view button
    const resetBtn = document.getElementById('resetView');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            camera.position.set(0, 0, 40);
            controls.target.set(0, 0, 0);
            if (dnaGroup) {
                dnaGroup.rotation.set(0, 0, 0);
            }
            controls.update();
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
