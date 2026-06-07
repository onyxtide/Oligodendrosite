/**
 * Chapter 4: Brain Systems & Development - Interactive Features
 * Clean, optimized version focused on Circle of Willis simulation
 * Medical accuracy ensured, vessel quiz removed
 */

// Global state management
const chapter4State = {
    current3DModel: null,
    enhancedBrainModel: null,
    currentVessel: null,
    developmentStage: 'conception',
    rotationEnabled: false,
    selectedBrainRegion: null,
    strokeSimulationActive: false
};

const chapter4IsGreek = (document.documentElement.lang || '').startsWith('el') || window.location.pathname.includes('/gr/');

const chapter4Locale = chapter4IsGreek ? {
    cerebralCirculation: 'Εγκεφαλική Κυκλοφορία',
    vesselPrompt: 'Κάνε κλικ σε οποιοδήποτε αγγείο για να εξερευνήσεις αναλυτικές ανατομικές και κλινικές πληροφορίες',
    anatomicalData: 'Ανατομικά Δεδομένα',
    origin: 'Προέλευση:',
    diameter: 'Διάμετρος:',
    length: 'Μήκος:',
    flowRate: 'Ρυθμός ροής:',
    bloodSupplyTerritory: 'Περιοχή Αιμάτωσης',
    clinicalSignificance: 'Κλινική Σημασία',
    strokeSigns: 'Σημεία Εγκεφαλικού',
    bloodFlow: 'Ροή Αίματος',
    animateCirculation: 'Κίνηση κυκλοφορίας',
    stopFlow: 'Διακοπή Ροής',
    hideAnimation: 'Απόκρυψη κίνησης',
    bloodFlowStopped: '🔴 Η κίνηση της αιματικής ροής σταμάτησε',
    bloodFlowStarted: '🔵 Η κίνηση της αιματικής ροής ξεκίνησε',
    strokeSimulation: 'Προσομοίωση Εγκεφαλικού Επεισοδίου',
    educationalSimulation: 'Εκπαιδευτική Προσομοίωση',
    strokeIntro: 'Αυτή η προσομοίωση δείχνει τις επιδράσεις των αγγειακών εγκεφαλικών επεισοδίων για εκπαιδευτικούς σκοπούς. Επίλεξε ένα αγγείο για να προσομοιώσεις απόφραξη και να παρατηρήσεις τα νευρολογικά ελλείμματα που προκύπτουν.',
    selectVesselToOcclude: 'Επίλεξε Αγγείο για Απόφραξη:',
    leftMcaStroke: 'Εγκεφαλικό Αριστερής MCA (Το συχνότερο)',
    leftMcaSummary: 'Δεξιά ημιπληγία, αφασία, ημιανοψία',
    rightMcaStroke: 'Εγκεφαλικό Δεξιάς MCA',
    rightMcaSummary: 'Αριστερή ημιπληγία, χωρική παραμέληση, ανοσογνωσία',
    acaStroke: 'Εγκεφαλικό ACA',
    acaSummary: 'Αδυναμία κάτω άκρου, αλλαγές προσωπικότητας, αβουλία',
    pcaStroke: 'Εγκεφαλικό PCA',
    pcaSummary: 'Ελλείμματα οπτικών πεδίων, προβλήματα μνήμης, αλεξία',
    basilarStroke: 'Εγκεφαλικό Βασικής Αρτηρίας (Κρίσιμο)',
    basilarSummary: 'Σύνδρομο εγκλεισμού, κώμα, αναπνευστική ανεπάρκεια',
    resetAll: 'Επαναφορά Όλων',
    close: 'Κλείσιμο',
    resetStroke: 'Επαναφορά Εγκεφαλικού',
    clearSimulation: 'Καθαρισμός προσομοίωσης',
    strokeSimulationActive: 'Ενεργή Προσομοίωση Εγκεφαλικού',
    clinicalSignsSymptoms: 'Κλινικά Σημεία και Συμπτώματα:',
    seeVesselSymptoms: 'Δες τις λεπτομέρειες του αγγείου για συμπτώματα',
    affectedTerritory: 'Επηρεαζόμενη Περιοχή:',
    seeVesselTerritory: 'Δες τις λεπτομέρειες του αγγείου για πληροφορίες περιοχής',
    time: 'Χρόνος:',
    endSimulation: 'Τέλος Προσομοίωσης',
    occlusion: 'Απόφραξη',
    clinicalPresentation: 'Κλινική Εικόνα:',
    goToBloodSupply: 'Μετάβαση στην Αιμάτωση',
    strokeSimulator: 'Προσομοιωτής Εγκεφαλικού',
    simulateVesselOcclusion: 'Προσομοίωση απόφραξης αγγείου',
    resetNotification: '🔄 Η προσομοίωση αιμάτωσης επαναφέρθηκε'
} : {
    cerebralCirculation: 'Cerebral Circulation',
    vesselPrompt: 'Click on any vessel to explore detailed anatomical and clinical information',
    anatomicalData: 'Anatomical Data',
    origin: 'Origin:',
    diameter: 'Diameter:',
    length: 'Length:',
    flowRate: 'Flow Rate:',
    bloodSupplyTerritory: 'Blood Supply Territory',
    clinicalSignificance: 'Clinical Significance',
    strokeSigns: 'Stroke Signs',
    bloodFlow: 'Blood Flow',
    animateCirculation: 'Animate circulation',
    stopFlow: 'Stop Flow',
    hideAnimation: 'Hide animation',
    bloodFlowStopped: '🔴 Blood flow animation stopped',
    bloodFlowStarted: '🔵 Blood flow animation started',
    strokeSimulation: 'Stroke Simulation',
    educationalSimulation: 'Educational Simulation',
    strokeIntro: 'This simulation demonstrates the effects of cerebrovascular accidents for educational purposes. Select a vessel to simulate occlusion and observe the resulting neurological deficits.',
    selectVesselToOcclude: 'Select Vessel to Occlude:',
    leftMcaStroke: 'Left MCA Stroke (Most Common)',
    leftMcaSummary: 'Right hemiplegia, aphasia, hemianopia',
    rightMcaStroke: 'Right MCA Stroke',
    rightMcaSummary: 'Left hemiplegia, spatial neglect, anosognosia',
    acaStroke: 'ACA Stroke',
    acaSummary: 'Leg weakness, personality changes, abulia',
    pcaStroke: 'PCA Stroke',
    pcaSummary: 'Visual field defects, memory problems, alexia',
    basilarStroke: 'Basilar Artery Stroke (Critical)',
    basilarSummary: 'Locked-in syndrome, coma, respiratory failure',
    resetAll: 'Reset All',
    close: 'Close',
    resetStroke: 'Reset Stroke',
    clearSimulation: 'Clear simulation',
    strokeSimulationActive: 'Stroke Simulation Active',
    clinicalSignsSymptoms: 'Clinical Signs & Symptoms:',
    seeVesselSymptoms: 'See vessel details for symptoms',
    affectedTerritory: 'Affected Territory:',
    seeVesselTerritory: 'See vessel details for territory information',
    time: 'Time:',
    endSimulation: 'End Simulation',
    occlusion: 'Occlusion',
    clinicalPresentation: 'Clinical Presentation:',
    goToBloodSupply: 'Go to Blood Supply',
    strokeSimulator: 'Stroke Simulator',
    simulateVesselOcclusion: 'Simulate vessel occlusion',
    resetNotification: '🔄 Blood supply simulation reset'
};

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('🧠 Chapter 4: Brain Systems & Development - Initializing...');

    // Add immediate debug info
    console.log('🔍 Initial debug:', {
        THREE: typeof THREE,
        'THREE.OrbitControls': typeof THREE?.OrbitControls,
        brain3DContainer: !!document.getElementById('brain-3d-container'),
        vesselPaths: document.querySelectorAll('.vessel-path').length,
        devStageButtons: document.querySelectorAll('.dev-stage').length,
        tabButtons: document.querySelectorAll('.tab-button').length
    });

    // Simplified initialization - skip dependency waiting for now
    try {
        console.log('🔧 Starting direct initialization...');

        // Initialize core functionality
        console.log('🔧 Initializing tab navigation...');
        initTabNavigation();

        console.log('🔧 Initializing 3D brain model...');
        initStreamlinedBrain3DModel();

        console.log('🔧 Initializing blood supply simulation...');
        initBloodSupplySimulation();

        console.log('🔧 Initializing development timeline...');
        initDevelopmentTimeline();

        console.log('🔧 Initializing medical imaging...');
        initMedicalImaging();

        console.log('🔧 Initializing brain region cards...');
        initBrainRegionCards();

        console.log('🔧 Initializing cortical system navigation...');
        initCorticalSystemNavigation();


        // Set up global controller for external access
        window.chapter4Controller = {
            switchTab: switchTab,
            selectBrainRegion: selectBrainRegion,
            updateDevelopmentStage: updateDevelopmentStage,
            selectVessel: selectVessel,
            resetAllSimulations: resetAllSimulations,
            initBrain3DModel: initBrain3DModel
        };

        console.log('✅ Chapter 4 features loaded successfully!');

    } catch (error) {
        console.error('❌ Initialization error:', error);
        console.log('🔧 Attempting fallback initialization...');

        // Try basic initialization
        try {
            initTabNavigation();
            initBloodSupplySimulation();
            initDevelopmentTimeline();

            // Try to initialize brain model
            initStreamlinedBrain3DModel();

            console.log('✅ Fallback initialization completed');
        } catch (fallbackError) {
            console.error('❌ Fallback initialization failed:', fallbackError);
        }
    }
});

// Function to wait for all required dependencies
function waitForDependencies() {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 10;

        function check() {
            attempts++;
            console.log(`🔍 Checking dependencies (attempt ${attempts}/${maxAttempts})...`);
            console.log({
                THREE: typeof THREE,
                'THREE.Scene': typeof THREE?.Scene,
                'THREE.WebGLRenderer': typeof THREE?.WebGLRenderer,
                'THREE.OrbitControls': typeof THREE?.OrbitControls,
                EnhancedBrainModel: typeof EnhancedBrainModel
            });

            if (typeof THREE !== 'undefined' && typeof EnhancedBrainModel !== 'undefined') {
                console.log('✅ All dependencies loaded successfully');
                // Additional check for WebGL support
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                console.log('🔍 WebGL Support:', gl ? 'Supported' : 'Not Supported');
                if (!gl) {
                    console.warn('⚠️ WebGL not supported, enhanced model may fail to initialize');
                }
                resolve();
            } else if (attempts >= maxAttempts) {
                console.warn('⚠️ Dependencies not fully loaded after maximum attempts');
                console.log('Available dependencies:', {
                    THREE: typeof THREE,
                    'THREE.Scene': typeof THREE?.Scene,
                    'THREE.WebGLRenderer': typeof THREE?.WebGLRenderer,
                    'THREE.OrbitControls': typeof THREE?.OrbitControls,
                    EnhancedBrainModel: typeof EnhancedBrainModel
                });
                reject(new Error('Dependencies timeout'));
            } else {
                setTimeout(check, 500);
            }
        }

        check();
    });
}

/**
 * Initialize Tab Navigation
 */
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length === 0 || tabContents.length === 0) {
        console.warn('Tab elements not found');
        return;
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetId = button.getAttribute('aria-controls');
            switchTab(targetId, button);
        });
    });

    console.log(`✅ Initialized ${tabButtons.length} tabs`);
}

/**
 * Switch to a specific tab
 */
