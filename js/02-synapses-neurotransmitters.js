/**
 * Chapter 2: Synapses & Neurotransmitters - Interactive Features
 * Handles all functionality specific to the synapses and neurotransmitters chapter
 * Medical accuracy ensured, optimized for dark/light mode and mobile devices
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Chapter 2: Synapses & Neurotransmitters - Initializing...');

    // Initialize tab navigation first
    initTabNavigation();

    // Initialize theme detection and mobile responsiveness
    initThemeAndResponsiveness();

    // Initialize Chapter 2 specific features
    initSynapseInteraction();
    initTransmissionTimeline();
    initNeurotransmitterInteractions();
    initReceptorInteractions();
    initIntegrationSimulations();

    // Initialize accessibility features
    initAccessibilityFeatures();

    console.log('✅ Chapter 2 features loaded successfully!');
});

const chapter2Locale = (document.documentElement.lang || '').startsWith('el') || window.location.pathname.includes('/gr/')
    ? {
        integrationTitle: '🧠 Προσομοιωτής Νευρωνικής Ολοκλήρωσης',
        integrationIntro: 'Προσομοίωσε πώς ένας νευρώνας ολοκληρώνει πολλαπλές συναπτικές εισόδους. Ρύθμισε την ένταση και τον χρονισμό των εισόδων για να δεις πώς αθροίζονται.',
        excitA: '🟢 Διεγερτική Είσοδος A (Γλουταμικό)',
        excitB: '🟢 Διεγερτική Είσοδος B (Γλουταμικό)',
        inhib: '🔴 Ανασταλτική Είσοδος (GABA)',
        epsp: 'Πλάτος EPSP',
        ipsp: 'Πλάτος IPSP',
        temporalControls: '⏱️ Έλεγχος Χρονικής Άθροισης',
        timingOffset: 'Χρονική Απόκλιση Εισόδων (ms):',
        simultaneous: '0 ms (ταυτόχρονα)',
        offset: 'ms διαφορά',
        membraneTime: 'Χρονική Σταθερά Μεμβράνης:',
        fast: 'Γρήγορη τ (5ms) - Ενδονευρώνας',
        medium: 'Μεσαία τ (10ms) - Πυραμιδικός νευρώνας',
        slow: 'Αργή τ (20ms) - Κινητικός νευρώνας',
        membranePotential: 'Δυναμικό μεμβράνης στο αρχικό τμήμα του άξονα',
        fireAp: '⚡ Πυροδότηση δυναμικού ενέργειας',
        resting: '-70 mV (ηρεμία)',
        threshold: '-55 mV (κατώφλι)',
        net: 'Καθαρή μεταβολή:',
        spatial: '• <strong>Χωρική άθροιση:</strong> Πολλαπλές συνάψεις ενεργές ταυτόχρονα',
        temporal: '• <strong>Χρονική άθροιση:</strong> Χρονικά εξαρτώμενη ολοκλήρωση με βάση τη μεμβρανική τ',
        thresholdNote: '• <strong>Κατώφλι:</strong> Το δυναμικό ενέργειας πυροδοτείται όταν η μεμβράνη φτάσει τα -55mV',
        fire: '⚡ ΠΥΡΟΔΟΤΗΣΗ!',
        subthreshold: '⚡ Υποκατώφλιο',
        noChange: '⚡ Χωρίς μεταβολή',
        firing: '🔥 ΠΥΡΟΔΟΤΗΣΗ!',
        perfect: 'Τέλεια',
        reducedBy: 'Μειωμένο κατά',
        reached: '✅ ΕΠΙΤΕΥΧΘΗΚΕ! Θα παραχθεί δυναμικό ενέργειας',
        needMore: '❌ Χρειάζονται ακόμη'
    }
    : {
        integrationTitle: '🧠 Neural Integration Simulator',
        integrationIntro: 'Simulate how a neuron integrates multiple synaptic inputs. Adjust the strength and timing of inputs to see how they summate.',
        excitA: '🟢 Excitatory Input A (Glutamate)',
        excitB: '🟢 Excitatory Input B (Glutamate)',
        inhib: '🔴 Inhibitory Input (GABA)',
        epsp: 'EPSP Amplitude',
        ipsp: 'IPSP Amplitude',
        temporalControls: '⏱️ Temporal Summation Controls',
        timingOffset: 'Input Timing Offset (ms):',
        simultaneous: '0 ms (simultaneous)',
        offset: 'ms offset',
        membraneTime: 'Membrane Time Constant:',
        fast: 'Fast τ (5ms) - Interneuron',
        medium: 'Medium τ (10ms) - Pyramidal',
        slow: 'Slow τ (20ms) - Motor neuron',
        membranePotential: 'Membrane Potential at Axon Hillock',
        fireAp: '⚡ Fire Action Potential',
        resting: '-70 mV (resting)',
        threshold: '-55 mV (threshold)',
        net: 'Net:',
        spatial: '• <strong>Spatial summation:</strong> Multiple synapses active simultaneously',
        temporal: '• <strong>Temporal summation:</strong> Time-dependent integration based on membrane τ',
        thresholdNote: '• <strong>Threshold:</strong> Action potential fires when membrane reaches -55mV',
        fire: '⚡ FIRE!',
        subthreshold: '⚡ Subthreshold',
        noChange: '⚡ No Change',
        firing: '🔥 FIRING!',
        perfect: 'Perfect',
        reducedBy: 'Reduced by',
        reached: '✅ REACHED! Action potential will fire',
        needMore: '❌ Need'
    };

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
    // Add touch-friendly interactions for mobile
    const interactiveElements = document.querySelectorAll('.synapse-part, .nt-card, .receptor-card');
    interactiveElements.forEach(element => {
        element.style.cursor = 'pointer';
        element.addEventListener('touchstart', function () {
            this.style.transform = 'scale(0.98)';
        });
        element.addEventListener('touchend', function () {
            this.style.transform = 'scale(1)';
        });
    });
}

/**
 * Detect and Apply Theme
 */
function detectAndApplyTheme() {
    const isDark = document.documentElement.classList.contains('dark') ||
        document.body.classList.contains('dark') ||
        (document.documentElement.getAttribute('data-theme') === 'dark');

    if (isDark) {
        document.body.setAttribute('data-theme', 'dark');
    }
}

/**
 * Add Responsive Layout Adjustments
 */
function addResponsiveAdjustments() {
    // Adjust layouts for different screen sizes
    function adjustLayout() {
        const isMobile = window.innerWidth < 768;
        const tabButtons = document.querySelectorAll('.tab-button');

        tabButtons.forEach(button => {
            if (isMobile) {
                button.classList.add('text-sm', 'px-3', 'py-1');
            } else {
                button.classList.remove('text-sm', 'px-3', 'py-1');
            }
        });
    }

    adjustLayout();
    window.addEventListener('resize', adjustLayout);
}

/**
 * Initialize Tab Navigation
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

        // Add keyboard navigation
        button.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    console.log(`✅ Initialized ${tabButtons.length} tabs`);
}

/**
 * Switch to a specific tab
 * @param {string} activeTabId - The ID of the tab content to show
 * @param {HTMLElement} activeButton - The button that was clicked
 */
function switchTab(activeTabId, activeButton) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content'); tabContents.forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
        content.setAttribute('aria-hidden', 'true');
    });

    // Reset all tab button styles and ARIA states
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('text-green-700');
        button.classList.add('text-gray-500');
        button.setAttribute('aria-selected', 'false');
    });

    // Show the active tab content
    const activeTab = document.getElementById(activeTabId);
    if (activeTab) {
        activeTab.classList.add('active');
        activeTab.style.display = 'block';
        activeTab.setAttribute('aria-hidden', 'false');
    }

    // Highlight the active button
    if (activeButton) {
        activeButton.classList.remove('text-gray-500');
        activeButton.classList.add('text-green-700');
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
        case 'content-synapse':
            initSynapseInteraction();
            break;
        case 'content-transmission':
            initTransmissionTimeline();
            break;
        case 'content-neurotransmitters':
            initNeurotransmitterInteractions();
            break;
        case 'content-receptors':
            initReceptorInteractions();
            break;
        case 'content-integration':
            initIntegrationSimulations();
            break;
        case 'content-modern':
            console.log('🔬 Beyond Neuron-to-Neuron tab activated');
            break;
    }
}

/**
 * Initialize Accessibility Features
 */
function initAccessibilityFeatures() {
    // Add high contrast mode support
    addHighContrastSupport();

    // Add reduced motion support
    addReducedMotionSupport();

    // Enhance keyboard navigation
    enhanceKeyboardNavigation();

    // Add screen reader announcements
    addScreenReaderSupport();

    console.log('✅ Accessibility features initialized');
}

