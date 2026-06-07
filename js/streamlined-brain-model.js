/**
 * Medically Accurate Brain 3D Model - Enhanced Version
 * Features improved anatomical accuracy, lobe-specific highlighting,
 * responsive design, and accessibility enhancements
 */

let brainScene = null;
let brainCamera = null;
let brainRenderer = null;
let brainGroup = null;
let isRotating = false;
let animationId = null;
let selectedRegion = null; // Track currently selected region
let raycaster = null;
let mouse = null;

const brainModelIsGreek = (document.documentElement.lang || '').startsWith('el') || window.location.pathname.includes('/gr/');
const brainModelLocale = brainModelIsGreek ? {
    interactiveLabel: 'Μοντέλο 3D Εγκεφάλου - Διαδραστική οπτικοποίηση',
    resetView: 'Επαναφορά προβολής εγκεφάλου στην προεπιλεγμένη θέση',
    toggleRotation: 'Εναλλαγή αυτόματης περιστροφής',
    autoRotate: 'Αυτόματη Περιστροφή',
    stop: 'Διακοπή',
    brainModel: 'Μοντέλο 3D Εγκεφάλου',
    threeRequired: 'Η διαδραστική 3D οπτικοποίηση απαιτεί τη βιβλιοθήκη THREE.js.',
    bestExperience: 'Για την καλύτερη εμπειρία, βεβαιωθείτε ότι το JavaScript είναι ενεργοποιημένο και ότι έχει φορτωθεί η THREE.js.',
    highlightRegion: (regionName) => `Επισήμανση ${regionName} στο μοντέλο 3D`,
    regionExplorer: 'Εξερευνητής Περιοχών Εγκεφάλου',
    regionPrompt: 'Κάνε κλικ σε οποιαδήποτε περιοχή παρακάτω για να εξερευνήσεις αναλυτικές πληροφορίες'
} : {
    interactiveLabel: '3D Brain Model - Interactive visualization',
    resetView: 'Reset brain view to default position',
    toggleRotation: 'Toggle automatic rotation',
    autoRotate: 'Auto Rotate',
    stop: 'Stop',
    brainModel: '3D Brain Model',
    threeRequired: 'Interactive 3D visualization requires THREE.js library.',
    bestExperience: 'For the best experience, ensure JavaScript is enabled and THREE.js is loaded.',
    highlightRegion: (regionName) => `Highlight ${regionName} in 3D model`,
    regionExplorer: 'Brain Region Explorer',
    regionPrompt: 'Click on any region below to explore detailed information'
};

/**
 * Main initialization function
 */
function initStreamlinedBrain3DModel() {

    const container = document.getElementById('brain-3d-container');
    if (!container) {
        console.error('❌ Brain 3D container not found!');
        return;
    }

    // Prevent duplicate initialization
    if (container.dataset.initialized === 'true') {
        console.log('⚠️ Brain model already initialized, skipping...');
        return;
    }
    container.dataset.initialized = 'true';

    // Check THREE.js availability
    if (typeof THREE === 'undefined') {
        console.warn('⚠️ THREE.js not available, showing fallback');
        showBrainFallback(container);
        return;
    }

    try {
        // Clear existing content
        container.innerHTML = '';

        // Setup container styling for responsive design
        container.style.position = 'relative';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.minHeight = '400px'; // Minimum height for usability

        // Initialize raycaster for better interaction
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        // Wait for container to be properly sized and visible
        const initModel = () => {
            if (container.offsetWidth > 0 && container.offsetHeight > 0) {
                createSimpleBrainModel(container);
                setupBrainControls();
                console.log('✅ Enhanced Brain 3D Model loaded successfully');
            } else {
                // Container not ready yet, wait a bit more
                setTimeout(initModel, 100);
            }
        };

        requestAnimationFrame(initModel);

    } catch (error) {
        console.error('❌ Error initializing brain model:', error);
        showBrainFallback(container);
    }
}

/**
 * Create the brain model with responsive dimensions
 */
function createSimpleBrainModel(container) {
    // Create scene
    brainScene = new THREE.Scene();
    brainScene.background = new THREE.Color(0xf8fafc);

    // Get exact container dimensions
    const containerRect = container.getBoundingClientRect();
    const width = containerRect.width || container.offsetWidth || 800;
    const height = containerRect.height || container.offsetHeight || 384; // Match h-96 from Tailwind

    // Create camera with optimal FOV for brain viewing
    brainCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    brainCamera.position.set(4, 2, 4); // Moved closer to the brain
    brainCamera.lookAt(0, 0, 0);

    // Camera positioned for optimal brain viewing

    // Create renderer with enhanced settings
    brainRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });

    brainRenderer.setSize(width, height);
    brainRenderer.shadowMap.enabled = true;
    brainRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    brainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Make canvas fit container exactly
    brainRenderer.domElement.style.width = '100%';
    brainRenderer.domElement.style.height = '100%';
    brainRenderer.domElement.style.display = 'block';
    brainRenderer.domElement.style.position = 'absolute';
    brainRenderer.domElement.style.top = '0';
    brainRenderer.domElement.style.left = '0';
    brainRenderer.domElement.style.right = '0';
    brainRenderer.domElement.style.bottom = '0';
    brainRenderer.domElement.setAttribute('role', 'img');
    brainRenderer.domElement.setAttribute('aria-label', brainModelLocale.interactiveLabel);

    container.appendChild(brainRenderer.domElement);

    // Add enhanced lighting for better visualization
    setupLighting();

    // Create brain group
    brainGroup = new THREE.Group();

    // Create anatomically accurate brain regions
    createBrainRegions();

    // Center and scale the brain model
    centerAndScaleModel();

    brainScene.add(brainGroup);

    // Add controls
    addMouseControls(container);
    addKeyboardControls();

    // Start render loop
    startRenderLoop();
}

