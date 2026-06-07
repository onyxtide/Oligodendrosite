/**
 * Chapter 3: Neural Networks & Brain Plasticity - Interactive Features
 * Simplified and focused approach matching Chapters 1 & 2
 * Medical accuracy ensured, optimized for all devices and themes
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('Chapter 3: Neural Networks & Brain Plasticity - Initializing...');

    // Initialize tab navigation first
    initTabNavigation();

    // Initialize all interactive features
    initNetworkSimulation();
    initPlasticitySimulation();
    initPathwayInteractions();
    initMemorySimulation();

    console.log('✅ Chapter 3 features loaded successfully!');
});

const chapter3Locale = (document.documentElement.lang || '').startsWith('el') || window.location.pathname.includes('/gr/')
    ? {
        startNetwork: 'Εκκίνηση Δικτύου',
        stopNetwork: 'Διακοπή Δικτύου',
        ready: 'Έτοιμο',
        none: 'Κανένα',
        datasetLabel: 'Συναπτική Ισχύς (%)'
    }
    : {
        startNetwork: 'Start Network',
        stopNetwork: 'Stop Network',
        ready: 'Ready',
        none: 'None',
        datasetLabel: 'Synaptic Strength (%)'
    };

/**
 * Initialize Tab Navigation
 * Simple and reliable tab switching functionality
 */
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabButtons.length === 0 || tabContents.length === 0) {
        console.warn('Tab elements not found');
        return;
    }

    // Add click event listeners to tab buttons
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
 * @param {string} activeTabId - The ID of the tab content to show
 * @param {HTMLElement} activeButton - The button that was clicked
 */
function switchTab(activeTabId, activeButton) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Reset all tab button styles and ARIA states
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('text-purple-700');
        button.classList.add('text-gray-500');
        button.setAttribute('aria-selected', 'false');
    });

    // Show the active tab content
    const activeTab = document.getElementById(activeTabId);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Highlight the active button
    if (activeButton) {
        activeButton.classList.remove('text-gray-500');
        activeButton.classList.add('text-purple-700');
        activeButton.setAttribute('aria-selected', 'true');
    }

    // Initialize tab-specific content
    if (activeTabId === 'content-networks') {
        initNetworkVisualization();
    } else if (activeTabId === 'content-plasticity') {
        initPlasticityChart();
    } else if (activeTabId === 'content-memory') {
        initMemoryChart();
    } else if (activeTabId === 'content-modern') {
        console.log('🔬 Modern Plasticity tab activated');
    }

    console.log('Switched to tab:', activeTabId);
}

/**
 * Network Simulation
 * Interactive neural network visualization
 */