function switchTab(activeTabId, activeButton) {
    // Close any open stroke simulation modals when switching tabs
    const strokeModal = document.getElementById('stroke-simulation-modal');
    if (strokeModal) {
        strokeModal.remove();
    }

    // Also close stroke effects modal
    const strokeEffectsModal = document.getElementById('stroke-effects-modal');
    if (strokeEffectsModal) {
        closeStrokeEffectsModal();
    }

    // Update button states
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.remove('text-red-700');
        btn.classList.add('text-gray-500');
        btn.setAttribute('aria-selected', 'false');
    });

    if (activeButton) {
        activeButton.classList.add('active');
        activeButton.classList.remove('text-gray-500');
        activeButton.classList.add('text-red-700');
        activeButton.setAttribute('aria-selected', 'true');
    }

    // Update content visibility
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    const targetContent = document.getElementById(activeTabId);
    if (targetContent) {
        targetContent.classList.add('active');

        // Initialize tab-specific features
        setTimeout(() => {
            switch (activeTabId) {
                case 'content-anatomy':
                    refreshBrain3DModel();
                    break;
                case 'content-blood':
                    refreshBloodSupplyDiagram();
                    break;
                case 'content-development':
                    // Development timeline already initialized
                    break;
                case 'content-imaging':
                    initMedicalImaging();
                    break;
                case 'content-modern':
                    console.log('🔬 Frontiers tab activated');
                    break;
            }
        }, 100);
    }
}

/**
 * Initialize Blood Supply Simulation
 */
function initBloodSupplySimulation() {
    console.log('🔧 Initializing blood supply simulation...');

    const vesselPaths = document.querySelectorAll('.vessel-path');
    const showFlowButton = document.getElementById('show-flow');
    const strokeButton = document.getElementById('simulate-stroke-btn');
    const resetButton = document.getElementById('reset-blood-supply');

    console.log(`🔍 Found ${vesselPaths.length} vessel paths`);
    console.log(`🔍 Show flow button found: ${!!showFlowButton}`);

    if (vesselPaths.length === 0) {
        console.warn('⚠️ Blood vessel paths not found - tab may not be visible');
        return;
    }

    // Add enhanced click handlers to vessels
    vesselPaths.forEach(path => {
        // Remove any existing event listeners first
        path.removeEventListener('click', path._vesselClickHandler);

        // Create a new click handler and store reference for later removal
        path._vesselClickHandler = function () {
            const vesselId = this.dataset.vessel;
            console.log(`🔍 Vessel clicked: ${vesselId}`);
            selectVessel(vesselId);
        };

        path.addEventListener('click', path._vesselClickHandler);

        path.addEventListener('mouseenter', function () {
            if (!this.classList.contains('vessel-selected') && !this.classList.contains('stroke-highlighted')) {
                // Clear any inline styles and add hover class
                this.removeAttribute('style');
                this.classList.add('vessel-hover');
            }
        });

        path.addEventListener('mouseleave', function () {
            // Always remove hover class on mouse leave
            this.classList.remove('vessel-hover');
            if (!this.classList.contains('vessel-selected') && !this.classList.contains('stroke-highlighted')) {
                // Clear inline styles for unselected vessels
                this.removeAttribute('style');
            }
        });
    });

    // Enhanced button event listeners
    if (showFlowButton) {
        console.log('✅ Blood flow button found, adding event listener');
        showFlowButton.addEventListener('click', toggleBloodFlow);
    } else {
        console.error('❌ Blood flow button not found');
    }

    if (strokeButton) {
        strokeButton.addEventListener('click', showStrokeSimulationMenu);
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetBloodSupply);
    }

    // Initialize improved stroke simulation
    initInlineStrokeSimulation();

    // Add debugging to test click handlers
    console.log('🔍 Testing vessel click handlers...');
    vesselPaths.forEach((path, index) => {
        console.log(`🔍 Vessel ${index + 1}: ${path.dataset.vessel}, handler attached: ${!!path._vesselClickHandler}`);
    });

    console.log(`✅ Blood supply simulation initialized with ${vesselPaths.length} vessels`);
}

/**
 * Select and display vessel information with toggle functionality
 */
