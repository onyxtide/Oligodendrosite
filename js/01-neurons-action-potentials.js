/**
 * Chapter 1: Neurons & Action Potentials - Interactive Features
 * Handles all functionality specific to the neurons and action potentials chapter
 * Medical accuracy ensured, optimized for dark/light mode and mobile devices
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Chapter 1: Neurons & Action Potentials - Initializing...');

    // Initialize tab navigation first
    initTabNavigation();

    // Initialize theme detection and mobile responsiveness
    initThemeAndResponsiveness();

    // Initialize features that don't depend on specific tabs
    initSystemInteraction();
    initNerveInteraction();
    initNeuronTypeSwitching();

    // Initialize accessibility features
    initAccessibilityFeatures();

    // Tab-specific features will be initialized when tabs are activated
    console.log('✅ Chapter 1 features loaded successfully!');
});

/**
 * Initialize Theme Detection and Mobile Responsiveness
 */
function initThemeAndResponsiveness() {
    // Add touch and mobile optimization
    addTouchSupport();

    // Detect and apply theme
    detectAndApplyTheme();

    // Add responsive layout adjustments
    addResponsiveAdjustments();

    // Listen for theme changes
    window.addEventListener('themeChanged', detectAndApplyTheme);

    console.log('✅ Theme and responsiveness initialized');
}

/**
 * Add Touch Support for Mobile Devices
 */
function addTouchSupport() {
    // Enable touch events for SVG interactions
    document.addEventListener('touchstart', function (e) {
        // Prevent default to enable custom touch handling
        if (e.target.closest('.neuron-part, .system-part, .neuron-container')) {
            e.preventDefault();
        }
    }, { passive: false });

    // Add touch-friendly hover effects
    const interactiveElements = document.querySelectorAll('.neuron-part, .tab-button, button');
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', function () {
            this.classList.add('touch-active');
        });

        element.addEventListener('touchend', function () {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        });
    });
}

/**
 * Detect and Apply Theme
 */
function detectAndApplyTheme() {
    const isDark = document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply theme-specific adjustments
    if (isDark) {
        applyDarkThemeAdjustments();
    } else {
        applyLightThemeAdjustments();
    }

    // Update chart colors if chart exists
    updateChartColors(isDark);
}

/**
 * Apply Dark Theme Adjustments
 */
function applyDarkThemeAdjustments() {
    // Adjust SVG colors for dark mode
    const svgElements = document.querySelectorAll('#neuron-svg g');
    svgElements.forEach(group => {
        const paths = group.querySelectorAll('path');
        const circles = group.querySelectorAll('circle');
        const rects = group.querySelectorAll('rect');

        // Enhance contrast for dark mode
        paths.forEach(path => {
            const currentStroke = path.getAttribute('stroke');
            if (currentStroke && currentStroke !== 'none') {
                path.style.filter = 'brightness(1.3) saturate(1.2)';
            }
        });

        circles.forEach(circle => {
            const currentFill = circle.getAttribute('fill');
            if (currentFill && currentFill !== 'none') {
                circle.style.filter = 'brightness(1.2) saturate(1.1)';
            }
        });
    });

    // Adjust info panel for dark mode
    const infoPanel = document.getElementById('neuron-info');
    if (infoPanel) {
        infoPanel.style.backgroundColor = 'rgba(31, 41, 55, 0.95)';
        infoPanel.style.color = '#f9fafb';
        infoPanel.style.border = '1px solid #4b5563';
    }
}

/**
 * Apply Light Theme Adjustments
 */
function applyLightThemeAdjustments() {
    // Reset any dark theme specific adjustments
    const svgElements = document.querySelectorAll('#neuron-svg g path, #neuron-svg g circle');
    svgElements.forEach(element => {
        element.style.filter = '';
    });

    // Reset info panel for light mode
    const infoPanel = document.getElementById('neuron-info');
    if (infoPanel) {
        infoPanel.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        infoPanel.style.color = '#111827';
        infoPanel.style.border = '1px solid #e5e7eb';
    }
}

/**
 * Add Responsive Layout Adjustments
 */
function addResponsiveAdjustments() {
    function adjustLayout() {
        const width = window.innerWidth;

        // Mobile adjustments
        if (width < 768) {
            adjustForMobile();
        } else if (width < 1024) {
            adjustForTablet();
        } else {
            adjustForDesktop();
        }
    }

    // Initial adjustment
    adjustLayout();

    // Listen for resize events
    window.addEventListener('resize', adjustLayout);
}

/**
 * Mobile Layout Adjustments
 */
function adjustForMobile() {
    // Adjust tab navigation for mobile
    const tabNavigation = document.querySelector('.tab-navigation');
    if (tabNavigation) {
        tabNavigation.style.flexWrap = 'wrap';
        tabNavigation.style.justifyContent = 'center';
    }

    // Adjust neuron container for mobile
    const neuronContainer = document.querySelector('.neuron-container');
    if (neuronContainer) {
        neuronContainer.style.height = '300px';
        neuronContainer.style.minHeight = '280px';
    }

    // Adjust chart container for mobile
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        chartContainer.style.height = '200px';
        chartContainer.style.padding = '0.5rem';
    }

    // Enhanced mobile optimizations are now handled by CSS and the new modal system
}

/**
 * Tablet Layout Adjustments
 */
function adjustForTablet() {
    // Enhanced responsive design is now handled by CSS and the modal system
    console.log('📱 Tablet layout adjustments applied');
}

/**
 * Desktop Layout Adjustments
 */
function adjustForDesktop() {
    // Enhanced responsive design is now handled by CSS and the modal system
    console.log('🖥️ Desktop layout adjustments applied');
}

/**
 * Initialize Accessibility Features
 */
function initAccessibilityFeatures() {
    // Add keyboard navigation support
    addKeyboardNavigation();

    // Add ARIA labels and descriptions
    addAriaLabels();

    // Add screen reader support
    addScreenReaderSupport();

    console.log('✅ Accessibility features initialized');
}

/**
 * Add Keyboard Navigation
 */
function addKeyboardNavigation() {
    // Tab navigation with keyboard
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach((button, index) => {
        button.setAttribute('tabindex', '0');
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const nextIndex = e.key === 'ArrowRight' ?
                    (index + 1) % tabButtons.length :
                    (index - 1 + tabButtons.length) % tabButtons.length;
                tabButtons[nextIndex].focus();
            }
        });
    });

    // Neuron part navigation with keyboard
    const neuronParts = document.querySelectorAll('.neuron-part');
    neuronParts.forEach(part => {
        part.setAttribute('tabindex', '0');
        part.setAttribute('role', 'button');
        part.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Add ARIA Labels
 */
function addAriaLabels() {
    // Add ARIA labels to interactive elements
    const neuronParts = document.querySelectorAll('.neuron-part');
    neuronParts.forEach(part => {
        const partName = part.getAttribute('data-part');
        const title = part.getAttribute('data-title') || partName;
        part.setAttribute('aria-label', `Learn about ${title}`);
        part.setAttribute('aria-describedby', `${partName}-description`);
    });

    // Add ARIA labels to buttons
    const triggerBtn = document.getElementById('trigger-action-potential');
    if (triggerBtn) {
        triggerBtn.setAttribute('aria-label', 'Trigger action potential simulation');
        triggerBtn.setAttribute('aria-describedby', 'trigger-description');
    }

    const simulateBtn = document.getElementById('simulate-neuron-btn');
    if (simulateBtn) {
        simulateBtn.setAttribute('aria-label', 'Simulate signal transmission through neuron');
    }
}

/**
 * Add Screen Reader Support
 */
function addScreenReaderSupport() {
    // Add live region for dynamic updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.id = 'sr-live-region';
    document.body.appendChild(liveRegion);

    // Function to announce to screen readers
    window.announceToScreenReader = function (message) {
        const liveRegion = document.getElementById('sr-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    };
}
/**
 * Tab Navigation System
 * Handles switching between different tabs in the chapter
 */
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length === 0 || tabContents.length === 0) {
        console.log('No tabs found, skipping tab initialization');
        return;
    }

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tabId = this.id.replace('tab-', 'content-');
            switchTab(tabId, this);

            // Announce tab change to screen readers
            if (window.announceToScreenReader) {
                window.announceToScreenReader(`Switched to ${this.textContent.trim()} tab`);
            }
        });
    });

    console.log(`✅ Initialized ${tabButtons.length} tabs`);
    
    // Initialize the active tab (neuron tab should be active by default)
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        console.log('🎯 Initializing default active tab:', activeTab.id);
        initializeTabContent(activeTab.id);
    }
}