/**
 * Setup enhanced lighting for medical visualization
 */
function setupLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    brainScene.add(ambientLight);

    // Key light (main directional light)
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 20;
    keyLight.shadow.camera.left = -10;
    keyLight.shadow.camera.right = 10;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -10;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    brainScene.add(keyLight);

    // Fill light to reduce harsh shadows
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 3, -5);
    brainScene.add(fillLight);

    // Rim light for edge definition
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.2);
    rimLight.position.set(0, -5, -5);
    brainScene.add(rimLight);
}

/**
 * Center and scale the model appropriately
 */
function centerAndScaleModel() {
    const box = new THREE.Box3().setFromObject(brainGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Center the model
    brainGroup.position.set(-center.x, -center.y, -center.z);

    // Scale to fit view
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 4 / maxDim;
    brainGroup.scale.multiplyScalar(scale);

    // Brain model centered and scaled
}

/**
 * Create medically accurate brain regions
 */
function createBrainRegions() {
    // Create cerebral hemispheres with anatomically accurate lobe regions
    createCerebralHemisphere('left');
    createCerebralHemisphere('right');

    // Create anatomically accurate cerebellum
    createCerebellum();

    // Create brainstem structures
    createBrainstem();

    // Create thalamus as a separate structure
    createThalamus();

    // Create curved corpus callosum
    createCorpusCallosum();
}

/**
 * Create a cerebral hemisphere with anatomically accurate lobe regions
 */
function createCerebralHemisphere(side) {
    const xMultiplier = side === 'left' ? 1 : -1;
    const hemisphereGroup = new THREE.Group();
    hemisphereGroup.userData = { region: `hemisphere-${side}`, type: 'hemisphere' };

    // Create main hemisphere with higher resolution for accurate lobe mapping
    const segments = 80; // Higher resolution for more accurate boundaries
    const hemisphereGeometry = new THREE.SphereGeometry(1, segments, segments);

    // Create vertex groups for each lobe based on anatomical positions
    const lobeVertexGroups = {
        frontal: [],
        parietal: [],
        temporal: [],
        occipital: []
    };

    // Deform to create realistic brain shape and assign vertices to lobes
    const positions = hemisphereGeometry.attributes.position;
    const colors = new Float32Array(positions.count * 3);
    const lobeAssignments = new Uint8Array(positions.count); // Store lobe assignment per vertex

    for (let i = 0; i < positions.count; i++) {
        let x = positions.getX(i);
        let y = positions.getY(i);
        let z = positions.getZ(i);

        // Store original position for lobe assignment
        const origX = x, origY = y, origZ = z;

        // Elongate anterior-posterior axis
        z = z * 1.5;

        // Flatten inferior surface
        if (y < -0.3) {
            y = y * 0.6;
        }

        // Curve superior surface
        if (y > 0.5) {
            y = y * 1.15;
        }

        // Make medial surface flatter
        if ((side === 'left' && x < 0) || (side === 'right' && x > 0)) {
            x = x * 0.7;
        }

        // Add slight inward curve at temporal region
        if (y < 0 && Math.abs(z) < 0.7) {
            x = x * 0.85;
        }

        // Update positions
        positions.setXYZ(i, x, y, z);

        // More accurate lobe assignment based on anatomical landmarks
        let lobe = 'frontal'; // default
        
        // Use original (pre-deformation) coordinates for consistent assignment
        const r = Math.sqrt(origX * origX + origY * origY + origZ * origZ);
        const normalizedX = origX / r;
        const normalizedY = origY / r;
        const normalizedZ = origZ / r;
        
        // Define boundaries more precisely
        // Central sulcus approximately at z = 0.2 (separates frontal from parietal)
        // Lateral sulcus approximately at y = -0.1 (separates temporal from frontal/parietal)
        // Parieto-occipital sulcus approximately at z = -0.6
        
        if (normalizedZ > 0.2) {
            // Anterior to central sulcus
            lobe = 'frontal';
        } else if (normalizedZ > -0.6) {
            // Between central and parieto-occipital sulci
            if (normalizedY < -0.1 && Math.abs(normalizedX) > 0.3) {
                // Below lateral sulcus and lateral enough
                lobe = 'temporal';
            } else if (normalizedY > 0.1) {
                // Above lateral sulcus
                lobe = 'parietal';
            } else {
                // Transition zone - assign based on proximity
                if (normalizedZ > -0.2) {
                    lobe = 'parietal';
                } else {
                    lobe = 'temporal';
                }
            }
        } else {
            // Posterior to parieto-occipital sulcus
            if (normalizedY < -0.2 && Math.abs(normalizedX) > 0.3) {
                // Inferior temporal continuation
                lobe = 'temporal';
            } else {
                lobe = 'occipital';
            }
        }

        // Store lobe assignment
        const lobeIndex = { frontal: 0, parietal: 1, temporal: 2, occipital: 3 }[lobe];
        lobeAssignments[i] = lobeIndex;
        lobeVertexGroups[lobe].push(i);

        // Set initial vertex colors (base brain color)
        colors[i * 3] = 1.0;     // R
        colors[i * 3 + 1] = 0.7; // G
        colors[i * 3 + 2] = 0.76; // B
    }

    hemisphereGeometry.computeVertexNormals();
    hemisphereGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Store lobe assignments as an attribute for shader use if needed
    hemisphereGeometry.setAttribute('lobeIndex', new THREE.BufferAttribute(lobeAssignments, 1));

    // Create materials with vertex colors enabled
    const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0xffb3c1,
        vertexColors: true,
        shininess: 40,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    const hemisphereMesh = new THREE.Mesh(hemisphereGeometry, baseMaterial);
    hemisphereMesh.scale.set(1.8, 1.6, 2.3);
    hemisphereMesh.position.set(xMultiplier * 0.9, 0.2, 0);
    hemisphereMesh.castShadow = true;
    hemisphereMesh.receiveShadow = true;
    
    // Store lobe vertex groups in userData for highlighting
    hemisphereMesh.userData.lobeVertexGroups = lobeVertexGroups;
    hemisphereMesh.userData.originalColors = colors.slice(); // Store original colors
    hemisphereMesh.userData.side = side;
    
    hemisphereGroup.add(hemisphereMesh);

    // Create lobe region markers (invisible meshes for click detection)
    createLobeRegionMarkers(hemisphereGroup, side, xMultiplier);

    // Add major sulci
    createMajorSulci(hemisphereGroup, xMultiplier);

    brainGroup.add(hemisphereGroup);
}

/**
 * Create invisible marker meshes for each lobe region for easier interaction
 */
function createLobeRegionMarkers(hemisphereGroup, side, xMultiplier) {
    // These are invisible meshes that define clickable/hoverable regions for each lobe
    const markerMaterial = new THREE.MeshBasicMaterial({
        visible: false,
        side: THREE.DoubleSide
    });

    // Frontal lobe marker - positioned at frontal lobe center
    const frontalMarker = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1.2, 1.8),
        markerMaterial
    );
    frontalMarker.position.set(xMultiplier * 1.2, 0.4, 1.2);
    frontalMarker.userData = { region: `frontal-lobe-${side}`, type: 'lobe', lobe: 'frontal' };
    hemisphereGroup.add(frontalMarker);

    // Parietal lobe marker - positioned at parietal lobe center
    const parietalMarker = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 1.0, 1.2),
        markerMaterial
    );
    parietalMarker.position.set(xMultiplier * 1.0, 0.8, -0.2);
    parietalMarker.userData = { region: `parietal-lobe-${side}`, type: 'lobe', lobe: 'parietal' };
    hemisphereGroup.add(parietalMarker);

    // Temporal lobe marker - positioned at temporal lobe center
    const temporalMarker = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.0, 1.8),
        markerMaterial
    );
    temporalMarker.position.set(xMultiplier * 1.5, -0.4, 0.2);
    temporalMarker.userData = { region: `temporal-lobe-${side}`, type: 'lobe', lobe: 'temporal' };
    hemisphereGroup.add(temporalMarker);

    // Occipital lobe marker - positioned at occipital lobe center
    const occipitalMarker = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 1.2, 0.8),
        markerMaterial
    );
    occipitalMarker.position.set(xMultiplier * 0.8, 0.2, -1.5);
    occipitalMarker.userData = { region: `occipital-lobe-${side}`, type: 'lobe', lobe: 'occipital' };
    hemisphereGroup.add(occipitalMarker);
}

