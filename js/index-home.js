// Index Page JavaScript - Home page functionality

// Home page specific JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();

    // Initialize progress tracking
    initProgressTracking();

    // Initialize animations
    initAnimations();
});

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initProgressTracking() {
    // This would typically connect to a backend to track user progress
    // For now, we'll use localStorage to simulate progress tracking
    const chapters = ['01-neurons-action-potentials', '02-synapses-neurotransmitters', '03-neural-networks-plasticity', '04-brain-systems-pathways'];

    chapters.forEach((chapter, index) => {
        const progress = localStorage.getItem(`${chapter}-progress`) || 0;
        const card = document.querySelector(`a[href="${chapter}.html"]`).closest('.chapter-card');

        if (progress > 0) {
            // Add progress indicator
            const progressIndicator = document.createElement('div');
            progressIndicator.className = 'mt-4 bg-gray-200 rounded-full h-2';
            progressIndicator.innerHTML = `<div class="bg-blue-500 h-2 rounded-full transition-all" style="width: ${progress}%"></div>`;
            card.appendChild(progressIndicator);

            const progressText = document.createElement('div');
            progressText.className = 'text-sm text-gray-500 mt-2';
            progressText.textContent = `${progress}% Complete`;
            card.appendChild(progressText);
        }
    });
}

function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe chapter cards
    const cards = document.querySelectorAll('.chapter-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe feature items
    const features = document.querySelectorAll('#features .text-center');
    features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateY(30px)';
        feature.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(feature);
    });
}

// Update progress when user visits a chapter
function updateProgress(chapter, progress) {
    localStorage.setItem(`${chapter}-progress`, progress);
}

// Simulate some progress for demo purposes
setTimeout(() => {
    updateProgress('01-neurons-action-potentials', 75);
    updateProgress('02-synapses-neurotransmitters', 50);
    updateProgress('03-neural-networks-plasticity', 25);
}, 1000);