function selectVessel(vesselId) {
    const vesselInfo = document.getElementById('vessel-info');
    if (!vesselInfo) {
        console.error('❌ vessel-info element not found!');
        return;
    }
    console.log(`🔍 Selecting vessel: ${vesselId}`);

    // Check if this vessel is already selected
    const currentVessel = chapter4State.currentVessel;
    const isCurrentlySelected = currentVessel === vesselId;

    // If clicking the same vessel, deselect it
    if (isCurrentlySelected) {
        // Clear all selections and inline styles
        document.querySelectorAll('.vessel-path').forEach(path => {
            path.classList.remove('vessel-selected');
            // Force clear any inline styles
            path.removeAttribute('style');
        });

        // Reset vessel info to default state
        vesselInfo.innerHTML = `
            <div class="text-center py-8">
                <div class="text-4xl mb-3">🩸</div>
                <h4 class="font-bold text-gray-700 dark:text-gray-300 mb-2">${chapter4Locale.cerebralCirculation}</h4>
                <p class="text-gray-500 dark:text-gray-400 text-sm">
                    ${chapter4Locale.vesselPrompt}
                </p>
            </div>
        `;

        // Clear current vessel state
        chapter4State.currentVessel = null;

        // Also clear any stroke highlighting if active
        document.querySelectorAll('.vessel-path').forEach(v => {
            v.classList.remove('stroke-highlighted');
        });

        console.log('🔄 Vessel deselected');
        return;
    }

    // Clear all vessel selections and inline styles
    document.querySelectorAll('.vessel-path').forEach(path => {
        path.classList.remove('vessel-selected', 'vessel-hover');
        // Force clear any inline styles that might be interfering
        path.removeAttribute('style');
    });

    const selectedVessel = document.querySelector(`[data-vessel="${vesselId}"]`);
    if (selectedVessel) {
        // Clear any inline styles and hover states, then add selection class
        selectedVessel.removeAttribute('style');
        selectedVessel.classList.remove('vessel-hover');
        selectedVessel.classList.add('vessel-selected');
        console.log(`✅ Vessel highlighted: ${vesselId}`, selectedVessel);
        console.log(`🔍 Classes after selection:`, selectedVessel.className);

        // Add a MutationObserver to watch for class changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    console.log(`🔄 Class changed on ${vesselId}:`, selectedVessel.className);
                    if (!selectedVessel.classList.contains('vessel-selected')) {
                        console.error(`❌ Someone removed vessel-selected class from ${vesselId}!`);
                        console.trace('Call stack:');
                    }
                }
            });
        });
        observer.observe(selectedVessel, { attributes: true, attributeFilter: ['class'] });

        // Stop observing after 5 seconds
        setTimeout(() => observer.disconnect(), 5000);

        // Check multiple times to catch when the class disappears
        setTimeout(() => {
            console.log(`🔍 Classes after 50ms:`, selectedVessel.className);
            if (!selectedVessel.classList.contains('vessel-selected')) {
                console.warn(`⚠️ Vessel selection lost after 50ms: ${vesselId}`);
            }
        }, 50);

        setTimeout(() => {
            console.log(`🔍 Classes after 100ms:`, selectedVessel.className);
            if (selectedVessel.classList.contains('vessel-selected')) {
                console.log(`✅ Vessel selection confirmed: ${vesselId}`);
            } else {
                console.warn(`⚠️ Vessel selection lost after 100ms: ${vesselId}`);
            }
        }, 100);
    } else {
        console.warn(`⚠️ Could not find vessel element for: ${vesselId}`);
    }

    // Get enhanced vessel data
    const vesselData = getVesselData(vesselId);
    if (!vesselData) {
        console.error(`❌ No vessel data found for: ${vesselId}`);
        return;
    }
    console.log(`📊 Vessel data loaded:`, vesselData);

    // Create enhanced info panel
    vesselInfo.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg">
                <span class="text-4xl">🩸</span>
                <div>
                    <h4 class="text-xl font-bold text-red-600 dark:text-red-400">${vesselData.name}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${vesselData.fullName || vesselData.name}</p>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h5 class="font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center">
                        <span class="mr-2">📊</span> ${chapter4Locale.anatomicalData}
                    </h5>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">${chapter4Locale.origin}</span>
                            <span class="font-medium text-gray-800 dark:text-gray-200">${vesselData.origin}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">${chapter4Locale.diameter}</span>
                            <span class="font-medium text-gray-800 dark:text-gray-200">${vesselData.diameter}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">${chapter4Locale.length}</span>
                            <span class="font-medium text-gray-800 dark:text-gray-200">${vesselData.length || 'Variable'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">${chapter4Locale.flowRate}</span>
                            <span class="font-medium text-gray-800 dark:text-gray-200">${vesselData.flowRate || '~350 mL/min'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h5 class="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center">
                        <span class="mr-2">🧠</span> ${chapter4Locale.bloodSupplyTerritory}
                    </h5>
                    <p class="text-sm text-gray-700 dark:text-gray-300">${vesselData.supply}</p>
                </div>
            </div>
            
            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h5 class="font-semibold text-yellow-600 dark:text-yellow-400 mb-3 flex items-center">
                    <span class="mr-2">⚕️</span> ${chapter4Locale.clinicalSignificance}
                </h5>
                <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">${vesselData.clinical}</p>
                ${vesselData.strokeSigns ? `
                    <div class="mt-3 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <h6 class="font-medium text-orange-600 dark:text-orange-400 mb-2">🚨 ${chapter4Locale.strokeSigns}</h6>
                        <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            ${vesselData.strokeSigns.map(sign => `<li>• ${sign}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
            
        </div>
    `;

    chapter4State.currentVessel = vesselId;
    // Remove popup notification in favor of integrated display
    // showNotification(`🩸 Selected ${vesselData.name}`, 'info');
    console.log(`Selected vessel: ${vesselId}`);
}

/**
 * Get vessel data with enhanced medical information
 */
function getVesselData(vesselId) {
    const vessels = {
        'aca': {
            name: 'Anterior Cerebral Artery (ACA)',
            fullName: 'Arteria cerebri anterior',
            supply: 'Supplies the medial surfaces of the frontal and parietal lobes, including the motor and sensory areas for the legs, supplementary motor area, and anterior cingulate cortex.',
            origin: 'Internal Carotid Artery',
            diameter: '2-3 mm',
            length: '~12 cm',
            flowRate: '~50-70 mL/min',
            clinical: 'ACA stroke typically causes leg weakness and sensory loss, personality changes, and apraxia. Often presents with abulia (lack of motivation) and executive dysfunction.',
            strokeSigns: [
                'Contralateral leg weakness (greater than arm)',
                'Urinary incontinence',
                'Abulia (lack of motivation)',
                'Personality changes',
                'Apraxia of left hand',
                'Mutism (if left ACA)'
            ]
        },
        'mca-left': {
            name: 'Left Middle Cerebral Artery (MCA)',
            fullName: 'Arteria cerebri media sinistra',
            supply: 'Supplies most of the lateral cerebral hemisphere including motor, sensory, and language areas (Broca\'s and Wernicke\'s areas), and the temporal lobe.',
            origin: 'Internal Carotid Artery',
            diameter: '3-4 mm',
            length: '~8-10 cm',
            flowRate: '~150-200 mL/min',
            clinical: 'Most common stroke location. Left MCA stroke causes right-sided weakness, aphasia, and neglect. Can be devastating due to large territory.',
            strokeSigns: [
                'Right hemiplegia (face, arm > leg)',
                'Broca\'s or Wernicke\'s aphasia',
                'Right hemianopia',
                'Right hemisensory loss',
                'Dysarthria',
                'Right facial weakness'
            ]
        },
        'mca-right': {
            name: 'Right Middle Cerebral Artery (MCA)',
            fullName: 'Arteria cerebri media dextra',
            supply: 'Supplies most of the lateral cerebral hemisphere on the right side, including motor and sensory areas, and areas for spatial processing.',
            origin: 'Internal Carotid Artery',
            diameter: '3-4 mm',
            length: '~8-10 cm',
            flowRate: '~150-200 mL/min',
            clinical: 'Right MCA stroke causes left-sided weakness, spatial neglect, and anosognosia (denial of illness). Often less recognized than left MCA strokes.',
            strokeSigns: [
                'Left hemiplegia (face, arm > leg)',
                'Left spatial neglect',
                'Left hemianopia',
                'Anosognosia (denial of deficit)',
                'Constructional apraxia',
                'Left hemisensory loss'
            ]
        },
        'pca': {
            name: 'Posterior Cerebral Artery (PCA)',
            fullName: 'Arteria cerebri posterior',
            supply: 'Supplies the occipital lobe, inferior temporal lobe, and parts of the thalamus, midbrain, and posterior limbic structures.',
            origin: 'Basilar Artery',
            diameter: '2-3 mm',
            length: '~6-8 cm',
            flowRate: '~40-60 mL/min',
            clinical: 'PCA stroke can cause visual field defects, memory problems, and reading difficulties (alexia). Thalamic involvement causes specific syndromes.',
            strokeSigns: [
                'Contralateral homonymous hemianopia',
                'Alexia without agraphia (left PCA)',
                'Memory impairment',
                'Visual agnosia',
                'Prosopagnosia (face recognition)',
                'Color anomia'
            ]
        },
        'ica-left': {
            name: 'Left Internal Carotid Artery (ICA)',
            fullName: 'Arteria carotis interna sinistra',
            supply: 'Main arterial supply to the left cerebral hemisphere via ACA and MCA branches, also supplies the ipsilateral eye via ophthalmic artery.',
            origin: 'Common Carotid Artery (at carotid bifurcation)',
            diameter: '4-6 mm',
            length: '~20-25 cm',
            flowRate: '~250-350 mL/min',
            clinical: 'ICA occlusion can cause massive stroke with hemiplegia, aphasia, and altered consciousness. May present with amaurosis fugax.',
            strokeSigns: [
                'Complete MCA + ACA syndrome',
                'Contralateral hemiplegia',
                'Global aphasia (left side)',
                'Hemianopia',
                'Amaurosis fugax',
                'Horner\'s syndrome'
            ]
        },
        'ica-right': {
            name: 'Right Internal Carotid Artery (ICA)',
            fullName: 'Arteria carotis interna dextra',
            supply: 'Main arterial supply to the right cerebral hemisphere via ACA and MCA branches, also supplies the ipsilateral eye via ophthalmic artery.',
            origin: 'Common Carotid Artery (at carotid bifurcation)',
            diameter: '4-6 mm',
            length: '~20-25 cm',
            flowRate: '~250-350 mL/min',
            clinical: 'Right ICA occlusion causes left hemiplegia and often spatial neglect syndrome. Less language involvement than left side.',
            strokeSigns: [
                'Complete MCA + ACA syndrome',
                'Contralateral hemiplegia',
                'Spatial neglect syndrome',
                'Hemianopia',
                'Amaurosis fugax',
                'Anosognosia'
            ]
        },
        'basilar': {
            name: 'Basilar Artery',
            fullName: 'Arteria basilaris',
            supply: 'Supplies the brainstem (pons and medulla), cerebellum, and posterior cerebrum via PCA. Critical for consciousness and vital functions.',
            origin: 'Vertebral Arteries (at vertebrobasilar junction)',
            diameter: '3-4 mm',
            length: '~3-4 cm',
            flowRate: '~100-150 mL/min',
            clinical: 'Basilar artery occlusion is often fatal, causing locked-in syndrome or coma. Emergency intervention required.',
            strokeSigns: [
                'Locked-in syndrome',
                'Coma or altered consciousness',
                'Quadriplegia',
                'Bilateral cranial nerve palsies',
                'Respiratory failure',
                'Ataxia (if partial)'
            ]
        },
        'acom': {
            name: 'Anterior Communicating Artery (ACoM)',
            fullName: 'Arteria communicans anterior',
            supply: 'Connects the two ACAs, providing collateral circulation between hemispheres. Critical for cross-flow during unilateral ICA disease.',
            origin: 'Between left and right ACAs',
            diameter: '1-2 mm',
            length: '~2-4 mm',
            flowRate: 'Variable (collateral dependent)',
            clinical: 'ACoM aneurysms are common and can cause subarachnoid hemorrhage. Rupture may cause severe neurological deficits.',
            strokeSigns: [
                'Subarachnoid hemorrhage symptoms',
                'Sudden severe headache',
                'Meningeal signs',
                'Altered consciousness',
                'Memory impairment',
                'Personality changes'
            ]
        },
        'pcom-left': {
            name: 'Left Posterior Communicating Artery (PCoM)',
            fullName: 'Arteria communicans posterior sinistra',
            supply: 'Connects the left ICA to the left PCA, providing collateral circulation between anterior and posterior circulations.',
            origin: 'Internal Carotid Artery to Posterior Cerebral Artery',
            diameter: '1-2 mm',
            length: '~12-15 mm',
            flowRate: 'Variable (collateral dependent)',
            clinical: 'PCoM aneurysms can cause third nerve palsy due to proximity to the oculomotor nerve. Important for stroke prevention.',
            strokeSigns: [
                'Third nerve palsy (aneurysm)',
                'Pupillary abnormalities',
                'Ptosis and diplopia',
                'Subarachnoid hemorrhage',
                'Headache',
                'Altered consciousness'
            ]
        },
        'pcom-right': {
            name: 'Right Posterior Communicating Artery (PCoM)',
            fullName: 'Arteria communicans posterior dextra',
            supply: 'Connects the right ICA to the right PCA, providing collateral circulation between anterior and posterior circulations.',
            origin: 'Internal Carotid Artery to Posterior Cerebral Artery',
            diameter: '1-2 mm',
            length: '~12-15 mm',
            flowRate: 'Variable (collateral dependent)',
            clinical: 'PCoM aneurysms can cause third nerve palsy due to proximity to the oculomotor nerve. Important for stroke prevention.',
            strokeSigns: [
                'Third nerve palsy (aneurysm)',
                'Pupillary abnormalities',
                'Ptosis and diplopia',
                'Subarachnoid hemorrhage',
                'Headache',
                'Altered consciousness'
            ]
        }
    };

    return vessels[vesselId] || null;
}

/**
 * Toggle blood flow animation
 */
let isToggling = false;

function toggleBloodFlow() {
    // Prevent rapid toggling
    if (isToggling) {
        console.log('⚠️ Toggle already in progress, ignoring');
        return;
    }

    isToggling = true;
    console.log('🩸 Blood flow toggle clicked');

    const flowAnimations = document.getElementById('flow-animations');
    const button = document.getElementById('show-flow');
    const svg = document.getElementById('circle-of-willis-svg');

    if (!flowAnimations || !svg) {
        console.error('❌ Required elements not found');
        isToggling = false;
        return;
    }

    // Check if animations are currently visible
    const computedStyle = window.getComputedStyle(flowAnimations);
    const isVisible = computedStyle.display !== 'none';

    console.log('Is visible:', isVisible);
    console.log('Currently animating:', isAnimating);

    if (isVisible || isAnimating) {
        // Hide animations
        flowAnimations.style.display = 'none';
        stopJSAnimations();
        if (button) {
            button.innerHTML = `
                <div class="text-3xl mb-2">💫</div>
                <div class="text-sm font-medium text-blue-600 dark:text-blue-400">${chapter4Locale.bloodFlow}</div>
                <div class="text-xs text-gray-500 mt-1">${chapter4Locale.animateCirculation}</div>
            `;
        }
        showNotification(chapter4Locale.bloodFlowStopped, 'info');
        console.log('✅ Blood flow animation stopped');
    } else {
        // Show animations - try both SVG and JS animation
        flowAnimations.style.display = 'block';
        // Small delay to ensure DOM is updated
        setTimeout(() => {
            startJSAnimations();
        }, 100);

        if (button) {
            button.innerHTML = `
                <div class="text-3xl mb-2">⏸️</div>
                <div class="text-sm font-medium text-blue-600 dark:text-blue-400">${chapter4Locale.stopFlow}</div>
                <div class="text-xs text-gray-500 mt-1">${chapter4Locale.hideAnimation}</div>
            `;
        }
        showNotification(chapter4Locale.bloodFlowStarted, 'success');
        console.log('✅ Blood flow animation started');
    }

    // Reset toggle lock after a short delay
    setTimeout(() => {
        isToggling = false;
    }, 300);
}

// JavaScript-based animation as fallback
let animationIntervals = [];
let isAnimating = false;

function startJSAnimations() {
    console.log('🔄 Starting JavaScript animations as fallback');

    // Don't start if already animating
    if (isAnimating) {
        console.log('⚠️ Animations already running');
        return;
    }

    const svg = document.getElementById('circle-of-willis-svg');
    if (!svg) {
        console.error('❌ SVG element not found');
        return;
    }

    // Clear any existing intervals first
    stopJSAnimations();

    isAnimating = true;

    // Create animated dots for each vessel
    const vessels = [
        { id: 'ica-left-path', color: '#ff3333' },
        { id: 'ica-right-path', color: '#ff3333' },
        { id: 'mca-left-path', color: '#ff5555' },
        { id: 'mca-right-path', color: '#ff5555' },
        { id: 'aca-path', color: '#ff7777' },
        { id: 'pca-path', color: '#ff7777' },
        { id: 'basilar-path', color: '#cc4444' }
    ];

    let createdDots = 0;

    vessels.forEach((vessel, index) => {
        const path = document.getElementById(vessel.id);
        if (!path) {
            console.warn(`⚠️ Path not found: ${vessel.id}`);
            return;
        }

        try {
            // Create animated dot
            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('r', '3');
            dot.setAttribute('fill', vessel.color);
            dot.setAttribute('opacity', '0.9');
            dot.setAttribute('class', 'blood-flow-dot');

            svg.appendChild(dot);
            createdDots++;
            console.log(`✅ Created dot ${createdDots} for ${vessel.id}`);

            // Animate the dot along the path
            let progress = index * 0.1; // Stagger start positions
            const speed = 0.015 + (index * 0.003); // Varied speeds

            const animateInterval = setInterval(() => {
                if (!isAnimating) {
                    clearInterval(animateInterval);
                    return;
                }

                progress += speed;
                if (progress > 1) progress = 0;

                try {
                    const pathLength = path.getTotalLength();
                    const point = path.getPointAtLength(progress * pathLength);

                    dot.setAttribute('cx', point.x);
                    dot.setAttribute('cy', point.y);
                } catch (e) {
                    console.warn('Path animation error:', e);
                    clearInterval(animateInterval);
                }
            }, 33); // ~30fps

            animationIntervals.push(animateInterval);
        } catch (e) {
            console.error('Error creating animation dot:', e);
        }
    });

    console.log(`✅ Created ${createdDots} animated dots`);
}

function stopJSAnimations() {
    console.log('🛑 Stopping JavaScript animations');

    isAnimating = false;

    // Clear all intervals
    animationIntervals.forEach(interval => {
        try {
            clearInterval(interval);
        } catch (e) {
            console.warn('Error clearing interval:', e);
        }
    });
    animationIntervals = [];

    // Remove all animated dots
    const dots = document.querySelectorAll('.blood-flow-dot');
    dots.forEach(dot => {
        try {
            dot.remove();
        } catch (e) {
            console.warn('Error removing dot:', e);
        }
    });

    console.log(`🧹 Removed ${dots.length} animated dots`);
}

/**
 * Show stroke simulation menu
 */
function showStrokeSimulationMenu() {
    // Ensure we're on the blood supply tab
    const bloodTab = document.querySelector('[aria-controls="content-blood"]');
    const bloodContent = document.getElementById('content-blood');

    if (!bloodContent || !bloodContent.classList.contains('active')) {
        console.log('Switching to blood supply tab for stroke simulation');
        if (bloodTab) {
            bloodTab.click();
        }
        // Wait for tab to switch before showing modal
        setTimeout(() => showStrokeSimulationMenuModal(), 200);
        return;
    }

    showStrokeSimulationMenuModal();
}

function showStrokeSimulationMenuModal() {
    // Remove existing modal if present
    const existingModal = document.getElementById('stroke-simulation-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create stroke simulation modal
    const modal = document.createElement('div');
    modal.id = 'stroke-simulation-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';

    // Close modal when clicking outside
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeStrokeModal();
        }
    });

    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        🧠⚠️ ${chapter4Locale.strokeSimulation}
                    </h2>
                    <button onclick="closeStrokeModal()" class="text-gray-500 hover:text-gray-700 text-2xl">
                        ×
                    </button>
                </div>
                
                <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                    <h3 class="font-semibold text-red-600 dark:text-red-400 mb-2">⚠️ ${chapter4Locale.educationalSimulation}</h3>
                    <p class="text-sm text-gray-700 dark:text-gray-300">
                        ${chapter4Locale.strokeIntro}
                    </p>
                </div>
                
                <div class="grid gap-3 mb-6">
                    <h3 class="font-semibold text-gray-700 dark:text-gray-300 mb-3">${chapter4Locale.selectVesselToOcclude}</h3>
                    
                    <button onclick="simulateSpecificStroke('mca-left')" 
                            class="p-4 text-left bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-700 transition-all">
                        <div class="font-medium text-red-600 dark:text-red-400">${chapter4Locale.leftMcaStroke}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">${chapter4Locale.leftMcaSummary}</div>
                    </button>
                    
                    <button onclick="simulateSpecificStroke('mca-right')" 
                            class="p-4 text-left bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-700 transition-all">
                        <div class="font-medium text-orange-600 dark:text-orange-400">${chapter4Locale.rightMcaStroke}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">${chapter4Locale.rightMcaSummary}</div>
                    </button>
                    
                    <button onclick="simulateSpecificStroke('aca')" 
                            class="p-4 text-left bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-700 transition-all">
                        <div class="font-medium text-yellow-600 dark:text-yellow-400">${chapter4Locale.acaStroke}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">${chapter4Locale.acaSummary}</div>
                    </button>
                    
                    <button onclick="simulateSpecificStroke('pca')" 
                            class="p-4 text-left bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700 transition-all">
                        <div class="font-medium text-purple-600 dark:text-purple-400">${chapter4Locale.pcaStroke}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">${chapter4Locale.pcaSummary}</div>
                    </button>
                    
                    <button onclick="simulateSpecificStroke('basilar')" 
                            class="p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-all">
                        <div class="font-medium text-gray-600 dark:text-gray-300">${chapter4Locale.basilarStroke}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">${chapter4Locale.basilarSummary}</div>
                    </button>
                </div>
                
                <div class="flex justify-center gap-3">
                    <button onclick="resetBloodSupply(); closeStrokeModal();" 
                            class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg">
                        ${chapter4Locale.resetAll}
                    </button>
                    <button onclick="closeStrokeModal()" 
                            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                        ${chapter4Locale.close}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeStrokeModal();
        }
    });
}

/**
 * Simulate specific stroke with detailed effects
 */
function simulateSpecificStroke(vesselId) {
    closeStrokeModal();

    // Reset any previous simulation
    resetBloodSupply();

    // Mark as stroke simulation active
    chapter4State.strokeSimulationActive = true;

    // Apply visual effects to the occluded vessel
    const vessel = document.querySelector(`[data-vessel="${vesselId}"]`);
    if (vessel) {
        vessel.classList.add('stroke-affected');
    }

    // Stop blood flow in affected vessel
    const flowAnimations = document.getElementById('flow-animations');
    if (flowAnimations) {
        flowAnimations.style.display = 'none';
    }

    // Get vessel data for stroke information
    const vesselData = getVesselData(vesselId);

    // Show detailed stroke information
    showStrokeEffectsModal(vesselId, vesselData);

    // Update stroke button
    const strokeButton = document.getElementById('simulate-stroke-btn');
    if (strokeButton) {
        strokeButton.innerHTML = `
            <div class="text-3xl mb-2">✅</div>
            <div class="text-sm font-medium text-red-600 dark:text-red-400">${chapter4Locale.resetStroke}</div>
            <div class="text-xs text-gray-500 mt-1">${chapter4Locale.clearSimulation}</div>
        `;
        strokeButton.onclick = () => resetBloodSupply();
    }

    // Integrated into the modal display instead of popup notification
    console.log(`Stroke simulation activated for: ${vesselId}`);
}

/**
 * Show detailed stroke effects modal
 */
function showStrokeEffectsModal(vesselId, vesselData) {
    // Remove existing modal if present
    const existingModal = document.getElementById('stroke-effects-modal');
    if (existingModal) {
        existingModal.remove();
    }

    if (!vesselData) return;

    // Check if we're on the blood supply tab, if not, show in vessel info instead
    const bloodContent = document.getElementById('content-blood');
    const vesselInfo = document.getElementById('vessel-info');

    if (!bloodContent || !bloodContent.classList.contains('active')) {
        // If not on blood supply tab, integrate into vessel info panel instead
        if (vesselInfo) {
            showStrokeEffectsInPanel(vesselId, vesselData, vesselInfo);
            return;
        }
    }

    const modal = document.createElement('div');
    modal.id = 'stroke-effects-modal';
    modal.className = 'fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border-2 border-red-500 max-w-xs z-40 p-4 transform transition-all duration-300 translate-y-0 max-h-96 overflow-y-auto';

    modal.innerHTML = `
        <div class="space-y-3">
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <h3 class="text-sm font-bold text-red-600 dark:text-red-400">
                        ${chapter4Locale.strokeSimulationActive}
                    </h3>
                </div>
                <button onclick="closeStrokeEffectsModal()" class="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            
            <div class="text-xs font-medium text-gray-700 dark:text-gray-300">
                ${vesselData.name}
            </div>
            
            <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded max-h-32 overflow-y-auto">
                <h4 class="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">${chapter4Locale.clinicalSignsSymptoms}</h4>
                <div class="text-xs text-red-700 dark:text-red-300 space-y-1">
                    ${vesselData.strokeSigns ? vesselData.strokeSigns.map(sign => `<div>• ${sign}</div>`).join('') : `<div>• ${chapter4Locale.seeVesselSymptoms}</div>`}
                </div>
            </div>
            
            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                <h4 class="text-xs font-semibold text-yellow-600 dark:text-yellow-400 mb-1">${chapter4Locale.affectedTerritory}</h4>
                <p class="text-xs text-yellow-700 dark:text-yellow-300">${vesselData.supply || chapter4Locale.seeVesselTerritory}</p>
            </div>
            
            <div class="flex justify-between items-center text-xs">
                <span class="text-gray-500 dark:text-gray-400">
                    ${chapter4Locale.time} <span id="stroke-timer">0:00</span>
                </span>
                <button onclick="closeStrokeEffectsModal()" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                    ${chapter4Locale.endSimulation}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add entrance animation
    setTimeout(() => {
        modal.style.transform = 'translateY(0)';
        modal.style.opacity = '1';
    }, 100);

    // Start stroke timer
    let seconds = 0;
    const timer = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const timerElement = document.getElementById('stroke-timer');
        if (timerElement) {
            timerElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        } else {
            clearInterval(timer);
        }
    }, 1000);

    // Store timer reference for cleanup
    modal.dataset.timerId = timer;

    // Auto-close after 30 seconds unless user interacts
    const autoCloseTimer = setTimeout(() => {
        if (document.getElementById('stroke-effects-modal')) {
            console.log('Auto-closing stroke effects modal after 30 seconds');
            closeStrokeEffectsModal();
        }
    }, 30000);

    // Cancel auto-close if user interacts with modal
    modal.addEventListener('mouseenter', () => {
        clearTimeout(autoCloseTimer);
    });
}