/**
 * Switch to a specific tab
 * @param {string} activeTabId - The ID of the tab content to show
 * @param {HTMLElement} activeButton - The button that was clicked
 */
function switchTab(activeTabId, activeButton) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
    });    // Reset all tab button styles and aria-selected attributes
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('text-blue-700');
        button.classList.add('text-gray-500');
        button.setAttribute('aria-selected', 'false');
    });

    // Show the active tab content
    const activeTab = document.getElementById(activeTabId);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.display = 'block';
    }

    // Highlight the active button
    if (activeButton) {
        activeButton.classList.remove('text-gray-500');
        activeButton.classList.add('text-blue-700');
        activeButton.setAttribute('aria-selected', 'true');
    }

    // Trigger any tab-specific initialization
    initializeTabContent(activeTabId);
}

/**
 * Initialize content when a tab becomes active
 * @param {string} tabId - The ID of the activated tab
 */
function initializeTabContent(tabId) {
    console.log('🔄 Initializing content for tab:', tabId);

    switch (tabId) {
        case 'content-neuron':
            // Initialize neuron diagram and interactions
            initNeuronSVG();
            setTimeout(() => initNeuronInteraction(), 100); // Small delay to ensure SVG is rendered
            break;
        case 'content-action':
            // Initialize action potential simulation
            initActionPotentialSimulation();
            if (document.getElementById('action-potential-chart') && !window.actionPotentialChart) {
                initDemoChart();
            }
            break;
        case 'content-system':
            // Initialize nervous system diagram
            initNervousSystemSVG();
            break;
        case 'content-types':
            // Initialize neuron type switching
            initNeuronTypeSwitching();
            break;
        case 'content-cranial':
            // Any cranial nerve specific initialization
            break;
        case 'content-modern':
            console.log('🔬 Modern Discoveries tab activated');
            break;
    }
}

/**
 * Initialize Neuron SVG (called when neuron tab is activated)
 */
function initNeuronSVG() {
    const neuronSvg = document.getElementById('neuron-svg');
    if (!neuronSvg) {
        console.log('❌ Neuron SVG container not found');
        return;
    }

    if (neuronSvg.children.length > 0) {
        console.log('✅ Neuron SVG already initialized');
        return; // Already initialized
    }

    console.log('🎨 Creating neuron SVG diagram');

    // Create the neuron SVG structure
    neuronSvg.innerHTML = `
        <!-- Dendrites -->
        <g id="dendrites" class="neuron-part" data-part="dendrites" data-title="Dendrites" 
           data-description="Branched extensions that receive signals from other neurons and convert chemical signals to electrical ones.">
            <path d="M50,100 Q80,80 100,120" stroke="#8884d8" stroke-width="4" fill="none"/>
            <path d="M50,150 Q80,130 100,170" stroke="#8884d8" stroke-width="4" fill="none"/>
            <path d="M50,200 Q80,220 100,180" stroke="#8884d8" stroke-width="4" fill="none"/>
            <path d="M50,250 Q80,270 100,230" stroke="#8884d8" stroke-width="4" fill="none"/>
        </g>

        <!-- Cell Body (Soma) -->
        <g id="soma" class="neuron-part" data-part="soma" data-title="Cell Body (Soma)"
           data-description="Contains the nucleus and most cellular organelles. Integrates incoming signals and maintains cell functions.">
            <circle cx="150" cy="200" r="40" fill="#82ca9d" stroke="#66bb6a" stroke-width="3"/>
            <circle cx="150" cy="200" r="15" fill="#4caf50" opacity="0.7"/>
            <text x="150" y="205" text-anchor="middle" fill="white" font-size="10" font-weight="bold">Nucleus</text>
        </g>

        <!-- Axon Hillock -->
        <g id="axon-hillock" class="neuron-part" data-part="axon-hillock" data-title="Axon Hillock"
           data-description="The trigger zone where action potentials are initiated due to high concentration of voltage-gated channels.">
            <path d="M190,200 Q220,200 250,200" stroke="#ffc658" stroke-width="8" fill="none"/>
        </g>

        <!-- Axon -->
        <g id="axon" class="neuron-part" data-part="axon" data-title="Axon"
           data-description="Long projection that carries action potentials away from the cell body to other neurons or target cells.">
            <line x1="250" y1="200" x2="600" y2="200" stroke="#ff7300" stroke-width="6"/>
            <!-- Myelin sheaths -->
            <rect x="280" y="190" width="40" height="20" fill="white" stroke="#ccc" stroke-width="1" rx="10"/>
            <rect x="340" y="190" width="40" height="20" fill="white" stroke="#ccc" stroke-width="1" rx="10"/>
            <rect x="400" y="190" width="40" height="20" fill="white" stroke="#ccc" stroke-width="1" rx="10"/>
            <rect x="460" y="190" width="40" height="20" fill="white" stroke="#ccc" stroke-width="1" rx="10"/>
            <rect x="520" y="190" width="40" height="20" fill="white" stroke="#ccc" stroke-width="1" rx="10"/>
        </g>

        <!-- Axon Terminals -->
        <g id="terminals" class="neuron-part" data-part="terminals" data-title="Axon Terminals"
           data-description="End points that release neurotransmitters into the synapse to communicate with the next neuron. They contain synaptic vesicles filled with neurotransmitters.">
            <path d="M600,200 C620,180 640,160 660,150" stroke="#ff8042" stroke-width="5" fill="none"/>
            <path d="M600,200 C620,220 640,240 660,250" stroke="#ff8042" stroke-width="5" fill="none"/>

            <circle cx="660" cy="150" r="10" fill="#ff8042"/>
            <circle cx="660" cy="175" r="10" fill="#ff8042"/>
            <circle cx="660" cy="225" r="10" fill="#ff8042"/>
            <circle cx="660" cy="250" r="10" fill="#ff8042"/>
        </g>

        <!-- Synapse -->
        <g id="synapse" class="neuron-part" data-part="synapse" data-title="Synapse"
           data-description="The junction between neurons where information is transmitted. It consists of the presynaptic terminal, synaptic cleft, and postsynaptic membrane.">
            <rect x="680" y="130" width="60" height="140" fill="#a4a4ff" rx="10"/>
            <text x="710" y="195" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Next</text>
            <text x="710" y="210" text-anchor="middle" fill="white" font-size="12" font-weight="bold">Neuron</text>
        </g>
    `;
}