/**
 * Add High Contrast Mode Support
 */
function addHighContrastSupport() {
    if (window.matchMedia && window.matchMedia('(prefers-contrast: high)').matches) {
        document.body.classList.add('high-contrast');
    }
}

/**
 * Add Reduced Motion Support
 */
function addReducedMotionSupport() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduce-motion');
        // Disable animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            .reduce-motion *,
            .reduce-motion *::before,
            .reduce-motion *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Enhance Keyboard Navigation
 */
function enhanceKeyboardNavigation() {
    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('.synapse-part, .nt-card, .receptor-card, button');
    interactiveElements.forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }

        element.addEventListener('focus', function () {
            this.style.outline = '2px solid #3b82f6';
            this.style.outlineOffset = '2px';
        });

        element.addEventListener('blur', function () {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

/**
 * Add Screen Reader Support
 */
function addScreenReaderSupport() {
    // Create announcement area for screen readers
    if (!document.getElementById('sr-announcements')) {
        const announcements = document.createElement('div');
        announcements.id = 'sr-announcements';
        announcements.setAttribute('aria-live', 'polite');
        announcements.setAttribute('aria-atomic', 'true');
        announcements.style.position = 'absolute';
        announcements.style.left = '-10000px';
        announcements.style.width = '1px';
        announcements.style.height = '1px';
        announcements.style.overflow = 'hidden';
        document.body.appendChild(announcements);
    }

    // Function to announce messages to screen readers
    window.announceToScreenReader = function (message) {
        const announcements = document.getElementById('sr-announcements');
        if (announcements) {
            announcements.textContent = message;
        }
    };
}

/**
 * Synapse Interaction
 * Handles interactive synapse diagrams
 */
function initSynapseInteraction() {
    const synapseParts = document.querySelectorAll('.synapse-part');
    const synapseInfo = document.getElementById('synapse-info');
    const synapsePartTitle = document.getElementById('synapse-part-title');
    const synapsePartDescription = document.getElementById('synapse-part-description');

    if (synapseParts.length > 0 && synapseInfo) {
        synapseParts.forEach(part => {
            part.addEventListener('click', () => {
                const partTitle = part.dataset.title;
                const partDescription = part.dataset.description;

                // Update info panel
                if (synapsePartTitle) synapsePartTitle.textContent = partTitle;
                if (synapsePartDescription) synapsePartDescription.textContent = partDescription;

                // Highlight selected part
                synapseParts.forEach(p => {
                    p.style.opacity = '0.7';
                    p.style.filter = 'none';
                });
                part.style.opacity = '1';
                part.style.filter = 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))';

                // Show info panel
                synapseInfo.classList.remove('hidden');
            });

            // Add hover effects
            part.addEventListener('mouseenter', () => {
                if (!part.style.filter.includes('drop-shadow')) {
                    part.style.opacity = '0.9';
                }
            });

            part.addEventListener('mouseleave', () => {
                if (!part.style.filter.includes('drop-shadow')) {
                    part.style.opacity = '1';
                }
            });
        });

        // Initialize close button for info panel
        const closeBtn = document.getElementById('close-synapse-info');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                synapseInfo.classList.add('hidden');
                // Reset highlighting
                synapseParts.forEach(p => {
                    p.style.opacity = '1';
                    p.style.filter = 'none';
                });
            });
        }

        // Initialize simulate transmission button
        const simulateBtn = document.getElementById('simulate-transmission-btn');
        if (simulateBtn) {
            simulateBtn.addEventListener('click', simulateSynapticTransmission);
        }
    }
}

/**
 * Synaptic Transmission Simulation
 * Creates a medically accurate, step-by-step visualization of synaptic transmission
 */
function simulateSynapticTransmission() {
    const steps = document.querySelectorAll('[id^="step-"]');
    const vesicles = document.querySelectorAll('#vesicles .vesicle.docked');
    const caChannels = document.querySelectorAll('#ca-channels .ca-channel');
    const neurotransmitters = document.querySelectorAll('#neurotransmitters .neurotransmitter');
    const receptors = document.querySelectorAll('#receptors .receptor');
    const ionChannels = document.querySelectorAll('#ion-channels .ion-channel');
    const actionPotential = document.getElementById('action-potential');
    const calciumIons = document.getElementById('calcium-ions');

    // Reset all elements to initial state
    steps.forEach(step => {
        step.classList.add('opacity-50');
        step.classList.remove('ring-2', 'ring-blue-500', 'bg-green-100', 'border-green-500');
    });

    vesicles.forEach(vesicle => {
        vesicle.style.transform = '';
        vesicle.style.opacity = '1';
        vesicle.classList.remove('releasing');
    });

    caChannels.forEach(channel => {
        channel.classList.remove('open');
        channel.style.fill = '#dc2626';
    });

    neurotransmitters.forEach(nt => {
        nt.style.opacity = '0';
        nt.style.transform = '';
    });

    receptors.forEach(receptor => {
        receptor.classList.remove('bound');
        receptor.style.fill = receptor.classList.contains('ampa') ? '#f97316' : '#dc2626';
    });

    ionChannels.forEach(channel => {
        channel.classList.remove('open');
        channel.style.fill = channel.parentElement.querySelector('text').textContent.includes('Na') ? '#06b6d4' : '#8b5cf6';
    });

    if (actionPotential) actionPotential.style.opacity = '0';
    if (calciumIons) calciumIons.style.opacity = '0';

    let currentStep = 0;

    function executeStep() {
        if (currentStep >= steps.length) {
            // Animation complete - show success state
            setTimeout(() => {
                steps.forEach(step => {
                    step.classList.remove('ring-2', 'ring-blue-500');
                    step.classList.add('bg-green-100', 'border-green-500');
                });
            }, 1000);
            return;
        }

        // Activate current step
        const currentStepElement = steps[currentStep];
        currentStepElement.classList.remove('opacity-50');
        currentStepElement.classList.add('ring-2', 'ring-blue-500');

        // Execute step-specific animations with medical accuracy
        switch (currentStep) {
            case 0: // Action Potential Arrival
                if (actionPotential) {
                    actionPotential.style.opacity = '1';
                    const wave = actionPotential.querySelector('circle');
                    if (wave) {
                        wave.style.animation = 'none';
                        wave.offsetHeight; // Trigger reflow
                        wave.style.animation = 'moveRight 1.5s ease-out forwards';
                    }
                }
                break;

            case 1: // Calcium Influx
                caChannels.forEach((channel, index) => {
                    setTimeout(() => {
                        channel.classList.add('open');
                        channel.style.fill = '#ff4444';
                        channel.style.filter = 'drop-shadow(0 0 4px #ff4444)';
                    }, index * 200);
                });

                if (calciumIons) {
                    setTimeout(() => {
                        calciumIons.style.opacity = '1';
                        const ions = calciumIons.querySelectorAll('.calcium-ion');
                        ions.forEach((ion, index) => {
                            setTimeout(() => {
                                ion.style.transform = 'translateX(-20px) scale(1.5)';
                                ion.style.filter = 'drop-shadow(0 0 4px #ff6b6b)';
                            }, index * 100);
                        });
                    }, 500);
                }
                break;

            case 2: // Vesicle Fusion
                vesicles.forEach((vesicle, index) => {
                    setTimeout(() => {
                        vesicle.classList.add('releasing');
                        vesicle.style.transform = 'scale(1.3) translateX(10px)';
                        vesicle.style.opacity = '0.7';
                        vesicle.style.filter = 'drop-shadow(0 0 6px #fbbf24)';

                        // Create fusion pore effect
                        setTimeout(() => {
                            vesicle.style.transform = 'scale(0.8) translateX(20px)';
                            vesicle.style.opacity = '0.3';
                        }, 300);
                    }, index * 150);
                });
                break;

            case 3: // Neurotransmitter Diffusion
                neurotransmitters.forEach((nt, index) => {
                    setTimeout(() => {
                        nt.style.opacity = '1';
                        nt.style.transform = 'translateX(30px) translateY(' + (Math.random() * 20 - 10) + 'px)';
                        nt.style.filter = 'drop-shadow(0 0 3px #10b981)';

                        // Simulate brownian motion
                        setTimeout(() => {
                            nt.style.transform += ' translateY(' + (Math.random() * 10 - 5) + 'px)';
                        }, 200);

                        setTimeout(() => {
                            nt.style.transform += ' translateX(20px)';
                        }, 400);
                    }, index * 80);
                });
                break;

            case 4: // Receptor Binding
                receptors.forEach((receptor, index) => {
                    setTimeout(() => {
                        receptor.classList.add('bound');
                        receptor.style.fill = '#22c55e';
                        receptor.style.filter = 'drop-shadow(0 0 4px #22c55e)';
                        receptor.style.transform = 'scale(1.1)';
                    }, index * 100);
                });
                break;

            case 5: // Postsynaptic Response
                ionChannels.forEach((channel, index) => {
                    setTimeout(() => {
                        channel.classList.add('open');
                        channel.style.fill = '#fbbf24';
                        channel.style.filter = 'drop-shadow(0 0 4px #fbbf24)';
                        channel.style.transform = 'scaleY(1.2)';

                        // Ion flow animation
                        const channelText = channel.parentElement.querySelector('text').textContent;
                        if (channelText.includes('Na')) {
                            // Simulate sodium influx
                            setTimeout(() => {
                                channel.style.filter = 'drop-shadow(0 0 6px #3b82f6)';
                            }, 200);
                        } else if (channelText.includes('K')) {
                            // Simulate potassium efflux
                            setTimeout(() => {
                                channel.style.filter = 'drop-shadow(0 0 6px #8b5cf6)';
                            }, 200);
                        }
                    }, index * 150);
                });
                break;

            case 6: // Signal Termination
                setTimeout(() => {
                    // Gradually clear neurotransmitters
                    neurotransmitters.forEach((nt, index) => {
                        setTimeout(() => {
                            nt.style.opacity = '0.3';
                            nt.style.transform = 'translateX(60px) translateY(' + (Math.random() * 30 - 15) + 'px) scale(0.5)';
                        }, index * 50);
                    });

                    // Reset receptors
                    setTimeout(() => {
                        receptors.forEach((receptor, index) => {
                            setTimeout(() => {
                                receptor.classList.remove('bound');
                                receptor.style.fill = receptor.classList.contains('ampa') ? '#f97316' : '#dc2626';
                                receptor.style.filter = '';
                                receptor.style.transform = '';
                            }, index * 100);
                        });
                    }, 500);

                    // Close ion channels
                    setTimeout(() => {
                        ionChannels.forEach((channel, index) => {
                            setTimeout(() => {
                                channel.classList.remove('open');
                                channel.style.fill = channel.parentElement.querySelector('text').textContent.includes('Na') ? '#06b6d4' : '#8b5cf6';
                                channel.style.filter = '';
                                channel.style.transform = '';
                            }, index * 100);
                        });
                    }, 1000);
                }, 500);
                break;
        }

        currentStep++;

        // Continue to next step after appropriate delay
        const delays = [2000, 1500, 2000, 1500, 1000, 1200, 2000]; // Realistic timing
        setTimeout(executeStep, delays[currentStep - 1] || 1500);
    }

    // Start the simulation
    executeStep();
}

