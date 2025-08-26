/**
 * Site Navigation Handler
 * Handles dropdown navigation across all GCSE CS practice sites
 * with auto-generated menu items
 */

class SiteNavigation {
    constructor() {
        this.navToggle = null;
        this.navDropdown = null;
        this.navMenu = null;

        this.navMenuData = [
            {
                title: "1.2 - Data Units",
                description: "Convert units and calculate file sizes",
                url: "https://convertdataunits.netlify.app/",
                id: "data-units",
                keywords: ["convertdataunits", "data", "units"]
            },
            {
                title: "1.3 - Network Addresses",
                description: "Identify IP addresses and MAC addresses",
                url: "https://ipormac.netlify.app/",
                id: "network-addresses",
                keywords: ["ipormac", "network", "ip", "mac"]
            },
            {
                title: "2.1 - Sorting Algorithms",
                description: "Visualize bubble, merge & insertion sorts",
                url: "https://ocrsortvisualiser.netlify.app/",
                id: "sort-algorithms",
                keywords: ["ocrsortvisualiser", "sort", "algorithm"]
            },
            {
                title: "2.1 - Trace Tables",
                description: "Practice OCR ERL algorithm tracing",
                url: "https://tracetablepractice.netlify.app/",
                id: "trace-tables",
                keywords: ["tracetablepractice", "trace"]
            },
            {
                title: "2.2 - Programming Practice",
                description: "Input/output and basic programming concepts",
                url: "https://input-output-practice.netlify.app/",
                id: "programming-practice",
                keywords: ["input-output-practice", "programming"]
            },
            {
                title: "2.4 - Boolean Algebra",
                description: "Logic gates and Boolean expressions",
                url: "https://booleanalgebrapractice.netlify.app/",
                id: "boolean-algebra",
                keywords: ["booleanalgebrapractice", "boolean", "logic"]
            },
        ];
    }

    init() {
        this.renderNavMarkup();
        this.cacheElements();
        this.populateNavItems();
        this.setupEventListeners();
    }

    /**
     * Render the static structure of the nav dropdown
     */
    renderNavMarkup() {
        const siteNav = document.getElementById('siteNav');
        if (!siteNav) {
            console.warn('siteNav element not found');
            return;
        }

        siteNav.innerHTML = `
            <div id="siteNavDropdown" class="nav-dropdown" role="navigation">
                <button id="navToggle" class="nav-toggle" aria-haspopup="true" aria-expanded="false">
                    🎓 GCSE CS Tools
                </button>
                <div id="navMenu" class="nav-menu">
                    <div class="nav-menu-header">Computer Science Practice</div>
                </div>
            </div>
        `;
    }

    /**
     * Cache essential DOM elements
     */
    cacheElements() {
        this.navToggle = document.getElementById('navToggle');
        this.navDropdown = document.getElementById('siteNavDropdown');
        this.navMenu = document.getElementById('navMenu');

        if (!this.navToggle || !this.navDropdown || !this.navMenu) {
            console.warn('Navigation elements missing in DOM.');
        }
    }

    /**
     * Detect current page based on URL
     */
    detectCurrentPage() {
        const currentUrl = window.location.href.toLowerCase();
        const currentHostname = window.location.hostname.toLowerCase();

        for (const item of this.navMenuData) {
            if (currentUrl.includes(item.url.toLowerCase())) return item.id;

            if (item.keywords) {
                for (const keyword of item.keywords) {
                    if (
                        currentHostname.includes(keyword.toLowerCase()) ||
                        currentUrl.includes(keyword.toLowerCase())
                    ) {
                        return item.id;
                    }
                }
            }
        }

        return null;
    }

    /**
     * Populate nav items from data
     */
    populateNavItems() {
        if (!this.navMenu) return;

        const currentPageId = this.detectCurrentPage();

        this.navMenuData.forEach(item => {
            const navItem = document.createElement('a');
            navItem.href = item.url;
            navItem.className = item.id === currentPageId ? 'nav-item current' : 'nav-item';

            const title = document.createElement('span');
            title.className = 'nav-item-title';
            title.textContent = item.title;

            const desc = document.createElement('span');
            desc.className = 'nav-item-desc';
            desc.textContent = item.description;

            navItem.appendChild(title);
            navItem.appendChild(desc);
            this.navMenu.appendChild(navItem);
        });
    }

    /**
     * Setup event listeners for nav interaction
     */
    setupEventListeners() {
        if (!this.navToggle || !this.navDropdown || !this.navMenu) return;

        // Toggle dropdown open/closed
        this.navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = this.navDropdown.classList.toggle('open');
            this.navToggle.setAttribute('aria-expanded', isOpen);
        });

        // Close dropdown if click outside
        document.addEventListener('click', (e) => {
            if (!this.navDropdown.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Escape key closes dropdown
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });

        // Close dropdown on nav item click (including children)
        this.navMenu.addEventListener('click', (e) => {
            if (e.target.closest('.nav-item')) {
                this.closeDropdown();
            }
        });
    }

    /**
     * Close dropdown and update ARIA
     */
    closeDropdown() {
        this.navDropdown.classList.remove('open');
        this.navToggle.setAttribute('aria-expanded', 'false');
    }

    /**
     * Get info on current page (optional utility)
     */
    getCurrentPageInfo() {
        const currentId = this.detectCurrentPage();
        return this.navMenuData.find(item => item.id === currentId) || null;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const nav = new SiteNavigation();
    nav.init();
});