function initNetworkSimulation() {
    const runBtn = document.getElementById('run-network');
    const resetBtn = document.getElementById('reset-network');
    const networkTypeSelect = document.getElementById('network-type');

    if (runBtn) {
        runBtn.addEventListener('click', function () {
            const currentText = runBtn.textContent.trim();
            if (currentText === chapter3Locale.startNetwork) {
                runBtn.textContent = chapter3Locale.stopNetwork;
                runBtn.classList.remove('bg-purple-600', 'hover:bg-purple-700');
                runBtn.classList.add('bg-red-600', 'hover:bg-red-700');
                startNetworkAnimation();
            } else {
                runBtn.textContent = chapter3Locale.startNetwork;
                runBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
                runBtn.classList.add('bg-purple-600', 'hover:bg-purple-700');
                stopNetworkAnimation();
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetNetwork);
    }

    if (networkTypeSelect) {
        networkTypeSelect.addEventListener('change', function () {
            createNetwork(this.value);
        });
    }

    // Initialize with default network
    createNetwork('feedforward');
}

function initNetworkVisualization() {
    const svg = document.getElementById('network-svg');
    if (!svg) return;

    // Clear any existing content
    svg.innerHTML = '';
    createNetwork('feedforward');
}

function createNetwork(type) {
    const svg = document.getElementById('network-svg');
    if (!svg) return;

    svg.innerHTML = '';

    // Create network based on type
    switch (type) {
        case 'feedforward':
            createFeedforwardNetwork(svg);
            break;
        case 'recurrent':
            createRecurrentNetwork(svg);
            break;
        case 'small-world':
            createSmallWorldNetwork(svg);
            break;
    }

    updateNetworkStats();
}

function createFeedforwardNetwork(svg) {
    // More medically accurate neural network structure
    const layers = [4, 8, 6, 2]; // Input, hidden1, hidden2, output
    const layerSpacing = 120; // Distance between layers

    // Vary neuron sizes based on type/function
    const nodeRadii = {
        input: 8,      // Sensory neurons
        hidden1: 7,    // Interneurons (varied sizes)
        hidden2: 7,    // Interneurons (varied sizes)
        output: 9      // Motor neurons (larger)
    };

    // More neurobiologically accurate colors
    // Blue: excitatory neurons, Red: inhibitory neurons, Green: output neurons
    const colors = ['#3b82f6', '#8b5cf6', '#8b5cf6', '#10b981'];

    let nodeId = 0;
    const nodes = [];
    const connections = [];
    const inhibitoryNodes = []; // Track inhibitory neurons for different styling

    // Create nodes by layers with more biological variation
    for (let layer = 0; layer < layers.length; layer++) {
        const nodeCount = layers[layer];
        const nodeSpacing = 300 / (nodeCount + 1);
        const x = layerSpacing * (layer + 1) + 30; // Centered positioning for 600px viewBox
        const layerType = ['input', 'hidden1', 'hidden2', 'output'][layer];

        for (let node = 0; node < nodeCount; node++) {
            // Add slight position variation for more natural appearance
            const jitter = (Math.random() - 0.5) * 10;
            const y = nodeSpacing * (node + 1) + 50 + jitter;

            // Determine if this should be an inhibitory neuron (red)
            // ~20% of interneurons are inhibitory in cortical networks
            const isInhibitory = (layer === 1 || layer === 2) && Math.random() < 0.2;

            if (isInhibitory) {
                inhibitoryNodes.push(nodeId);
            }

            const nodeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            const radius = nodeRadii[layerType] * (isInhibitory ? 0.9 : 1); // Inhibitory neurons slightly smaller

            nodeElement.setAttribute('cx', x);
            nodeElement.setAttribute('cy', y);
            nodeElement.setAttribute('r', radius);
            nodeElement.setAttribute('fill', isInhibitory ? '#ef4444' : colors[layer]); // Red for inhibitory
            nodeElement.setAttribute('stroke', '#ffffff');
            nodeElement.setAttribute('stroke-width', '2');
            nodeElement.setAttribute('class', 'neuron cursor-pointer transition-all duration-300');
            nodeElement.setAttribute('data-layer', layer);
            nodeElement.setAttribute('data-node', node);
            nodeElement.setAttribute('data-type', isInhibitory ? 'inhibitory' : 'excitatory');

            // Add click event for activation
            nodeElement.addEventListener('click', function () {
                activateNeuron(this);
            });

            svg.appendChild(nodeElement);
            nodes.push({
                element: nodeElement,
                x,
                y,
                layer,
                node: nodeId++,
                active: false,
                isInhibitory: isInhibitory
            });
        }
    }

    // Create connections between adjacent layers with more realistic patterns
    let layerStart = 0;
    for (let layer = 0; layer < layers.length - 1; layer++) {
        const currentLayerSize = layers[layer];
        const nextLayerSize = layers[layer + 1];

        for (let i = 0; i < currentLayerSize; i++) {
            // Not every neuron connects to every neuron in the next layer
            // More realistic connection patterns based on proximity and random factors
            const connectionCount = Math.ceil(nextLayerSize * (Math.random() * 0.3 + 0.5)); // Connect to 50-80% of next layer

            // Create a list of potential target indices and shuffle them
            const targetIndices = Array.from({ length: nextLayerSize }, (_, j) => j);
            shuffleArray(targetIndices);

            // Connect to a subset of the next layer
            for (let j = 0; j < connectionCount; j++) {
                const sourceNode = nodes[layerStart + i];
                const targetNode = nodes[layerStart + currentLayerSize + targetIndices[j]];

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', sourceNode.x);
                line.setAttribute('y1', sourceNode.y);
                line.setAttribute('x2', targetNode.x);
                line.setAttribute('y2', targetNode.y);

                // Style based on whether source is inhibitory or excitatory
                if (sourceNode.isInhibitory) {
                    line.setAttribute('stroke', '#ef4444'); // Red for inhibitory connections
                    line.setAttribute('stroke-dasharray', '3,2'); // Dashed line for inhibitory
                } else {
                    line.setAttribute('stroke', '#6b7280'); // Gray for excitatory
                }

                // Vary connection strength (line width)
                const connectionStrength = Math.random() * 0.8 + 0.6; // 0.6-1.4 range
                line.setAttribute('stroke-width', connectionStrength);

                const opacity = Math.random() * 0.3 + 0.4; // 0.4-0.7 range
                line.setAttribute('opacity', opacity.toString());
                line.setAttribute('class', 'connection');
                line.setAttribute('data-type', sourceNode.isInhibitory ? 'inhibitory' : 'excitatory');

                svg.insertBefore(line, svg.firstChild); // Insert before nodes
                connections.push({
                    element: line,
                    source: sourceNode,
                    target: targetNode,
                    strength: connectionStrength,
                    isInhibitory: sourceNode.isInhibitory
                });
            }
        }
        layerStart += currentLayerSize;
    }

    // Store references for animation
    window.networkNodes = nodes;
    window.networkConnections = connections;
}

// Helper function to shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createRecurrentNetwork(svg) {
    const nodeCount = 12;
    const radius = 120;
    const centerX = 300;
    const centerY = 200;
    const nodeRadius = 8;
    const nodes = [];
    const connections = [];

    // Create nodes in a circle
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const nodeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        nodeElement.setAttribute('cx', x);
        nodeElement.setAttribute('cy', y);
        nodeElement.setAttribute('r', nodeRadius);
        nodeElement.setAttribute('fill', '#8b5cf6');
        nodeElement.setAttribute('stroke', '#ffffff');
        nodeElement.setAttribute('stroke-width', '2');
        nodeElement.setAttribute('class', 'neuron cursor-pointer transition-all duration-300');

        nodeElement.addEventListener('click', function () {
            activateNeuron(this);
        });

        svg.appendChild(nodeElement);
        nodes.push({ element: nodeElement, x, y, node: i, active: false });
    }

    // Create connections (each node connects to next 2-3 nodes)
    for (let i = 0; i < nodeCount; i++) {
        for (let j = 1; j <= 2; j++) {
            const targetIndex = (i + j) % nodeCount;
            const sourceNode = nodes[i];
            const targetNode = nodes[targetIndex];

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', sourceNode.x);
            line.setAttribute('y1', sourceNode.y);
            line.setAttribute('x2', targetNode.x);
            line.setAttribute('y2', targetNode.y);
            line.setAttribute('stroke', '#6b7280');
            line.setAttribute('stroke-width', '1');
            line.setAttribute('opacity', '0.6');
            line.setAttribute('class', 'connection');

            svg.insertBefore(line, svg.firstChild);
            connections.push({ element: line, source: sourceNode, target: targetNode });
        }
    }

    window.networkNodes = nodes;
    window.networkConnections = connections;
}