/**
 * Create major sulci (grooves) between brain regions
 */
function createMajorSulci(hemisphereGroup, xMultiplier) {
    const sulcusMaterial = new THREE.MeshPhongMaterial({
        color: 0xff8fa3,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
    });

    // Central sulcus (between frontal and parietal lobes)
    const centralSulcusGeometry = new THREE.PlaneGeometry(0.15, 1.8, 1, 8);

    // Curve the sulcus
    const centralPositions = centralSulcusGeometry.attributes.position;
    for (let i = 0; i < centralPositions.count; i++) {
        const y = centralPositions.getY(i);
        const offset = Math.sin(y * Math.PI / 1.8) * 0.2;
        centralPositions.setZ(i, offset);
    }
    centralSulcusGeometry.computeVertexNormals();

    const centralSulcus = new THREE.Mesh(centralSulcusGeometry, sulcusMaterial);
    centralSulcus.position.set(xMultiplier * 1.1, 0.6, 0.4);
    centralSulcus.rotation.set(0, xMultiplier * 0.1, xMultiplier * 0.15);
    hemisphereGroup.add(centralSulcus);

    // Lateral sulcus (Sylvian fissure)
    const lateralSulcusGeometry = new THREE.PlaneGeometry(0.12, 1.4, 1, 6);

    // Curve the lateral sulcus
    const lateralPositions = lateralSulcusGeometry.attributes.position;
    for (let i = 0; i < lateralPositions.count; i++) {
        const x = lateralPositions.getX(i);
        const offset = Math.sin(x * Math.PI / 0.12) * 0.15;
        lateralPositions.setZ(i, offset);
    }
    lateralSulcusGeometry.computeVertexNormals();

    const lateralSulcus = new THREE.Mesh(lateralSulcusGeometry, sulcusMaterial);
    lateralSulcus.position.set(xMultiplier * 1.3, 0.1, 0.6);
    lateralSulcus.rotation.set(xMultiplier * -0.4, xMultiplier * 0.6, xMultiplier * -0.2);
    hemisphereGroup.add(lateralSulcus);

    // Parieto-occipital sulcus
    const parietoOccipitalGeometry = new THREE.PlaneGeometry(0.1, 1.0, 1, 4);
    const parietoOccipitalSulcus = new THREE.Mesh(parietoOccipitalGeometry, sulcusMaterial);
    parietoOccipitalSulcus.position.set(xMultiplier * 0.9, 0.8, -1.2);
    parietoOccipitalSulcus.rotation.set(-0.5, xMultiplier * 0.1, 0);
    hemisphereGroup.add(parietoOccipitalSulcus);
}

/**
 * Create anatomically accurate cerebellum with curved folia
 */
