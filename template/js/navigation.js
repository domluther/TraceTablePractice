/**
 * Site Navigation Handler
 * Handles dropdown navigation across all GCSE CS practice sites
 */

class SiteNavigation {
    constructor() {
        this.navToggle = null;
        this.navDropdown = null;
        this.navMenu = null;
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
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
            this.toggleDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navDropdown.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Close dropdown when pressing Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDropdown();
            }
        });

        // Close dropdown when clicking on a link
        this.navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-item')) {
                this.closeDropdown();
            }
        });
    }

    toggleDropdown() {
        this.navDropdown.classList.toggle('active');
    }

    closeDropdown() {
        this.navDropdown.classList.remove('active');
    }

    openDropdown() {
        this.navDropdown.classList.add('active');
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navigation = new SiteNavigation();
    navigation.init();
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteNavigation;
}