/**
 * Initialize Nervous System SVG
 */
function initNervousSystemSVG() {
    const systemSvg = document.querySelector('#content-system svg');
    if (!systemSvg || systemSvg.children.length > 0) return; // Already initialized

    systemSvg.innerHTML = `
        <!-- Brain -->
        <g id="brain" class="system-part" data-part="brain">
            <ellipse cx="300" cy="100" rx="80" ry="60" fill="#ff6b6b" stroke="#e55656" stroke-width="3"/>
            <text x="300" y="105" text-anchor="middle" fill="white" font-weight="bold">Brain</text>
        </g>

        <!-- Spinal Cord -->
        <g id="spinal-cord" class="system-part" data-part="spinal-cord">
            <rect x="285" y="160" width="30" height="180" fill="#4ecdc4" stroke="#45b7b8" stroke-width="3" rx="15"/>
            <text x="300" y="255" text-anchor="middle" fill="white" font-weight="bold" font-size="12">Spinal</text>
            <text x="300" y="270" text-anchor="middle" fill="white" font-weight="bold" font-size="12">Cord</text>
        </g>

        <!-- Peripheral Nerves -->
        <g id="peripheral-nerves" class="system-part" data-part="peripheral-nerves">
            <!-- Left side nerves -->
            <line x1="285" y1="200" x2="150" y2="180" stroke="#feca57" stroke-width="4"/>
            <line x1="285" y1="220" x2="150" y2="220" stroke="#feca57" stroke-width="4"/>
            <line x1="285" y1="240" x2="150" y2="260" stroke="#feca57" stroke-width="4"/>
            <line x1="285" y1="280" x2="150" y2="320" stroke="#feca57" stroke-width="4"/>
            
            <!-- Right side nerves -->
            <line x1="315" y1="200" x2="450" y2="180" stroke="#feca57" stroke-width="4"/>
            <line x1="315" y1="220" x2="450" y2="220" stroke="#feca57" stroke-width="4"/>
            <line x1="315" y1="240" x2="450" y2="260" stroke="#feca57" stroke-width="4"/>
            <line x1="315" y1="280" x2="450" y2="320" stroke="#feca57" stroke-width="4"/>
            
            <text x="80" y="250" text-anchor="middle" fill="#f39801" font-weight="bold" font-size="12">Peripheral</text>
            <text x="80" y="265" text-anchor="middle" fill="#f39801" font-weight="bold" font-size="12">Nerves</text>
        </g>
    `;
}

/**
 * Enhanced Neuron Interaction
 * Handles both SVG neuron parts and interactive cards
 */
function initNeuronInteraction() {
    console.log('🔗 Initializing enhanced neuron interactions');
    
    try {
        // Initialize both SVG interactions and card interactions
        initSVGNeuronInteraction();
        initNeuronCardInteraction();
        
        // Initialize the signal transmission simulation
        initActionPotentialSimulation();
        
        console.log('✅ Enhanced neuron interactions initialized');
    } catch (error) {
        console.error('❌ Error initializing neuron interactions:', error);
        // Try individual initialization with error handling
        try {
            initSVGNeuronInteraction();
            console.log('✅ SVG neuron interactions initialized');
        } catch (svgError) {
            console.error('❌ Error initializing SVG interactions:', svgError);
        }
        
        try {
            initNeuronCardInteraction();
            console.log('✅ Card neuron interactions initialized');
        } catch (cardError) {
            console.error('❌ Error initializing card interactions:', cardError);
        }
        
        try {
            initActionPotentialSimulation();
            console.log('✅ Signal simulation initialized');
        } catch (simError) {
            console.error('❌ Error initializing signal simulation:', simError);
        }
    }
}

/**
 * Initialize SVG Neuron Part Interactions
 */
function initSVGNeuronInteraction() {
    const neuronParts = document.querySelectorAll('.neuron-part');
    console.log(`Found ${neuronParts.length} SVG neuron parts`);


    neuronParts.forEach((part, index) => {
        // Enhanced click interaction
        part.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            

            const partName = this.getAttribute('data-part');
            console.log('🖱️ Clicked SVG neuron part:', partName);
            
            // Expand corresponding card and highlight SVG part
            expandNeuronCard(partName);
            highlightNeuronPart(partName);
            
            // Add visual feedback
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // Enhanced hover effects
        part.addEventListener('mouseenter', function () {
            // Enhanced hover feedback with medical-grade visual cues
            this.style.filter = 'brightness(1.3) drop-shadow(0 0 15px rgba(59, 130, 246, 0.9))';
            this.style.transform = 'scale(1.02)';
            this.style.cursor = 'pointer';
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            this.style.zIndex = '10';
        });

        part.addEventListener('mouseleave', function () {
            this.style.filter = '';
            this.style.transform = '';
            this.style.zIndex = '';
        });

        // Touch support for mobile
        part.addEventListener('touchstart', function (e) {
            e.preventDefault();
            this.style.filter = 'brightness(1.3) drop-shadow(0 0 15px rgba(59, 130, 246, 0.9))';
        });

        part.addEventListener('touchend', function (e) {
            e.preventDefault();
            
            const partName = this.getAttribute('data-part');
            expandNeuronCard(partName);
            highlightNeuronPart(partName);
            
            // Reset styles after a delay
            setTimeout(() => {
                this.style.filter = '';
            }, 300);
        });

        // Accessibility: keyboard support
        part.setAttribute('tabindex', '0');
        part.setAttribute('role', 'button');
        part.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });

        // Add subtle pulse animation to make parts more discoverable
        part.style.animation = `neuron-pulse ${2 + index * 0.2}s ease-in-out infinite alternate`;
    });
}

/**
 * Initialize Neuron Card Interactions (Chapter 4 style)
 */
function initNeuronCardInteraction() {
    console.log('🚀 STARTING initNeuronCardInteraction...');
    
    const neuronCards = document.querySelectorAll('.neuron-structure-card');
    console.log(`🃏 Found ${neuronCards.length} neuron structure cards`);
    
    // Debug: List all found cards
    neuronCards.forEach((card, i) => {
        console.log(`Card ${i + 1}:`, card.getAttribute('data-neuron-part'), card);
    });

    if (neuronCards.length === 0) {
        console.error('❌ No neuron structure cards found! Check HTML structure.');
        console.log('🔍 All cards in document:', document.querySelectorAll('[data-neuron-part]'));
        return;
    }

    neuronCards.forEach((card, index) => {
        const partName = card.getAttribute('data-neuron-part');
        console.log(`🔧 Setting up card ${index + 1}: ${partName}`);
        
        card.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const partName = this.getAttribute('data-neuron-part');
            console.log('🖱️ DIRECT CLICK on neuron card:', partName);
            console.log('🔍 Card element:', this);
            console.log('🔍 Card classes:', this.className);
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Toggle card expansion
            console.log('📞 Calling toggleCardExpansion...');
            toggleCardExpansion(this, partName);
            
            // Highlight corresponding SVG part
            highlightNeuronPart(partName);
        });

        // Keyboard support
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log('⌨️ Keyboard triggered card:', this.getAttribute('data-neuron-part'));
                this.click();
            }
        });

        // Enhanced hover effects
        card.addEventListener('mouseenter', function () {
            const partName = this.getAttribute('data-neuron-part');
            console.log('🖱️ Hovering over card:', partName);
            // Highlight corresponding SVG part on hover
            highlightNeuronPartHover(partName);
        });

        card.addEventListener('mouseleave', function () {
            // Remove SVG highlighting
            clearNeuronPartHighlight();
        });
        
        console.log(`✅ Card ${index + 1} (${partName}) setup complete`);
    });
    
    console.log('✅ All neuron card interactions initialized');
}