function createCerebellum() {
    const cerebellumGroup = new THREE.Group();
    cerebellumGroup.userData = { region: 'cerebellum', type: 'structure' };

    // Main cerebellar body
    const mainGeometry = new THREE.SphereGeometry(1, 32, 24);

    // Deform to create characteristic cerebellar shape
    const positions = mainGeometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const z = positions.getZ(i);

        // Flatten superior and inferior surfaces
        positions.setY(i, y * 0.55);

        // Widen laterally
        positions.setX(i, x * 1.4);

        // Posterior prominence
        if (z < 0) {
            positions.setZ(i, z * 1.3);
        }

        // Create slight indentation at midline
        if (Math.abs(x) < 0.1) {
            positions.setY(i, y * 0.9);
        }
    }

    mainGeometry.computeVertexNormals();

    const cerebellumMaterial = new THREE.MeshPhongMaterial({
        color: 0xffa0a9,
        shininess: 50,
        side: THREE.DoubleSide
    });

    const mainMesh = new THREE.Mesh(mainGeometry, cerebellumMaterial);
    mainMesh.scale.set(1.3, 0.9, 1.0);
    mainMesh.position.set(0, -1.3, -1.6);
    mainMesh.castShadow = true;
    mainMesh.receiveShadow = true;
    cerebellumGroup.add(mainMesh);

    // Create curved folia (characteristic folds)
    const foliaGroup = new THREE.Group();

    for (let i = 0; i < 10; i++) {
        const foliaGeometry = new THREE.PlaneGeometry(2.4, 0.08, 16, 1);

        // Create curved folia by manipulating vertices
        const foliaPositions = foliaGeometry.attributes.position;
        for (let j = 0; j < foliaPositions.count; j++) {
            const x = foliaPositions.getX(j);
            const z = Math.sin(x * Math.PI / 1.2) * 0.15;
            foliaPositions.setZ(j, z);
        }
        foliaGeometry.computeVertexNormals();

        const foliaMaterial = new THREE.MeshPhongMaterial({
            color: 0xff7a8a,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });

        const foliaMesh = new THREE.Mesh(foliaGeometry, foliaMaterial);
        foliaMesh.position.set(0, -1.3 + (i * 0.12) - 0.5, -1.6);
        foliaMesh.rotation.x = Math.sin(i * 0.3) * 0.15;
        foliaMesh.rotation.y = Math.cos(i * 0.2) * 0.05;
        foliaGroup.add(foliaMesh);
    }

    cerebellumGroup.add(foliaGroup);

    // Add vermis (central structure)
    const vermisGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.9, 16);
    const vermisMesh = new THREE.Mesh(vermisGeometry, cerebellumMaterial);
    vermisMesh.position.set(0, -1.3, -1.4);
    vermisMesh.rotation.x = Math.PI / 2.2;
    vermisMesh.castShadow = true;
    cerebellumGroup.add(vermisMesh);

    // Add cerebellar hemispheres bulge
    ['left', 'right'].forEach(side => {
        const hemisphereGeometry = new THREE.SphereGeometry(0.6, 16, 12);
        const hemisphereMesh = new THREE.Mesh(hemisphereGeometry, cerebellumMaterial);
        hemisphereMesh.scale.set(1.2, 0.8, 1.0);
        hemisphereMesh.position.set(side === 'left' ? 0.8 : -0.8, -1.3, -1.7);
        hemisphereMesh.castShadow = true;
        cerebellumGroup.add(hemisphereMesh);
    });

    brainGroup.add(cerebellumGroup);
}

/**
 * Create brainstem structures with improved anatomy
 */
function createBrainstem() {
    const brainstemGroup = new THREE.Group();
    brainstemGroup.userData = { region: 'brainstem', type: 'structure' };

    const brainstemMaterial = new THREE.MeshPhongMaterial({
        color: 0xffc9d0,
        shininess: 30
    });

    // Midbrain (mesencephalon)
    const midbrainGeometry = new THREE.CylinderGeometry(0.45, 0.55, 0.6, 16);
    const midbrainMesh = new THREE.Mesh(midbrainGeometry, brainstemMaterial);
    midbrainMesh.position.set(0, -0.5, -0.5);
    midbrainMesh.rotation.x = 0.3;
    midbrainMesh.castShadow = true;
    brainstemGroup.add(midbrainMesh);

    // Add cerebral peduncles
    ['left', 'right'].forEach(side => {
        const peduncleGeometry = new THREE.CylinderGeometry(0.15, 0.2, 0.4, 8);
        const peduncleMesh = new THREE.Mesh(peduncleGeometry, brainstemMaterial);
        peduncleMesh.position.set(side === 'left' ? 0.3 : -0.3, -0.6, -0.4);
        peduncleMesh.rotation.x = 0.4;
        peduncleMesh.rotation.z = side === 'left' ? -0.15 : 0.15;
        brainstemGroup.add(peduncleMesh);
    });

    // Pons (more anatomically accurate)
    const ponsGeometry = new THREE.SphereGeometry(0.7, 16, 12);

    // Deform pons for characteristic bulge
    const ponsPositions = ponsGeometry.attributes.position;
    for (let i = 0; i < ponsPositions.count; i++) {
        const z = ponsPositions.getZ(i);
        if (z > 0) {
            ponsPositions.setZ(i, z * 1.3);
        }
    }
    ponsGeometry.computeVertexNormals();

    const ponsMesh = new THREE.Mesh(ponsGeometry, brainstemMaterial);
    ponsMesh.scale.set(1.1, 0.8, 0.9);
    ponsMesh.position.set(0, -1.0, -0.8);
    ponsMesh.castShadow = true;
    brainstemGroup.add(ponsMesh);

    // Medulla oblongata with pyramids
    const medullaGeometry = new THREE.CylinderGeometry(0.35, 0.45, 1.0, 12);
    const medullaMesh = new THREE.Mesh(medullaGeometry, brainstemMaterial);
    medullaMesh.position.set(0, -1.6, -0.8);
    medullaMesh.rotation.x = 0.1;
    medullaMesh.castShadow = true;
    brainstemGroup.add(medullaMesh);

    // Add pyramids (motor tracts)
    ['left', 'right'].forEach(side => {
        const pyramidGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.2);
        const pyramidMesh = new THREE.Mesh(pyramidGeometry, brainstemMaterial);
        pyramidMesh.position.set(side === 'left' ? 0.15 : -0.15, -1.6, -0.6);
        brainstemGroup.add(pyramidMesh);
    });

    brainGroup.add(brainstemGroup);
}

