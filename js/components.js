document.addEventListener('DOMContentLoaded', async function () {
    await loadHeaderComponent();
    await loadFooterComponent();
    initializeLanguageSwitcher();
    initializeHeaderFunctionality();
    initializeFooterFunctionality();
});

function initializeLanguageSwitcher() {
    const langLinks = document.querySelectorAll('[data-lang-link]');
    if (!langLinks.length) return;

    const rawPath = window.location.pathname === '/' ? '/index.html' : window.location.pathname;
    const path = rawPath.replace(/\/+/g, '/');
    const isGreek = path.startsWith('/gr/');
    const englishPath = isGreek ? path.replace(/^\/gr/, '') : path;
    const greekPath = `/gr${englishPath}`;
    const suffix = `${window.location.search || ''}${window.location.hash || ''}`;

    langLinks.forEach(link => {
        const lang = link.getAttribute('data-lang-link');
        const isCurrent = (lang === 'gr' && isGreek) || (lang === 'en' && !isGreek);
        link.setAttribute('href', `${lang === 'gr' ? greekPath : englishPath}${suffix}`);
        link.setAttribute('aria-current', isCurrent ? 'page' : 'false');

        if (isCurrent) {
            link.classList.add('bg-blue-600', 'text-white');
            link.classList.remove('text-gray-600', 'dark:text-gray-300');
        } else {
            link.classList.remove('bg-blue-600', 'text-white');
            link.classList.add('text-gray-600', 'dark:text-gray-300');
        }
    });
}

// Load header component
async function loadHeaderComponent() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch('components/header.html');
            if (response.ok) {
                const headerHtml = await response.text();
                headerPlaceholder.innerHTML = headerHtml;
                
                // Apply current theme immediately after loading
                const currentTheme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', currentTheme);
                updateThemeIcons();
            } else {
                console.warn('Could not load header component');
            }
        } catch (error) {
            console.warn('Error loading header component:', error);
        }
    }
}

// Load footer component
async function loadFooterComponent() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        try {
            const response = await fetch('components/footer.html');
            if (response.ok) {
                const footerHtml = await response.text();
                footerPlaceholder.innerHTML = footerHtml;
            } else {
                console.warn('Could not load footer component');
            }
        } catch (error) {
            console.warn('Error loading footer component:', error);
        }
    }
}

// Initialize header functionality after loading
function initializeHeaderFunctionality() {
    // Wait a bit for header to be fully loaded
    setTimeout(() => {
        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcons();
        
        // Set up theme toggle event listeners
        setupThemeToggleListeners();
        
        // Set up mobile menu listeners
        setupMobileMenuListeners();
        
    }, 50);
}

// Set up theme toggle event listeners
function setupThemeToggleListeners() {
    // Desktop dark mode toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Remove any existing listeners by cloning
        const newThemeToggle = themeToggle.cloneNode(true);
        if (themeToggle.parentNode) {
            themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);
            newThemeToggle.addEventListener('click', toggleTheme);
        } else {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }

    // Mobile dark mode toggle functionality
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    if (mobileThemeToggle) {
        // Remove any existing listeners by cloning
        const newMobileThemeToggle = mobileThemeToggle.cloneNode(true);
        if (mobileThemeToggle.parentNode) {
            mobileThemeToggle.parentNode.replaceChild(newMobileThemeToggle, mobileThemeToggle);
            newMobileThemeToggle.addEventListener('click', toggleTheme);
        } else {
            mobileThemeToggle.addEventListener('click', toggleTheme);
        }
    }
}

// Set up mobile menu listeners
function setupMobileMenuListeners() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        // Remove any existing listeners by cloning
        const newMobileMenuButton = mobileMenuButton.cloneNode(true);
        mobileMenuButton.parentNode.replaceChild(newMobileMenuButton, mobileMenuButton);
        
        newMobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');

            // Update aria-expanded for accessibility
            const isExpanded = !mobileMenu.classList.contains('hidden');
            newMobileMenuButton.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                newMobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (event) {
            if (!newMobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                newMobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
    
}

// Toggle theme function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons();

}

// Legacy cranial nerve fix cleanup (kept as a safe no-op)
function fixCranialNerveTextColors() {
    const existingStyle = document.getElementById('cranial-nerve-fix');
    if (existingStyle) {
        existingStyle.remove();
    }

    document.querySelectorAll('.bg-cyan-50 [style], .bg-lime-50 [style]').forEach((el) => {
        if (el.style.color === 'rgb(31, 41, 55)' || el.style.color === '#1f2937') {
            el.style.removeProperty('color');
            el.style.removeProperty('opacity');
            el.style.removeProperty('visibility');
        }
    });
}

// Update theme icons based on current theme
function updateThemeIcons() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Desktop icons
    const lightIcon = document.getElementById('light-icon');
    const darkIcon = document.getElementById('dark-icon');

    // Mobile icons
    const mobileLightIcon = document.getElementById('mobile-light-icon');
    const mobileDarkIcon = document.getElementById('mobile-dark-icon');

    if (isDark) {
        // Show sun icon (light mode option)
        if (lightIcon) lightIcon.classList.remove('hidden');
        if (darkIcon) darkIcon.classList.add('hidden');
        if (mobileLightIcon) mobileLightIcon.classList.remove('hidden');
        if (mobileDarkIcon) mobileDarkIcon.classList.add('hidden');
    } else {
        // Show moon icon (dark mode option)
        if (lightIcon) lightIcon.classList.add('hidden');
        if (darkIcon) darkIcon.classList.remove('hidden');
        if (mobileLightIcon) mobileLightIcon.classList.add('hidden');
        if (mobileDarkIcon) mobileDarkIcon.classList.remove('hidden');
    }
}

// Initialize footer functionality after loading
function initializeFooterFunctionality() {
    // Scroll to top functionality
    const scrollToTopButton = document.getElementById('scroll-to-top');
    if (scrollToTopButton) {
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                scrollToTopButton.style.opacity = '1';
            } else {
                scrollToTopButton.style.opacity = '0';
            }
        });

        // Scroll to top when clicked
        scrollToTopButton.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

window.addEventListener('load', () => {
    fixCranialNerveTextColors();
});