/**
 * Expand a specific neuron card by part name
 */
function expandNeuronCard(partName) {
    console.log('🎯 Expanding neuron card for:', partName);
    
    // Map SVG parts to card parts when they don't match exactly
    const partMapping = {
        'axon-hillock': 'soma',  // Axon hillock is part of the soma
        'nodes': 'myelin',       // Nodes are related to myelin 
        'synapse': 'terminals'   // Synapse is related to terminals
    };
    
    const mappedPartName = partMapping[partName] || partName;
    console.log(`🗺️ Part mapping: ${partName} -> ${mappedPartName}`);
    
    const card = document.querySelector(`[data-neuron-part="${mappedPartName}"]`);
    if (!card) {
        console.log('❌ Card not found for:', partName, 'or mapped part:', mappedPartName);
        return;
    }
    
    console.log('✅ Found card for:', partName, '(mapped to:', mappedPartName, ')');
    
    // Collapse all other cards first (except this one)
    collapseAllCards(card);
    
    // Expand this card
    const expandedContent = card.querySelector('.expanded-content');
    const arrow = card.querySelector('.expansion-arrow');
    
    if (!expandedContent || !arrow) {
        console.log('❌ Missing expanded content or arrow in card for:', mappedPartName);
        return;
    }
    
    console.log('🚀 Expanding card elements...');
    
    // Remove hidden class and set up animation
    expandedContent.classList.remove('hidden');
    
    // Force reflow and measure content properly
    expandedContent.style.maxHeight = 'none'; // Remove height constraint to measure
    expandedContent.offsetHeight; // Force reflow
    
    // Get the actual content height
    const scrollHeight = expandedContent.scrollHeight;
    console.log('📏 Scroll height in expandNeuronCard:', scrollHeight);
    
    // Reset to 0 and then animate to full height
    expandedContent.style.maxHeight = '0px';
    
    // Set the max height for smooth expansion
    requestAnimationFrame(() => {
        expandedContent.style.maxHeight = scrollHeight + 'px';
    });
    arrow.style.transform = 'rotate(180deg)';
    
    // Add active state
    card.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
    
    // Scroll card into view smoothly
    setTimeout(() => {
        card.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }, 150);
    
    // Announce to screen readers
    if (window.announceToScreenReader) {
        const title = card.querySelector('h4')?.textContent || mappedPartName;
        window.announceToScreenReader(`Expanded ${title} information card`);
    }
    
    console.log('✅ Card expansion completed for:', partName, '(mapped to:', mappedPartName, ')');
}

/**
 * Toggle card expansion
 */
function toggleCardExpansion(card, partName) {
    console.log('🔄 Toggling card expansion for:', partName);
    
    const expandedContent = card.querySelector('.expanded-content');
    const arrow = card.querySelector('.expansion-arrow');
    
    if (!expandedContent || !arrow) {
        console.error('❌ Missing expanded content or arrow for:', partName);
        console.log('Card HTML:', card.outerHTML.substring(0, 200) + '...');
        return;
    }
    
    const isExpanded = !expandedContent.classList.contains('hidden');
    console.log('📊 Current state - isExpanded:', isExpanded);
    console.log('📊 Expanded content classes:', expandedContent.className);
    console.log('📊 Expanded content style.maxHeight:', expandedContent.style.maxHeight);
    console.log('📊 Expanded content scrollHeight:', expandedContent.scrollHeight);
    
    if (isExpanded) {
        // Collapse this card
        console.log('📉 Collapsing card:', partName);
        expandedContent.style.maxHeight = '0px';
        setTimeout(() => {
            expandedContent.classList.add('hidden');
        }, 300);
        arrow.style.transform = 'rotate(0deg)';
        card.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
        console.log('✅ Card collapsed');
    } else {
        // Collapse all other cards first (except this one)
        console.log('📈 Expanding card:', partName);
        collapseAllCards(card);
        
        // Expand this card
        console.log('🔓 Removing hidden class...');
        expandedContent.classList.remove('hidden');
        
        // Force reflow and measure content properly
        console.log('🔄 Forcing reflow...');
        expandedContent.style.maxHeight = 'none'; // Remove height constraint to measure
        expandedContent.offsetHeight; // Force reflow
        
        // Get the actual content height when expanded
        const scrollHeight = expandedContent.scrollHeight;
        console.log('📏 Scroll height after reflow:', scrollHeight);
        
        // Reset to 0 and then animate to full height
        expandedContent.style.maxHeight = '0px';
        
        // Set the max-height to enable smooth transition
        console.log('📐 Setting maxHeight to:', scrollHeight + 'px');
        requestAnimationFrame(() => {
            expandedContent.style.maxHeight = scrollHeight + 'px';
        });
        
        console.log('🔄 Rotating arrow...');
        arrow.style.transform = 'rotate(180deg)';
        
        console.log('🎨 Adding active styling...');
        card.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
        
        // Scroll into view after expansion
        setTimeout(() => {
            console.log('🚀 Scrolling card into view...');
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 150);
        
        // Announce to screen readers
        if (window.announceToScreenReader) {
            const title = card.querySelector('h4')?.textContent || partName;
            window.announceToScreenReader(`Expanded ${title} information`);
        }
        
        console.log('✅ Card expansion completed for:', partName);
    }
}

/**
 * Collapse all neuron cards
 */
function collapseAllCards(exceptCard = null) {
    console.log('📉 Collapsing all cards...');
    
    const cards = document.querySelectorAll('.neuron-structure-card');
    console.log(`Found ${cards.length} cards to collapse`);
    
    cards.forEach((card, index) => {
        // Skip the card that should stay expanded
        if (exceptCard && card === exceptCard) {
            console.log(`⏭️ Skipping card ${index + 1} (should stay expanded)`);
            return;
        }
        
        const expandedContent = card.querySelector('.expanded-content');
        const arrow = card.querySelector('.expansion-arrow');
        
        if (expandedContent && arrow) {
            // Collapse immediately without delay that interferes with expansion
            expandedContent.style.maxHeight = '0px';
            expandedContent.classList.add('hidden');
            arrow.style.transform = 'rotate(0deg)';
            card.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20');
            
            console.log(`✅ Collapsed card ${index + 1}`);
        }
    });
    
    console.log('✅ All cards collapsed');
}

/**
 * Highlight neuron part in SVG
 */
function highlightNeuronPart(partName) {
    // Clear previous highlights
    clearNeuronPartHighlight();
    
    const svgPart = document.querySelector(`[data-part="${partName}"]`);
    if (svgPart) {
        svgPart.style.filter = 'brightness(1.3) drop-shadow(0 0 15px rgba(59, 130, 246, 0.9))';
        svgPart.style.transform = 'scale(1.02)';
        svgPart.classList.add('highlighted');
        
        // Auto-clear highlight after 3 seconds
        setTimeout(() => {
            if (svgPart.classList.contains('highlighted')) {
                svgPart.style.filter = '';
                svgPart.style.transform = '';
                svgPart.classList.remove('highlighted');
            }
        }, 3000);
    }
}

/**
 * Highlight neuron part on hover
 */
function highlightNeuronPartHover(partName) {
    const svgPart = document.querySelector(`[data-part="${partName}"]`);
    if (svgPart && !svgPart.classList.contains('highlighted')) {
        svgPart.style.filter = 'brightness(1.15) drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))';
        svgPart.style.transition = 'all 0.3s ease';
    }
}

/**
 * Clear neuron part highlighting
 */
function clearNeuronPartHighlight() {
    const allParts = document.querySelectorAll('.neuron-part');
    allParts.forEach(part => {
        if (!part.classList.contains('highlighted')) {
            part.style.filter = '';
            part.style.transform = '';
        }
    });
}

// Modal functionality removed - now using expandable cards


/**
 * Action Potential Simulation Button
 * Handles the "Trigger Stimulus" button
 */
function initActionPotentialSimulation() {
    console.log('⚡ Initializing action potential simulation');

    const simulateBtn = document.getElementById('simulate-neuron-btn');
    const triggerBtn = document.getElementById('trigger-action-potential');
    const stimulusSlider = document.getElementById('stimulus-strength');
    const thresholdMessage = document.getElementById('threshold-message');

    console.log('Elements found:', {
        simulateBtn: !!simulateBtn,
        triggerBtn: !!triggerBtn,
        stimulusSlider: !!stimulusSlider,
        thresholdMessage: !!thresholdMessage
    });

    // Handle the neuron structure simulation button
    if (simulateBtn) {
        console.log('✅ Found simulate neuron button, adding event listener');
        simulateBtn.addEventListener('click', () => {
            console.log('🎬 Simulating signal transmission through neuron...');
            animateSignalTransmission();
        });
    } else {
        console.log('❌ Simulate neuron button not found!');
    }

    // Handle the action potential trigger button
    if (triggerBtn) {
        console.log('✅ Found trigger button, adding event listener');
        triggerBtn.addEventListener('click', () => {
            console.log('🔥 Trigger button clicked!');
            const stimulusValue = stimulusSlider ? parseInt(stimulusSlider.value) : 60;
            console.log('📊 Stimulus value:', stimulusValue);
            triggerActionPotential(stimulusValue);
        });
    } else {
        console.log('❌ Trigger button not found!');
    }

    // Handle stimulus slider changes
    if (stimulusSlider) {
        stimulusSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            updateStimulusDisplay(value);
        });
    }
}