/**
 * Close stroke simulation modal
 */
function closeStrokeModal() {
    const modal = document.getElementById('stroke-simulation-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Close stroke effects modal
 */
function closeStrokeEffectsModal() {
    const modal = document.getElementById('stroke-effects-modal');
    if (modal) {
        // Clear timer if exists
        if (modal.dataset.timerId) {
            clearInterval(parseInt(modal.dataset.timerId));
        }
        modal.remove();
    }
}

/**
 * Show stroke effects integrated into vessel info panel
 */
function showStrokeEffectsInPanel(vesselId, vesselData, vesselInfoElement) {
    const strokeNotice = `
        <div class="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <div class="flex items-center gap-2 mb-3">
                <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h4 class="font-bold text-red-600 dark:text-red-400">🚨 ${chapter4Locale.strokeSimulationActive}</h4>
            </div>
            
            <p class="text-sm text-red-700 dark:text-red-300 mb-3 font-medium">
                ${vesselData.name} ${chapter4Locale.occlusion}
            </p>
            
            <div class="bg-red-100 dark:bg-red-800/30 p-3 rounded mb-3">
                <h5 class="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">${chapter4Locale.clinicalPresentation}</h5>
                <div class="text-sm text-red-700 dark:text-red-300 space-y-1">
                    ${vesselData.strokeSigns ? vesselData.strokeSigns.map(sign => `<div>• ${sign}</div>`).join('') : `<div>• ${chapter4Locale.seeVesselSymptoms}</div>`}
                </div>
            </div>
            
            <div class="flex gap-2">
                <button onclick="closeStrokeEffectsModal(); selectVessel('${vesselId}');" 
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm">
                    ${chapter4Locale.endSimulation}
                </button>
                <button onclick="switchTab('content-blood', document.querySelector('[aria-controls=\"content-blood\"]'))" 
                        class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm">
                    ${chapter4Locale.goToBloodSupply}
                </button>
            </div>
        </div>
    `;

    // Prepend stroke notice to existing vessel info
    vesselInfoElement.innerHTML = strokeNotice + vesselInfoElement.innerHTML;
}

/**
 * Reset blood supply simulation
 */
function resetBloodSupply() {
    // Reset all vessels - remove CSS classes and clear inline styles
    document.querySelectorAll('.vessel-path').forEach(path => {
        path.classList.remove('vessel-selected', 'stroke-affected', 'vessel-hover', 'stroke-highlighted');
        // Force clear any inline styles that might be interfering
        path.removeAttribute('style');
    });

    // Hide flow animations
    const flowAnimations = document.getElementById('flow-animations');
    if (flowAnimations) {
        flowAnimations.style.display = 'none';
    }

    // Reset buttons to original state
    const showFlowButton = document.getElementById('show-flow');
    if (showFlowButton) {
        showFlowButton.innerHTML = `
            <div class="text-3xl mb-2">💫</div>
            <div class="text-sm font-medium text-blue-600 dark:text-blue-400">${chapter4Locale.bloodFlow}</div>
            <div class="text-xs text-gray-500 mt-1">${chapter4Locale.animateCirculation}</div>
        `;
        // Event handler is already attached in initBloodSupplySimulation()
    }

    const strokeButton = document.getElementById('simulate-stroke-btn');
    if (strokeButton) {
        strokeButton.innerHTML = `
            <div class="text-3xl mb-2">⚠️</div>
            <div class="text-sm font-medium text-red-600 dark:text-red-400">${chapter4Locale.strokeSimulator}</div>
            <div class="text-xs text-gray-500 mt-1">${chapter4Locale.simulateVesselOcclusion}</div>
        `;
        strokeButton.onclick = showStrokeSimulationMenu;
    }

    // Reset vessel info panel
    const vesselInfo = document.getElementById('vessel-info');
    if (vesselInfo) {
        vesselInfo.innerHTML = `
            <div class="text-center py-8">
                <div class="text-4xl mb-3">🩸</div>
                <h4 class="font-bold text-gray-700 dark:text-gray-300 mb-2">${chapter4Locale.cerebralCirculation}</h4>
                <p class="text-gray-500 dark:text-gray-400 text-sm">
                    ${chapter4Locale.vesselPrompt}
                </p>
            </div>
        `;
    }

    // Close any open modals
    closeStrokeModal();
    closeStrokeEffectsModal();

    // Reset state
    chapter4State.currentVessel = null;
    chapter4State.strokeSimulationActive = false;

    showNotification(chapter4Locale.resetNotification, 'success');
    console.log('Blood supply simulation reset');
}

// Additional enhanced functionality

/**
 * Initialize Brain Region Cards with comprehensive data
 */
function initBrainRegionCards() {
    const regionCards = document.querySelectorAll('.brain-region-card');
    const regionDetails = document.getElementById('region-details');

    if (regionCards.length === 0) {
        console.warn('Brain region cards not found');
        return;
    }

    // Initialize region details with default content
    if (regionDetails && !regionDetails.innerHTML.trim()) {
        regionDetails.innerHTML = `
            <div class="text-center py-4">
                <div class="text-3xl mb-2">🧠</div>
                <h4 class="font-bold text-gray-700 dark:text-gray-300">Brain Region Explorer</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Click on any region below to explore detailed information
                </p>
            </div>
        `;
    }

    regionCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.style.transition = 'all 0.3s ease';

        card.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            const region = this.dataset.region;
            console.log(`Brain region card clicked: ${region}`);

            // Visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            selectBrainRegion(region);
        });

        // Add hover effects
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    console.log(`✅ Initialized ${regionCards.length} brain region cards`);
}

