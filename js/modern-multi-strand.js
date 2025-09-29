// Universal Multi-Strand DNA Visualization
// Works for 2-12 strand DNA structures

let scene, camera, renderer, controls, dnaGroup;
let isRotating = true;
let animationId;

// Get strand count from global variable (set in HTML)
const strandCount = typeof STRAND_COUNT !== 'undefined' ? STRAND_COUNT : 2;

// Color palette for different strands
const colors = [
    0x00ff00, // Green
    0x0000ff, // Blue
    0xff8000, // Orange
    0x8000ff, // Purple
    0xff0080, // Pink
    0x80ff00, // Lime
    0x0080ff, // Cyan
    0xff00ff, // Magenta
    0x00ffff, // Aqua
    0xffff00, // Yellow
    0xff4444, // Red
    0x44ff44  // Light Green
];

// Create materials for strands
function createStrandMaterials() {
    const materials = [];
    for (let i = 0; i < strandCount; i++) {
        const color = colors[i % colors.length];
        const emissive = (color >> 4) & 0x0f0f0f; // Darker version
        materials.push(
            new THREE.MeshPhongMaterial({
                color: color,
                shininess: 100,
                emissive: emissive,
                emissiveIntensity: 0.2
            })
        );
    }
    return materials;
}

const strandMaterials = createStrandMaterials();

const basePairMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    shininess: 100,
    emissive: 0x330000,
    transparent: true,
    opacity: 0.8
});

// Calculate radius based on strand count
function calculateRadius(count) {
    const baseRadius = 5;
    return baseRadius * Math.max(1, Math.sqrt(count / 2));
}

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
    
    // Adjust camera distance based on strand count
    const cameraDistance = 30 + (strandCount * 2);
    camera.position.set(0, 0, cameraDistance);

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
    controls.maxDistance = 150;
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

    // Add point lights based on strand count
    const lightCount = Math.min(strandCount, 4);
    for (let i = 0; i < lightCount; i++) {
        const angle = (i / lightCount) * Math.PI * 2;
        const distance = 15;
        const pointLight = new THREE.PointLight(colors[i % colors.length], 0.4, 60);
        pointLight.position.set(
            Math.cos(angle) * distance,
            Math.sin(angle) * distance,
            10
        );
        scene.add(pointLight);
    }

    // Create DNA structure
    createMultiStrandDNA();

    // Hide loading indicator
    document.getElementById('loading').style.display = 'none';

    // Event listeners
    setupEventListeners();

    // Start animation
    animate();
}

// Create multi-strand DNA structure
function createMultiStrandDNA() {
    dnaGroup = new THREE.Group();
    
    const radius = calculateRadius(strandCount);
    const height = 40;
    const turns = 3;
    const segments = 150;
    
    // Create strands
    for (let strand = 0; strand < strandCount; strand++) {
        createStrand(strand, radius, height, turns, segments);
    }
    
    // Create connections
    if (strandCount <= 4) {
        createBasePairs(radius, height, turns);
    } else {
        createRadialConnections(radius, height, segments);
    }
    
    scene.add(dnaGroup);
}

// Create individual strand
function createStrand(strandIndex, radius, height, turns, segments) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const angleOffset = (strandIndex * 2 * Math.PI) / strandCount;
    
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * turns * Math.PI * 2 + angleOffset;
        const y = (t - 0.5) * height;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        positions.push(x, y, z);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    // Create line for strand backbone
    const line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
            color: strandMaterials[strandIndex].color,
            linewidth: 2
        })
    );
    dnaGroup.add(line);
    
    // Add spheres along the strand
    const sphereInterval = strandCount > 6 ? 4 : 3;
    for (let i = 0; i <= segments; i += sphereInterval) {
        const t = i / segments;
        const angle = t * turns * Math.PI * 2 + angleOffset;
        const y = (t - 0.5) * height;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const sphereSize = strandCount > 8 ? 0.3 : 0.4;
        const sphereGeometry = new THREE.SphereGeometry(sphereSize, 16, 16);
        const sphere = new THREE.Mesh(sphereGeometry, strandMaterials[strandIndex]);
        sphere.position.set(x, y, z);
        sphere.castShadow = true;
        dnaGroup.add(sphere);
    }
}

// Create base pairs for 2-4 strands
function createBasePairs(radius, height, turns) {
    const basePairsPerTurn = 10;
    const totalBasePairs = turns * basePairsPerTurn;
    
    for (let i = 0; i < totalBasePairs; i++) {
        const t = i / totalBasePairs;
        const angle = t * turns * Math.PI * 2;
        const y = (t - 0.5) * height;
        
        // Connect opposite or adjacent strands
        for (let s = 0; s < Math.floor(strandCount / 2); s++) {
            const angle1 = angle + (s * 2 * Math.PI) / strandCount;
            const angle2 = angle1 + Math.PI;
            
            const x1 = Math.cos(angle1) * radius;
            const z1 = Math.sin(angle1) * radius;
            const x2 = Math.cos(angle2) * radius;
            const z2 = Math.sin(angle2) * radius;
            
            const distance = Math.sqrt(
                Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2)
            );
            
            const basePairGeometry = new THREE.CylinderGeometry(0.15, 0.15, distance, 8);
            const basePair = new THREE.Mesh(basePairGeometry, basePairMaterial);
            
            basePair.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
            basePair.rotation.z = Math.PI / 2;
            basePair.rotation.y = angle1;
            basePair.castShadow = true;
            
            dnaGroup.add(basePair);
        }
    }
}

// Create radial connections for 5+ strands
function createRadialConnections(radius, height, segments) {
    const connectionInterval = strandCount > 8 ? 8 : 6;
    const turns = 3;
    
    for (let i = 0; i <= segments; i += connectionInterval) {
        const t = i / segments;
        const y = (t - 0.5) * height;
        
        // Create connections from center to each strand
        for (let strand = 0; strand < strandCount; strand++) {
            const angleOffset = (strand * 2 * Math.PI) / strandCount;
            const angle = t * turns * Math.PI * 2 + angleOffset;
            
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const connectionGeometry = new THREE.CylinderGeometry(0.08, 0.08, radius, 6);
            const connection = new THREE.Mesh(connectionGeometry, basePairMaterial);
            
            connection.position.set(x / 2, y, z / 2);
            connection.rotation.z = Math.PI / 2 - angle;
            connection.rotation.x = Math.PI / 2;
            
            dnaGroup.add(connection);
        }
        
        // Add central sphere
        const centralSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 12, 12),
            basePairMaterial
        );
        centralSphere.position.set(0, y, 0);
        dnaGroup.add(centralSphere);
    }
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
            const cameraDistance = 30 + (strandCount * 2);
            camera.position.set(0, 0, cameraDistance);
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