/**
 * Trigger Action Potential Simulation with Enhanced Medical Accuracy
 */
function triggerActionPotential(stimulusValue) {
    console.log('🎯 triggerActionPotential called with value:', stimulusValue);

    const threshold = 50; // Representing ~15mV depolarization from -70mV to -55mV
    const thresholdMessage = document.getElementById('threshold-message');

    // Reset all phases first
    resetActionPotentialPhases();

    // Show or hide threshold message with medical accuracy
    if (thresholdMessage) {
        if (stimulusValue < threshold) {
            thresholdMessage.classList.remove('hidden');
            thresholdMessage.innerHTML = `
                <div class="flex items-start space-x-2">
                    <div class="flex-shrink-0 mt-0.5">
                        <svg class="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div>
                        <strong>Below Threshold:</strong> Stimulus strength ${stimulusValue}% (representing ~${Math.round(-70 + (stimulusValue * 0.3))}mV)<br>
                        <span class="text-sm">Threshold is -55mV. Current stimulus produces only local depolarization without triggering voltage-gated Na+ channels.</span>
                    </div>
                </div>
            `;
            thresholdMessage.className = 'mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg text-sm';
            console.log('⚠️ Below threshold, showing warning');

            // Announce to screen readers
            if (window.announceToScreenReader) {
                window.announceToScreenReader('Stimulus is below threshold. No action potential generated.');
            }
            return;
        } else {
            thresholdMessage.classList.remove('hidden');
            const calculatedVoltage = Math.round(-55 + ((stimulusValue - 50) * 0.5));
            thresholdMessage.innerHTML = `
                <div class="flex items-start space-x-2">
                    <div class="flex-shrink-0 mt-0.5">
                        <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                    <div>
                        <strong>Action Potential Triggered!</strong> Stimulus: ${stimulusValue}% (≈${calculatedVoltage}mV)<br>
                        <span class="text-sm">Voltage-gated Na+ channels open, initiating depolarization phase. Watch the membrane potential changes below.</span>
                    </div>
                </div>
            `;
            thresholdMessage.className = 'mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg text-sm';
        }
    }

    // Trigger action potential sequence with medically accurate timing
    console.log(`⚡ Triggering action potential with stimulus: ${stimulusValue}%`);

    const phaseSequence = [
        { phase: 'phase-resting', delay: 0, duration: 500 },
        { phase: 'phase-depolarization', delay: 500, duration: 300 },
        { phase: 'phase-repolarization', delay: 800, duration: 400 },
        { phase: 'phase-hyperpolarization', delay: 1200, duration: 300 },
        { phase: 'phase-recovery', delay: 1500, duration: 500 }
    ];

    phaseSequence.forEach(({ phase, delay, duration }) => {
        setTimeout(() => {
            console.log(`🔄 Highlighting phase: ${phase}`);
            highlightActionPotentialPhase(phase);

            // Announce phase to screen readers
            const phaseNames = {
                'phase-resting': 'Resting potential phase',
                'phase-depolarization': 'Depolarization phase - sodium channels open',
                'phase-repolarization': 'Repolarization phase - potassium channels open',
                'phase-hyperpolarization': 'Hyperpolarization phase - undershoot',
                'phase-recovery': 'Recovery phase - returning to resting potential'
            };

            if (window.announceToScreenReader && phaseNames[phase]) {
                window.announceToScreenReader(phaseNames[phase]);
            }
        }, delay);
    });

    updateActionPotentialChart(stimulusValue);
}

/**
 * Update Stimulus Display
 */
function updateStimulusDisplay(stimulusValue) {
    const threshold = 50;
    const thresholdMessage = document.getElementById('threshold-message');

    if (thresholdMessage) {
        if (stimulusValue < threshold) {
            thresholdMessage.classList.remove('hidden');
            thresholdMessage.textContent = `Current stimulus: ${stimulusValue}%. Threshold: ${threshold}%. Increase to trigger action potential.`;
            thresholdMessage.className = 'mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded text-sm';
        } else {
            thresholdMessage.classList.remove('hidden');
            thresholdMessage.textContent = `Stimulus: ${stimulusValue}%. Above threshold! Click "Trigger Stimulus" to see the action potential.`;
            thresholdMessage.className = 'mt-4 p-3 bg-green-100 border border-green-300 rounded text-sm';
        }
    }
}

/**
 * Update Action Potential Chart with Medically Accurate Values
 */
