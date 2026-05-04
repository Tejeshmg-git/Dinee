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
            container.innerHTML = data
                .replace(/(href|src)="\/pages\//g, `$1="${prefix}pages/`)
                .replace(/(href|src)="pages\//g, `$1="${prefix}pages/`)
                .replace(/(href|src)="\/assets\//g, `$1="${prefix}assets/`)
                .replace(/(href|src)="assets\//g, `$1="${prefix}assets/`)
                .replace(/href="\/index.html"/g, `href="${prefix}index.html"`)
                .replace(/href="index.html"/g, `href="${prefix}index.html"`);

            if (id === "navbar") {
                initNavEvents();
                highlightActiveLink();
                initThemeToggle();
                initRtlToggle();
                initMobileMenu();
                initHeaderScroll(); // Trigger consistent scroll behavior
            }
        })
        .catch(err => console.error("Error loading component:", err));
}

/**
 * Refined Global Header Scroll Logic
 */
function initHeaderScroll() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    const handleScroll = () => {
        const isLight = document.body.classList.contains("light");
        const scrolled = window.scrollY > 30; // Closer threshold for instant premium feel

        navbar.classList.toggle("shrink", scrolled);

        if (scrolled) {
            navbar.style.background = isLight 
                ? "rgba(248, 247, 244, 0.98)" 
                : "rgba(10, 10, 10, 0.96)";
        } else {
            navbar.style.background = isLight 
                ? "rgba(248, 247, 244, 0.92)" 
                : "rgba(10, 10, 10, 0.85)";
        }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check once on initial load
}

function initNavEvents() {
    console.log("Navbar initialized.");
}

function highlightActiveLink() {
    const currentUrl = window.location.href;
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-links a');

    navLinks.forEach(link => {
        // Normalize the link's absolute URL for comparison
        const linkUrl = new URL(link.href, window.location.origin).href;

        if (currentUrl === linkUrl || (currentUrl.endsWith('/') && linkUrl.endsWith('index.html'))) {
            link.classList.add('active');
            
            // If the link is inside a dropdown, highlight the parent dropdown toggle as well
            const dropdown = link.closest('.dropdown');
            if (dropdown) {
                const parentToggle = dropdown.querySelector('a');
                if (parentToggle) parentToggle.classList.add('active');
            }
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

/**
 * Premium Animation & Interaction System
 */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Scroll Reveal Logic
    const reveals = document.querySelectorAll(".reveal");
    const revealOnScroll = () => {
        reveals.forEach(el => {
            const top = el.getBoundingClientRect().top;
            if (top < window.innerHeight - 100) {
                el.classList.add("active");
            }
        });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Initial check

    // 3. Testimonial Slider Logic
    const testimonialItems = document.querySelectorAll(".testimonial-item");
    if (testimonialItems.length > 0) {
        let index = 0;
        // Set first item active
        testimonialItems[0].classList.add("active");

        setInterval(() => {
            testimonialItems[index].classList.remove("active");
            index = (index + 1) % testimonialItems.length;
            testimonialItems[index].classList.add("active");
        }, 4000);
    }

    // 4. Counter Animation Logic
    const counters = document.querySelectorAll(".stat-item h2");
    if (counters.length > 0) {
        const observerOptions = { threshold: 0.5 };
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const targetText = counter.innerText;
                    const targetNum = parseInt(targetText.replace('+', ''), 10);
                    let count = 0;
                    const duration = 2000;
                    const frameDuration = 1000 / 60;
                    const totalFrames = Math.round(duration / frameDuration);
                    const increment = targetNum / totalFrames;

                    const updateCount = () => {
                        count += increment;
                        if (count < targetNum) {
                            counter.innerText = Math.floor(count) + "+";
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = targetNum + "+";
                        }
                    };
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => counterObserver.observe(counter));
    }
});