function createSmallWorldNetwork(svg) {
    const nodeCount = 16;
    const centerX = 300;
    const centerY = 200;
    const radius = 130;
    const nodeRadius = 6;
    const nodes = [];
    const connections = [];

    // Create nodes in a grid-like pattern with some randomization
    for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * 2 * Math.PI;
        const r = radius + (Math.random() - 0.5) * 40; // Add some randomness
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        const nodeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        nodeElement.setAttribute('cx', x);
        nodeElement.setAttribute('cy', y);
        nodeElement.setAttribute('r', nodeRadius);
        nodeElement.setAttribute('fill', '#10b981');
        nodeElement.setAttribute('stroke', '#ffffff');
        nodeElement.setAttribute('stroke-width', '2');
        nodeElement.setAttribute('class', 'neuron cursor-pointer transition-all duration-300');

        nodeElement.addEventListener('click', function () {
            activateNeuron(this);
        });

        svg.appendChild(nodeElement);
        nodes.push({ element: nodeElement, x, y, node: i, active: false });
    }

    // Create small-world connections (local + some long-range)
    for (let i = 0; i < nodeCount; i++) {
        // Local connections
        for (let j = 1; j <= 2; j++) {
            const targetIndex = (i + j) % nodeCount;
            createConnection(svg, nodes[i], nodes[targetIndex], connections);
        }

        // Some long-range connections
        if (Math.random() < 0.3) {
            const randomTarget = Math.floor(Math.random() * nodeCount);
            if (randomTarget !== i && Math.abs(randomTarget - i) > 2) {
                createConnection(svg, nodes[i], nodes[randomTarget], connections);
            }
        }
    }

    window.networkNodes = nodes;
    window.networkConnections = connections;
}