function updateActionPotentialChart(stimulusValue) {
    const chart = window.actionPotentialChart;
    if (!chart) {
        console.log('❌ Chart not found!');
        return;
    }

    const threshold = 50;
    let chartData;
    let phaseLabels = ['Rest', 'Threshold', 'Peak', 'Undershoot', 'Recovery', 'Rest'];

    if (stimulusValue < threshold) {
        // Sub-threshold response - only local depolarization
        const localDepol = -70 + (stimulusValue * 0.3); // Max 15mV depolarization
        chartData = [-70, localDepol, localDepol - 2, -70, -70, -70];

        // Update chart colors for sub-threshold
        chart.data.datasets[0].borderColor = 'rgb(156, 163, 175)'; // Gray
        chart.data.datasets[0].backgroundColor = 'rgba(156, 163, 175, 0.1)';
    } else {
        // Suprathreshold response - full action potential
        const intensity = Math.min((stimulusValue - 50) / 50, 1);

        // Medically accurate voltage values
        const restingPotential = -70;
        const threshold_v = -55;
        const peakVoltage = 30 + (intensity * 10); // +30 to +40mV peak
        const hyperpolarization = -80 - (intensity * 5); // -80 to -85mV undershoot
        const recovery1 = -75;
        const recovery2 = -70;

        chartData = [restingPotential, threshold_v, peakVoltage, hyperpolarization, recovery1, recovery2];

        // Update chart colors for action potential
        chart.data.datasets[0].borderColor = 'rgb(59, 130, 246)'; // Blue
        chart.data.datasets[0].backgroundColor = 'rgba(59, 130, 246, 0.1)';

        // Update timing labels for accuracy
        phaseLabels = ['0ms', '0.5ms', '1ms', '3ms', '4ms', '5ms'];
    }

    chart.data.labels = phaseLabels;
    chart.data.datasets[0].data = chartData;

    // Add phase annotations
    if (stimulusValue >= threshold) {
        chart.options.plugins.annotation = {
            annotations: {
                thresholdLine: {
                    type: 'line',
                    yMin: -55,
                    yMax: -55,
                    borderColor: 'rgb(239, 68, 68)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    label: {
                        content: 'Threshold (-55mV)',
                        enabled: true,
                        position: 'end'
                    }
                }
            }
        };
    }

    chart.update('active');
    console.log('✅ Chart updated with medically accurate values');
}

/**
 * Reset Action Potential Phases
 */
function resetActionPotentialPhases() {
    const phases = [
        'phase-resting',
        'phase-depolarization',
        'phase-repolarization',
        'phase-hyperpolarization',
        'phase-recovery'
    ];

    phases.forEach(phaseId => {
        const phase = document.getElementById(phaseId);
        if (phase) {
            phase.classList.add('opacity-50');
            phase.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-100', 'bg-gray-100', 'bg-green-100', 'bg-purple-100', 'bg-red-100', 'phase-activated');
        }
    });

    if (window.activatedPhases) {
        window.activatedPhases.clear();
    }
}

/**
 * Highlight Action Potential Phase
 */
function highlightActionPotentialPhase(phaseId) {
    if (!window.activatedPhases) {
        window.activatedPhases = new Set();
    }

    const phase = document.getElementById(phaseId);
    if (!phase) return;

    window.activatedPhases.add(phaseId);
    phase.classList.remove('opacity-50');
    phase.classList.add('ring-2', 'ring-blue-500', 'phase-activated');

    const phaseColors = {
        'phase-resting': 'bg-gray-100',
        'phase-depolarization': 'bg-blue-100',
        'phase-repolarization': 'bg-green-100',
        'phase-hyperpolarization': 'bg-purple-100',
        'phase-recovery': 'bg-red-100'
    };

    if (phaseColors[phaseId]) {
        phase.classList.add(phaseColors[phaseId]);
    }
}

/**
 * Demo Action Potential Chart with Enhanced Features
 */
function initDemoChart() {
    console.log('📈 Initializing action potential chart');
    const ctx = document.getElementById('action-potential-chart');
    if (!ctx) {
        console.log('❌ Chart canvas not found');
        return;
    }

    // Detect current theme for chart colors
    const isDark = document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark';

    const textColor = isDark ? '#e5e7eb' : '#374151';
    const gridColor = isDark ? '#4b5563' : '#e5e7eb';
    const bgColor = isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.1)';

    window.actionPotentialChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['0ms', '0.5ms', '1ms', '3ms', '4ms', '5ms'],
            datasets: [{
                label: 'Membrane Potential (mV)',
                data: [-70, -55, 30, -80, -75, -70],
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: bgColor,
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: isDark ? '#1f2937' : '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: isDark ? '#4b5563' : '#e5e7eb',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function (context) {
                            const phases = ['Resting Potential', 'Threshold', 'Depolarization Peak', 'Hyperpolarization', 'Recovery', 'Return to Rest'];
                            return phases[context[0].dataIndex] || context[0].label;
                        },
                        label: function (context) {
                            const value = context.parsed.y;
                            const descriptions = [
                                'Resting potential maintained by Na+/K+ pump',
                                'Threshold reached, voltage-gated Na+ channels open',
                                'Peak depolarization, Na+ influx maximum',
                                'Undershoot due to K+ efflux, refractory period',
                                'Gradual return to resting potential',
                                'Fully restored resting potential'
                            ];
                            return [`${value}mV`, descriptions[context.dataIndex] || ''];
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time (milliseconds)',
                        color: textColor,
                        font: {
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        color: textColor
                    },
                    grid: {
                        color: gridColor
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Membrane Potential (mV)',
                        color: textColor,
                        font: {
                            weight: 'bold'
                        }
                    },
                    min: -100,
                    max: 50,
                    ticks: {
                        color: textColor,
                        callback: function (value) {
                            if (value === -55) return value + ' (threshold)';
                            if (value === 0) return value + ' (reversal)';
                            return value;
                        }
                    },
                    grid: {
                        color: gridColor
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });

    console.log('✅ Chart initialized successfully with enhanced features');
}

/**
 * Update Chart Colors for Theme Changes
 */
function updateChartColors(isDark) {
    const chart = window.actionPotentialChart;
    if (!chart) return;

    const textColor = isDark ? '#e5e7eb' : '#374151';
    const gridColor = isDark ? '#4b5563' : '#e5e7eb';
    const bgColor = isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.1)';

    // Update dataset colors
    chart.data.datasets[0].backgroundColor = bgColor;
    chart.data.datasets[0].pointBorderColor = isDark ? '#1f2937' : '#ffffff';

    // Update scale colors
    chart.options.scales.x.title.color = textColor;
    chart.options.scales.x.ticks.color = textColor;
    chart.options.scales.x.grid.color = gridColor;
    chart.options.scales.y.title.color = textColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.scales.y.grid.color = gridColor;

    // Update tooltip colors
    chart.options.plugins.tooltip.backgroundColor = isDark ? '#1f2937' : '#ffffff';
    chart.options.plugins.tooltip.titleColor = textColor;
    chart.options.plugins.tooltip.bodyColor = textColor;
    chart.options.plugins.tooltip.borderColor = isDark ? '#4b5563' : '#e5e7eb';

    chart.update('none');
}

/**
 * Theme Toggle for Testing (Development Only)
 */
function addThemeToggle() {
    // Create theme toggle button for testing
    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = '🌓 Toggle Theme';
    toggleButton.className = 'fixed top-4 right-4 z-50 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-colors';
    toggleButton.onclick = function () {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';

        if (isDark) {
            html.removeAttribute('data-theme');
            html.classList.remove('dark');
            toggleButton.innerHTML = '🌙 Dark Mode';
        } else {
            html.setAttribute('data-theme', 'dark');
            html.classList.add('dark');
            toggleButton.innerHTML = '☀️ Light Mode';
        }

        // Trigger theme change event
        window.dispatchEvent(new Event('themeChanged'));
    };

    document.body.appendChild(toggleButton);
}

