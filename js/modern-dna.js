// Modern DNA Visualization with Enhanced Controls and Liquid Glass Effects
let scene, camera, renderer, controls, dnaGroup;
let isRotating = true;
let animationId;
let particleSystem, particleGeometry, particleMaterial;
let time = 0;

// Enhanced strand materials with liquid-like properties
const strandMaterials = [
    new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        shininess: 200,
        emissive: 0x004400,
        transparent: true,
        opacity: 0.9,
        specular: 0x00ff00
    }),
    new THREE.MeshPhongMaterial({
        color: 0x0000ff,
        shininess: 200,
        emissive: 0x000044,
        transparent: true,
        opacity: 0.9,
        specular: 0x0000ff
    })
];

const basePairMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0066,
    shininess: 150,
    emissive: 0x440033,
    transparent: true,
    opacity: 0.8
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

    // Enhanced lighting setup with liquid-style effects
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Main directional light with dynamic intensity
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 10, 7.5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    // Fill light with color temperature variation
    const fillLight = new THREE.DirectionalLight(0x4CAF50, 0.4);
    fillLight.position.set(-5, -5, -5);
    scene.add(fillLight);

    // Back light for depth
    const backLight = new THREE.DirectionalLight(0x2196F3, 0.3);
    backLight.position.set(0, 5, -10);
    scene.add(backLight);

    // Dynamic point lights that pulse and move
    const pointLight1 = new THREE.PointLight(0x00ff88, 0.8, 60);
    pointLight1.position.set(15, 15, 15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0088ff, 0.8, 60);
    pointLight2.position.set(-15, -15, 15);
    scene.add(pointLight2);

    // Additional atmospheric lighting
    const hemiLight = new THREE.HemisphereLight(0x404040, 0x202020, 0.6);
    scene.add(hemiLight);

    // Create particle system for ambient atmosphere
    createParticleSystem();

    // Create DNA structure
    createDoubleHelix();

    // Hide loading indicator with fade effect
    const loadingEl = document.getElementById('loading');
    if (loadingEl) {
        loadingEl.style.opacity = '0';
        setTimeout(() => {
            loadingEl.style.display = 'none';
        }, 300);
    }

    // Event listeners
    setupEventListeners();

    // Start animation
    animate();
}

// Create enhanced double helix DNA structure with liquid effects
function createDoubleHelix() {
    dnaGroup = new THREE.Group();

    const radius = 5;
    const height = 40;
    const turns = 3;
    const segments = 150;
    const basePairsPerTurn = 10;

    // Create two strands with enhanced materials
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
            new THREE.LineBasicMaterial({
                color: strandMaterials[strand].color,
                linewidth: 3,
                transparent: true,
                opacity: 0.8
            })
        );
        dnaGroup.add(strandLine);

        // Add enhanced spheres along the strand with glow effect
        for (let i = 0; i <= segments; i += 3) {
            const t = i / segments;
            const angle = t * turns * Math.PI * 2 + strand * Math.PI;
            const y = (t - 0.5) * height;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            const sphereGeometry = new THREE.SphereGeometry(0.4, 20, 20);
            const sphere = new THREE.Mesh(sphereGeometry, strandMaterials[strand].clone());
            sphere.position.set(x, y, z);
            sphere.castShadow = true;
            sphere.receiveShadow = true;
            dnaGroup.add(sphere);

            // Add point light for each major node
            if (i % 15 === 0) {
                const nodeLight = new THREE.PointLight(strandMaterials[strand].color, 0.3, 10);
                nodeLight.position.set(x, y, z);
                dnaGroup.add(nodeLight);
            }
        }
    }

    // Create enhanced base pairs with better materials
    const totalBasePairs = turns * basePairsPerTurn;
    for (let i = 0; i < totalBasePairs; i++) {
        const t = i / totalBasePairs;
        const angle = t * turns * Math.PI * 2;
        const y = (t - 0.5) * height;

        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;

        const basePairGeometry = new THREE.CylinderGeometry(0.15, 0.15, radius * 2, 12);
        const basePair = new THREE.Mesh(basePairGeometry, basePairMaterial.clone());

        basePair.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
        basePair.rotation.z = Math.PI / 2;
        basePair.rotation.y = angle;
        basePair.castShadow = true;
        basePair.receiveShadow = true;

        dnaGroup.add(basePair);
    }

    scene.add(dnaGroup);
}

// Create particle system for ambient atmosphere
function createParticleSystem() {
    const particleCount = 200;
    particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Random positions in a large sphere around the DNA
        const radius = Math.random() * 80 + 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Color gradient from green to blue
        const colorIntensity = Math.random() * 0.5 + 0.5;
        colors[i3] = 0.2 * colorIntensity;     // R
        colors[i3 + 1] = 0.8 * colorIntensity; // G
        colors[i3 + 2] = 0.4 * colorIntensity; // B

        sizes[i] = Math.random() * 3 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 },
            pixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            uniform float time;
            void main() {
                float distance = length(gl_PointCoord - vec2(0.5));
                float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
                alpha *= (sin(time * 2.0 + gl_PointCoord.x * 10.0) * 0.5 + 0.5) * 0.8 + 0.2;
                gl_FragColor = vec4(vColor, alpha);
            }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
}

// Enhanced animation loop with liquid effects
function animate() {
    animationId = requestAnimationFrame(animate);
    time += 0.016; // Approximate 60fps delta time

    if (isRotating && dnaGroup) {
        dnaGroup.rotation.y += 0.005;
        // Add subtle floating motion to DNA strands
        dnaGroup.position.y = Math.sin(time * 0.5) * 0.5;
    }

    // Animate particle system
    if (particleSystem && particleMaterial) {
        particleMaterial.uniforms.time.value = time;
        // Subtle rotation of particle field
        particleSystem.rotation.y += 0.001;
        particleSystem.rotation.x += 0.0005;
    }

    // Animate point lights for dynamic lighting
    const pointLight1 = scene.getObjectByName('pointLight1') || scene.children.find(child => child instanceof THREE.PointLight && child.color.getHex() === 0x00ff88);
    const pointLight2 = scene.children.find(child => child instanceof THREE.PointLight && child.color.getHex() === 0x0088ff);

    if (pointLight1) {
        pointLight1.position.x = Math.cos(time * 0.5) * 20;
        pointLight1.position.z = Math.sin(time * 0.3) * 20;
        pointLight1.intensity = 0.8 + Math.sin(time * 2) * 0.2;
    }

    if (pointLight2) {
        pointLight2.position.x = Math.cos(time * 0.7) * 20;
        pointLight2.position.z = Math.sin(time * 0.4) * 20;
        pointLight2.intensity = 0.8 + Math.sin(time * 1.5) * 0.2;
    }

    // Animate main light for subtle color temperature changes
    if (mainLight) {
        const hue = (Math.sin(time * 0.1) * 0.1 + 0.5);
        mainLight.color.setHSL(hue, 0.8, 0.6);
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