/**
 * Create thalamus as a separate structure
 */
function createThalamus() {
    const thalamusGroup = new THREE.Group();
    thalamusGroup.userData = { region: 'thalamus', type: 'structure' };

    const thalamicMaterial = new THREE.MeshPhongMaterial({
        color: 0xffccd5,
        shininess: 35
    });

    // Create bilateral thalamic structures
    ['left', 'right'].forEach(side => {
        const thalamusGeometry = new THREE.SphereGeometry(0.35, 16, 12);
        
        // Deform to create egg-like shape characteristic of thalamus
        const positions = thalamusGeometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const y = positions.getY(i);
            const z = positions.getZ(i);
            
            // Elongate anteroposterior
            positions.setZ(i, z * 1.3);
            
            // Flatten mediolaterally
            positions.setX(i, positions.getX(i) * 0.7);
            
            // Slight superior tapering
            if (y > 0) {
                positions.setX(i, positions.getX(i) * (1 - y * 0.3));
            }
        }
        thalamusGeometry.computeVertexNormals();
        
        const thalamus = new THREE.Mesh(thalamusGeometry, thalamicMaterial);
        thalamus.position.set(side === 'left' ? 0.35 : -0.35, 0.0, -0.2);
        thalamus.castShadow = true;
        thalamusGroup.add(thalamus);
    });

    // Add interthalamic adhesion (massa intermedia)
    const adhesionGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 8);
    const adhesion = new THREE.Mesh(adhesionGeometry, thalamicMaterial);
    adhesion.rotation.z = Math.PI / 2;
    adhesion.position.set(0, 0.0, -0.2);
    thalamusGroup.add(adhesion);

    brainGroup.add(thalamusGroup);
}

/**
 * Create curved corpus callosum
 */
function createCorpusCallosum() {
    const corpusCallosumGroup = new THREE.Group();
    corpusCallosumGroup.userData = { region: 'corpus-callosum', type: 'structure' };

    // Create curved shape using torus geometry
    const torusGeometry = new THREE.TorusGeometry(1.2, 0.15, 8, 24, Math.PI);

    const material = new THREE.MeshPhongMaterial({
        color: 0xffe4e9,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
    });

    const torusMesh = new THREE.Mesh(torusGeometry, material);
    torusMesh.rotation.z = Math.PI;
    torusMesh.position.set(0, 0.6, 0.2);
    torusMesh.scale.set(1, 0.8, 1.5);
    torusMesh.castShadow = true;
    corpusCallosumGroup.add(torusMesh);

    // Add genu (front bulge)
    const genuGeometry = new THREE.SphereGeometry(0.3, 12, 8);
    const genuMesh = new THREE.Mesh(genuGeometry, material);
    genuMesh.position.set(0, 0.3, 1.2);
    genuMesh.scale.set(1, 0.8, 1.2);
    corpusCallosumGroup.add(genuMesh);

    // Add splenium (back bulge)
    const spleniumGeometry = new THREE.SphereGeometry(0.35, 12, 8);
    const spleniumMesh = new THREE.Mesh(spleniumGeometry, material);
    spleniumMesh.position.set(0, 0.4, -0.8);
    spleniumMesh.scale.set(1, 0.9, 1.1);
    corpusCallosumGroup.add(spleniumMesh);

    brainGroup.add(corpusCallosumGroup);
}

/**
 * Add mouse controls with improved interaction
 */
function addMouseControls(container) {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationSpeed = 1;

    // Detect touch device
    const isTouchDevice = 'ontouchstart' in window;

    const handleStart = (clientX, clientY) => {
        isDragging = true;
        previousMousePosition = { x: clientX, y: clientY };
    };

    const handleMove = (clientX, clientY) => {
        if (isDragging && brainGroup) {
            const deltaMove = {
                x: clientX - previousMousePosition.x,
                y: clientY - previousMousePosition.y
            };

            const deltaRotationQuaternion = new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(
                    toRadians(deltaMove.y * rotationSpeed),
                    toRadians(deltaMove.x * rotationSpeed),
                    0,
                    'XYZ'
                ));

            brainGroup.quaternion.multiplyQuaternions(deltaRotationQuaternion, brainGroup.quaternion);
            previousMousePosition = { x: clientX, y: clientY };
        }
    };

    const handleEnd = () => {
        isDragging = false;
    };

    // Mouse events
    container.addEventListener('mousedown', (e) => handleStart(e.clientX, e.clientY));
    container.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
    container.addEventListener('mouseup', handleEnd);
    container.addEventListener('mouseleave', handleEnd);

    // Touch events
    if (isTouchDevice) {
        container.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleStart(touch.clientX, touch.clientY);
        });

        container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        });

        container.addEventListener('touchend', handleEnd);
    }

    // Wheel zoom with smooth limits
    container.addEventListener('wheel', (event) => {
        event.preventDefault();
        const scale = event.deltaY > 0 ? 1.05 : 0.95;
        const newLength = brainCamera.position.length() * scale;

        // Smooth zoom limits (adjusted for closer brain position)
        if (newLength >= 2 && newLength <= 8) {
            brainCamera.position.multiplyScalar(scale);
        }
    });
}

/**
 * Add keyboard controls for accessibility
 */