// Add theme toggle on load (for development/testing)
if (window.location.hostname === '' || window.location.hostname === 'localhost') {
    document.addEventListener('DOMContentLoaded', addThemeToggle);
}

// Additional helper functions...

/**
 * Animate Signal Transmission with Medical Accuracy
 * Simulates action potential propagation through a neuron
 */
function animateSignalTransmission() {
    console.log('🎬 Starting medically accurate signal transmission animation...');
    
    const neuronSvg = document.getElementById('neuron-svg');
    if (!neuronSvg) {
        console.error('❌ Neuron SVG not found');
        return;
    }

    // Disable button during animation
    const simulateBtn = document.getElementById('simulate-neuron-btn');
    if (simulateBtn) {
        simulateBtn.disabled = true;
        simulateBtn.innerHTML = '<span class="flex items-center justify-center"><svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Simulating...</span>';
    }

    // Create multiple signal elements for a more realistic effect
    const signals = [];
    
    // Create main action potential signal
    const mainSignal = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    mainSignal.setAttribute('r', '12');
    mainSignal.setAttribute('fill', '#3b82f6');
    mainSignal.setAttribute('opacity', '0.9');
    mainSignal.style.filter = 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))';
    
    // Create trailing signal effects
    for (let i = 0; i < 3; i++) {
        const trailSignal = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        trailSignal.setAttribute('r', 8 - i * 2);
        trailSignal.setAttribute('fill', '#60a5fa');
        trailSignal.setAttribute('opacity', 0.6 - i * 0.2);
        trailSignal.style.filter = `drop-shadow(0 0 ${8 - i * 2}px rgba(96, 165, 250, ${0.6 - i * 0.2}))`;
        signals.push(trailSignal);
        neuronSvg.appendChild(trailSignal);
    }
    
    signals.unshift(mainSignal);
    neuronSvg.appendChild(mainSignal);

    // Medically accurate pathway: Dendrites → Soma → Axon Hillock → Axon → Nodes → Terminals
    const signalPath = [
        // 1. Dendrite input integration (synaptic potentials)
        { 
            x: 80, y: 120, duration: 800, 
            phase: 'Synaptic Input', 
            description: 'Neurotransmitters bind to receptors, causing EPSPs',
            highlight: 'dendrites'
        },
        { 
            x: 120, y: 140, duration: 600, 
            phase: 'Signal Integration', 
            description: 'Multiple synaptic inputs summate in dendrites',
            highlight: 'dendrites'
        },
        
        // 2. Soma processing (temporal and spatial summation)
        { 
            x: 180, y: 180, duration: 500, 
            phase: 'Summation', 
            description: 'Soma integrates all inputs to determine response',
            highlight: 'soma'
        },
        
        // 3. Axon hillock (action potential initiation)
        { 
            x: 250, y: 200, duration: 300, 
            phase: 'Threshold Check', 
            description: 'Axon hillock: voltage-gated Na+ channels open if threshold reached',
            highlight: 'axon-hillock'
        },
        
        // 4. Axon conduction (action potential propagation)
        { 
            x: 320, y: 200, duration: 150, 
            phase: 'Depolarization', 
            description: 'Na+ influx causes rapid depolarization (+30mV)',
            highlight: 'axon'
        },
        
        // 5. Saltatory conduction through myelinated segments
        { 
            x: 380, y: 200, duration: 80, 
            phase: 'Saltatory Conduction', 
            description: 'Signal jumps between nodes of Ranvier (50x faster)',
            highlight: 'nodes'
        },
        { 
            x: 450, y: 200, duration: 80, 
            phase: 'Node Jump', 
            description: 'Action potential regenerated at each node',
            highlight: 'nodes'
        },
        { 
            x: 520, y: 200, duration: 80, 
            phase: 'Continued Propagation', 
            description: 'Unidirectional signal propagation to terminals',
            highlight: 'nodes'
        },
        
        // 6. Terminal processing and neurotransmitter release
        { 
            x: 600, y: 190, duration: 400, 
            phase: 'Ca²⁺ Influx', 
            description: 'Voltage-gated Ca²⁺ channels open at terminals',
            highlight: 'terminals'
        },
        { 
            x: 650, y: 175, duration: 600, 
            phase: 'Exocytosis', 
            description: 'Synaptic vesicles fuse, releasing neurotransmitters',
            highlight: 'terminals'
        },
        
        // 7. Synaptic transmission to next neuron
        { 
            x: 700, y: 200, duration: 500, 
            phase: 'Synaptic Transmission', 
            description: 'Signal transmitted to postsynaptic neuron',
            highlight: 'synapse'
        }
    ];

    let currentStep = 0;
    let infoBox = null;

    // Create floating info box
    function createInfoBox(phase, description) {
        // Remove previous info box
        if (infoBox) infoBox.remove();
        
        infoBox = document.createElement('div');
        infoBox.className = 'absolute bg-blue-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50 max-w-xs';
        infoBox.style.cssText = `
            top: 10px;
            right: 10px;
            opacity: 0;
            transition: opacity 0.3s ease;
            border-left: 4px solid #3b82f6;
        `;
        
        infoBox.innerHTML = `
            <div class="font-semibold text-blue-200 mb-1">${phase}</div>
            <div class="text-xs">${description}</div>
        `;
        
        const container = neuronSvg.closest('.neuron-container') || neuronSvg.parentElement;
        container.style.position = 'relative';
        container.appendChild(infoBox);
        
        // Fade in
        setTimeout(() => {
            infoBox.style.opacity = '1';
        }, 100);
        
        return infoBox;
    }

    function animateStep() {
        if (currentStep >= signalPath.length) {
            // Animation complete - cleanup
            setTimeout(() => {
                signals.forEach(signal => signal.remove());
                if (infoBox) infoBox.remove();
                
                // Show completion message
                const completionBox = createInfoBox(
                    'Signal Complete! 🎉', 
                    'Action potential successfully propagated from dendrites to synaptic terminals in ~5ms'
                );
                
                setTimeout(() => {
                    if (completionBox) completionBox.remove();
                }, 3000);
                
                // Re-enable button
                if (simulateBtn) {
                    simulateBtn.disabled = false;
                    simulateBtn.innerHTML = '<span class="flex items-center justify-center"><svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path></svg>Simulate Signal Transmission</span>';
                }
            }, 1000);
            return;
        }

        const step = signalPath[currentStep];
        
        // Create info box for current phase
        createInfoBox(step.phase, step.description);
        
        // Highlight corresponding neuron part
        if (step.highlight) {
            highlightNeuronPart(step.highlight);
        }
        
        // Animate all signals
        signals.forEach((signal, index) => {
            const delay = index * 50; // Stagger trailing signals
            setTimeout(() => {
                signal.style.transition = `all ${step.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                signal.setAttribute('cx', step.x - (index * 15));
                signal.setAttribute('cy', step.y + (index * 2));
            }, delay);
        });

        currentStep++;
        setTimeout(animateStep, step.duration + 200);
    }

    // Start animation
    console.log('🚀 Starting signal transmission sequence...');
    animateStep();
}

/**
 * Neuron Type Switching with Enhanced Functionality
 */
function initNeuronTypeSwitching() {
    console.log('🧠 Initializing neuron type switching');

    // Initialize neuron type buttons
    const typeButtons = ['show-multipolar', 'show-bipolar', 'show-unipolar'];
    typeButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function () {
                const neuronType = buttonId.replace('show-', '');
                switchNeuronType(neuronType, this);
            });
        }
    });

    // Initialize functional neuron type cards
    const functionalCards = ['sensory-neuron', 'motor-neuron', 'interneuron'];
    functionalCards.forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card) {
            card.addEventListener('click', function () {
                showFunctionalNeuronInfo(cardId);
            });

            // Add keyboard support
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        }
    });
}

/**
 * Switch between structural neuron types
 */
function switchNeuronType(type, activeButton) {
    // Hide all neuron type views
    const views = ['multipolar-view', 'bipolar-view', 'unipolar-view'];
    views.forEach(viewId => {
        const view = document.getElementById(viewId);
        if (view) {
            view.style.display = 'none';
        }
    });

    // Show selected view
    const activeView = document.getElementById(`${type}-view`);
    if (activeView) {
        activeView.style.display = 'block';
    }

    // Update button states
    const buttons = document.querySelectorAll('#show-multipolar, #show-bipolar, #show-unipolar');
    buttons.forEach(button => {
        button.classList.remove('bg-blue-600', 'text-white', 'active');
        button.classList.add('bg-gray-300', 'text-gray-700');
    });

    // Highlight active button
    if (activeButton) {
        activeButton.classList.remove('bg-gray-300', 'text-gray-700');
        activeButton.classList.add('bg-blue-600', 'text-white', 'active');
    }

    // Announce to screen readers
    if (window.announceToScreenReader) {
        const typeNames = {
            'multipolar': 'Multipolar neuron with multiple dendrites and one axon',
            'bipolar': 'Bipolar neuron with one dendrite and one axon',
            'unipolar': 'Unipolar neuron with a single branched process'
        };
        window.announceToScreenReader(`Switched to ${typeNames[type]}`);
    }

    console.log(`🔄 Switched to ${type} neuron type`);
}

/**
 * Show functional neuron information
 */
function showFunctionalNeuronInfo(cardId) {
    // Reset all cards
    const allCards = document.querySelectorAll('#sensory-neuron, #motor-neuron, #interneuron');
    allCards.forEach(card => {
        card.classList.remove('ring-2', 'ring-blue-500', 'transform', 'scale-105');
    });

    // Highlight selected card
    const activeCard = document.getElementById(cardId);
    if (activeCard) {
        activeCard.classList.add('ring-2', 'ring-blue-500', 'transform', 'scale-105');

        // Remove highlight after 2 seconds
        setTimeout(() => {
            activeCard.classList.remove('ring-2', 'ring-blue-500', 'transform', 'scale-105');
        }, 2000);
    }

    // Show detailed information
    const neuronDetails = {
        'sensory-neuron': {
            title: 'Sensory (Afferent) Neurons',
            description: 'Specialized to detect stimuli and convert them into electrical signals.',
            details: [
                'Found in sensory organs (eyes, ears, skin, etc.)',
                'Often have specialized receptors (photoreceptors, mechanoreceptors)',
                'Typically unipolar or bipolar in structure',
                'Transmit information from periphery to CNS',
                'Examples: retinal photoreceptors, olfactory neurons, touch receptors'
            ]
        },
        'motor-neuron': {
            title: 'Motor (Efferent) Neurons',
            description: 'Transmit signals from CNS to muscles and glands to produce responses.',
            details: [
                'Cell bodies located in brain stem and spinal cord',
                'Long axons extend to target muscles',
                'Release acetylcholine at neuromuscular junctions',
                'Alpha motor neurons innervate skeletal muscle',
                'Clinical importance: ALS affects motor neurons'
            ]
        },
        'interneuron': {
            title: 'Interneurons',
            description: 'Connect neurons within the CNS, processing and integrating information.',
            details: [
                'Most numerous type of neuron (~99% of all neurons)',
                'Found only within CNS (brain and spinal cord)',
                'Form complex networks and circuits',
                'Enable reflexes, learning, and higher cognitive functions',
                'Include inhibitory (GABA) and excitatory (glutamate) types'
            ]
        }
    };

    const info = neuronDetails[cardId];
    if (info && window.announceToScreenReader) {
        window.announceToScreenReader(`Selected ${info.title}: ${info.description}`);
    }
}

/**
 * System Interaction with Enhanced Features
 */
function initSystemInteraction() {
    console.log('🏗️ Initializing system interaction');

    // Add interaction for nervous system parts
    const systemParts = document.querySelectorAll('.system-part');
    systemParts.forEach(part => {
        part.addEventListener('click', function () {
            const partName = this.getAttribute('data-part');
            showSystemInfo(partName, this);
        });

        part.addEventListener('mouseenter', function () {
            this.style.filter = 'brightness(1.2) drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))';
        });

        part.addEventListener('mouseleave', function () {
            this.style.filter = '';
        });
    });
}

/**
 * Show nervous system information
 */
function showSystemInfo(partName, element) {
    const systemInfo = {
        'brain': {
            title: 'Brain',
            description: 'Central control center containing approximately 86 billion neurons.',
            functions: ['Higher cognitive functions', 'Motor control', 'Sensory processing', 'Emotion and memory']
        },
        'spinal-cord': {
            title: 'Spinal Cord',
            description: 'Major pathway for information traveling between brain and peripheral nervous system.',
            functions: ['Reflexes', 'Motor pathways', 'Sensory pathways', 'Autonomic control']
        },
        'peripheral-nerves': {
            title: 'Peripheral Nerves',
            description: 'Network of nerves that connect the CNS to the rest of the body.',
            functions: ['Sensory input', 'Motor output', 'Autonomic control', 'Reflex arcs']
        }
    };

    const info = systemInfo[partName];
    if (info && window.announceToScreenReader) {
        window.announceToScreenReader(`${info.title}: ${info.description}`);
    }
}

/**
 * Nerve Interaction with Medical Accuracy
 */
function initNerveInteraction() {
    console.log('🧠 Initializing nerve interaction');

    // Add interaction for cranial nerve cards
    const cranialCards = document.querySelectorAll('.cranial-nerve-card');
    cranialCards.forEach(card => {
        card.addEventListener('click', function () {
            expandCranialNerveInfo(this);
        });

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

/**
 * Expand cranial nerve information
 */
function expandCranialNerveInfo(card) {
    // Create or update expanded info
    let expandedInfo = card.querySelector('.expanded-info');

    if (expandedInfo) {
        // Toggle existing expanded info
        expandedInfo.style.display = expandedInfo.style.display === 'none' ? 'block' : 'none';
    } else {
        // Create new expanded info
        expandedInfo = document.createElement('div');
        expandedInfo.className = 'expanded-info mt-2 p-2 bg-white dark:bg-gray-800 rounded border-t border-gray-200 dark:border-gray-600';
        expandedInfo.innerHTML = `
            <div class="text-xs text-gray-600 dark:text-gray-400">
                <p><strong>Origin:</strong> Brainstem/Brain</p>
                <p><strong>Course:</strong> Through specific foramina</p>
                <p><strong>Testing:</strong> Clinical examination methods</p>
            </div>
        `;
        card.appendChild(expandedInfo);
    }

    // Announce to screen readers
    const nerveName = card.querySelector('h4').textContent;
    if (window.announceToScreenReader) {
        window.announceToScreenReader(`Expanded information for ${nerveName}`);
    }
}