function createConnection(svg, sourceNode, targetNode, connections) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', sourceNode.x);
    line.setAttribute('y1', sourceNode.y);
    line.setAttribute('x2', targetNode.x);
    line.setAttribute('y2', targetNode.y);
    line.setAttribute('stroke', '#6b7280');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('opacity', '0.6');
    line.setAttribute('class', 'connection');

    svg.insertBefore(line, svg.firstChild);
    connections.push({ element: line, source: sourceNode, target: targetNode });
}

function activateNeuron(neuronElement) {
    // Get neuron type
    const isInhibitory = neuronElement.getAttribute('data-type') === 'inhibitory';
    const layer = neuronElement.getAttribute('data-layer');

    // Visual feedback - different colors for inhibitory vs excitatory
    if (isInhibitory) {
        // Inhibitory neurons flash blue when activated
        neuronElement.setAttribute('fill', '#3b82f6');
        neuronElement.style.filter = 'drop-shadow(0 0 8px #3b82f6)';
    } else {
        // Excitatory neurons flash yellow/gold when activated
        neuronElement.setAttribute('fill', '#fbbf24');
        neuronElement.style.filter = 'drop-shadow(0 0 8px #fbbf24)';
    }

    // Find connected neurons and propagate signal
    if (window.networkConnections) {
        // Find connections where this neuron is the source
        const outgoingConnections = window.networkConnections.filter(
            conn => conn.source.element === neuronElement
        );

        // Highlight connections
        outgoingConnections.forEach(conn => {
            const connection = conn.element;

            // Highlight the connection
            connection.setAttribute('stroke-width', (parseFloat(connection.getAttribute('stroke-width')) * 2).toString());
            connection.setAttribute('opacity', '1');

            // Propagate to target neurons with a delay
            setTimeout(() => {
                // If inhibitory, the target is inhibited (dimmed)
                if (isInhibitory) {
                    conn.target.element.setAttribute('fill', '#9ca3af'); // Gray for inhibition
                    conn.target.element.style.filter = 'brightness(0.7)';
                } else {
                    // Otherwise, activate the target
                    conn.target.element.setAttribute('fill', '#fbbf24');
                    conn.target.element.style.filter = 'drop-shadow(0 0 8px #fbbf24)';
                }

                // Reset target after a delay
                setTimeout(() => {
                    const targetLayer = conn.target.element.getAttribute('data-layer');
                    const targetType = conn.target.element.getAttribute('data-type');

                    // Determine original color based on layer and type
                    let originalColor;
                    if (targetType === 'inhibitory') {
                        originalColor = '#ef4444'; // Red for inhibitory
                    } else if (targetLayer === '0') {
                        originalColor = '#3b82f6'; // Blue for input
                    } else if (targetLayer === '3') {
                        originalColor = '#10b981'; // Green for output
                    } else {
                        originalColor = '#8b5cf6'; // Purple for hidden
                    }

                    conn.target.element.setAttribute('fill', originalColor);
                    conn.target.element.style.filter = '';
                }, 800);
            }, 200);

            // Reset connection after delay
            setTimeout(() => {
                connection.setAttribute('stroke-width', (conn.strength || 1).toString());
                connection.setAttribute('opacity', '0.6');
            }, 600);
        });
    }

    // Reset after animation
    setTimeout(() => {
        let originalColor;
        if (isInhibitory) {
            originalColor = '#ef4444'; // Red for inhibitory
        } else if (layer === '0') {
            originalColor = '#3b82f6'; // Blue for input
        } else if (layer === '3') {
            originalColor = '#10b981'; // Green for output
        } else {
            originalColor = '#8b5cf6'; // Purple for hidden
        }

        neuronElement.setAttribute('fill', originalColor);
        neuronElement.style.filter = '';
    }, 1000);

    updateNetworkStats();
}