// Add CSS animations for the action potential wave
const style = document.createElement('style');
style.textContent = `
    @keyframes moveRight {
        0% { cx: 50; }
        100% { cx: 360; }
    }
    
    .vesicle.releasing {
        transition: all 0.5s ease-out;
    }
    
    .neurotransmitter {
        transition: all 0.3s ease-out;
    }
    
    .receptor.bound {
        transition: all 0.2s ease-out;
    }
    
    .ion-channel.open {
        transition: all 0.3s ease-out;
    }
    
    .ca-channel.open {
        transition: all 0.2s ease-out;
    }
    
    .calcium-ion {
        transition: all 0.4s ease-out;
    }
`;
document.head.appendChild(style);

/**
 * Transmission Timeline Initialization
 */
function initTransmissionTimeline() {
    const startBtn = document.getElementById('start-transmission');
    const speedSlider = document.getElementById('transmission-speed');
    const chartCanvas = document.getElementById('transmission-timeline-chart');

    if (startBtn && chartCanvas) {
        // Initialize Chart.js timeline
        const ctx = chartCanvas.getContext('2d');
        const timelineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 50 }, (_, i) => i * 0.1),
                datasets: [{
                    label: 'Ca²⁺ Concentration',
                    data: Array(50).fill(0.1),
                    borderColor: 'rgb(220, 38, 38)',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Neurotransmitter Release',
                    data: Array(50).fill(0),
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Relative Concentration'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time (ms)'
                        }
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });

        startBtn.addEventListener('click', () => {
            const speed = speedSlider ? parseInt(speedSlider.value) : 3;
            animateTransmissionTimeline(timelineChart, speed);
        });
    }
}

/**
 * Animate Transmission Timeline
 */
function animateTransmissionTimeline(chart, speed) {
    const steps = document.querySelectorAll('[id^="step-"]');
    let frame = 0;
    const maxFrames = 50;
    const interval = 200 / speed; // Adjust speed

    // Reset chart
    chart.data.datasets[0].data = Array(50).fill(0.1);
    chart.data.datasets[1].data = Array(50).fill(0);
    chart.update();

    // Reset steps
    steps.forEach(step => step.classList.add('opacity-50'));

    const animation = setInterval(() => {
        if (frame >= maxFrames) {
            clearInterval(animation);
            // Keep all transmission steps highlighted - remove only pulse effects
            setTimeout(() => {
                const currentlyPulsing = document.querySelector('[id^="step-"].ring-2.ring-blue-500');
                if (currentlyPulsing) {
                    currentlyPulsing.classList.remove('ring-2', 'ring-blue-500');
                }
            }, 500);
            return;
        }

        // Update Ca²⁺ concentration
        if (frame >= 5 && frame <= 15) {
            chart.data.datasets[0].data[frame] = 0.1 + (frame - 5) * 10;
        } else if (frame > 15 && frame <= 25) {
            chart.data.datasets[0].data[frame] = 100 - (frame - 15) * 9;
        } else if (frame > 25) {
            chart.data.datasets[0].data[frame] = 10 - (frame - 25) * 0.4;
        }

        // Update neurotransmitter release
        if (frame >= 10 && frame <= 20) {
            chart.data.datasets[1].data[frame] = (frame - 10) * 8;
        } else if (frame > 20 && frame <= 35) {
            chart.data.datasets[1].data[frame] = 80 - (frame - 20) * 5;
        }

        // Activate corresponding steps cumulatively
        const stepIndex = Math.floor(frame / 7);
        if (stepIndex < steps.length) {
            // Remove previous pulse effects but keep steps highlighted
            steps.forEach(step => step.classList.remove('ring-2', 'ring-blue-500'));

            // Ensure all previous steps remain highlighted (cumulative effect)
            for (let i = 0; i <= stepIndex; i++) {
                if (steps[i]) {
                    steps[i].classList.remove('opacity-50');
                }
            }

            // Add pulse effect to current step only
            if (steps[stepIndex]) {
                steps[stepIndex].classList.add('ring-2', 'ring-blue-500');
            }
        }

        chart.update();
        frame++;
    }, interval);
}

/**
 * Neurotransmitter Interactions
 */
function initNeurotransmitterInteractions() {
    // Enhanced neurotransmitter card interactions for better educational experience
    const neurotransmitterSection = document.querySelector('#content-neurotransmitters');
    if (neurotransmitterSection) {
        // Target individual neurotransmitter cards more specifically
        const cards = neurotransmitterSection.querySelectorAll('.p-2.bg-white.rounded.border, .p-2.bg-cyan-800.rounded.border');

        console.log(`Found ${cards.length} neurotransmitter cards`);

        cards.forEach((card, index) => {
            // Ensure card has pointer cursor
            card.style.cursor = 'pointer';

            // Add accessibility attributes
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', 'Click for detailed information');

            // Enhanced hover effect
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0.9';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '';
                card.style.opacity = '1';
            });

            // Click for detailed information
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const neurotransmitterName = extractNeurotransmitterName(card);
                console.log(`Card ${index + 1} clicked. Extracted name: "${neurotransmitterName}"`);

                if (neurotransmitterName) {
                    showDetailedNeurotransmitterInfo(neurotransmitterName, card);
                } else {
                    console.warn('Could not extract neurotransmitter name from card:', card);
                }
            });

            // Keyboard accessibility
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }
}

