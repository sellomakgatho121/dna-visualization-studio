const fs = require('fs');
const path = require('path');

// Load DNA strand data
const DNA_STRAND_DATA = {
    2: {
        name: "Double Helix",
        scientificType: "B-DNA",
        spiritualType: "Base Physical Matrix",
        dimensions: "1D-2D",
        harmonicUniverse: "First (Partial)",
        chakras: "Root, Sacral",
        consciousness: "Physical Body",
        helixTurn: "10.5 bp",
        diameter: "~2 nm",
        description: "The double helix represents the base physical matrix of human DNA. Currently, humanity operates with only 2 active strands out of the original 12 Strand Silicate Matrix.",
        keyPoints: [
            "Contains 4 active nucleotide base pairs (A-T, G-C)",
            "Represents physical matter and elemental body",
            "Connected to Earth's 1D-2D dimensional fields",
            "Foundation for biological life on Earth"
        ],
        ascensionGlossary: "Each strand is composed of 12 base magnetic female codes (Mions) and 12 base-electrical male acceleration codes (Dions). The 2-strand configuration represents the minimum required for physical incarnation.",
        energeticSynthesis: "The double helix represents the unplugged DNA state that occurred during the Atlantian Cataclysm approximately 5,500 years ago. Only 4 of the 12 Vector Codes remain active in biological Earth life.",
        activation: "Begins with grounding into Earth's core and activating the root chakra. Foundation for all higher strand activation."
    },
    3: {
        name: "Triple Helix",
        scientificType: "Triplex DNA",
        spiritualType: "Emotional-Mental Bridge",
        dimensions: "1D-2D-3D",
        harmonicUniverse: "First (Complete)",
        chakras: "Root, Sacral, Solar Plexus",
        consciousness: "Personality Matrix",
        helixTurn: "Variable",
        diameter: "~2.5 nm",
        description: "Three-strand DNA activation represents the completion of the First Harmonic Universe, integrating physical, emotional, and mental bodies into unified consciousness.",
        keyPoints: [
            "Completes the personality matrix integration",
            "Activates solar plexus and personal power center",
            "Bridges physical and emotional consciousness",
            "Enables basic psychic sensitivity"
        ],
        ascensionGlossary: "In the First Harmonic Universe 1D-2D-3D exists the three layers of the personality matrix or incarnated human. Triple helix activation unifies these three layers.",
        energeticSynthesis: "The 3-strand activation represents the first major milestone in DNA assembly, completing the incarnate identity level. This allows for greater emotional intelligence and mental clarity.",
        activation: "Achieved through emotional healing, mental clarity practices, and integration of shadow aspects. Requires clearing of 3D timeline blockages."
    },
    4: {
        name: "G-Quadruplex",
        scientificType: "Tetraplex",
        spiritualType: "Heart Bridge",
        dimensions: "4D (Astral)",
        harmonicUniverse: "Second (Entry)",
        chakras: "Heart",
        consciousness: "Soul Matrix",
        helixTurn: "Stacked quartets",
        diameter: "~3 nm",
        description: "Four-strand DNA opens the heart chakra and astral consciousness, creating the bridge between personality and soul. This is the gateway to higher dimensional awareness.",
        keyPoints: [
            "Activates heart chakra and astral body",
            "Opens gateway to soul consciousness",
            "Enables astral travel and lucid dreaming",
            "Connects to Tara matrix (parallel Earth)"
        ],
        ascensionGlossary: "The 4D-5D-6D layers exist in the Second Harmonic Universe as the three layers of the Soul Matrix. Four-strand activation opens the doorway to this higher dimensional experience.",
        energeticSynthesis: "The 4D frequency band is the astral plane and heart chakra complex. This is where the soul matrix begins to integrate with the personality, creating the bridge to higher consciousness.",
        activation: "Requires heart opening, forgiveness practices, and clearing of astral plane distortions. The 2D/4D split must be healed for full activation."
    },
    5: {
        name: "Pentaplex",
        scientificType: "Five-Strand",
        spiritualType: "Higher Mind",
        dimensions: "5D (Archetypal)",
        harmonicUniverse: "Second",
        chakras: "Throat",
        consciousness: "Soul Expression",
        helixTurn: "Complex",
        diameter: "~3.5 nm",
        description: "Five-strand DNA activates the throat chakra and higher mind, enabling authentic soul expression and access to archetypal consciousness patterns.",
        keyPoints: [
            "Activates throat chakra and authentic expression",
            "Access to archetypal mind and collective wisdom",
            "Enhanced telepathic and channeling abilities",
            "Connection to Tara's 5D frequency bands"
        ],
        ascensionGlossary: "Each DNA strand represents a Fire Letters Code program sequence corresponding to one dimensional frequency band of Consciousness. The 5th strand connects to 5D Tara matrix.",
        energeticSynthesis: "The 5D frequency represents the archetypal mind plane where thought-forms and belief systems are created. Five-strand activation allows conscious participation in reality creation.",
        activation: "Developed through authentic self-expression, truth-speaking, and clearing throat chakra blockages. Requires integration of soul purpose."
    },
    6: {
        name: "6-Strand DNA",
        scientificType: "Hexaplex",
        spiritualType: "Third Eye Activation",
        dimensions: "6D (Celestial)",
        harmonicUniverse: "Second (Complete)",
        chakras: "Third Eye",
        consciousness: "Soul Integration",
        helixTurn: "Hexagonal",
        diameter: "~4 nm",
        description: "Six-strand DNA completes the Soul Matrix by activating the third eye, enabling direct perception of multidimensional reality and celestial consciousness.",
        keyPoints: [
            "Activates third eye and celestial vision",
            "Completes soul matrix integration (4D-5D-6D)",
            "Direct perception of energy fields and auras",
            "Access to akashic records and soul memories"
        ],
        ascensionGlossary: "Six-strand activation completes the soul matrix layers, allowing the consciousness to perceive and interact with the Tara matrix fully. This is a major ascension milestone.",
        energeticSynthesis: "The 6D frequency band completes the Second Harmonic Universe, representing full soul embodiment. This allows for direct knowing and celestial communication.",
        activation: "Achieved through meditation, inner vision development, and clearing pineal gland calcification. Requires trust in intuitive guidance."
    },
    7: {
        name: "7-Strand DNA",
        scientificType: "Heptaplex",
        spiritualType: "Monadic Integration",
        dimensions: "7D (Ketheric)",
        harmonicUniverse: "Third (Entry)",
        chakras: "Crown",
        consciousness: "Monad - Oversoul",
        helixTurn: "Heptagonal",
        diameter: "~4.5 nm",
        description: "Seven-strand DNA opens the crown chakra and initiates connection with the Monad (Oversoul), accessing the Gaian matrix and higher spiritual blueprints.",
        keyPoints: [
            "Activates crown chakra and divine connection",
            "Opens gateway to monadic consciousness",
            "Access to Gaian matrix (7D-8D-9D)",
            "Connection to spiritual family and purpose"
        ],
        ascensionGlossary: "In the Third Harmonic Universe 7D-8D-9D exists the three layers of the Gaian matrix. Seven-strand activation opens the doorway to monadic integration.",
        energeticSynthesis: "The 7D frequency represents the first layer of the Monad or Oversoul. This is where individual consciousness begins merging with group consciousness and divine purpose.",
        activation: "Requires surrender of personal will to divine will, crown chakra opening, and recognition of unity consciousness. Major spiritual initiation point."
    },
    8: {
        name: "8-Strand DNA",
        scientificType: "Octaplex",
        spiritualType: "Monadic Body",
        dimensions: "8D (Monadic Core)",
        harmonicUniverse: "Third",
        chakras: "Higher Crown",
        consciousness: "Group Avatar",
        helixTurn: "Octagonal",
        diameter: "~5 nm",
        description: "Eight-strand DNA integrates the monadic body, enabling group consciousness and access to the core spiritual blueprint of the Gaian matrix.",
        keyPoints: [
            "Integrates monadic body and group consciousness",
            "Access to original divine blueprint",
            "Manifestation of Avatar abilities",
            "Connection to spiritual mission teams"
        ],
        ascensionGlossary: "Eight-strand DNA activation represents significant monadic integration, where the consciousness operates as a group entity while maintaining individual expression.",
        energeticSynthesis: "The 8D frequency band represents the monadic core where the original divine blueprint is held. Eight-strand activation allows embodiment of Avatar consciousness.",
        activation: "Achieved through service to others, group consciousness work, and complete ego dissolution. Requires living as divine instrument."
    },
    9: {
        name: "9-Strand DNA",
        scientificType: "Nonaplex",
        spiritualType: "Monadic Matrix Complete",
        dimensions: "9D (Cosmic Christ)",
        harmonicUniverse: "Third (Complete)",
        chakras: "Universal Mind",
        consciousness: "Christos-Sophia",
        helixTurn: "Nonagonal",
        diameter: "~5.5 nm",
        description: "Nine-strand DNA completes the Monadic Matrix, embodying Cosmic Christ Consciousness and full connection to the Gaian crystalline matrix.",
        keyPoints: [
            "Completes monadic matrix (7D-8D-9D)",
            "Embodies Cosmic Christ-Sophia consciousness",
            "Full access to Gaian crystalline blueprint",
            "Universal love and compassion embodied"
        ],
        ascensionGlossary: "Nine-strand DNA represents the completion of the monadic layers, embodying the Christos-Sophia consciousness that is the foundation for the Diamond Sun body.",
        energeticSynthesis: "The 9D frequency represents the Cosmic Christ principle, the unified field of divine love-wisdom. Nine-strand activation completes the Third Harmonic Universe.",
        activation: "Achieved through embodiment of unconditional love, service to all life, and complete alignment with divine will. Major ascension completion."
    },
    10: {
        name: "10-Strand DNA",
        scientificType: "Decaplex",
        spiritualType: "Avatar Christos Body",
        dimensions: "10D (Solar Logos)",
        harmonicUniverse: "Fourth (Entry)",
        chakras: "Solar Star",
        consciousness: "Avatar Christos",
        helixTurn: "Decagonal",
        diameter: "~6 nm",
        description: "Ten-strand DNA activates the Avatar Christos body, connecting to the Solar Logos and the crystalline Aramatena/Aurora Earth matrix.",
        keyPoints: [
            "Activates Avatar Christos consciousness",
            "Connection to Solar Logos and Sun",
            "Access to Aramatena (Aurora Earth) matrix",
            "Solar body activation and light body merkaba"
        ],
        ascensionGlossary: "In the Fourth Harmonic Universe 10D-11D-12D exists the crystalline Aramatena or Aurora Earth Matrix. Ten-strand activation opens this gateway.",
        energeticSynthesis: "The 10D frequency represents the Solar Logos, the consciousness of our Sun. Ten-strand activation connects to the crystalline blueprint of the future Earth.",
        activation: "Requires solar body integration, planetary service, and embodiment of solar consciousness. Connection to Earth's crystalline core."
    },
    11: {
        name: "11-Strand DNA",
        scientificType: "Complex",
        spiritualType: "Galactic Logos",
        dimensions: "11D (Galactic Core)",
        harmonicUniverse: "Fourth",
        chakras: "Galactic Center",
        consciousness: "Galactic Avatar",
        helixTurn: "Multi-point",
        diameter: "~6.5 nm",
        description: "Eleven-strand DNA integrates Galactic Logos consciousness, connecting to the Galactic Core and embodying Krystal (Christ-Crystal) frequencies.",
        keyPoints: [
            "Integrates Galactic Logos consciousness",
            "Connection to Galactic Center and core",
            "Krystal frequency embodiment",
            "Access to galactic akashic records"
        ],
        ascensionGlossary: "Eleven-strand DNA activation represents advanced Avatar consciousness, preparing for the complete 12-strand Silicate Matrix and Diamond Sun body activation.",
        energeticSynthesis: "The 11D frequency represents the Galactic Logos, the consciousness of our galaxy. This is where the Krystal frequencies originate, representing the original divine blueprint.",
        activation: "Achieved through galactic consciousness integration, Krystal frequency alignment, and service to galactic evolution. Rare achievement."
    },
    12: {
        name: "12-Strand DNA",
        scientificType: "Silicate Matrix",
        spiritualType: "Diamond Sun Body",
        dimensions: "12D (Universal Logos)",
        harmonicUniverse: "Fourth (Complete)",
        chakras: "Universal Gateway",
        consciousness: "Universal Christos",
        helixTurn: "Dodecagonal",
        diameter: "~7 nm",
        description: "Twelve-strand DNA represents the complete Silicate Matrix and Diamond Sun body, the original divine human blueprint with full multidimensional consciousness.",
        keyPoints: [
            "Complete Silicate Matrix activation",
            "Diamond Sun body fully embodied",
            "All 12 dimensional bands integrated",
            "Full multidimensional consciousness",
            "Freedom from reincarnation cycle"
        ],
        ascensionGlossary: "The original human DNA pattern arranged into 12 dimensionalized mathematical programs. The complete Silicate Matrix represents full consciousness freedom, with Inner Christos fully activated and Sacred Crystal Heart flowering.",
        energeticSynthesis: "The 12D frequency represents the Universal Logos, the unified field of all creation. Twelve-strand activation completes the ascension process, embodying the full Diamond Sun template.",
        activation: "The ultimate goal of spiritual ascension. Achieved through complete integration of all dimensional layers, embodiment of universal love-wisdom, and alignment with the Cosmic Kryst-Krystallah blueprint."
    }
};

console.log('DNA Strand Data loaded successfully!');
console.log('Ready to update pages with spiritual/energetic information.');
console.log('\\nStrand configurations available: 2-12');
console.log('Each includes: Scientific, Spiritual, Ascension Glossary, and Energetic Synthesis data');