/**
 * Select and display brain region information with enhanced data
 */
function selectBrainRegion(region) {
    console.log(`selectBrainRegion called with: ${region}`);

    const regionDetails = document.getElementById('region-details');
    if (!regionDetails) {
        console.warn('Region details container not found');
        return;
    }

    const regionData = getBrainRegionData(region);
    if (!regionData) {
        console.warn(`No data found for region: ${region}`);
        return;
    }

    // Update visual state of cards
    document.querySelectorAll('.brain-region-card').forEach(card => {
        card.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
        card.classList.add('bg-white', 'dark:bg-gray-800');
    });

    const selectedCard = document.querySelector(`[data-region="${region}"]`);
    if (selectedCard) {
        selectedCard.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
        selectedCard.classList.remove('bg-white', 'dark:bg-gray-800');
    }

    // Clear all previous 3D highlights and highlight the selected region persistently
    if (typeof window.resetBrainRegionHighlight === 'function') {
        window.resetBrainRegionHighlight();
        console.log('✅ Cleared previous brain region highlights');
    }
    
    // Highlight the selected region in 3D model with persistent highlighting
    if (typeof window.highlightBrainRegion === 'function') {
        window.highlightBrainRegion(region, false); // false = not hover, persistent highlight
        console.log(`✅ Highlighting brain region: ${region} in 3D model`);
        
        // Add to highlighted regions set for persistence
        if (typeof window.highlightedRegions !== 'undefined') {
            window.highlightedRegions.clear(); // Clear previous selections
            window.highlightedRegions.add(region); // Add current selection
            console.log(`✅ Added ${region} to highlighted regions set`);
        }
    } else {
        console.warn('⚠️ highlightBrainRegion function not available from streamlined brain model');
        console.log('Available functions:', {
            highlightBrainRegion: typeof window.highlightBrainRegion,
            resetBrainRegionHighlight: typeof window.resetBrainRegionHighlight,
            highlightedRegions: typeof window.highlightedRegions
        });
    }

    regionDetails.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <div class="flex items-center gap-4">
                    <span class="text-4xl">${regionData.icon}</span>
                    <div>
                        <h4 class="text-xl font-bold text-blue-600 dark:text-blue-400">${regionData.name}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${regionData.latinName || ''}</p>
                    </div>
                </div>
                <button onclick="closeBrainRegionDetails()" class="ml-auto p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors" aria-label="Close region details">
                    <span class="text-xl text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</span>
                </button>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h5 class="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center">
                        <span class="mr-2">🎯</span> Primary Functions
                    </h5>
                    <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        ${regionData.functions.map(func => `<li>• ${func}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h5 class="font-semibold text-yellow-600 dark:text-yellow-400 mb-3 flex items-center">
                        <span class="mr-2">🔗</span> Key Connections
                    </h5>
                    <ul class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        ${regionData.connections.map(conn => `<li>• ${conn}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h5 class="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center">
                    <span class="mr-2">⚕️</span> Clinical Significance
                </h5>
                <p class="text-sm text-gray-700 dark:text-gray-300 mb-3">${regionData.clinical}</p>
                ${regionData.disorders ? `
                    <div class="mt-3 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <h6 class="font-medium text-orange-600 dark:text-orange-400 mb-2">🚨 Associated Disorders</h6>
                        <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                            ${regionData.disorders.map(disorder => `<li>• ${disorder}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
            
        </div>
    `;

    chapter4State.selectedBrainRegion = region;
    // Information now integrated in the region details panel
    console.log(`Selected brain region: ${region}`);
}

/**
 * Close brain region details and clear highlighting
 */
function closeBrainRegionDetails() {
    const regionDetails = document.getElementById('region-details');
    if (regionDetails) {
        // Reset to default content
        regionDetails.innerHTML = `
            <div class="text-center py-4">
                <div class="text-3xl mb-2">🧠</div>
                <h4 class="font-bold text-gray-700 dark:text-gray-300">Brain Region Explorer</h4>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Click on any region below to explore detailed information
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
    if (typeof window.resetBrainRegionHighlight === 'function') {
        window.resetBrainRegionHighlight();
        console.log('✅ Cleared 3D brain region highlighting');
    }

    // Clear selected region state
    chapter4State.selectedBrainRegion = null;
    
    console.log('Brain region details closed and highlighting cleared');
}

// highlightBrainRegionIn3D function removed - now handled by streamlined-brain-model.js

// highlightBrainRegion function removed - now handled by streamlined-brain-model.js

/**
 * Get comprehensive brain region data
 */
function getBrainRegionData(region) {
    const regions = {
        frontal: {
            name: 'Frontal Lobe',
            latinName: 'Lobus frontalis',
            icon: '🎯',
            functions: [
                'Executive function and planning',
                'Working memory and attention',
                'Motor control and movement initiation',
                'Language production (Broca\'s area)',
                'Personality and decision making',
                'Impulse control and judgment'
            ],
            connections: [
                'Parietal lobe via association fibers',
                'Temporal lobe through uncinate fasciculus',
                'Brainstem via corticospinal tract',
                'Thalamus through thalamocortical projections',
                'Contralateral frontal via corpus callosum'
            ],
            clinical: 'Frontal lobe damage can result in executive dysfunction, personality changes, motor deficits, and language production problems. The prefrontal cortex is crucial for higher-order cognitive functions.',
            disorders: [
                'Frontotemporal dementia',
                'ADHD (prefrontal dysfunction)',
                'Broca\'s aphasia',
                'Pseudobulbar affect',
                'Abulia and apathy syndromes'
            ]
        },
        parietal: {
            name: 'Parietal Lobe',
            latinName: 'Lobus parietalis',
            icon: '🤲',
            functions: [
                'Somatosensory processing',
                'Spatial awareness and navigation',
                'Attention and visual-spatial integration',
                'Body schema and proprioception',
                'Mathematical and reading comprehension',
                'Multisensory integration'
            ],
            connections: [
                'Frontal lobe via superior longitudinal fasciculus',
                'Occipital lobe through parieto-occipital connections',
                'Temporal lobe via inferior longitudinal fasciculus',
                'Thalamus (VPL/VPM nuclei)',
                'Contralateral parietal via corpus callosum'
            ],
            clinical: 'Parietal lesions can cause sensory neglect, apraxia, spatial disorientation, and difficulties with mathematical concepts. Right parietal damage often causes left-sided neglect.',
            disorders: [
                'Hemispatial neglect syndrome',
                'Gerstmann syndrome',
                'Ideomotor apraxia',
                'Astereognosis',
                'Balint syndrome'
            ]
        },
        temporal: {
            name: 'Temporal Lobe',
            latinName: 'Lobus temporalis',
            icon: '👂',
            functions: [
                'Auditory processing and hearing',
                'Language comprehension (Wernicke\'s area)',
                'Memory formation and retrieval',
                'Emotional processing (amygdala)',
                'Visual object recognition',
                'Semantic memory and concepts'
            ],
            connections: [
                'Frontal lobe via uncinate fasciculus',
                'Parietal lobe through superior longitudinal fasciculus',
                'Occipital lobe via inferior longitudinal fasciculus',
                'Limbic system (hippocampus, amygdala)',
                'Contralateral temporal via corpus callosum'
            ],
            clinical: 'Temporal lobe pathology can result in memory impairment, language comprehension deficits, auditory processing disorders, and seizures. Hippocampal damage severely affects new memory formation.',
            disorders: [
                'Temporal lobe epilepsy',
                'Wernicke\'s aphasia',
                'Amnesia syndromes',
                'Auditory agnosia',
                'Semantic dementia'
            ]
        },
        occipital: {
            name: 'Occipital Lobe',
            latinName: 'Lobus occipitalis',
            icon: '👁️',
            functions: [
                'Primary visual processing',
                'Visual field mapping',
                'Motion detection and tracking',
                'Color and form recognition',
                'Visual attention and scanning',
                'Visual-spatial integration'
            ],
            connections: [
                'Parietal lobe via parieto-occipital connections',
                'Temporal lobe through inferior longitudinal fasciculus',
                'Frontal lobe via long association fibers',
                'Thalamus (LGN) via optic radiations',
                'Contralateral occipital via corpus callosum'
            ],
            clinical: 'Occipital damage can cause visual field defects, cortical blindness, visual agnosia, and difficulties with visual perception. Bilateral damage can result in Anton syndrome.',
            disorders: [
                'Homonymous hemianopia',
                'Cortical blindness',
                'Visual agnosia',
                'Anton syndrome',
                'Palinopsia'
            ]
        },
        cerebellum: {
            name: 'Cerebellum',
            latinName: 'Cerebellum',
            icon: '⚖️',
            functions: [
                'Motor coordination and balance',
                'Motor learning and adaptation',
                'Cognitive function modulation',
                'Language and speech coordination',
                'Emotional regulation',
                'Timing and rhythm processing'
            ],
            connections: [
                'Brainstem via cerebellar peduncles',
                'Cerebral cortex through corticopontocerebellar tract',
                'Spinal cord via spinocerebellar tracts',
                'Vestibular system',
                'Deep cerebellar nuclei'
            ],
            clinical: 'Cerebellar dysfunction causes ataxia, dysmetria, intention tremor, and speech difficulties. Can also affect cognitive and emotional functions through cerebrocerebellar connections.',
            disorders: [
                'Cerebellar ataxia',
                'Dysarthria and dysphonia',
                'Intention tremor',
                'Cerebellar cognitive affective syndrome',
                'Spinocerebellar ataxias'
            ]
        },
        brainstem: {
            name: 'Brainstem',
            latinName: 'Truncus cerebri',
            icon: '🔌',
            functions: [
                'Vital functions (breathing, heart rate)',
                'Sleep-wake cycle regulation',
                'Cranial nerve functions',
                'Consciousness and arousal',
                'Reflexes and automatic responses',
                'Neurotransmitter system origins'
            ],
            connections: [
                'Cerebral cortex via ascending/descending tracts',
                'Cerebellum through cerebellar peduncles',
                'Spinal cord via brainstem tracts',
                'Cranial nerves III-XII',
                'Reticular formation networks'
            ],
            clinical: 'Brainstem lesions can be life-threatening, affecting consciousness, breathing, and vital functions. Can cause cranial nerve palsies and crossed neurological signs.',
            disorders: [
                'Locked-in syndrome',
                'Brainstem stroke',
                'Multiple sclerosis plaques',
                'Cranial nerve palsies',
                'Sleep disorders'
            ]
        },
        thalamus: {
            name: 'Thalamus',
            latinName: 'Thalamus',
            icon: '🔄',
            functions: [
                'Sensory relay to cortex',
                'Motor pathway modulation',
                'Consciousness and awareness',
                'Sleep and arousal regulation',
                'Attention and alertness',
                'Memory processing support'
            ],
            connections: [
                'All cortical areas via thalamocortical projections',
                'Basal ganglia through thalamic nuclei',
                'Brainstem reticular formation',
                'Limbic system connections',
                'Hypothalamus'
            ],
            clinical: 'Thalamic lesions can cause sensory loss, pain syndromes, movement disorders, and altered consciousness. Different nuclei have specific functions and lesion patterns.',
            disorders: [
                'Thalamic pain syndrome',
                'Thalamic aphasia',
                'Fatal familial insomnia',
                'Thalamic strokes',
                'Consciousness disorders'
            ]
        },
        'corpus-callosum': {
            name: 'Corpus Callosum',
            latinName: 'Corpus callosum',
            icon: '🌉',
            functions: [
                'Inter-hemispheric communication',
                'Transfer of motor, sensory, and cognitive information',
                'Coordination between brain hemispheres',
                'Integration of bilateral sensory inputs',
                'Cross-hemispheric memory consolidation',
                'Bilateral motor coordination'
            ],
            connections: [
                'Left and right cerebral cortex',
                'Frontal lobes through genu',
                'Parietal and temporal regions through body',
                'Occipital regions through splenium',
                'All cortical association areas'
            ],
            clinical: 'Corpus callosum lesions can cause disconnection syndromes, where the hemispheres cannot communicate effectively. This results in alien hand syndrome, split-brain phenomena, and impaired bilateral coordination.',
            disorders: [
                'Split-brain syndrome',
                'Alien hand syndrome',
                'Callosal agenesis',
                'Multiple sclerosis lesions',
                'Marchiafava-Bignami disease',
                'Callosal disconnection syndrome'
            ]
        }
    };

    return regions[region] || null;
}

/**
 * Initialize Development Timeline with enhanced functionality
 */
function initDevelopmentTimeline() {
    const stageButtons = document.querySelectorAll('.dev-stage');

    if (stageButtons.length === 0) {
        console.warn('Development stage buttons not found');
        return;
    }

    stageButtons.forEach(button => {
        button.addEventListener('click', function () {
            const stage = this.dataset.stage;
            updateDevelopmentStage(stage);
        });
    });

    // Initialize with the first stage (conception) by default
    const firstStage = stageButtons[0]?.dataset.stage || 'conception';
    updateDevelopmentStage(firstStage);

    console.log(`✅ Development timeline initialized with ${stageButtons.length} stages`);
}

/**
 * Update development stage display with enhanced data
 */
function updateDevelopmentStage(stage) {
    // Update button states
    document.querySelectorAll('.dev-stage').forEach(btn => {
        btn.classList.remove('active', 'bg-red-600', 'text-white');
        btn.classList.add('bg-gray-200', 'dark:bg-gray-700');
    });

    const activeButton = document.querySelector(`[data-stage="${stage}"]`);
    if (activeButton) {
        activeButton.classList.remove('bg-gray-200', 'dark:bg-gray-700');
        activeButton.classList.add('active', 'bg-red-600', 'text-white');
    }

    // Update progress bar with smooth animation
    const progressBar = document.getElementById('dev-progress');
    if (progressBar) {
        const stages = ['conception', 'neurulation', 'organogenesis', 'birth', 'childhood', 'adult'];
        const stageIndex = stages.indexOf(stage);

        if (stageIndex !== -1) {
            const progress = ((stageIndex + 1) / stages.length) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.style.transition = 'width 0.5s ease-in-out';

            console.log(`Progress bar updated: ${stage} (${stageIndex + 1}/${stages.length}) = ${progress}%`);
        } else {
            console.warn(`Stage "${stage}" not found in stages array`);
        }
    } else {
        console.warn('Progress bar element not found');
    }

    // Get and display stage data
    const stageData = getDevelopmentStageData(stage);
    if (stageData) {
        updateDevelopmentDisplay(stageData);

        // Ensure the development info section is visible
        const developmentInfo = document.getElementById('development-info');
        if (developmentInfo) {
            developmentInfo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    chapter4State.developmentStage = stage;
    console.log(`Updated development stage: ${stage}`);
}

/**
 * Get comprehensive development stage data
 */
function getDevelopmentStageData(stage) {
    const stages = {
        conception: {
            icon: '🧬',
            title: 'Conception (Day 0)',
            description: 'Fertilization occurs when a sperm penetrates the ovum, forming a diploid zygote with 46 chromosomes. This single totipotent cell contains the complete genetic blueprint for nervous system development, including neural fate determinants and transcription factors that will guide neurogenesis.',
            keyEvents: [
                'Sperm-egg membrane fusion and cortical reaction',
                'Nuclear pronuclei fusion forming diploid zygote',
                'First mitotic cleavage begins (~24 hours)',
                'Activation of embryonic genome (Day 3)',
                'Morula formation and compaction'
            ],
            clinical: [
                'Periconceptional folic acid (400-800 μg/day) prevents neural tube defects',
                'Maternal diabetes increases risk of neural tube defects (3-5x)',
                'Alcohol exposure can cause fetal alcohol spectrum disorders',
                'Advanced maternal age increases aneuploidy risk',
                'Pre-implantation genetic testing available for high-risk couples'
            ]
        },
        neurulation: {
            icon: '🦠',
            title: 'Neurulation (Weeks 3-4)',
            description: 'The neural plate forms from the dorsal ectoderm under the influence of the notochord and neural induction signals (BMP inhibition, Wnt signaling). Neural folds elevate and fuse to form the neural tube, establishing the primitive CNS with anterior-posterior and dorsal-ventral patterning.',
            keyEvents: [
                'Neural plate induction by notochord (Day 16-18)',
                'Neural groove and fold formation (Days 18-20)',
                'Primary neurulation: anterior tube closure (Day 22)',
                'Secondary neurulation: posterior tube closure (Day 26)',
                'Three primary brain vesicles appear: prosencephalon, mesencephalon, rhombencephalon'
            ],
            clinical: [
                'Neural tube defects occur in 1-2/1000 pregnancies',
                'Anencephaly: failure of anterior neural tube closure (lethal)',
                'Spina bifida: failure of posterior neural tube closure',
                'Folic acid reduces NTD risk by 50-70%',
                'Maternal hyperthermia (fever >38.5°C) increases risk',
                'Valproic acid exposure causes 1-2% NTD risk'
            ]
        },
        organogenesis: {
            icon: '👶',
            title: 'Organogenesis (Week 8)',
            description: 'Major organ systems form, including differentiation of brain regions. The basic brain structure emerges with distinct vesicles.',
            keyEvents: [
                'Brain vesicle differentiation',
                'Cranial nerve formation',
                'Early neuron migration',
                'Blood-brain barrier development'
            ],
            clinical: [
                'Teratogen sensitivity peak',
                'Alcohol affects brain development',
                'Medication safety concerns',
                'Infectious disease risks'
            ]
        },
        birth: {
            icon: '🍼',
            title: 'Birth (Week 40)',
            description: 'At birth, the brain has most neurons but lacks many connections. Rapid synaptogenesis and myelination will follow.',
            keyEvents: [
                'Neurogenesis largely complete',
                'Basic reflexes present',
                'Sensory systems functional',
                'Breathing centers active'
            ],
            clinical: [
                'Birth trauma risks',
                'Hypoxic-ischemic injury',
                'Premature brain vulnerability',
                'Early intervention importance'
            ]
        },
        childhood: {
            icon: '🧒',
            title: 'Childhood (0-12 years)',
            description: 'Explosive synaptogenesis peaks at different times across brain regions, followed by activity-dependent synaptic pruning. Critical periods for sensory systems, language acquisition, and executive function development. Peak synaptic density occurs at 2-4 years in sensory cortices, 7 years in prefrontal cortex.',
            keyEvents: [
                'Synaptic density peaks: visual cortex (8 months), language areas (3-4 years)',
                'Activity-dependent synaptic pruning eliminates 40% of synapses',
                'Myelination progresses: sensory → motor → association → prefrontal',
                'Critical periods: vision (0-7 years), language (0-puberty), executive function (preschool)',
                'Experience-dependent plasticity shapes neural circuits'
            ],
            clinical: [
                'Amblyopia must be treated before age 7 (critical period)',
                'Language deprivation has lasting effects if not corrected by puberty',
                'Early intervention for autism most effective before age 5',
                'Developmental delays detectable'
            ]
        },
        adult: {
            icon: '🧑',
            title: 'Adult (25+ years)',
            description: 'Structural brain maturation completes around age 25 with full myelination of prefrontal cortex. Adult neuroplasticity continues through synaptic remodeling, adult neurogenesis in hippocampus and olfactory bulb, and experience-dependent white matter changes. Cognitive reserve protects against age-related decline.',
            keyEvents: [
                'Prefrontal cortex myelination completes (~age 25)',
                'Peak white matter integrity (age 25-35)',
                'Continued adult hippocampal neurogenesis (~700 new neurons/day)',
                'Experience-dependent synaptic plasticity throughout life',
                'Gradual decline in processing speed begins (~age 30)',
                'Age-related brain volume loss starts (~0.5%/year after 40)'
            ],
            clinical: [
                'Peak cognitive performance in most domains (ages 25-35)',
                'Crystallized intelligence continues to increase with age',
                'Higher education and cognitive engagement build reserve',
                'Neurodegenerative disease risk increases with age',
                'Lifestyle factors (exercise, diet, sleep) affect brain aging',
                'Adult-onset psychiatric disorders may emerge'
            ]
        }
    };

    return stages[stage] || null;
}

/**
 * Update development display with enhanced formatting
 */
function updateDevelopmentDisplay(stageData) {
    const elements = {
        icon: document.getElementById('stage-icon'),
        title: document.getElementById('stage-title'),
        description: document.getElementById('stage-description'),
        keyEvents: document.getElementById('key-events'),
        clinical: document.getElementById('clinical-info')
    };

    if (elements.icon) elements.icon.textContent = stageData.icon;
    if (elements.title) elements.title.textContent = stageData.title;
    if (elements.description) elements.description.textContent = stageData.description;

    if (elements.keyEvents) {
        elements.keyEvents.innerHTML = stageData.keyEvents.map(event => `<li>${event}</li>`).join('');
    }

    if (elements.clinical) {
        elements.clinical.innerHTML = stageData.clinical.map(item => `<li>${item}</li>`).join('');
    }
}

/**
 * Initialize Medical Imaging with enhanced functionality
 */
function initMedicalImaging() {
    // Check for advanced imaging controls first
    const planeSelect = document.getElementById('imaging-plane');
    const typeSelect = document.getElementById('imaging-type');
    const levelSlider = document.getElementById('section-level');

    if (planeSelect && typeSelect && levelSlider) {
        // Initialize advanced imaging controls
        initAdvancedMedicalImaging();
        return;
    }

    // Otherwise, initialize plane selector buttons
    initBrainImagingPlanes();
}

function initAdvancedMedicalImaging() {
    const placeholder = document.getElementById('imaging-placeholder');
    const planeSelect = document.getElementById('imaging-plane');
    const typeSelect = document.getElementById('imaging-type');
    const levelSlider = document.getElementById('section-level');
    const levelDisplay = document.getElementById('level-display');
    const toggleLabelsButton = document.getElementById('toggle-labels');

    planeSelect.addEventListener('change', updateMedicalImaging);
    typeSelect.addEventListener('change', updateMedicalImaging);
    levelSlider.addEventListener('input', function () {
        if (levelDisplay) {
            levelDisplay.textContent = this.value;
        }
        updateMedicalImaging();
    });

    if (toggleLabelsButton) {
        toggleLabelsButton.addEventListener('click', toggleImagingLabels);
    }

    console.log('✅ Medical imaging controls initialized');
}

/**
 * Update medical imaging display
 */
function updateMedicalImaging() {
    const canvas = document.getElementById('imaging-canvas');
    const placeholder = document.getElementById('imaging-placeholder');

    if (!canvas) return;

    const plane = document.getElementById('imaging-plane')?.value;
    const type = document.getElementById('imaging-type')?.value;
    const level = document.getElementById('section-level')?.value;

    if (placeholder) placeholder.style.display = 'none';
    canvas.style.display = 'block';

    drawMedicalImaging(canvas, plane, type, level);

    console.log(`Updated medical imaging: ${plane} ${type} level ${level}`);
}

/**
 * Show brain region pathways
 */
function showRegionPathways(region) {
    console.log(`Showing pathways for region: ${region}`);
    // Pathway information integrated into the interface
}


// resetBrainView function now handled by streamlined-brain-model.js

/**
 * Toggle brain auto-rotation
 */
function toggleBrainRotation() {
    chapter4State.rotationEnabled = !chapter4State.rotationEnabled;

    const button = document.getElementById('toggle-rotation');
    if (button) {
        button.textContent = chapter4State.rotationEnabled ? '⏸️ Stop Rotation' : '⚡ Auto Rotate';
    }

    showNotification(
        chapter4State.rotationEnabled ? '▶️ Auto rotation enabled' : '⏸️ Auto rotation disabled',
        'info'
    );

    console.log(`Brain rotation ${chapter4State.rotationEnabled ? 'enabled' : 'disabled'}`);
}

/**
 * Refresh brain 3D model when tab becomes active
 */
function refreshBrain3DModel() {
    console.log('🧠 Refreshing 3D brain model');
    // Re-initialize the 3D model using streamlined version
    initBrain3DModel();
}

/**
 * Refresh development timeline when tab becomes active
 */
function refreshDevelopmentTimeline() {
    updateDevelopmentStage(chapter4State.developmentStage);
}

/**
 * Refresh medical imaging when tab becomes active
 */
function refreshMedicalImaging() {
    setTimeout(updateMedicalImaging, 100);
}

/**
 * Draw medical imaging simulation
 */
function drawMedicalImaging(canvas, plane, type, level) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set drawing style for type and plane
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#666666';
    ctx.lineWidth = 2;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseSize = 80 + (level * 2);

    // Draw based on plane
    switch (plane) {
        case 'axial':
            drawAxialSection(ctx, centerX, centerY, baseSize, type, level);
            break;
        case 'coronal':
            drawCoronalSection(ctx, centerX, centerY, baseSize, type, level);
            break;
        case 'sagittal':
            drawSagittalSection(ctx, centerX, centerY, baseSize, type, level);
            break;
    }

    // Apply imaging effects
    applyImagingEffects(ctx, canvas, type);
}

/**
 * Draw axial brain section
 */
function drawAxialSection(ctx, centerX, centerY, size, type, level) {
    // Brain outline
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, size, size * 0.8, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Ventricles
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.ellipse(centerX - 20, centerY, 15, 8, 0, 0, 2 * Math.PI);
    ctx.ellipse(centerX + 20, centerY, 15, 8, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Level-specific details
    if (level > 10) {
        // Higher level - more cortical structures
        ctx.beginPath();
        ctx.arc(centerX, centerY - 30, 12, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

/**
 * Draw coronal brain section
 */
function drawCoronalSection(ctx, centerX, centerY, size, type, level) {
    // Brain outline
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, size * 0.9, size, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Lateral ventricles
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 20, 40, 8, 0, 0, Math.PI, true);
    ctx.stroke();

    // Hippocampi
    ctx.beginPath();
    ctx.ellipse(centerX - 25, centerY, 12, 20, 0, 0, 2 * Math.PI);
    ctx.ellipse(centerX + 25, centerY, 12, 20, 0, 0, 2 * Math.PI);
    ctx.stroke();
}

/**
 * Draw sagittal brain section
 */
function drawSagittalSection(ctx, centerX, centerY, size, type, level) {
    // Brain outline
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, size, size * 0.7, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Corpus callosum
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 15, 35, 6, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Brainstem
    ctx.beginPath();
    ctx.rect(centerX + 30, centerY + 20, 20, 40);
    ctx.stroke();

    // Cerebellum
    ctx.beginPath();
    ctx.arc(centerX + 45, centerY + 45, 25, 0, 2 * Math.PI);
    ctx.stroke();
}

/**
 * Apply imaging-specific visual effects
 */
function applyImagingEffects(ctx, canvas, type) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    switch (type) {
        case 'mri-t1':
            // T1-weighted appearance - bright white matter
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) {
                    data[i] = 200;     // R
                    data[i + 1] = 200; // G
                    data[i + 2] = 200; // B
                }
            }
            break;
        case 'mri-t2':
            // T2-weighted appearance - bright CSF
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) {
                    data[i] = 180;     // R
                    data[i + 1] = 180; // G
                    data[i + 2] = 220; // B
                }
            }
            break;
        case 'ct':
            // CT appearance - grayscale
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) {
                    const gray = 160;
                    data[i] = gray;     // R
                    data[i + 1] = gray; // G
                    data[i + 2] = gray; // B
                }
            }
            break;
        case 'anatomical':
            // Anatomical coloring
            for (let i = 0; i < data.length; i += 4) {
                if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) {
                    data[i] = 255;     // R
                    data[i + 1] = 200; // G
                    data[i + 2] = 180; // B
                }
            }
            break;
    }

    ctx.putImageData(imageData, 0, 0);
}

