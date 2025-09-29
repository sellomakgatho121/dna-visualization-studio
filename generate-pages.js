// Script to generate all modern DNA visualization pages
const fs = require('fs');
const path = require('path');

const strandConfigs = [
    { count: 2, name: 'Double Helix', subtitle: 'Classic two-strand DNA structure', color: 'green', file: 'modern-index.html' },
    { count: 3, name: 'Triple Helix', subtitle: 'Three-strand DNA structure', color: 'blue', file: 'modern-triple.html' },
    { count: 4, name: 'G-Quadruplex', subtitle: 'Four-strand DNA structure', color: 'orange', file: 'modern-4-strand.html' },
    { count: 5, name: 'Pentaplex', subtitle: 'Five-strand DNA structure', color: 'purple', file: 'modern-5-strand.html' },
    { count: 6, name: '6-Strand DNA', subtitle: 'Hexagonal pattern structure', color: 'pink', file: 'modern-6-strand.html' },
    { count: 7, name: '7-Strand DNA', subtitle: 'Heptagonal pattern structure', color: 'lime', file: 'modern-7-strand.html' },
    { count: 8, name: '8-Strand DNA', subtitle: 'Octagonal pattern structure', color: 'cyan', file: 'modern-8-strand.html' },
    { count: 9, name: '9-Strand DNA', subtitle: 'Nonagonal pattern structure', color: 'indigo', file: 'modern-9-strand.html' },
    { count: 10, name: '10-Strand DNA', subtitle: 'Decagonal pattern structure', color: 'yellow', file: 'modern-10-strand.html' },
    { count: 11, name: '11-Strand DNA', subtitle: 'Complex multi-strand structure', color: 'red', file: 'modern-11-strand.html' },
    { count: 12, name: '12-Strand DNA', subtitle: 'Dodecagonal pattern structure', color: 'emerald', file: 'modern-12-strand.html' }
];

const strandInfo = {
    2: { type: 'B-DNA', helixTurn: '10.5 bp', diameter: '~2 nm', description: 'The double helix is the most common DNA structure found in nature, consisting of two antiparallel strands wound around each other.' },
    3: { type: 'Triplex DNA', helixTurn: 'Variable', diameter: '~2.5 nm', description: 'Triple helix DNA forms when a third strand binds to the major groove of a double helix, creating unique structural properties.' },
    4: { type: 'Tetraplex', helixTurn: 'Stacked quartets', diameter: '~3 nm', description: 'G-quadruplexes are four-stranded structures formed by guanine-rich sequences, playing important roles in telomeres and gene regulation.' },
    5: { type: 'Pentaplex', helixTurn: 'Complex', diameter: '~3.5 nm', description: 'Pentaplex structures represent theoretical five-stranded DNA with potential applications in nanotechnology and molecular computing.' },
    6: { type: 'Hexaplex', helixTurn: 'Hexagonal', diameter: '~4 nm', description: '6-strand DNA structures form hexagonal patterns with applications in DNA nanotechnology and structural biology.' },
    7: { type: 'Heptaplex', helixTurn: 'Heptagonal', diameter: '~4.5 nm', description: '7-strand DNA creates heptagonal symmetry useful for building complex nanostructures.' },
    8: { type: 'Octaplex', helixTurn: 'Octagonal', diameter: '~5 nm', description: '8-strand DNA forms octagonal patterns with high structural stability for nanomaterial applications.' },
    9: { type: 'Nonaplex', helixTurn: 'Nonagonal', diameter: '~5.5 nm', description: '9-strand DNA structures exhibit nonagonal symmetry with unique geometric properties.' },
    10: { type: 'Decaplex', helixTurn: 'Decagonal', diameter: '~6 nm', description: '10-strand DNA creates decagonal patterns ideal for complex molecular architectures.' },
    11: { type: 'Complex', helixTurn: 'Multi-point', diameter: '~6.5 nm', description: '11-strand DNA represents highly complex multi-strand architectures with advanced structural properties.' },
    12: { type: 'Dodecaplex', helixTurn: 'Dodecagonal', diameter: '~7 nm', description: '12-strand DNA forms dodecagonal patterns with maximum symmetry for sophisticated nanostructures.' }
};

function generateSidebarNav(activeCount) {
    return strandConfigs.map(config => {
        const isActive = config.count === activeCount;
        const activeClass = isActive ? ' active' : '';
        
        return `                    <a href="${config.file}" class="sidebar-item${activeClass} flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white">
                        <span class="flex items-center justify-center w-8 h-8 rounded-full bg-${config.color}-500/20 text-${config.color}-500 font-bold">${config.count}</span>
                        <div class="flex-1">
                            <div class="font-semibold">${config.name}</div>
                            <div class="text-xs text-gray-400">${config.subtitle}</div>
                        </div>
                    </a>`;
    }).join('\n\n');
}