let networkAnimationId;

function startNetworkAnimation() {
    if (!window.networkNodes) return;

    function animate() {
        // Randomly activate neurons
        if (Math.random() < 0.1) {
            const randomNode = window.networkNodes[Math.floor(Math.random() * window.networkNodes.length)];
            activateNeuron(randomNode.element);
        }
        networkAnimationId = requestAnimationFrame(animate);
    }

    animate();
}

function stopNetworkAnimation() {
    if (networkAnimationId) {
        cancelAnimationFrame(networkAnimationId);
        networkAnimationId = null;
    }
}

function resetNetwork() {
    stopNetworkAnimation();

    const runBtn = document.getElementById('run-network');
    if (runBtn) {
        runBtn.textContent = chapter3Locale.startNetwork;
        runBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
        runBtn.classList.add('bg-purple-600', 'hover:bg-purple-700');
    }

    // Reset all neurons to default state
    if (window.networkNodes) {
        window.networkNodes.forEach(node => {
            const originalColor = node.layer === 0 ? '#3b82f6' :
                node.layer === 3 ? '#10b981' : '#8b5cf6';
            node.element.setAttribute('fill', originalColor);
            node.element.style.filter = '';
            node.active = false;
        });
    }

    updateNetworkStats();
}

function updateNetworkStats() {
    const nodeCountEl = document.getElementById('node-count');
    const connectionCountEl = document.getElementById('connection-count');
    const activeNodesEl = document.getElementById('active-nodes');

    if (nodeCountEl && window.networkNodes) {
        nodeCountEl.textContent = window.networkNodes.length;
    }

    if (connectionCountEl && window.networkConnections) {
        connectionCountEl.textContent = window.networkConnections.length;
    }

    if (activeNodesEl && window.networkNodes) {
        const activeCount = window.networkNodes.filter(n => n.active).length;
        activeNodesEl.textContent = activeCount;
    }
}

/**
 * Plasticity Simulation
 * Interactive LTP/LTD demonstration
 */
function initPlasticitySimulation() {
    const frequencySlider = document.getElementById('frequency-slider');
    const frequencyDisplay = document.getElementById('frequency-display');
    const stimulateBtn = document.getElementById('stimulate-synapses');

    if (frequencySlider && frequencyDisplay) {
        frequencySlider.addEventListener('input', function () {
            frequencyDisplay.textContent = this.value + ' Hz';
        });
    }

    if (stimulateBtn) {
        stimulateBtn.addEventListener('click', function () {
            const frequency = frequencySlider ? parseInt(frequencySlider.value) : 10;
            simulatePlasticity(frequency);
        });
    }
}