// Helper function to extract neurotransmitter name from card
function extractNeurotransmitterName(card) {
    // Try different selectors to find the neurotransmitter name
    let name = null;

    // Try h5 first (most common in the structure)
    const h5 = card.querySelector('h5');
    if (h5) {
        name = h5.textContent.trim();
    }

    // Try h4 if h5 not found
    if (!name) {
        const h4 = card.querySelector('h4');
        if (h4) {
            name = h4.textContent.trim();
        }
    }

    // Try h3 if h4 not found
    if (!name) {
        const h3 = card.querySelector('h3');
        if (h3) {
            name = h3.textContent.trim();
        }
    }

    // Try strong tag
    if (!name) {
        const strong = card.querySelector('strong');
        if (strong) {
            name = strong.textContent.trim();
        }
    }

    // Try first text content if no headers found
    if (!name) {
        const textContent = card.textContent.trim();
        // Extract first line or first meaningful text
        const lines = textContent.split('\n').filter(line => line.trim().length > 0);
        if (lines.length > 0) {
            name = lines[0].trim();
        }
    }

    // Clean up the name - remove emojis and extra text
    if (name) {
        // Remove emojis and special characters but keep parentheses and dashes
        name = name.replace(/[^\w\s\(\)-]/g, '').trim();

        // Remove common descriptive words that might interfere
        name = name.replace(/\b(neurotransmitter|hormone|chemical|messenger)\b/gi, '').trim();

        // Clean up extra spaces
        name = name.replace(/\s+/g, ' ').trim();

        // Map common variations to standard names
        const nameMap = {
            'Dopamine': 'Dopamine',
            'Dopamine DA': 'Dopamine',
            'Dopamine (DA)': 'Dopamine',
            'Serotonin': 'Serotonin',
            'Serotonin 5-HT': 'Serotonin',
            'Serotonin (5-HT)': 'Serotonin',
            '5-HT': 'Serotonin',
            'Acetylcholine': 'Acetylcholine',
            'Acetylcholine ACh': 'Acetylcholine',
            'Acetylcholine (ACh)': 'Acetylcholine',
            'ACh': 'Acetylcholine',
            'GABA': 'GABA',
            'Glutamate': 'Glutamate',
            'Glutamate Glu': 'Glutamate',
            'Glutamate (Glu)': 'Glutamate',
            'Glu': 'Glutamate',
            'Norepinephrine': 'Norepinephrine',
            'Norepinephrine NE': 'Norepinephrine',
            'Norepinephrine (NE)': 'Norepinephrine',
            'NE': 'Norepinephrine',
            'Epinephrine': 'Norepinephrine',
            'Noradrenaline': 'Norepinephrine',
            'Substance P': 'Substance P',
            'SP': 'Substance P',
            'Adenosine': 'Adenosine',
            'Glycine': 'Glycine',
            'Gly': 'Glycine',
            'Endorphins': 'Endorphins',
            'ATP': 'ATP',
            'Nitric Oxide': 'Nitric Oxide',
            'Nitric Oxide (NO)': 'Nitric Oxide',
            'NO': 'Nitric Oxide'
        };

        const mappedName = nameMap[name] || name;

        // Debug logging to help identify naming issues
        console.log(`Extracted neurotransmitter name: "${name}" -> "${mappedName}"`);

        return mappedName;
    }

    console.log('Could not extract neurotransmitter name from card:', card);
    return null;
}