function generatePage(config) {
    const info = strandInfo[config.count];
    const sidebarNav = generateSidebarNav(config.count);
    
    return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.name} | DNA Visualization Studio</title>
    <link rel="stylesheet" href="css/modern.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * { font-family: 'Inter', sans-serif; }
        :root {
            --background: 222.2 84% 4.9%;
            --foreground: 210 40% 98%;
            --primary: 142 76% 36%;
            --secondary: 217.2 91.2% 59.8%;
            --muted: 217.2 32.6% 17.5%;
            --border: 217.2 32.6% 17.5%;
        }
        body {
            margin: 0;
            padding: 0;
            background: hsl(var(--background));
            color: hsl(var(--foreground));
            overflow: hidden;
        }
        .glass {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: hsl(var(--primary)); border-radius: 4px; }
        .sidebar-item { transition: all 0.2s ease; }
        .sidebar-item:hover { background: rgba(76, 175, 80, 0.1); border-left: 3px solid hsl(var(--primary)); }
        .sidebar-item.active { background: rgba(76, 175, 80, 0.2); border-left: 3px solid hsl(var(--primary)); }
        #canvas-container { position: relative; width: 100%; height: 100%; }
        .control-panel { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 10; }
    </style>
</head>
<body>
    <div class="flex h-screen w-screen">
        <!-- Sidebar Navigation -->
        <aside class="w-80 glass border-r border-white/10 flex flex-col">
            <div class="p-6 border-b border-white/10">
                <div class="flex items-center gap-3 mb-2">
                    <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                    </svg>
                    <div>
                        <h1 class="text-xl font-bold text-white">DNA Studio</h1>
                        <p class="text-xs text-gray-400">Multi-Strand Explorer</p>
                    </div>
                </div>
            </div>
            <nav class="flex-1 overflow-y-auto custom-scrollbar p-4">
                <div class="space-y-1">
${sidebarNav}
                </div>
            </nav>
            <div class="p-4 border-t border-white/10">
                <div class="flex items-center gap-2 text-xs text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Interactive 3D DNA Visualization</span>
                </div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <main class="flex-1 flex flex-col">
            <header class="glass border-b border-white/10 px-6 py-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-2xl font-bold text-white">${config.name}</h2>
                        <p class="text-sm text-gray-400">${config.subtitle}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <button id="toggleRotation" class="glass px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-all">
                            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Pause
                        </button>
                        <button id="resetView" class="glass px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/10 transition-all">
                            <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Reset
                        </button>
                    </div>
                </div>
            </header>

            <div class="flex-1 relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div id="canvas-container">
                    <canvas id="dna-canvas" class="w-full h-full"></canvas>
                    <div id="loading" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl">
                        <div class="flex flex-col items-center gap-4">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                            <span>Loading DNA Structure...</span>
                        </div>
                    </div>
                </div>

                <div class="control-panel glass rounded-xl px-6 py-4">
                    <div class="flex items-center gap-6 text-sm text-white">
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                            </svg>
                            <span class="font-medium">Click & Drag to Rotate</span>
                        </div>
                        <div class="w-px h-6 bg-white/20"></div>
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path>
                            </svg>
                            <span class="font-medium">Scroll to Zoom</span>
                        </div>
                        <div class="w-px h-6 bg-white/20"></div>
                        <div class="flex items-center gap-2">
                            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"></path>
                            </svg>
                            <span class="font-medium">Right-Click to Pan</span>
                        </div>
                    </div>
                </div>

                <div class="absolute top-6 right-6 glass rounded-xl p-6 max-w-sm">
                    <h3 class="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <span class="flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Structure Information
                    </h3>
                    <div class="space-y-3 text-sm text-gray-300">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Strands:</span>
                            <span class="font-semibold text-green-500">${config.count}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Type:</span>
                            <span class="font-semibold">${info.type}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Helix Turn:</span>
                            <span class="font-semibold">${info.helixTurn}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Diameter:</span>
                            <span class="font-semibold">${info.diameter}</span>
                        </div>
                        <div class="pt-3 border-t border-white/10">
                            <p class="text-xs text-gray-400 leading-relaxed">
                                ${info.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.158.0/examples/js/controls/OrbitControls.js"></script>
    <script>
        const STRAND_COUNT = ${config.count};
    </script>
    <script src="js/modern-multi-strand.js"></script>
</body>
</html>`;
}

// Generate all pages
strandConfigs.forEach(config => {
    const html = generatePage(config);
    fs.writeFileSync(config.file, html);
    console.log(`Generated ${config.file}`);
});

console.log('All pages generated successfully!');