/**
 * Toggle imaging labels
 */
function toggleImagingLabels() {
    console.log('Toggling imaging labels');
    showNotification('🏷️ Imaging labels toggled', 'info');
}

// Make functions globally accessible
window.closeStrokeModal = closeStrokeModal;
window.closeStrokeEffectsModal = closeStrokeEffectsModal;
window.simulateSpecificStroke = simulateSpecificStroke;
window.highlightVesselTerritory = function (vesselId) {
    selectVessel(vesselId);
};
window.simulateVesselOcclusion = simulateSpecificStroke;
window.showRegionPathways = showRegionPathways;
window.highlightBrainRegion = highlightBrainRegion;
window.resetBrainView = resetBrainView;
window.selectBrainRegion = selectBrainRegion;
window.closeBrainRegionDetails = closeBrainRegionDetails;
window.toggleBrainRotation = toggleBrainRotation;

// Utility function for notifications
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${type === 'success' ? 'bg-green-600 text-white' :
        type === 'warning' ? 'bg-orange-600 text-white' :
            type === 'error' ? 'bg-red-600 text-white' :
                'bg-blue-600 text-white'
        }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 3D Brain Model Implementation - Now uses external streamlined version
/**
 * Brain 3D Model wrapper - delegates to streamlined implementation
 */
