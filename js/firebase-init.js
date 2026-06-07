(function () {
    const firebaseWebConfig = {
        apiKey: 'AIzaSyCLFXMOgWlrlC9AZCnafDgwwpBQQtJu2sI',
        authDomain: 'oligodendrosite-395e6.firebaseapp.com',
        projectId: 'oligodendrosite-395e6',
        storageBucket: 'oligodendrosite-395e6.firebasestorage.app',
        messagingSenderId: '221364873308',
        appId: '1:221364873308:web:a4f72470ae8aec5364de99',
        measurementId: 'G-SQ9Y6WYJ47'
    };

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[src="${src}"]`);
            if (existing) {
                if (existing.dataset.loaded === 'true') {
                    resolve();
                } else {
                    existing.addEventListener('load', () => resolve(), { once: true });
                    existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
                }
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.addEventListener('load', () => {
                script.dataset.loaded = 'true';
                resolve();
            }, { once: true });
            script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
            document.head.appendChild(script);
        });
    }

    async function initializeFirebaseClient() {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return;
        }

        if (window.OligodendrositeFirebase?.app) {
            return;
        }

        try {
            await loadScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
            await loadScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics-compat.js');

            if (!window.firebase) {
                return;
            }

            const app = window.firebase.apps?.length ? window.firebase.app() : window.firebase.initializeApp(firebaseWebConfig);
            const result = { app, config: firebaseWebConfig };

            if (typeof location !== 'undefined' && !location.protocol.startsWith('file')) {
                try {
                    result.analytics = window.firebase.analytics(app);
                } catch (analyticsError) {
                    console.warn('Firebase analytics initialization skipped:', analyticsError);
                }
            }

            window.OligodendrositeFirebase = result;
        } catch (error) {
            console.warn('Firebase client initialization failed:', error);
        }
    }

    window.initializeOligodendrositeFirebase = initializeFirebaseClient;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFirebaseClient, { once: true });
    } else {
        initializeFirebaseClient();
    }
})();
