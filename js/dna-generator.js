// Universal DNA Structure Generator
// Supports 2-12 strand DNA visualizations

export class DNAGenerator {
    constructor(strandCount = 2) {
        this.strandCount = strandCount;
        this.radius = this.calculateRadius(strandCount);
        this.height = 40;
        this.turns = 3;
        this.segments = 150;
        this.basePairsPerTurn = 10;
        
        // Color palette for different strands
        this.colors = [
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
        
        this.materials = this.createMaterials();
    }
    
    calculateRadius(strandCount) {
        // Increase radius based on strand count for better visualization
        const baseRadius = 5;
        return baseRadius * Math.max(1, Math.sqrt(strandCount / 2));
    }
    
    createMaterials() {
        const materials = [];
        for (let i = 0; i < this.strandCount; i++) {
            const color = this.colors[i % this.colors.length];
            const emissive = color & 0x333333; // Darker version for emissive
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
    
    generate() {
        const dnaGroup = new THREE.Group();
        
        // Create strands
        for (let strand = 0; strand < this.strandCount; strand++) {
            this.createStrand(dnaGroup, strand);
        }
        
        // Create connections between strands
        if (this.strandCount <= 4) {
            this.createBasePairs(dnaGroup);
        } else {
            this.createRadialConnections(dnaGroup);
        }
        
        return dnaGroup;
    }
    
    createStrand(group, strandIndex) {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const angleOffset = (strandIndex * 2 * Math.PI) / this.strandCount;
        
        for (let i = 0; i <= this.segments; i++) {
            const t = i / this.segments;
            const angle = t * this.turns * Math.PI * 2 + angleOffset;
            const y = (t - 0.5) * this.height;
            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            
            positions.push(x, y, z);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        // Create line for strand backbone
        const line = new THREE.Line(
            geometry,
            new THREE.LineBasicMaterial({
                color: this.materials[strandIndex].color,
                linewidth: 2
            })
        );
        group.add(line);
        
        // Add spheres along the strand
        for (let i = 0; i <= this.segments; i += 3) {
            const t = i / this.segments;
            const angle = t * this.turns * Math.PI * 2 + angleOffset;
            const y = (t - 0.5) * this.height;
            const x = Math.cos(angle) * this.radius;
            const z = Math.sin(angle) * this.radius;
            
            const sphereGeometry = new THREE.SphereGeometry(0.4, 16, 16);
            const sphere = new THREE.Mesh(sphereGeometry, this.materials[strandIndex]);
            sphere.position.set(x, y, z);
            sphere.castShadow = true;
            group.add(sphere);
        }
    }
    
    createBasePairs(group) {
        // For 2-4 strands, create traditional base pairs
        const basePairMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            shininess: 100,
            emissive: 0x330000
        });
        
        const totalBasePairs = this.turns * this.basePairsPerTurn;
        
        for (let i = 0; i < totalBasePairs; i++) {
            const t = i / totalBasePairs;
            const angle = t * this.turns * Math.PI * 2;
            const y = (t - 0.5) * this.height;
            
            // Connect opposite strands
            for (let s = 0; s < Math.floor(this.strandCount / 2); s++) {
                const angle1 = angle + (s * 2 * Math.PI) / this.strandCount;
                const angle2 = angle1 + Math.PI;
                
                const x1 = Math.cos(angle1) * this.radius;
                const z1 = Math.sin(angle1) * this.radius;
                const x2 = Math.cos(angle2) * this.radius;
                const z2 = Math.sin(angle2) * this.radius;
                
                const distance = Math.sqrt(
                    Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2)
                );
                
                const basePairGeometry = new THREE.CylinderGeometry(0.15, 0.15, distance, 8);
                const basePair = new THREE.Mesh(basePairGeometry, basePairMaterial);
                
                basePair.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
                basePair.rotation.z = Math.PI / 2;
                basePair.rotation.y = angle1;
                basePair.castShadow = true;
                
                group.add(basePair);
            }
        }
    }
    
    createRadialConnections(group) {
        // For 5+ strands, create radial connections to center
        const connectionMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            shininess: 100,
            emissive: 0x330000,
            transparent: true,
            opacity: 0.6
        });
        
        const connectionInterval = 5;
        
        for (let i = 0; i <= this.segments; i += connectionInterval) {
            const t = i / this.segments;
            const y = (t - 0.5) * this.height;
            
            // Create connections from center to each strand
            for (let strand = 0; strand < this.strandCount; strand++) {
                const angleOffset = (strand * 2 * Math.PI) / this.strandCount;
                const angle = t * this.turns * Math.PI * 2 + angleOffset;
                
                const x = Math.cos(angle) * this.radius;
                const z = Math.sin(angle) * this.radius;
                
                const connectionGeometry = new THREE.CylinderGeometry(0.1, 0.1, this.radius, 6);
                const connection = new THREE.Mesh(connectionGeometry, connectionMaterial);
                
                connection.position.set(x / 2, y, z / 2);
                connection.rotation.z = Math.PI / 2 - angle;
                connection.rotation.x = Math.PI / 2;
                
                group.add(connection);
            }
            
            // Add central sphere
            const centralSphere = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 12, 12),
                connectionMaterial
            );
            centralSphere.position.set(0, y, 0);
            group.add(centralSphere);
        }
    }
    
    getStrandInfo() {
        const info = {
            2: {
                name: 'Double Helix',
                type: 'B-DNA',
                description: 'The most common DNA structure found in nature, consisting of two antiparallel strands wound around each other.',
                helixTurn: '10.5 bp',
                diameter: '~2 nm'
            },
            3: {
                name: 'Triple Helix',
                type: 'Triplex DNA',
                description: 'A three-stranded DNA structure where a third strand binds to the major groove of a double helix.',
                helixTurn: 'Variable',
                diameter: '~2.5 nm'
            },
            4: {
                name: 'G-Quadruplex',
                type: 'Tetraplex',
                description: 'Four-stranded structure formed by guanine-rich sequences, important in telomeres and gene regulation.',
                helixTurn: 'Stacked quartets',
                diameter: '~3 nm'
            },
            5: {
                name: 'Pentaplex',
                type: 'Five-Strand',
                description: 'Theoretical five-stranded DNA structure with potential applications in nanotechnology.',
                helixTurn: 'Complex',
                diameter: '~3.5 nm'
            }
        };
        
        if (this.strandCount in info) {
            return info[this.strandCount];
        }
        
        return {
            name: `${this.strandCount}-Strand DNA`,
            type: 'Multi-Strand Complex',
            description: `Higher-order DNA structure with ${this.strandCount} strands arranged in a symmetric pattern.`,
            helixTurn: 'Complex geometry',
            diameter: `~${Math.round(this.radius / 2.5)} nm`
        };
    }
}