function initPlasticityChart() {
    const ctx = document.getElementById('plasticity-chart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.plasticityChart) {
        window.plasticityChart.destroy();
    }

    window.plasticityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: 60 }, (_, i) => i),
            datasets: [{
                label: chapter3Locale.datasetLabel,
                data: Array(60).fill(100),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 200,
                    title: {
                        display: true,
                        text: 'Synaptic Strength (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time (minutes)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function simulatePlasticity(frequency) {
    if (!window.plasticityChart) return;

    const chart = window.plasticityChart;
    const dataset = chart.data.datasets[0];

    // Simulate different plasticity based on frequency
    let targetStrength;
    if (frequency >= 50) {
        // High frequency = LTP
        targetStrength = 150 + Math.random() * 30;
    } else if (frequency <= 5) {
        // Low frequency = LTD
        targetStrength = 70 - Math.random() * 20;
    } else {
        // Medium frequency = little change
        targetStrength = 100 + (Math.random() - 0.5) * 20;
    }

    // Animate the change
    const startStrength = dataset.data[dataset.data.length - 1];
    const steps = 30;
    let currentStep = 0;

    function animateChange() {
        currentStep++;
        const progress = currentStep / steps;
        const currentStrength = startStrength + (targetStrength - startStrength) * progress;

        // Shift data left and add new point
        dataset.data.shift();
        dataset.data.push(currentStrength);

        chart.update('none');

        if (currentStep < steps) {
            setTimeout(animateChange, 100);
        }
    }

    animateChange();
}

/**
 * Pathway Interactions
 * Information about neural pathways
 */
function initPathwayInteractions() {
    const pathwayCards = document.querySelectorAll('.pathway-card');
    const pathwayDetails = document.getElementById('pathway-details');

    pathwayCards.forEach(card => {
        card.addEventListener('click', function () {
            const pathway = this.getAttribute('data-pathway');
            showPathwayDetails(pathway, pathwayDetails);

            // Visual feedback
            pathwayCards.forEach(c => c.classList.remove('ring-2', 'ring-purple-500'));
            this.classList.add('ring-2', 'ring-purple-500');
        });
    });
}

function showPathwayDetails(pathway, detailsElement) {
    const pathwayInfo = {
        visual: {
            title: 'Visual Pathway',
            anatomy: 'Retina → Optic Nerve → Optic Chiasm → LGN → Primary Visual Cortex (V1) → Higher Visual Areas',
            function: 'Processes visual information through parallel streams: magnocellular (motion, depth) and parvocellular (color, form). Information then flows through dorsal "where/how" stream and ventral "what" stream.',
            clinical: 'Lesions cause specific deficits: optic nerve damage leads to monocular blindness, chiasm lesions cause bitemporal hemianopia, cortical lesions produce visual field defects or visual agnosia.'
        },
        motor: {
            title: 'Motor Pathway',
            anatomy: 'Primary Motor Cortex (M1) → Corticospinal Tract → Spinal Motor Neurons → Muscles',
            function: 'Controls voluntary movement through upper and lower motor neurons. Supplementary motor areas plan movements, while cerebellum and basal ganglia modulate execution.',
            clinical: 'Upper motor neuron lesions cause spasticity and hyperreflexia. Lower motor neuron lesions cause flaccid paralysis and muscle atrophy. ALS affects both systems.'
        },
        auditory: {
            title: 'Auditory Pathway',
            anatomy: 'Cochlea → Cochlear Nucleus → Superior Olivary Complex → Inferior Colliculus → Medial Geniculate Nucleus → Primary Auditory Cortex',
            function: 'Processes sound frequency, intensity, and spatial location. Binaural processing enables sound localization through interaural time and intensity differences.',
            clinical: 'Conductive hearing loss affects outer/middle ear. Sensorineural loss involves inner ear or neural pathways. Central auditory processing disorders affect higher-level interpretation.'
        },
        pain: {
            title: 'Pain Pathway',
            anatomy: 'Nociceptors → Spinal Cord → Spinothalamic Tract → Thalamus → Somatosensory Cortex',
            function: 'Fast pain (Aδ fibers) carries sharp, localized pain. Slow pain (C fibers) carries dull, aching pain. Gate control theory explains pain modulation at spinal level.',
            clinical: 'Chronic pain involves sensitization and maladaptive plasticity. Treatments target different levels: NSAIDs (peripheral), opioids (central), anticonvulsants (neuropathic).'
        },
        memory: {
            title: 'Memory Circuit',
            anatomy: 'Hippocampus ↔ Entorhinal Cortex ↔ Neocortex ↔ Prefrontal Cortex',
            function: 'Hippocampus binds distributed cortical representations into episodic memories. Consolidation gradually transfers memories to neocortex for long-term storage.',
            clinical: 'Hippocampal damage (H.M. case) causes anterograde amnesia. Alzheimer\'s disease progressively affects this circuit, starting with entorhinal cortex.'
        },
        reward: {
            title: 'Reward Pathway',
            anatomy: 'Ventral Tegmental Area (VTA) → Nucleus Accumbens → Prefrontal Cortex',
            function: 'Dopamine neurons signal reward prediction error, driving learning and motivation. Involved in addiction, where drugs hijack natural reward signaling.',
            clinical: 'Dysfunction contributes to addiction, depression, and Parkinson\'s disease. Deep brain stimulation of this circuit can treat severe depression and addiction.'
        }
    };

    const info = pathwayInfo[pathway];
    if (info && detailsElement) {
        detailsElement.innerHTML = `
            <h4 class="font-semibold text-gray-800 dark:text-gray-200 mb-3">${info.title}</h4>
            <div class="space-y-3 text-sm">
                <div>
                    <h5 class="font-medium text-gray-700 dark:text-gray-300 mb-1">Anatomy:</h5>
                    <p class="text-gray-600 dark:text-gray-400">${info.anatomy}</p>
                </div>
                <div>
                    <h5 class="font-medium text-gray-700 dark:text-gray-300 mb-1">Function:</h5>
                    <p class="text-gray-600 dark:text-gray-400">${info.function}</p>
                </div>
                <div>
                    <h5 class="font-medium text-gray-700 dark:text-gray-300 mb-1">Clinical Significance:</h5>
                    <p class="text-gray-600 dark:text-gray-400">${info.clinical}</p>
                </div>
            </div>
        `;
    }
}

/**
 * Memory Simulation
 * Interactive memory formation demonstration
 */
function initMemorySimulation() {
    const encodeBtn = document.getElementById('encode-memory');
    const consolidateBtn = document.getElementById('consolidate-memory');
    const retrieveBtn = document.getElementById('retrieve-memory');
    const resetBtn = document.getElementById('reset-memory');

    if (encodeBtn) encodeBtn.addEventListener('click', () => simulateMemoryStage('encoding'));
    if (consolidateBtn) consolidateBtn.addEventListener('click', () => simulateMemoryStage('consolidation'));
    if (retrieveBtn) retrieveBtn.addEventListener('click', () => simulateMemoryStage('retrieval'));
    if (resetBtn) resetBtn.addEventListener('click', resetMemorySimulation);
}

function initMemoryChart() {
    const ctx = document.getElementById('memory-chart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (window.memoryChart) {
        window.memoryChart.destroy();
    }

    window.memoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Hippocampus', 'Prefrontal Cortex', 'Temporal Cortex', 'Amygdala'],
            datasets: [{
                label: 'Activity Level',
                data: [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',  // Blue
                    'rgba(139, 92, 246, 0.8)',  // Purple
                    'rgba(16, 185, 129, 0.8)',  // Green
                    'rgba(245, 158, 11, 0.8)'   // Orange
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(139, 92, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)'
                ],
                borderWidth: 2
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
                        text: 'Activity Level (%)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function simulateMemoryStage(stage) {
    if (!window.memoryChart) return;

    const chart = window.memoryChart;
    const stageDisplay = document.getElementById('current-stage');
    const regionsDisplay = document.getElementById('active-regions');

    let activityPattern;
    let activeRegions;

    switch (stage) {
        case 'encoding':
            activityPattern = [90, 60, 30, 70]; // High hippocampus, moderate PFC, low temporal, high amygdala
            activeRegions = 'Hippocampus, Amygdala';
            break;
        case 'consolidation':
            activityPattern = [60, 40, 80, 20]; // Moderate hippocampus, low PFC, high temporal, low amygdala
            activeRegions = 'Hippocampus, Temporal Cortex';
            break;
        case 'retrieval':
            activityPattern = [70, 85, 60, 40]; // High hippocampus, very high PFC, moderate temporal, low amygdala
            activeRegions = 'Prefrontal Cortex, Hippocampus';
            break;
        default:
            return;
    }

    // Update display
    if (stageDisplay) stageDisplay.textContent = stage.charAt(0).toUpperCase() + stage.slice(1);
    if (regionsDisplay) regionsDisplay.textContent = activeRegions;

    // Animate chart changes
    const dataset = chart.data.datasets[0];
    let step = 0;
    const maxSteps = 20;

    function animateToTarget() {
        step++;
        const progress = step / maxSteps;

        for (let i = 0; i < dataset.data.length; i++) {
            const target = activityPattern[i];
            const current = dataset.data[i];
            dataset.data[i] = current + (target - current) * progress;
        }

        chart.update('none');

        if (step < maxSteps) {
            setTimeout(animateToTarget, 50);
        }
    }

    animateToTarget();
}

function resetMemorySimulation() {
    if (!window.memoryChart) return;

    const chart = window.memoryChart;
    const dataset = chart.data.datasets[0];

    // Reset all values to 0
    dataset.data = [0, 0, 0, 0];
    chart.update();

    // Reset displays
    const stageDisplay = document.getElementById('current-stage');
    const regionsDisplay = document.getElementById('active-regions');

    if (stageDisplay) stageDisplay.textContent = chapter3Locale.ready;
    if (regionsDisplay) regionsDisplay.textContent = chapter3Locale.none;
}