// Add function to show detailed neurotransmitter information
function showDetailedNeurotransmitterInfo(name, card) {
    // Create or update info modal for detailed neurotransmitter information
    let modal = document.getElementById('neurotransmitter-detail-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'neurotransmitter-detail-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.style.display = 'none';
        document.body.appendChild(modal);
    }

    // Get detailed information for the neurotransmitter
    const details = getNeurotransmitterDetails(name);

    // Modal content with detailed medical information
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-screen overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-2xl font-bold text-green-700 dark:text-green-300">${details.name}</h3>
                <button onclick="document.getElementById('neurotransmitter-detail-modal').style.display='none'" 
                        class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
                <!-- Basic Information -->
                <div class="space-y-4">
                    <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <h4 class="font-semibold text-blue-700 dark:text-blue-300 mb-2">Basic Information</h4>
                        <p><strong>Chemical Formula:</strong> ${details.formula}</p>
                        <p><strong>Molecular Weight:</strong> ${details.molecularWeight}</p>
                        <p><strong>Type:</strong> ${details.type}</p>
                        <p><strong>Primary Function:</strong> ${details.primaryFunction}</p>
                    </div>
                    
                    <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h4 class="font-semibold text-green-700 dark:text-green-300 mb-2">Synthesis & Metabolism</h4>
                        <p><strong>Synthesized from:</strong> ${details.synthesis}</p>
                        <p><strong>Degraded by:</strong> ${details.degradation}</p>
                        <p><strong>Location:</strong> ${details.location}</p>
                    </div>
                </div>
                
                <!-- Clinical Information -->
                <div class="space-y-4">
                    <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <h4 class="font-semibold text-purple-700 dark:text-purple-300 mb-2">Receptors & Mechanisms</h4>
                        <div class="space-y-2">
                            ${details.receptors.map(receptor => `
                                <div class="text-sm">
                                    <strong>${receptor.name}:</strong> ${receptor.description}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <h4 class="font-semibold text-red-700 dark:text-red-300 mb-2">Clinical Significance</h4>
                        <div class="space-y-2">
                            ${details.clinical.map(item => `
                                <div class="text-sm">
                                    <strong>${item.condition}:</strong> ${item.description}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Pharmacology -->
            <div class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <h4 class="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">Pharmacological Targets</h4>
                <div class="grid md:grid-cols-2 gap-4">
                    ${details.drugs.map(drug => `
                        <div class="text-sm">
                            <strong>${drug.name}:</strong> ${drug.mechanism} <em>(${drug.use})</em>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="mt-6 flex justify-end">
                <button onclick="document.getElementById('neurotransmitter-detail-modal').style.display='none'" 
                        class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">Close</button>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

// Comprehensive neurotransmitter database with medical accuracy
function getNeurotransmitterDetails(name) {
    const neurotransmitters = {
        "Dopamine": {
            name: "Dopamine",
            formula: "C₈H₁₁NO₂",
            molecularWeight: "153.18 g/mol",
            type: "Catecholamine",
            primaryFunction: "Reward, motivation, motor control",
            synthesis: "Tyrosine → L-DOPA → Dopamine (via tyrosine hydroxylase, AADC)",
            degradation: "MAO-B, COMT → HVA",
            location: "Substantia nigra, VTA, hypothalamus",
            receptors: [
                { name: "D1/D5", description: "Gs-coupled, increases cAMP, excitatory" },
                { name: "D2/D3/D4", description: "Gi/o-coupled, decreases cAMP, inhibitory" }
            ],
            clinical: [
                { condition: "Parkinson's Disease", description: "Loss of dopaminergic neurons in substantia nigra" },
                { condition: "Schizophrenia", description: "Altered dopamine signaling in mesolimbic pathway" },
                { condition: "ADHD", description: "Impaired dopamine function in prefrontal cortex" }
            ],
            drugs: [
                { name: "L-DOPA", mechanism: "Dopamine precursor", use: "Parkinson's treatment" },
                { name: "Haloperidol", mechanism: "D2 receptor antagonist", use: "Antipsychotic" },
                { name: "Methylphenidate", mechanism: "DAT inhibitor", use: "ADHD treatment" }
            ]
        },
        "Serotonin": {
            name: "Serotonin (5-HT)",
            formula: "C₁₀H₁₂N₂O",
            molecularWeight: "176.21 g/mol",
            type: "Indoleamine",
            primaryFunction: "Mood, sleep, appetite, cognition",
            synthesis: "Tryptophan → 5-HTP → Serotonin (via TPH, AADC)",
            degradation: "MAO-A → 5-HIAA",
            location: "Raphe nuclei, gut enterochromaffin cells",
            receptors: [
                { name: "5-HT1A", description: "Gi/o-coupled, inhibitory, autoreceptor" },
                { name: "5-HT2A", description: "Gq-coupled, excitatory, cortical effects" },
                { name: "5-HT3", description: "Ligand-gated ion channel, fast excitatory" }
            ],
            clinical: [
                { condition: "Depression", description: "Reduced serotonin availability and signaling" },
                { condition: "Anxiety Disorders", description: "Altered 5-HT1A receptor function" },
                { condition: "Migraine", description: "Vascular 5-HT receptor dysfunction" }
            ],
            drugs: [
                { name: "SSRIs", mechanism: "SERT inhibition", use: "Depression, anxiety" },
                { name: "LSD", mechanism: "5-HT2A agonist", use: "Research (hallucinogen)" },
                { name: "Ondansetron", mechanism: "5-HT3 antagonist", use: "Anti-nausea" }
            ]
        },
        "Acetylcholine": {
            name: "Acetylcholine (ACh)",
            formula: "C₇H₁₆NO₂⁺",
            molecularWeight: "146.21 g/mol",
            type: "Cholinergic",
            primaryFunction: "Muscle contraction, attention, memory",
            synthesis: "Choline + Acetyl-CoA → ACh (via ChAT)",
            degradation: "Acetylcholinesterase → Choline + Acetate",
            location: "Motor neurons, basal forebrain, autonomic ganglia",
            receptors: [
                { name: "Nicotinic", description: "Ligand-gated ion channel, fast excitatory" },
                { name: "Muscarinic (M1-M5)", description: "GPCRs, various second messenger systems" }
            ],
            clinical: [
                { condition: "Alzheimer's Disease", description: "Loss of cholinergic neurons in basal forebrain" },
                { condition: "Myasthenia Gravis", description: "Autoimmune attack on nicotinic receptors" },
                { condition: "Lambert-Eaton", description: "Reduced ACh release at NMJ" }
            ],
            drugs: [
                { name: "Donepezil", mechanism: "AChE inhibitor", use: "Alzheimer's treatment" },
                { name: "Atropine", mechanism: "Muscarinic antagonist", use: "Anticholinergic" },
                { name: "Succinylcholine", mechanism: "Nicotinic agonist", use: "Muscle relaxant" }
            ]
        },
        "GABA": {
            name: "GABA (γ-Aminobutyric acid)",
            formula: "C₄H₉NO₂",
            molecularWeight: "103.12 g/mol",
            type: "Amino acid",
            primaryFunction: "Primary inhibitory neurotransmitter",
            synthesis: "Glutamate → GABA (via GAD)",
            degradation: "GABA-T → Succinate semialdehyde",
            location: "Interneurons throughout CNS",
            receptors: [
                { name: "GABA-A", description: "Cl⁻ channel, fast inhibitory, allosteric sites" },
                { name: "GABA-B", description: "Gi/o-coupled, slow inhibitory, presynaptic" }
            ],
            clinical: [
                { condition: "Epilepsy", description: "Reduced GABAergic inhibition" },
                { condition: "Anxiety Disorders", description: "GABA-A receptor dysfunction" },
                { condition: "Huntington's Disease", description: "Loss of GABAergic striatal neurons" }
            ],
            drugs: [
                { name: "Benzodiazepines", mechanism: "GABA-A positive modulator", use: "Anxiety, seizures" },
                { name: "Baclofen", mechanism: "GABA-B agonist", use: "Muscle spasticity" },
                { name: "Vigabatrin", mechanism: "GABA-T inhibitor", use: "Epilepsy" }
            ]
        },
        "Glutamate": {
            name: "Glutamate",
            formula: "C₅H₉NO₄",
            molecularWeight: "147.13 g/mol",
            type: "Amino acid",
            primaryFunction: "Primary excitatory neurotransmitter",
            synthesis: "α-Ketoglutarate → Glutamate (via transaminases)",
            degradation: "Glutamine synthetase → Glutamine (glial cells)",
            location: "Pyramidal neurons, most excitatory synapses",
            receptors: [
                { name: "AMPA", description: "Na⁺/K⁺ channel, fast excitatory" },
                { name: "NMDA", description: "Ca²⁺/Na⁺ channel, voltage-dependent, plasticity" },
                { name: "Kainate", description: "Na⁺/K⁺ channel, presynaptic modulation" }
            ],
            clinical: [
                { condition: "Stroke", description: "Glutamate excitotoxicity causes neuronal death" },
                { condition: "Alzheimer's Disease", description: "NMDA receptor dysfunction" },
                { condition: "Schizophrenia", description: "NMDA hypofunction hypothesis" }
            ],
            drugs: [
                { name: "Memantine", mechanism: "NMDA antagonist", use: "Alzheimer's treatment" },
                { name: "Ketamine", mechanism: "NMDA antagonist", use: "Anesthesia, depression" },
                { name: "Riluzole", mechanism: "Reduces glutamate release", use: "ALS treatment" }
            ]
        },
        "Norepinephrine": {
            name: "Norepinephrine (Noradrenaline)",
            formula: "C₈H₁₁NO₃",
            molecularWeight: "169.18 g/mol",
            type: "Catecholamine",
            primaryFunction: "Arousal, attention, fight-or-flight response",
            synthesis: "Dopamine → Norepinephrine (via DBH)",
            degradation: "MAO-A, COMT → VMA",
            location: "Locus coeruleus, sympathetic neurons",
            receptors: [
                { name: "α1-Adrenergic", description: "Gq-coupled, excitatory, vasoconstriction" },
                { name: "α2-Adrenergic", description: "Gi/o-coupled, inhibitory, autoreceptor" },
                { name: "β-Adrenergic", description: "Gs-coupled, increases cAMP" }
            ],
            clinical: [
                { condition: "Depression", description: "Reduced noradrenergic signaling" },
                { condition: "ADHD", description: "Altered norepinephrine in prefrontal cortex" },
                { condition: "PTSD", description: "Hyperactive noradrenergic system" }
            ],
            drugs: [{ name: "SNRIs", mechanism: "NET inhibition", use: "Depression treatment" },
            { name: "Clonidine", mechanism: "α2 agonist", use: "Hypertension, ADHD" },
            { name: "Propranolol", mechanism: "β-blocker", use: "Anxiety, hypertension" }
            ]
        },
        "Substance P": {
            name: "Substance P",
            formula: "C₆₃H₉₈N₁₈O₁₃S",
            molecularWeight: "1347.6 g/mol",
            type: "Neuropeptide",
            primaryFunction: "Pain transmission, inflammation, mood regulation",
            synthesis: "Preprotachykinin A → Substance P (via specific peptidases)",
            degradation: "Neutral endopeptidase, ACE → fragments",
            location: "Dorsal root ganglia, spinal cord, brainstem",
            receptors: [
                { name: "NK1 (Neurokinin-1)", description: "Gq-coupled, excitatory, pain transmission" },
                { name: "NK2", description: "Gq-coupled, smooth muscle contraction" },
                { name: "NK3", description: "Gq-coupled, neuronal excitation" }
            ],
            clinical: [
                { condition: "Chronic Pain", description: "Elevated substance P in pain pathways" },
                { condition: "Depression", description: "NK1 receptor involvement in mood disorders" },
                { condition: "Inflammatory Bowel Disease", description: "Substance P promotes inflammation" }
            ],
            drugs: [
                { name: "Aprepitant", mechanism: "NK1 antagonist", use: "Antiemetic, potential antidepressant" },
                { name: "Capsaicin", mechanism: "Depletes substance P", use: "Topical analgesic" },
                { name: "Fosaprepitant", mechanism: "NK1 antagonist", use: "Chemotherapy-induced nausea" }
            ]
        },
        "Adenosine": {
            name: "Adenosine",
            formula: "C₁₀H₁₃N₅O₄",
            molecularWeight: "267.24 g/mol",
            type: "Purine nucleoside",
            primaryFunction: "Sleep regulation, neuroprotection, metabolic modulation",
            synthesis: "ATP breakdown → AMP → Adenosine (via 5'-nucleotidase)",
            degradation: "Adenosine deaminase → Inosine",
            location: "Throughout CNS, especially sleep centers",
            receptors: [
                { name: "A1", description: "Gi/o-coupled, inhibitory, sleep promotion" },
                { name: "A2A", description: "Gs-coupled, excitatory, arousal suppression" },
                { name: "A2B", description: "Gs-coupled, low affinity, immune modulation" },
                { name: "A3", description: "Gi/o-coupled, neuroprotection" }
            ],
            clinical: [
                { condition: "Sleep Disorders", description: "Adenosine accumulation promotes sleep pressure" },
                { condition: "Parkinson's Disease", description: "A2A antagonists improve motor symptoms" },
                { condition: "Epilepsy", description: "Adenosine has anticonvulsant properties" }
            ],
            drugs: [
                { name: "Caffeine", mechanism: "A1/A2A antagonist", use: "Stimulant, alertness" },
                { name: "Theophylline", mechanism: "Adenosine antagonist", use: "Bronchodilator" },
                { name: "Istradefylline", mechanism: "A2A antagonist", use: "Parkinson's treatment" }
            ]
        },
        "Glycine": {
            name: "Glycine",
            formula: "C₂H₅NO₂",
            molecularWeight: "75.07 g/mol",
            type: "Amino acid",
            primaryFunction: "Inhibitory neurotransmitter, NMDA co-agonist",
            synthesis: "Serine → Glycine (via serine hydroxymethyltransferase)",
            degradation: "Glycine cleavage system → CO₂ + NH₃",
            location: "Spinal cord, brainstem, retina",
            receptors: [
                { name: "Glycine Receptor", description: "Cl⁻ channel, fast inhibitory, strychnine-sensitive" },
                { name: "NMDA (co-agonist)", description: "Required for NMDA receptor activation" }
            ],
            clinical: [
                { condition: "Hyperekplexia", description: "Glycine receptor mutations cause startle disease" },
                { condition: "Spinal Cord Injury", description: "Loss of glycinergic inhibition" },
                { condition: "Schizophrenia", description: "Glycine transport inhibition as therapy" }
            ],
            drugs: [{ name: "Strychnine", mechanism: "Glycine receptor antagonist", use: "Poison (research tool)" },
            { name: "Sarcosine", mechanism: "GlyT1 inhibitor", use: "Experimental schizophrenia treatment" },
            { name: "Taurine", mechanism: "Glycine receptor agonist", use: "Neuroprotection" }
            ]
        },
        "Endorphins": {
            name: "Endorphins",
            formula: "Variable (peptides)",
            molecularWeight: "~3000-4000 g/mol",
            type: "Neuropeptide (endogenous opioids)",
            primaryFunction: "Pain relief, euphoria, stress response",
            synthesis: "POMC → β-endorphin (via specific peptidases)",
            degradation: "Peptidases → amino acids",
            location: "Hypothalamus, pituitary, limbic system",
            receptors: [
                { name: "μ-opioid (MOR)", description: "Gi/o-coupled, analgesia, euphoria" },
                { name: "δ-opioid (DOR)", description: "Gi/o-coupled, mood regulation" },
                { name: "κ-opioid (KOR)", description: "Gi/o-coupled, stress response" }
            ],
            clinical: [
                { condition: "Chronic Pain", description: "Endogenous pain relief system" },
                { condition: "Depression", description: "Reduced endorphin levels" },
                { condition: "Exercise Addiction", description: "Runner's high from endorphin release" }
            ],
            drugs: [
                { name: "Morphine", mechanism: "μ-opioid agonist", use: "Severe pain management" },
                { name: "Naloxone", mechanism: "Opioid antagonist", use: "Overdose reversal" },
                { name: "Buprenorphine", mechanism: "Partial μ-opioid agonist", use: "Addiction treatment" }
            ]
        },
        "ATP": {
            name: "ATP (Adenosine Triphosphate)",
            formula: "C₁₀H₁₆N₅O₁₃P₃",
            molecularWeight: "507.18 g/mol",
            type: "Purine nucleotide",
            primaryFunction: "Fast synaptic transmission, co-transmitter",
            synthesis: "Cellular metabolism → ATP",
            degradation: "ATPases → ADP + Pi",
            location: "Sympathetic neurons, sensory neurons",
            receptors: [
                { name: "P2X", description: "Ligand-gated ion channels, fast excitatory" },
                { name: "P2Y", description: "GPCRs, various second messengers" }
            ],
            clinical: [
                { condition: "Neuropathic Pain", description: "P2X3 receptors in pain pathways" },
                { condition: "Bladder Dysfunction", description: "P2X1 receptors in smooth muscle" },
                { condition: "Migraine", description: "ATP release triggers headache" }
            ],
            drugs: [
                { name: "Suramin", mechanism: "P2 receptor antagonist", use: "Research tool" },
                { name: "PPADS", mechanism: "P2X antagonist", use: "Experimental pain treatment" },
                { name: "Clopidogrel", mechanism: "P2Y12 antagonist", use: "Antiplatelet therapy" }
            ]
        },
        "Nitric Oxide": {
            name: "Nitric Oxide (NO)",
            formula: "NO",
            molecularWeight: "30.01 g/mol",
            type: "Gaseous neurotransmitter",
            primaryFunction: "Retrograde signaling, vasodilation, LTP",
            synthesis: "L-arginine → NO + L-citrulline (via NOS)",
            degradation: "Rapid oxidation to NO₂⁻ and NO₃⁻",
            location: "Diffuse throughout nervous system",
            receptors: [
                { name: "Guanylyl cyclase", description: "Increases cGMP, smooth muscle relaxation" },
                { name: "Direct protein targets", description: "S-nitrosylation of proteins" }
            ],
            clinical: [
                { condition: "Stroke", description: "NO mediates excitotoxicity and neuroprotection" },
                { condition: "Erectile Dysfunction", description: "NO-cGMP pathway in penile vessels" },
                { condition: "Memory Disorders", description: "NO required for long-term potentiation" }
            ],
            drugs: [
                { name: "Sildenafil (Viagra)", mechanism: "PDE5 inhibitor (enhances NO-cGMP)", use: "Erectile dysfunction" },
                { name: "L-NAME", mechanism: "NOS inhibitor", use: "Research tool" },
                { name: "Nitroglycerin", mechanism: "NO donor", use: "Angina treatment" }
            ]
        }
    };

    // Return the details or a default structure if neurotransmitter not found
    return neurotransmitters[name] || {
        name: name,
        formula: "Not available",
        molecularWeight: "Not available",
        type: "Neurotransmitter",
        primaryFunction: "Information not available",
        synthesis: "Information not available",
        degradation: "Information not available",
        location: "Information not available",
        receptors: [{ name: "Various", description: "Detailed information not available" }],
        clinical: [{ condition: "General", description: "Clinical information not available" }],
        drugs: [{ name: "Various", mechanism: "Not specified", use: "General therapeutic applications" }]
    };
}

/**
 * Receptor Interactions
 */
function initReceptorInteractions() {
    const receptorCards = document.querySelectorAll('#content-receptors .p-3');

    receptorCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active state from all cards
            receptorCards.forEach(c => {
                c.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-100');
            });

            // Add active state to clicked card
            card.classList.add('ring-2', 'ring-blue-500', 'bg-blue-100');

            // Show detailed information
            showReceptorDetails(card);
        });
    });
}

/**
 * Show Receptor Details
 */
function showReceptorDetails(card) {
    const receptorName = card.querySelector('h4').textContent;
    const details = getReceptorDetails(receptorName);

    // Create or update details panel
    let detailsPanel = document.getElementById('receptor-details');
    if (!detailsPanel) {
        detailsPanel = document.createElement('div');
        detailsPanel.id = 'receptor-details';
        detailsPanel.className = 'mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg shadow-lg';
        card.closest('.grid').parentNode.appendChild(detailsPanel);
    }

    detailsPanel.innerHTML = `
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-green-700 dark:text-green-300">${receptorName} - Detailed Information</h3>
            <button onclick="this.parentElement.parentElement.style.display='none'" 
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl font-bold">
                ×
            </button>
        </div>
        <div class="grid md:grid-cols-2 gap-4">
            ${details.map(detail => `
                <div class="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                    <p class="text-sm">
                        <strong class="text-green-700 dark:text-green-300">${detail.label}:</strong> 
                        <span class="text-gray-700 dark:text-gray-300">${detail.value}</span>
                    </p>
                </div>
            `).join('')}
        </div>
        <div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-600 rounded">
            <p class="text-xs text-green-700 dark:text-green-300">
                <strong>💡 Clinical Note:</strong> This information is based on current neuroscience research and medical literature. 
                Receptor pharmacology continues to evolve with new discoveries.
            </p>
        </div>
    `;
}

/**
 * Get Receptor Details
 */
function getReceptorDetails(receptorName) {
    const details = {
        'AMPA Receptors': [
            { label: 'Structure', value: 'Tetrameric glutamate-gated ion channels' },
            { label: 'Subunits', value: 'GluA1-GluA4 (formerly GluR1-GluR4)' },
            { label: 'Kinetics', value: 'Fast activation (~1ms), rapid desensitization' },
            { label: 'Permeability', value: 'Na⁺ and K⁺, Ca²⁺ permeability depends on GluA2 subunit' },
            { label: 'Location', value: 'Throughout CNS, highest in hippocampus and cortex' },
            { label: 'Function', value: 'Fast excitatory synaptic transmission, synaptic plasticity' },
            { label: 'Pharmacology', value: 'Blocked by CNQX, NBQX; potentiated by ampakines' }
        ],
        'NMDA Receptors': [
            { label: 'Structure', value: 'Heterotetrameric with GluN1 and GluN2/GluN3 subunits' },
            { label: 'Activation', value: 'Requires glutamate + glycine/D-serine co-agonist' },
            { label: 'Voltage dependence', value: 'Mg²⁺ block removed by depolarization' },
            { label: 'Function', value: 'Critical for synaptic plasticity and learning' },
            { label: 'Calcium influx', value: 'High Ca²⁺ permeability triggers LTP/LTD' },
            { label: 'Development', value: 'GluN2B→GluN2A switch during maturation' },
            { label: 'Pharmacology', value: 'Blocked by AP5, MK-801; modulated by Zn²⁺, polyamines' }
        ],
        'GABA-A Receptors': [
            { label: 'Structure', value: 'Pentameric Cl⁻ channels (α₁₋₆β₁₋₃γ₁₋₃δεθπρ subunits)' },
            { label: 'Function', value: 'Fast inhibitory transmission, membrane hyperpolarization' },
            { label: 'Kinetics', value: 'Fast activation (1-5ms), brief openings' },
            { label: 'Pharmacology', value: 'Enhanced by benzodiazepines, barbiturates, ethanol' },
            { label: 'Location', value: 'Synaptic (αβγ) and extrasynaptic (αβδ) subtypes' },
            { label: 'Clinical relevance', value: 'Target for anxiolytics, sedatives, anesthetics' },
            { label: 'Pathology', value: 'Mutations cause epilepsy, anxiety disorders' }
        ],
        'Nicotinic Receptors': [
            { label: 'Structure', value: 'Pentameric cation channels (α₁₋₁₀β₁₋₄γδε subunits)' },
            { label: 'Types', value: 'Neuronal (α₄β₂, α₇) and muscle (α₁β₁γδε) subtypes' },
            { label: 'Function', value: 'Fast excitatory transmission, Na⁺/K⁺/Ca²⁺ influx' },
            { label: 'Location', value: 'NMJ, autonomic ganglia, CNS (VTA, striatum)' },
            { label: 'Kinetics', value: 'Fast activation (<1ms), rapid desensitization' },
            { label: 'Pharmacology', value: 'Agonists: nicotine, carbachol; Blockers: curare, α-bungarotoxin' },
            { label: 'Clinical relevance', value: 'Addiction, Alzheimer\'s disease, myasthenia gravis' }
        ],
        'Muscarinic Receptors': [
            { label: 'Structure', value: 'G-protein coupled receptors (7 transmembrane domains)' },
            { label: 'Subtypes', value: 'M₁, M₃, M₅ (Gq/11); M₂, M₄ (Gi/o)' },
            { label: 'Function', value: 'Slow modulatory effects via second messengers' },
            { label: 'Signaling', value: 'IP₃/DAG (M₁,₃,₅) or cAMP inhibition (M₂,₄)' },
            { label: 'Location', value: 'Autonomic targets, cortex, hippocampus, striatum' },
            { label: 'Kinetics', value: 'Slow onset (100ms-seconds), prolonged duration' },
            { label: 'Pharmacology', value: 'Agonists: muscarine, pilocarpine; Blockers: atropine, scopolamine' },
            { label: 'Clinical relevance', value: 'Alzheimer\'s therapy, overactive bladder, COPD' }
        ],
        'Dopamine Receptors': [
            { label: 'Structure', value: 'G-protein coupled receptors with 7 transmembrane domains' },
            { label: 'Subtypes', value: 'D₁-like (D₁, D₅): Gs/Golf; D₂-like (D₂, D₃, D₄): Gi/o' },
            { label: 'Function', value: 'Motor control, reward, motivation, executive function' },
            { label: 'Signaling', value: 'cAMP activation (D₁-like) or inhibition (D₂-like)' },
            { label: 'Location', value: 'Striatum, nucleus accumbens, prefrontal cortex, VTA' },
            { label: 'Pathways', value: 'Nigrostriatal, mesolimbic, mesocortical, tuberoinfundibular' },
            { label: 'Pharmacology', value: 'Agonists: L-DOPA, bromocriptine; Blockers: haloperidol, clozapine' },
            { label: 'Clinical relevance', value: 'Parkinson\'s disease, schizophrenia, addiction, ADHD' }
        ],
        'Serotonin Receptors': [
            { label: 'Structure', value: 'Mostly GPCRs, except 5-HT₃ (ligand-gated ion channel)' },
            { label: 'Subtypes', value: '14 subtypes across 7 families (5-HT₁₋₇)' },
            { label: 'Function', value: 'Mood regulation, sleep, appetite, cognition, pain' },
            { label: 'Major types', value: '5-HT₁ₐ (Gi), 5-HT₂ₐ (Gq), 5-HT₃ (Na⁺/K⁺), 5-HT₄ (Gs)' },
            { label: 'Location', value: 'Raphe nuclei projections throughout brain and spinal cord' },
            { label: 'Signaling', value: 'Various: cAMP, IP₃/DAG, direct ion channel (5-HT₃)' },
            { label: 'Pharmacology', value: 'SSRIs, triptans, LSD, psilocybin target different subtypes' },
            { label: 'Clinical relevance', value: 'Depression, anxiety, migraine, psychedelics, GI disorders' }
        ],
        'mGluR': [
            { label: 'Structure', value: 'Group III GPCRs with large extracellular glutamate-binding domain' },
            { label: 'Classification', value: 'Group I (mGluR1,5): Gq/11; Groups II,III (mGluR2,3,4,6,7,8): Gi/o' },
            { label: 'Function', value: 'Synaptic modulation, plasticity, neuroprotection' },
            { label: 'Location', value: 'Perisynaptic and extrasynaptic membranes' },
            { label: 'Signaling', value: 'IP₃/DAG (Group I) or cAMP inhibition (Groups II,III)' },
            { label: 'Kinetics', value: 'Slow modulatory effects (hundreds of ms to minutes)' },
            { label: 'Pharmacology', value: 'Selective agonists/antagonists for different groups' },
            { label: 'Clinical relevance', value: 'Potential targets for schizophrenia, anxiety, pain' }
        ]
    };

    return details[receptorName] || [{ label: 'Information', value: 'Details not available' }];
}

/**
 * Integration Simulations
 */
function initIntegrationSimulations() {
    // Initialize spatial and temporal summation simulations
    initSummationSimulation();
    initPlasticityDemo();
}

/**
 * Enhanced Summation Simulation with Medical Accuracy
 */
function initSummationSimulation() {
    const integrationContent = document.getElementById('content-integration');
    if (!integrationContent) return;

    // Check if simulator already exists to prevent duplicates
    const existingSimulator = integrationContent.querySelector('.neural-integration-simulator');
    if (existingSimulator) {
        console.log('Neural Integration Simulator already exists, skipping creation');
        return;
    }

    const simulationDiv = document.createElement('div');
    simulationDiv.className = 'neural-integration-simulator mt-6 p-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-blue-200 dark:border-gray-600';
    simulationDiv.innerHTML = `        <h4 class="font-semibold mb-4 text-lg text-green-700 dark:text-green-300">${chapter2Locale.integrationTitle}</h4>
        <p class="text-sm text-white mb-4 font-medium">${chapter2Locale.integrationIntro}</p>
        
        <div class="grid md:grid-cols-3 gap-4 mb-6">
            <!-- Excitatory Input 1 -->
            <div class="p-4 bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-700">
                <label class="block text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                    ${chapter2Locale.excitA}
                </label>
                <input type="range" id="input1" min="0" max="8" value="2" step="0.5" class="slider w-full mb-2">
                <div class="text-center">
                    <span id="input1-value" class="font-medium text-green-600">+2.0 mV</span>
                    <p class="text-xs text-gray-500">${chapter2Locale.epsp}</p>
                </div>
            </div>

            <!-- Excitatory Input 2 -->
            <div class="p-4 bg-white dark:bg-gray-700 rounded-lg border border-green-200 dark:border-green-700">
                <label class="block text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                    ${chapter2Locale.excitB}
                </label>
                <input type="range" id="input2" min="0" max="8" value="2" step="0.5" class="slider w-full mb-2">
                <div class="text-center">
                    <span id="input2-value" class="font-medium text-green-600">+2.0 mV</span>
                    <p class="text-xs text-gray-500">${chapter2Locale.epsp}</p>
                </div>
            </div>

            <!-- Inhibitory Input -->
            <div class="p-4 bg-white dark:bg-gray-700 rounded-lg border border-red-200 dark:border-red-700">
                <label class="block text-sm font-medium mb-2 text-red-700 dark:text-red-300">
                    ${chapter2Locale.inhib}
                </label>
                <input type="range" id="input3" min="0" max="6" value="1" step="0.5" class="slider w-full mb-2">
                <div class="text-center">
                    <span id="input3-value" class="font-medium text-red-600">-1.0 mV</span>
                    <p class="text-xs text-gray-500">${chapter2Locale.ipsp}</p>
                </div>
            </div>
        </div>

        <!-- Temporal Controls -->
        <div class="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg border border-blue-200 dark:border-blue-700">
            <h5 class="font-medium mb-3 text-blue-700 dark:text-blue-300">${chapter2Locale.temporalControls}</h5>
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">${chapter2Locale.timingOffset}</label>
                    <input type="range" id="timing-offset" min="0" max="10" value="0" step="1" class="slider w-full">
                    <span id="timing-value" class="text-sm">${chapter2Locale.simultaneous}</span>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">${chapter2Locale.membraneTime}</label>
                    <select id="time-constant" class="w-full p-2 border rounded">
                        <option value="fast">${chapter2Locale.fast}</option>
                        <option value="medium" selected>${chapter2Locale.medium}</option>
                        <option value="slow">${chapter2Locale.slow}</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Results Display -->
        <div class="p-4 bg-white dark:bg-gray-700 rounded-lg border-2 border-gray-300 dark:border-gray-600">
            <div class="flex justify-between items-center mb-3">
                <h5 class="font-medium text-gray-800 dark:text-gray-200">${chapter2Locale.membranePotential}</h5>
                <button id="fire-neuron" class="px-3 py-1 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded disabled:opacity-50" disabled>
                    ${chapter2Locale.fireAp}
                </button>
            </div>
            
            <div class="relative">
                <!-- Resting potential line -->
                <div class="absolute left-0 top-1/2 w-full h-0.5 bg-gray-400 opacity-50"></div>
                <div class="absolute left-0 top-1/2 text-xs text-gray-500 -mt-6">${chapter2Locale.resting}</div>
                
                <!-- Threshold line -->
                <div class="absolute left-0 w-full h-0.5 bg-red-500 opacity-70" style="top: 20%"></div>
                <div class="absolute left-0 text-xs text-red-600 font-medium" style="top: 16%">${chapter2Locale.threshold}</div>
                
                <!-- Potential bar -->
                <div class="bg-gray-200 dark:bg-gray-600 rounded-full h-8 relative overflow-hidden">
                    <div id="potential-bar" class="h-8 rounded-full transition-all duration-500 flex items-center justify-center text-white font-medium text-sm" 
                         style="width: 0%; background: linear-gradient(90deg, #059669, #10b981);">
                        <span id="potential-text">-70.0 mV</span>
                    </div>
                </div>
                
                <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>-70 mV</span>
                    <span id="net-change">${chapter2Locale.net} 0.0 mV</span>
                    <span>-30 mV</span>
                </div>
            </div>

            <!-- Educational notes -->
            <div class="mt-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p id="integration-note">${chapter2Locale.spatial}</p>
                <p id="temporal-note">${chapter2Locale.temporal}</p>
                <p id="threshold-note">${chapter2Locale.thresholdNote}</p>
            </div>
        </div>
    `;

    const gridElement = integrationContent.querySelector('.lg\\:w-1\\/2');
    if (gridElement) {
        gridElement.appendChild(simulationDiv);

        // Initialize enhanced controls
        initEnhancedSummationControls();
    }
}

/**
 * Enhanced Summation Controls with Medical Accuracy
 */
function initEnhancedSummationControls() {
    const elements = {
        input1: document.getElementById('input1'),
        input2: document.getElementById('input2'),
        input3: document.getElementById('input3'),
        timingOffset: document.getElementById('timing-offset'),
        timeConstant: document.getElementById('time-constant'),
        input1Value: document.getElementById('input1-value'),
        input2Value: document.getElementById('input2-value'),
        input3Value: document.getElementById('input3-value'),
        timingValue: document.getElementById('timing-value'),
        potentialBar: document.getElementById('potential-bar'),
        potentialText: document.getElementById('potential-text'),
        netChange: document.getElementById('net-change'),
        fireButton: document.getElementById('fire-neuron'),
        integrationNote: document.getElementById('integration-note'),
        temporalNote: document.getElementById('temporal-note'),
        thresholdNote: document.getElementById('threshold-note')
    };

    function updateSummation() {
        const excit1 = parseFloat(elements.input1.value);
        const excit2 = parseFloat(elements.input2.value);
        const inhib = parseFloat(elements.input3.value);
        const timing = parseInt(elements.timingOffset.value);
        const timeConstantType = elements.timeConstant.value;

        // Update value displays
        elements.input1Value.textContent = `+${excit1.toFixed(1)} mV`;
        elements.input2Value.textContent = `+${excit2.toFixed(1)} mV`;
        elements.input3Value.textContent = `-${inhib.toFixed(1)} mV`;

        if (timing === 0) {
            elements.timingValue.textContent = chapter2Locale.simultaneous;
        } else {
            elements.timingValue.textContent = `${timing} ${chapter2Locale.offset}`;
        }

        // Calculate temporal summation effects
        let temporalFactor = 1.0;
        if (timing > 0) {
            const timeConstants = { fast: 5, medium: 10, slow: 20 };
            const tau = timeConstants[timeConstantType];
            temporalFactor = Math.exp(-timing / tau); // Exponential decay
        }

        // Calculate net membrane potential change
        let netChange = (excit1 + excit2) * temporalFactor - inhib;
        const restingPotential = -70.0;
        const currentPotential = restingPotential + netChange;
        const threshold = -55.0;

        // Update displays
        elements.netChange.textContent = `${chapter2Locale.net} ${netChange >= 0 ? '+' : ''}${netChange.toFixed(1)} mV`;
        elements.potentialText.textContent = `${currentPotential.toFixed(1)} mV`;

        // Calculate bar width (from -70mV to -30mV range)
        const minPotential = -70;
        const maxPotential = -30;
        const percentage = Math.max(0, Math.min(100, ((currentPotential - minPotential) / (maxPotential - minPotential)) * 100));

        // Color coding based on potential
        let barColor = 'linear-gradient(90deg, #059669, #10b981)'; // Default green
        if (currentPotential >= threshold) {
            barColor = 'linear-gradient(90deg, #dc2626, #ef4444)'; // Red for suprathreshold
            elements.fireButton.disabled = false;
            elements.fireButton.textContent = chapter2Locale.fire;
        } else if (currentPotential > -65) {
            barColor = 'linear-gradient(90deg, #d97706, #f59e0b)'; // Orange for subthreshold
            elements.fireButton.disabled = true;
            elements.fireButton.textContent = chapter2Locale.subthreshold;
        } else {
            elements.fireButton.disabled = true;
            elements.fireButton.textContent = chapter2Locale.noChange;
        }

        elements.potentialBar.style.width = `${percentage}%`;
        elements.potentialBar.style.background = barColor;

        // Update educational notes
        updateEducationalNotes(excit1, excit2, inhib, timing, temporalFactor, currentPotential, threshold);
    }

    function updateEducationalNotes(excit1, excit2, inhib, timing, temporalFactor, potential, threshold) {
        let spatialNote = chapter2Locale.spatial.replace('Multiple synapses active simultaneously', `${excit1}mV + ${excit2}mV - ${inhib}mV`).replace('Πολλαπλές συνάψεις ενεργές ταυτόχρονα', `${excit1}mV + ${excit2}mV - ${inhib}mV`);
        let temporalNote = `• <strong>${chapter2Locale.temporal.includes('Temporal') ? 'Temporal summation' : 'Χρονική άθροιση'}:</strong> ${timing === 0 ? chapter2Locale.perfect : `${chapter2Locale.reducedBy} ${((1 - temporalFactor) * 100).toFixed(0)}%`} (τ effect)`;
        let thresholdNote = `• <strong>${chapter2Locale.thresholdNote.includes('Threshold') ? 'Threshold' : 'Κατώφλι'}:</strong> ${potential >= threshold ? chapter2Locale.reached : `${chapter2Locale.needMore} ${(threshold - potential).toFixed(1)}mV ${chapter2Locale.needMore === '❌ Need' ? 'more' : ''}`}`;

        elements.integrationNote.innerHTML = spatialNote;
        elements.temporalNote.innerHTML = temporalNote;
        elements.thresholdNote.innerHTML = thresholdNote;
    }

    // Action potential simulation
    elements.fireButton.addEventListener('click', () => {
        elements.potentialBar.style.background = 'linear-gradient(90deg, #fbbf24, #f59e0b)';
        elements.potentialText.textContent = '+30.0 mV';
        elements.fireButton.textContent = chapter2Locale.firing;

        setTimeout(() => {
            updateSummation(); // Reset to normal state
        }, 1000);
    });

    // Add event listeners
    [elements.input1, elements.input2, elements.input3, elements.timingOffset].forEach(input => {
        input.addEventListener('input', updateSummation);
    });

    elements.timeConstant.addEventListener('change', updateSummation);    // Initial update
    updateSummation();
}

/**
 * Plasticity Demo
 */
function initPlasticityDemo() {
    // Add plasticity demonstration functionality
    console.log('Plasticity demo initialized');
}
