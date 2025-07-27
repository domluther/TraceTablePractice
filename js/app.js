// Main application entry point

import { UI } from './ui.js';

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    ui.init();
    
    // Expose UI instance globally for onclick handlers
    window.ui = ui;
});
