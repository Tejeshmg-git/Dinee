// ================= THEME & DIR: Load saved states instantly (prevent flash) =================
(function() {
    // Theme
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.body.classList.add(savedTheme);

    // Direction (RTL/LTR)
    const savedDir = localStorage.getItem("dir") || "ltr";
    document.documentElement.setAttribute("dir", savedDir);
})();

// Global Interactions
document.addEventListener("DOMContentLoaded", () => {
    
    // Auto-detect depth for relative component loading
    const pathPrefix = (window.location.pathname.includes('/pages/') || window.location.pathname.includes('/pages/')) ? '../' : './';
    
    // Load Components with relative prefix
    loadComponent("navbar", pathPrefix + "components/navbar.html");
    loadComponent("footer", pathPrefix + "components/footer.html");

    // Scroll effect (theme-aware)
    window.onscroll = () => {
        const navbar = document.querySelector(".navbar");
        if (navbar) {
            const isLight = document.body.classList.contains("light");
            if (window.scrollY > 50) {
                navbar.style.background = isLight 
                    ? "rgba(248, 247, 244, 0.97)" 
                    : "rgba(10,10,10,0.95)";
            } else {
                navbar.style.background = isLight 
                    ? "rgba(248, 247, 244, 0.92)" 
                    : "rgba(10,10,10,0.85)";
            }
        }
    };
});

/**
 * Loads a component HTML into a target element ID
 */
function loadComponent(id, path) {
    const container = document.getElementById(id);
    if (!container) return;

    // Determine current depth to fix relative paths within components
    const isSubPage = window.location.pathname.includes('/pages/');
    const prefix = isSubPage ? '../' : './';

    fetch(path)
        .then(res => {
            if (!res.ok) throw new Error(`Could not load ${path}`);
            return res.text();
        })
        .then(data => {
            // Fix both absolute-like ("/pages") and relative-like ("pages") paths in the fetched HTML before injecting
            const fixedData = data
                .replace(/(href|src)="\/pages\//g, `$1="${prefix}pages/`)
                .replace(/(href|src)="pages\//g, `$1="${prefix}pages/`)
                .replace(/(href|src)="\/assets\//g, `$1="${prefix}assets/`)
                .replace(/(href|src)="assets\//g, `$1="${prefix}assets/`)
                .replace(/href="\/index.html"/g, `href="${prefix}index.html"`)
                .replace(/href="index.html"/g, `href="${prefix}index.html"`);

            container.innerHTML = fixedData;

            
            if (id === "navbar") {
                initNavEvents();
                highlightActiveLink();
                initThemeToggle();
                initRtlToggle();
                initMobileMenu();
            }
        })
        .catch(err => console.error("Error loading component:", err));
}

function initNavEvents() {
    console.log("Navbar initialized.");
}

function highlightActiveLink() {
    const currentLoc = window.location.href;
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-links a');

    navLinks.forEach(link => {
        // Normalize the link's absolute URL for comparison
        const linkUrl = new URL(link.href, window.location.origin).href;
        const currentUrl = new URL(window.location.href).href;

        if (currentUrl === linkUrl || (currentUrl.endsWith('/') && linkUrl.endsWith('index.html'))) {
            link.classList.add('active');
        }
    });
}

/**
 * Theme Toggle System
 */
function initThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    // Set initial icon
    updateToggleIcon(toggle);

    toggle.addEventListener("click", () => {
        const isCurrentlyLight = document.body.classList.contains("light");

        if (isCurrentlyLight) {
            document.body.classList.remove("light");
            document.body.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark");
            document.body.classList.add("light");
            localStorage.setItem("theme", "light");
        }

        updateToggleIcon(toggle);

        // Update navbar background instantly
        const navbar = document.querySelector(".navbar");
        if (navbar) {
            const isLight = document.body.classList.contains("light");
            navbar.style.background = isLight 
                ? "rgba(248, 247, 244, 0.92)" 
                : "rgba(10,10,10,0.85)";
        }
    });
}

function updateToggleIcon(toggle) {
    const isLight = document.body.classList.contains("light");
    toggle.textContent = isLight ? "🌙" : "☀️";
    toggle.title = isLight ? "Switch to dark mode" : "Switch to light mode";
}

/**
 * RTL System
 */
function initRtlToggle() {
    const toggle = document.getElementById("rtl-toggle");
    if (!toggle) return;

    // Set initial text
    updateRtlIcon(toggle);

    toggle.addEventListener("click", () => {
        const html = document.documentElement;
        const currentDir = html.getAttribute("dir") || "ltr";

        if (currentDir === "rtl") {
            html.setAttribute("dir", "ltr");
            localStorage.setItem("dir", "ltr");
        } else {
            html.setAttribute("dir", "rtl");
            localStorage.setItem("dir", "rtl");
        }

        updateRtlIcon(toggle);
    });
}

function updateRtlIcon(toggle) {
    const isRtl = document.documentElement.getAttribute("dir") === "rtl";
    toggle.textContent = isRtl ? "LTR" : "RTL";
    toggle.title = isRtl ? "Switch to Left-to-Right" : "Switch to Right-to-Left";
}

/**
 * Mobile Navigation Logic
 */
function initMobileMenu() {
    const toggle = document.getElementById("mobile-toggle");
    const drawer = document.getElementById("mobile-drawer");
    const overlay = document.getElementById("nav-overlay");
    const closeBtn = document.getElementById("close-mobile-menu");
    const menuLinks = document.querySelectorAll(".mobile-links a");

    if (!toggle || !drawer) return;

    const openMenu = () => {
        drawer.classList.add("active");
        if (overlay) overlay.classList.add("active");
        document.body.style.overflow = "hidden";
    };

    const closeMenu = () => {
        drawer.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
        document.body.style.overflow = "auto";
    };

    // Open logic
    toggle.addEventListener("click", openMenu);

    // Close on btn
    if (closeBtn) closeBtn.addEventListener("click", closeMenu);

    // Close on overlay click
    if (overlay) overlay.addEventListener("click", closeMenu);

    // Close on link click
    menuLinks.forEach(link => {
        link.addEventListener("click", closeMenu);
    });
}