function initBrain3DModel() {
    // Delegate to the streamlined brain model
    if (typeof initStreamlinedBrain3DModel === 'function') {
        initStreamlinedBrain3DModel();
    } else {
        console.error('❌ Streamlined brain model not available');
        const container = document.getElementById('brain-3d-container');
        if (container) {
            container.innerHTML = `
                <div class="flex items-center justify-center w-full h-full p-4">
                    <div class="text-center">
                        <div class="text-4xl mb-3">🧠</div>
                        <div class="text-red-600 font-medium">Brain Model Unavailable</div>
                        <div class="text-sm text-gray-500 mt-2">Streamlined brain model not loaded</div>
                    </div>
                </div>
            `;
        }
    }
}

function refreshBloodSupplyDiagram() {
    console.log('🩸 Refreshing blood supply diagram');

    // Clear any existing state without interfering with event listeners
    const vesselPaths = document.querySelectorAll('.vessel-path');
    vesselPaths.forEach(path => {
        path.classList.remove('vessel-selected', 'vessel-hover', 'stroke-highlighted');
        path.removeAttribute('style');
    });

    // Reset vessel info to default state
    const vesselInfo = document.getElementById('vessel-info');
    if (vesselInfo) {
        vesselInfo.innerHTML = `
            <div class="text-center py-8">
                <div class="text-4xl mb-3">🩸</div>
                <h4 class="font-bold text-gray-700 dark:text-gray-300 mb-2">Cerebral Circulation</h4>
                <p class="text-gray-500 dark:text-gray-400 text-sm">
                    Click on any vessel to explore detailed anatomical and clinical information
                </p>
            </div>
        `;
    }

    // Hide flow animations
    const flowAnimations = document.getElementById('flow-animations');
    if (flowAnimations) {
        flowAnimations.style.display = 'none';
    }

    // Reset state
    chapter4State.currentVessel = null;
    chapter4State.strokeSimulationActive = false;

    // Re-initialize the blood supply simulation to ensure click handlers are attached
    initBloodSupplySimulation();
}

function resetAllSimulations() {
    resetBloodSupply();
    console.log('🔄 All simulations reset');
}

/**
 * Initialize Brain Imaging Plane functionality
 */
function initBrainImagingPlanes() {
    const planeButtons = document.querySelectorAll('.plane-selector');

    if (planeButtons.length === 0) {
        console.warn('Brain imaging plane buttons not found');
        return;
    }

    // Add click event listeners to plane buttons
    planeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const planeType = this.id.replace('-btn', '').replace('-plane', '');
            switchImagingPlane(planeType);
        });
    });

    // Initialize with axial plane
    switchImagingPlane('axial');

    console.log(`✅ Brain imaging initialized with ${planeButtons.length} plane selectors`);
}

/**
 * Switch between different imaging planes
 */
function switchImagingPlane(planeType) {
    console.log(`Switching to ${planeType} imaging plane`);

    // Update button states - remove all possible highlight classes
    document.querySelectorAll('.plane-selector').forEach(btn => {
        btn.classList.remove(
            'active',
            'border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20',
            'border-green-500', 'bg-green-50', 'dark:bg-green-900/20',
            'border-purple-500', 'bg-purple-50', 'dark:bg-purple-900/20'
        );
        btn.classList.add('border-gray-300');
    });

    const activeButton = document.getElementById(`${planeType}-plane-btn`);
    if (activeButton) {
        activeButton.classList.add('active');
        activeButton.classList.remove('border-gray-300');

        // Set appropriate colors for each plane
        switch (planeType) {
            case 'axial':
                activeButton.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
                break;
            case 'coronal':
                activeButton.classList.add('border-green-500', 'bg-green-50', 'dark:bg-green-900/20');
                break;
            case 'sagittal':
                activeButton.classList.add('border-purple-500', 'bg-purple-50', 'dark:bg-purple-900/20');
                break;
        }
    }

    // Hide all views
    document.querySelectorAll('.plane-view').forEach(view => {
        view.classList.add('hidden');
    });

    // Show selected view
    const activeView = document.getElementById(`${planeType}-view`);
    if (activeView) {
        activeView.classList.remove('hidden');
    }

    // Update plane details
    updatePlaneDetails(planeType);

    console.log(`Switched to ${planeType} imaging plane`);
}

/**
 * Update plane details information
 */
function updatePlaneDetails(planeType) {
    const planeDetails = document.getElementById('plane-details');
    if (!planeDetails) return;

    const planeInfo = {
        axial: {
            title: 'Axial Plane Details',
            color: 'blue',
            alsoKnown: '• Transverse plane<br>• Horizontal plane',
            divides: '• Superior (upper) portions<br>• Inferior (lower) portions',
            clinical: 'Most common for CT scans. Essential for stroke localization and measuring brain structures.',
            example: '"Right frontal hemorrhage at the level of the lateral ventricles"'
        },
        coronal: {
            title: 'Coronal Plane Details',
            color: 'green',
            alsoKnown: '• Frontal plane<br>• Front-to-back plane',
            divides: '• Right hemisphere<br>• Left hemisphere',
            clinical: 'Excellent for viewing brain symmetry and deep structures like hippocampus and thalamus.',
            example: '"Bilateral hippocampal atrophy seen on coronal sections"'
        },
        sagittal: {
            title: 'Sagittal Plane Details',
            color: 'purple',
            alsoKnown: '• Midline plane<br>• Left-to-right plane',
            divides: '• Anterior (front) structures<br>• Posterior (back) structures',
            clinical: 'Perfect for viewing midline structures like corpus callosum, brainstem, and cerebellar vermis.',
            example: '"Corpus callosum dysgenesis visible on sagittal images"'
        }
    };

    const info = planeInfo[planeType];
    if (!info) return;

    planeDetails.innerHTML = `
        <h4 class="font-semibold text-${info.color}-600 dark:text-${info.color}-400 mb-3">📋 ${info.title}</h4>
        <div class="space-y-3 text-sm">
            <div>
                <h5 class="font-medium text-${info.color}-700 dark:text-${info.color}-300">Also Known As:</h5>
                <p class="text-gray-600 dark:text-gray-400">${info.alsoKnown}</p>
            </div>
            <div>
                <h5 class="font-medium text-${info.color}-700 dark:text-${info.color}-300">Divides Brain Into:</h5>
                <p class="text-gray-600 dark:text-gray-400">${info.divides}</p>
            </div>
            <div>
                <h5 class="font-medium text-${info.color}-700 dark:text-${info.color}-300">Clinical Use:</h5>
                <p class="text-gray-600 dark:text-gray-400">${info.clinical}</p>
            </div>
            <div>
                <h5 class="font-medium text-${info.color}-700 dark:text-${info.color}-300">Example Description:</h5>
                <p class="text-gray-600 dark:text-gray-400">${info.example}</p>
            </div>
        </div>
    `;

    // Update the background color of the details panel
    planeDetails.className = `bg-${info.color}-50 dark:bg-${info.color}-900/20 p-4 rounded-lg`;
}

