// Main JavaScript - Shared functionality across all pages

// Global theme handling and utility functions
document.addEventListener('DOMContentLoaded', function () {
    // Initialize theme on page load
    initializeTheme();

    // Initialize global keyboard shortcuts
    initializeGlobalKeyboardShortcuts();

    // Initialize global error handling
    initializeGlobalErrorHandling();
});

function initializeTheme() {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
}

function initializeGlobalKeyboardShortcuts() {
    document.addEventListener('keydown', function (e) {
        // Toggle theme with Ctrl/Cmd + Shift + T
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleTheme();
        }

        // Go to home with Alt + H
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            window.location.href = 'index.html';
        }
    });
}

function initializeGlobalErrorHandling() {
    // Global error handler for uncaught JavaScript errors
    window.addEventListener('error', function (e) {
        console.error('Global error caught:', e.error);
        // Could send to analytics service in production
    });

    // Global handler for unhandled promise rejections
    window.addEventListener('unhandledrejection', function (e) {
        console.error('Unhandled promise rejection:', e.reason);
        // Could send to analytics service in production
    });
}

// Theme toggle function (shared across all pages)
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    // Trigger custom event for components that need to respond to theme changes
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
}

// Utility functions available globally
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Progress tracking utilities
function updateChapterProgress(chapter, progress) {
    localStorage.setItem(`${chapter}-progress`, Math.min(100, Math.max(0, progress)));

    // Trigger event for any listening components
    window.dispatchEvent(new CustomEvent('progressUpdated', {
        detail: { chapter, progress }
    }));
}

function getChapterProgress(chapter) {
    return parseInt(localStorage.getItem(`${chapter}-progress`) || 0);
}

// Analytics tracking (placeholder for future implementation)
function trackEvent(eventName, eventData = {}) {
    console.log('Analytics event:', eventName, eventData);
    // In production, this would send data to an analytics service
}

// Export functions for use in other modules
window.OligodendrositeUtils = {
    toggleTheme,
    updateChapterProgress,
    getChapterProgress,
    trackEvent,
    debounce,
    throttle
};