function addKeyboardControls() {
    document.addEventListener('keydown', (event) => {
        if (!brainGroup) return;

        const rotationAmount = 0.1;

        switch (event.key) {
            case 'ArrowLeft':
                brainGroup.rotation.y -= rotationAmount;
                event.preventDefault();
                break;
            case 'ArrowRight':
                brainGroup.rotation.y += rotationAmount;
                event.preventDefault();
                break;
            case 'ArrowUp':
                brainGroup.rotation.x -= rotationAmount;
                event.preventDefault();
                break;
            case 'ArrowDown':
                brainGroup.rotation.x += rotationAmount;
                event.preventDefault();
                break;
            case 'r':
            case 'R':
                resetBrainView();
                event.preventDefault();
                break;
            case ' ':
                toggleAutoRotation();
                event.preventDefault();
                break;
        }
    });
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Setup brain control buttons with accessibility
 */
function setupBrainControls() {
    const resetButton = document.getElementById('reset-brain-view');
    const rotateButton = document.getElementById('toggle-rotation');

    if (resetButton) {
        resetButton.addEventListener('click', resetBrainView);
        resetButton.setAttribute('aria-label', brainModelLocale.resetView);
        // Reset button connected
    }

    if (rotateButton) {
        rotateButton.addEventListener('click', toggleAutoRotation);
        rotateButton.setAttribute('aria-label', brainModelLocale.toggleRotation);
        // Auto-rotate button connected
    }

    // Setup brain region card links
    setupRegionCardLinks();
}

/**
 * Reset brain view to optimal position
 */
function resetBrainView() {
    if (brainCamera && brainGroup) {
        // Reset all highlighting states first (like page reload)
        resetBrainRegionHighlight();
        
        // Clear selected region
        selectedRegion = null;
        
        // Stop auto-rotation if it's running
        isRotating = false;
        const rotateButton = document.getElementById('toggle-rotation');
        if (rotateButton) {
            rotateButton.classList.remove('bg-purple-700');
            rotateButton.innerHTML = `<span>⚡</span><span>${brainModelLocale.autoRotate}</span>`;
            rotateButton.setAttribute('aria-pressed', 'false');
        }

        // Immediately reset brain rotation and position (no animation for more reliable reset)
        brainGroup.rotation.set(0, 0, 0);
        brainGroup.quaternion.set(0, 0, 0, 1);
        
        // Reset camera to exact initial position
        brainCamera.position.set(4, 2, 4);
        brainCamera.lookAt(0, 0, 0);

        // Apply the same centering and scaling as initial load
        centerAndScaleModel();

        // Brain view reset to initial launch state
        console.log('Brain view reset to initial position');
    }
}

/**
 * Toggle auto rotation with visual feedback
 */
function toggleAutoRotation() {
    isRotating = !isRotating;

    const rotateButton = document.getElementById('toggle-rotation');
    if (rotateButton) {
        if (isRotating) {
            rotateButton.classList.add('bg-purple-700');
            rotateButton.innerHTML = `<span>⏸️</span><span>${brainModelLocale.stop}</span>`;
            rotateButton.setAttribute('aria-pressed', 'true');
        } else {
            rotateButton.classList.remove('bg-purple-700');
            rotateButton.innerHTML = `<span>⚡</span><span>${brainModelLocale.autoRotate}</span>`;
            rotateButton.setAttribute('aria-pressed', 'false');
        }
    }

    // Auto rotation toggled
}

/**
 * Render loop with performance optimization
 */
function startRenderLoop() {
    let lastTime = 0;
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;

    function animate(currentTime) {
        animationId = requestAnimationFrame(animate);

        // Limit frame rate for performance
        const deltaTime = currentTime - lastTime;
        if (deltaTime < frameTime) return;

        lastTime = currentTime - (deltaTime % frameTime);

        // Auto rotation - only Y-axis (clockwise when viewed from above)
        if (isRotating && brainGroup) {
            brainGroup.rotation.y += 0.008; // Slightly faster and only Y-axis rotation
        }

        if (brainRenderer && brainScene && brainCamera) {
            brainRenderer.render(brainScene, brainCamera);
        }
    }

    animate(0);
}

/**
 * Handle window resize with debouncing
 */
let resizeTimeout;
function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        const container = document.getElementById('brain-3d-container');
        if (container && brainCamera && brainRenderer) {
            const containerRect = container.getBoundingClientRect();
            const width = containerRect.width || container.offsetWidth;
            const height = containerRect.height || container.offsetHeight || 384;

            brainCamera.aspect = width / height;
            brainCamera.updateProjectionMatrix();
            brainRenderer.setSize(width, height);

            // Ensure canvas fits container exactly
            brainRenderer.domElement.style.width = '100%';
            brainRenderer.domElement.style.height = '100%';

            // Resized canvas dimensions
        }
    }, 250);
}

window.addEventListener('resize', handleResize);

/**
 * Show fallback with helpful information
 */