// Enhanced Cortical System Navigation
function initCorticalSystemNavigation() {
    console.log('🧩 Initializing cortical system navigation...');

    const systemButtons = document.querySelectorAll('.cortex-system-btn');
    const systemContents = document.querySelectorAll('.cortex-system-content');

    if (!systemButtons.length) {
        console.log('⚠️ No cortical system buttons found, skipping initialization');
        return;
    }

    console.log(`🔍 Found ${systemButtons.length} cortical system buttons`);

    systemButtons.forEach(button => {
        button.addEventListener('click', function () {
            const systemType = this.dataset.system;
            switchCorticalSystem(systemType);

            // Add visual feedback
            showNotification(`🧩 ${systemType.charAt(0).toUpperCase() + systemType.slice(1)} system selected`, 'success');
        });

        // Add keyboard support
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    console.log('✅ Cortical system navigation initialized successfully');
}

function switchCorticalSystem(systemType) {
    console.log(`🔄 Switching to cortical system: ${systemType}`);

    // Update button states
    const systemButtons = document.querySelectorAll('.cortex-system-btn');
    systemButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.system === systemType) {
            btn.classList.add('active');
        }
    });

    // Update content visibility
    const systemContents = document.querySelectorAll('.cortex-system-content');
    systemContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `cortex-${systemType}-content`) {
            content.classList.add('active');
        }
    });

    // Update breadcrumb navigation
    const breadcrumbElement = document.getElementById('current-cortical-system');
    if (breadcrumbElement) {
        // Convert system type to display name
        const systemNames = {
            'motor': 'Motor System',
            'sensory': 'Sensory System', 
            'visual': 'Visual System',
            'auditory': 'Auditory System',
            'language': 'Language Areas',
            'executive': 'Executive Function',
            'association': 'Association Areas',
            'memory': 'Memory System',
            'emotional': 'Emotional System',
            'attention': 'Attention System'
        };
        
        const displayName = systemNames[systemType] || systemType.charAt(0).toUpperCase() + systemType.slice(1) + ' System';
        breadcrumbElement.textContent = displayName;
    }

    // Add smooth scroll to top of content
    const activeContent = document.getElementById(`cortex-${systemType}-content`);
    if (activeContent) {
        activeContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


// New Inline Stroke Simulation Functions
function initInlineStrokeSimulation() {
    console.log('🎯 Initializing improved stroke simulation...');

    // Get UI elements
    const showStrokePanel = document.getElementById('show-stroke-panel');
    const closeStrokePanel = document.getElementById('close-stroke-panel');
    const strokeSimulationPanel = document.getElementById('stroke-simulation-panel');
    const resetAll = document.getElementById('reset-all');

    // Show/hide stroke panel
    if (showStrokePanel && strokeSimulationPanel) {
        showStrokePanel.addEventListener('click', () => {
            strokeSimulationPanel.classList.remove('hidden');
            // Smooth scroll to panel
            strokeSimulationPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    if (closeStrokePanel && strokeSimulationPanel) {
        closeStrokePanel.addEventListener('click', () => {
            strokeSimulationPanel.classList.add('hidden');
            resetInlineStrokeSimulation();
        });
    }

    // Reset all functionality
    if (resetAll) {
        resetAll.addEventListener('click', () => {
            resetInlineStrokeSimulation();
            if (strokeSimulationPanel) {
                strokeSimulationPanel.classList.add('hidden');
            }
            resetBloodSupply();
        });
    }

    // Vessel selection buttons
    const vesselButtons = document.querySelectorAll('.stroke-vessel-btn');
    vesselButtons.forEach(button => {
        button.addEventListener('click', () => {
            const vessel = button.dataset.vessel;
            simulateStroke(vessel);
        });
    });

    // Reset button
    const resetButton = document.getElementById('reset-stroke-simulation');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            resetInlineStrokeSimulation();
        });
    }

    console.log('✅ Improved stroke simulation initialized');
}

function simulateStroke(vessel) {
    console.log(`🚨 Simulating stroke in ${vessel}...`);

    const strokeData = {
        'left-mca': {
            clinicalSigns: [
                'Right-sided hemiplegia (face, arm, leg)',
                'Aphasia (Broca\'s or Wernicke\'s)',
                'Right-sided hemianopia',
                'Apraxia',
                'Right-sided sensory loss',
                'Dysarthria'
            ],
            territory: 'Left middle cerebral artery territory: frontal, parietal, and temporal lobes including motor cortex, Broca\'s area, and primary sensory cortex.',
            severity: 'High'
        },
        'right-mca': {
            clinicalSigns: [
                'Left-sided hemiplegia (face, arm, leg)',
                'Left-sided neglect syndrome',
                'Left-sided hemianopia',
                'Anosognosia (denial of deficits)',
                'Left-sided sensory loss',
                'Constructional apraxia'
            ],
            territory: 'Right middle cerebral artery territory: frontal, parietal, and temporal lobes including motor cortex and areas responsible for spatial awareness.',
            severity: 'High'
        },
        'aca': {
            clinicalSigns: [
                'Contralateral leg weakness',
                'Urinary incontinence',
                'Abulia (lack of will/motivation)',
                'Personality changes',
                'Grasp reflex',
                'Alien hand syndrome (rare)'
            ],
            territory: 'Anterior cerebral artery territory: medial frontal lobe, supplementary motor area, and paracentral lobule.',
            severity: 'Moderate'
        },
        'pca': {
            clinicalSigns: [
                'Contralateral homonymous hemianopia',
                'Visual agnosia',
                'Alexia without agraphia',
                'Color anomia',
                'Prosopagnosia (face recognition issues)',
                'Memory impairment'
            ],
            territory: 'Posterior cerebral artery territory: occipital lobe, inferior temporal lobe, and medial temporal structures.',
            severity: 'Moderate'
        },
        'basilar': {
            clinicalSigns: [
                'Locked-in syndrome',
                'Coma or altered consciousness',
                'Quadriplegia',
                'Bilateral cranial nerve palsies',
                'Respiratory failure',
                'Ataxia (if partial)'
            ],
            territory: 'Basilar artery territory: brainstem (pons and medulla), cerebellum, and posterior cerebrum via posterior cerebral arteries.',
            severity: 'Critical'
        },
        'vertebral': {
            clinicalSigns: [
                'Dizziness and vertigo',
                'Nausea and vomiting',
                'Ataxia (coordination problems)',
                'Dysarthria (slurred speech)',
                'Dysphagia (difficulty swallowing)',
                'Ipsilateral facial numbness'
            ],
            territory: 'Vertebral artery territory: medulla, cerebellum, and posterior inferior cerebellar artery distribution.',
            severity: 'Moderate to High'
        }
    };

    const data = strokeData[vessel];
    if (!data) {
        console.error(`Unknown vessel: ${vessel}`);
        return;
    }

    // Show results section
    const resultsSection = document.getElementById('stroke-results');
    if (resultsSection) {
        resultsSection.classList.remove('hidden');

        // Populate clinical signs
        const clinicalSignsList = document.getElementById('clinical-signs');
        if (clinicalSignsList) {
            clinicalSignsList.innerHTML = '';
            data.clinicalSigns.forEach(sign => {
                const li = document.createElement('li');
                li.innerHTML = `• ${sign}`;
                clinicalSignsList.appendChild(li);
            });
        }

        // Populate affected territory
        const territoryElement = document.getElementById('affected-territory');
        if (territoryElement) {
            territoryElement.textContent = data.territory;
        }

        // Start treatment timer
        startTreatmentTimer();

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Highlight selected vessel button
    const vesselButtons = document.querySelectorAll('.stroke-vessel-btn');
    vesselButtons.forEach(btn => {
        btn.classList.remove('bg-red-200', 'dark:bg-red-700', 'border-red-400');
        if (btn.dataset.vessel === vessel) {
            btn.classList.add('bg-red-200', 'dark:bg-red-700', 'border-red-400');
        }
    });

    // Visual feedback on the SVG (if available)
    highlightStrokeVessel(vessel);
}

function startTreatmentTimer() {
    const timerElement = document.getElementById('treatment-timer');
    if (!timerElement) return;

    let timeRemaining = 4.5 * 60; // 4.5 hours in minutes

    const updateTimer = () => {
        const hours = Math.floor(timeRemaining / 60);
        const minutes = timeRemaining % 60;

        if (timeRemaining > 0) {
            timerElement.textContent = `${hours}.${minutes.toString().padStart(2, '0')} hours remaining for tPA`;
            timeRemaining--;
        } else {
            timerElement.textContent = 'Treatment window expired';
            timerElement.classList.remove('text-red-600', 'dark:text-red-400');
            timerElement.classList.add('text-gray-500', 'dark:text-gray-400');
        }
    };

    // Update immediately and then every minute
    updateTimer();
    const interval = setInterval(updateTimer, 60000);

    // Store interval ID for cleanup
    if (window.chapter4State) {
        window.chapter4State.treatmentTimer = interval;
    }
}

function highlightStrokeVessel(vessel) {
    // Remove previous highlights
    const vessels = document.querySelectorAll('.vessel-path');
    vessels.forEach(v => {
        v.classList.remove('stroke-highlighted');
    });

    // Add stroke highlighting based on vessel using actual SVG IDs
    const vesselMap = {
        'left-mca': 'mca-left-path',
        'right-mca': 'mca-right-path',
        'aca': 'aca-path',
        'pca': 'pca-path',
        'basilar': 'basilar-path',
        'vertebral': 'vertebral-left-path' // Now using actual vertebral artery
    };

    const vesselId = vesselMap[vessel];
    if (vesselId) {
        const vesselElement = document.getElementById(vesselId);
        if (vesselElement) {
            vesselElement.classList.add('stroke-highlighted');
            console.log(`✅ Highlighted vessel: ${vesselId}`);
        } else {
            console.warn(`⚠️ Vessel element not found: ${vesselId}`);
        }
    } else {
        console.warn(`⚠️ No mapping found for vessel: ${vessel}`);
    }
}

function resetInlineStrokeSimulation() {
    console.log('🔄 Resetting improved stroke simulation...');

    // Hide results section
    const resultsSection = document.getElementById('stroke-results');
    if (resultsSection) {
        resultsSection.classList.add('hidden');
    }

    // Clear vessel button selections
    const vesselButtons = document.querySelectorAll('.stroke-vessel-btn');
    vesselButtons.forEach(btn => {
        btn.classList.remove('bg-red-200', 'dark:bg-red-700', 'border-red-400');
    });

    // Remove vessel highlights
    const vessels = document.querySelectorAll('.vessel-path');
    vessels.forEach(v => {
        v.classList.remove('stroke-highlighted');
    });

    // Clear treatment timer
    if (window.chapter4State && window.chapter4State.treatmentTimer) {
        clearInterval(window.chapter4State.treatmentTimer);
        window.chapter4State.treatmentTimer = null;
    }

    // Clear clinical signs and affected territory
    const clinicalSigns = document.getElementById('clinical-signs');
    if (clinicalSigns) {
        clinicalSigns.innerHTML = '';
    }

    const affectedTerritory = document.getElementById('affected-territory');
    if (affectedTerritory) {
        affectedTerritory.innerHTML = '';
    }

    // Reset state
    chapter4State.strokeSimulationActive = false;

    console.log('✅ Improved stroke simulation reset');
}

// Initialize the inline stroke simulation when the page loads
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        initInlineStrokeSimulation();
    }, 1000);
});

console.log('✅ Chapter 4 Clean Version with Enhanced Cortical Interactions Loaded Successfully!');
