/**
 * Site Navigation Handler
 * Handles dropdown navigation across all GCSE CS practice sites
 * with auto-generated menu items
 */

export class SiteNavigation {
    constructor() {
        this.navToggle = null;
        this.navDropdown = null;
        this.navMenu = null;
        
        // Navigation menu data
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
        this.generateNavMenu();
        this.setupElements();
        this.setupEventListeners();
    }

    /**
     * Auto-detect current page based on URL and keywords
     */
    detectCurrentPage() {
        const currentUrl = window.location.href.toLowerCase();
        const currentHostname = window.location.hostname.toLowerCase();
        
        // Try to match by URL or keywords
        for (const item of this.navMenuData) {
            // Check if current URL matches item URL
            if (currentUrl.includes(item.url.toLowerCase())) {
                return item.id;
            }
            
            // Check keywords against current hostname/URL
            if (item.keywords) {
                for (const keyword of item.keywords) {
                    if (currentHostname.includes(keyword.toLowerCase()) || 
                        currentUrl.includes(keyword.toLowerCase())) {
                        return item.id;
                    }
                }
            }
        }
        
        return null;
    }

    /**
     * Generate the navigation menu from data
     */
    generateNavMenu() {
        const navMenu = document.getElementById('navMenu');
        if (!navMenu) {
            console.warn('navMenu element not found');
            return;
        }
        
        // Clear existing content
        navMenu.innerHTML = '';
        
        // Add header
        const header = document.createElement('div');
        header.className = 'nav-menu-header';
        header.textContent = 'Computer Science Practice';
        navMenu.appendChild(header);
        
        // Detect current page
        const currentPageId = this.detectCurrentPage();
        
        // Generate nav items
        this.navMenuData.forEach(item => {
            const navItem = document.createElement('a');
            navItem.href = item.url;
            navItem.className = item.id === currentPageId ? 'nav-item current' : 'nav-item';
            
            const title = document.createElement('span');
            title.className = 'nav-item-title';
            title.textContent = item.title;
            
            const description = document.createElement('span');
            description.className = 'nav-item-desc';
            description.textContent = item.description;
            
            navItem.appendChild(title);
            navItem.appendChild(description);
            navMenu.appendChild(navItem);
        });
    }

    setupElements() {
        this.navToggle = document.getElementById('navToggle');
        this.navDropdown = document.getElementById('siteNavDropdown');
        this.navMenu = document.getElementById('navMenu');

        if (!this.navToggle || !this.navDropdown || !this.navMenu) {
            console.warn('Navigation elements not found. Make sure the HTML includes the proper navigation structure.');
            return;
        }
    }

    setupEventListeners() {
        if (!this.navToggle) return;

        // Toggle dropdown on button click
        this.navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.navDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navDropdown.contains(e.target)) {
            this.navDropdown.classList.remove('active');
            }
        });

        // Close dropdown when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
            this.navDropdown.classList.remove('active');
            }
        });

        // Close dropdown when clicking on a link
        this.navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-item')) {
            this.navDropdown.classList.remove('active');
            }
        });
    }

    /**
     * Get current page info
     */
    getCurrentPageInfo() {
        const currentId = this.detectCurrentPage();
        return this.navMenuData.find(item => item.id === currentId) || null;
    }
}