function showBrainFallback(container) {
    container.innerHTML = `
        <div class="flex items-center justify-center w-full h-full p-8 bg-gray-50 rounded-lg">
            <div class="text-center max-w-md">
                <div class="text-8xl mb-4 animate-pulse">🧠</div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${brainModelLocale.brainModel}</h3>
                <p class="text-gray-600 mb-4">
                    ${brainModelLocale.threeRequired}
                </p>
                <div class="text-sm text-gray-500">
                    <p>${brainModelLocale.bestExperience}</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Setup region card links with improved highlighting
 */
function setupRegionCardLinks() {
    // Find brain region cards using both possible selectors
    const regionCards = document.querySelectorAll('[data-brain-region], [data-region]');

    regionCards.forEach(card => {
        const regionName = card.getAttribute('data-brain-region') || card.getAttribute('data-region');

        // Add click event for persistent highlighting
        card.addEventListener('click', (e) => {
            e.preventDefault();
            selectBrainRegion(regionName);
        });

        // Remove hover effects since we want persistent selection only
        // No hover preview to avoid confusion with selection state

        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', brainModelLocale.highlightRegion(regionName));

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectBrainRegion(regionName);
            }
        });
    });

    // Only log connection count - remove spammy debug info
    if (regionCards.length > 0) {
        console.log(`✅ Connected ${regionCards.length} brain region cards`);
    } else {
        console.warn('⚠️ No brain region cards found');
    }
}

/**
 * Select a brain region (replaces toggle functionality for persistent selection)
 */
function selectBrainRegion(regionName) {
    // If clicking the same region, do nothing (keeps it selected)
    if (selectedRegion === regionName) {
        return;
    }

    // Clear previous selection
    if (selectedRegion) {
        unhighlightBrainRegion(selectedRegion);
    }

    // Set new selection
    selectedRegion = regionName;
    highlightBrainRegion(regionName);
    
    // This will be called by external code when region details are closed
    // window.closeBrainRegionDetails will handle clearing the selection
}

/**
 * Highlight brain region with illumination/glow effect
 */
function highlightBrainRegion(regionName) {
    console.log(`🔍 Highlighting brain region: ${regionName}`);
    
    if (!brainGroup) {
        console.warn('⚠️ brainGroup not available for highlighting');
        return;
    }

    // Define different colors for lobes vs other structures
    const lobeGlowColor = new THREE.Color(0xffffff); // Almost white color for lobes
    const structureGlowColor = new THREE.Color(0xffddaa); // Warm golden color for other structures
    
    // For hemisphere lobes, use lighter coloring
    if (['frontal', 'parietal', 'temporal', 'occipital'].includes(regionName)) {
        // First, reset all hemisphere colors to ensure clean highlighting
        brainGroup.traverse(child => {
            if (child.isMesh && child.userData.lobeVertexGroups && child.userData.originalColors) {
                const colors = child.geometry.attributes.color;
                const originalColors = child.userData.originalColors;
                
                // Reset all colors first
                for (let i = 0; i < colors.count; i++) {
                    colors.setXYZ(
                        i,
                        originalColors[i * 3],
                        originalColors[i * 3 + 1],
                        originalColors[i * 3 + 2]
                    );
                }
                colors.needsUpdate = true;
            }
        });

        // Now highlight only the selected lobe
        brainGroup.traverse(child => {
            if (child.isMesh && child.userData.lobeVertexGroups) {
                const geometry = child.geometry;
                const colors = geometry.attributes.color;
                const lobeVertexGroups = child.userData.lobeVertexGroups;

                // Store original material properties if not already stored
                if (!child.userData.originalEmissive) {
                    child.userData.originalEmissive = child.material.emissive.clone();
                    child.userData.originalEmissiveIntensity = child.material.emissiveIntensity;
                    child.userData.originalShininess = child.material.shininess;
                }

                const vertexIndices = lobeVertexGroups[regionName];
                if (vertexIndices && vertexIndices.length > 0) {
                    // Only highlight specific vertices with bright white color - no material changes
                    // This keeps the highlighting precise to just the lobe area
                    vertexIndices.forEach(index => {
                        colors.setXYZ(index, lobeGlowColor.r, lobeGlowColor.g, lobeGlowColor.b);
                    });
                    colors.needsUpdate = true;
                    
                    // Don't apply material-level changes to avoid highlighting entire hemispheres
                    // Keep the original material intact for precise lobe-only highlighting
                }
            }
        });
    } else {
        // For non-hemisphere structures (cerebellum, brainstem, thalamus), use material highlighting
        const regions = findBrainRegions(regionName);
        
        regions.forEach(region => {
            region.traverse(child => {
                if (child.isMesh) {
                    // Store original material if not already stored
                    if (!child.userData.originalMaterial) {
                        child.userData.originalMaterial = child.material;
                    }

                    // Create illuminated material
                    const illuminatedMaterial = child.userData.originalMaterial.clone();
                    
                    // Make the base color brighter
                    const originalColor = child.userData.originalMaterial.color;
                    const illuminatedColor = new THREE.Color().lerpColors(
                        originalColor,
                        new THREE.Color(0xffffff),
                        0.5 // 50% brighter
                    );
                    
                    illuminatedMaterial.color = illuminatedColor;
                    illuminatedMaterial.emissive = structureGlowColor;
                    illuminatedMaterial.emissiveIntensity = 0.4; // Strong glow
                    illuminatedMaterial.shininess = 120; // Very shiny for illuminated effect
                    illuminatedMaterial.transparent = true;
                    illuminatedMaterial.opacity = 1.0;
                    
                    child.material = illuminatedMaterial;
                    child.material.needsUpdate = true;

                    // Add subtle scale animation for emphasis
                    if (!child.userData.originalScale) {
                        child.userData.originalScale = child.scale.clone();
                    }
                    child.scale.copy(child.userData.originalScale).multiplyScalar(1.03);
                    child.userData.highlighted = true;
                }
            });
        });
    }

    console.log(`✅ Highlighted ${regionName} with illumination effect`);
}

/**
 * Remove highlighting from brain region
 */
function unhighlightBrainRegion(regionName) {
    if (!brainGroup) return;

    // For hemisphere lobes, restore vertex colors
    if (['frontal', 'parietal', 'temporal', 'occipital'].includes(regionName)) {
        brainGroup.traverse(child => {
            if (child.isMesh && child.userData.lobeVertexGroups) {
                const geometry = child.geometry;
                const colors = geometry.attributes.color;
                const lobeVertexGroups = child.userData.lobeVertexGroups;
                const originalColors = child.userData.originalColors;

                const vertexIndices = lobeVertexGroups[regionName];
                if (vertexIndices) {
                    vertexIndices.forEach(index => {
                        colors.setXYZ(
                            index,
                            originalColors[index * 3],
                            originalColors[index * 3 + 1],
                            originalColors[index * 3 + 2]
                        );
                    });
                }

                colors.needsUpdate = true;
                
                // For lobes, we only modify vertex colors, not materials or scale
                // No need to restore material properties
            }
        });
    } else {
        // For non-hemisphere structures, use the original method
        const regions = findBrainRegions(regionName);

        regions.forEach(region => {
            region.traverse(child => {
                if (child.isMesh && child.userData.originalMaterial) {
                    child.material = child.userData.originalMaterial;

                    // Reset scale if it was highlighted
                    if (child.userData.highlighted && child.userData.originalScale) {
                        child.scale.copy(child.userData.originalScale);
                        child.userData.highlighted = false;
                    }
                }
            });
        });
    }
}

/**
 * Reset all brain region highlighting
 */
function resetBrainRegionHighlight() {
    if (!brainGroup) return;

    brainGroup.traverse(child => {
        if (child.isMesh) {
            // Reset vertex colors for hemisphere meshes
            if (child.userData.lobeVertexGroups && child.userData.originalColors) {
                const colors = child.geometry.attributes.color;
                const originalColors = child.userData.originalColors;
                
                for (let i = 0; i < colors.count; i++) {
                    colors.setXYZ(
                        i,
                        originalColors[i * 3],
                        originalColors[i * 3 + 1],
                        originalColors[i * 3 + 2]
                    );
                }
                colors.needsUpdate = true;
                
                // For lobes, we only modify vertex colors, not materials or scale  
                // No need to reset material properties
            }
            
            // Reset material for other structures
            if (child.userData.originalMaterial) {
                child.material = child.userData.originalMaterial;

                // Reset scale if it was highlighted
                if (child.userData.highlighted && child.userData.originalScale) {
                    child.scale.copy(child.userData.originalScale);
                    child.userData.highlighted = false;
                }
            }
        }
    });

    selectedRegion = null;
}

/**
 * Find brain regions with improved mapping
 */
function findBrainRegions(regionName) {
    if (!brainGroup) return [];

    const foundRegions = [];

    // Enhanced region mapping for specific and bilateral highlighting
    const regionMappings = {
        // Short form names from HTML data-region attributes
        'frontal': ['frontal-lobe-left', 'frontal-lobe-right'],
        'parietal': ['parietal-lobe-left', 'parietal-lobe-right'],
        'temporal': ['temporal-lobe-left', 'temporal-lobe-right'],
        'occipital': ['occipital-lobe-left', 'occipital-lobe-right'],
        'cerebellum': ['cerebellum'],
        'brainstem': ['brainstem'],
        'thalamus': ['thalamus'], // Thalamus highlighting shows separate thalamus structure
        'corpus-callosum': ['corpus-callosum'],

        // Full form names for compatibility
        'frontal-lobe': ['frontal-lobe-left', 'frontal-lobe-right'],
        'parietal-lobe': ['parietal-lobe-left', 'parietal-lobe-right'],
        'temporal-lobe': ['temporal-lobe-left', 'temporal-lobe-right'],
        'occipital-lobe': ['occipital-lobe-left', 'occipital-lobe-right'],

        // Hemisphere targeting
        'left-hemisphere': ['hemisphere-left', 'frontal-lobe-left', 'parietal-lobe-left', 'temporal-lobe-left', 'occipital-lobe-left'],
        'right-hemisphere': ['hemisphere-right', 'frontal-lobe-right', 'parietal-lobe-right', 'temporal-lobe-right', 'occipital-lobe-right'],
        'cerebral-cortex': ['hemisphere-left', 'hemisphere-right']
    };

    // Get mapped regions or use direct name
    const targetRegions = regionMappings[regionName] || [regionName];

    // Find all matching regions
    brainGroup.traverse(child => {
        if (child.userData && child.userData.region) {
            if (targetRegions.includes(child.userData.region)) {
                foundRegions.push(child);
            }
        }
    });

    return foundRegions;
}

// Make functions and variables globally available for external use
window.initStreamlinedBrain3DModel = initStreamlinedBrain3DModel;
window.resetBrainView = resetBrainView;
window.toggleAutoRotation = toggleAutoRotation;
window.highlightBrainRegion = highlightBrainRegion;
window.resetBrainRegionHighlight = resetBrainRegionHighlight;
window.selectedRegion = selectedRegion; // Expose selected region

// Override the old highlighting functions to use our new implementation
window.highlightBrainRegionIn3D = function (regionName) {
    selectBrainRegion(regionName);
};

window.selectBrainRegion = selectBrainRegion;

// Function to clear selection when region details are closed
window.closeBrainRegionDetails = function() {
    const regionDetails = document.getElementById('region-details');
    if (regionDetails) {
        // Reset to default content
        regionDetails.innerHTML = `
            <div class="text-center py-4">
                <div class="text-3xl mb-2">🧠</div>
                <h4 class="font-bold text-gray-700 dark:text-gray-300">${brainModelLocale.regionExplorer}</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ${brainModelLocale.regionPrompt}
                </p>
            </div>
        `;
    }

    // Clear visual selection from cards
    document.querySelectorAll('.brain-region-card').forEach(card => {
        card.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
        card.classList.add('bg-white', 'dark:bg-gray-800');
    });

    // Clear 3D highlighting
    if (selectedRegion) {
        unhighlightBrainRegion(selectedRegion);
        selectedRegion = null;
    }
    
    console.log('Brain region details closed and highlighting cleared');
};

// Test function for brain region highlighting
window.testBrainHighlight = function (regionName) {
    selectBrainRegion(regionName);
    setTimeout(() => {
        window.closeBrainRegionDetails();
    }, 3000);
};

// Auto-initialize if container exists (but prevent duplicate initialization)
document.addEventListener('DOMContentLoaded', () => {
    // Add small delay to ensure all elements are rendered
    setTimeout(() => {
        const container = document.getElementById('brain-3d-container');
        if (container && !container.dataset.initialized) {
            container.dataset.initialized = 'true';
            initStreamlinedBrain3DModel();
        }
    }, 500);
});
