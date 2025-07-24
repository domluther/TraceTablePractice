// UI management and event handling module

import { programs } from './programs.js';
import { TraceTable } from './trace-table.js';
import { Interpreter } from './interpreter.js';
import { ScoreManager } from './score-manager.js';

export class UI {
    constructor() {
        this.traceTable = new TraceTable();
        this.interpreter = new Interpreter();
        this.scoreManager = new ScoreManager();
        this.currentProgram = null;
        this.currentProgramIndex = null;
        this.currentDifficulty = null;
        this.expectedTrace = [];
        this.programVariables = [];
    }

    init() {
        this.setupEventListeners();
        this.setupURLNavigation(); // Set up URL navigation handling
        this.updateProgramTable();
        this.updateButtonStates(); // Set initial button states
        this.updateContentVisibility(); // Hide content sections initially
        
        // Load program from URL after a short delay to ensure everything is ready
        setTimeout(() => {
            this.loadFromURL(); // Load program from URL if present
        }, 100);
    }

    setupEventListeners() {
        // Difficulty change
        document.getElementById('difficulty').addEventListener('change', () => {
            // Clear current program selection when difficulty changes
            this.currentProgram = null;
            this.currentProgramIndex = null;
            this.currentDifficulty = null;
            
            this.updateProgramTable();
            this.updateButtonStates(); // Update button states
            this.updateContentVisibility(); // Hide content sections since no program selected
        });

        // Generate random program button
        document.getElementById('generateRandomBtn').addEventListener('click', () => {
            this.generateRandomProgram();
        });

        // Mark answer button
        document.getElementById('markBtn').addEventListener('click', () => {
            this.markAnswer();
        });

        // Clear table button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearTable();
        });

        // Shuffle inputs button
        document.getElementById('shuffleBtn').addEventListener('click', () => {
            this.shuffleInputs();
        });

        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.navigateProgram(-1);
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.navigateProgram(1);
        });

        // Keyboard navigation (global)
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Share button
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareCurrentProgram();
        });
    }

    updateProgramTable() {
        const difficulty = document.getElementById('difficulty').value;
        const programList = programs[difficulty];
        const tbody = document.querySelector('#programTable tbody');
        
        tbody.innerHTML = '';
        
        programList.forEach((program, index) => {
            const row = document.createElement('tr');
            const scoreDisplay = this.scoreManager.getScoreDisplay(difficulty, index);
            
            row.innerHTML = `
                <td class="program-name">${program.description}</td>
                <td><span class="score-display ${scoreDisplay.className}">${scoreDisplay.text}</span></td>
                <td><button class="btn-small btn-select" onclick="window.ui.selectProgram(${index})">Select</button></td>
            `;
            
            tbody.appendChild(row);
        });
    }

    selectProgram(programIndex) {
        const difficulty = document.getElementById('difficulty').value;
        this.generateSpecificProgram(difficulty, programIndex);
    }

    generateRandomProgram() {
        const difficulty = document.getElementById('difficulty').value;
        const programList = programs[difficulty];
        const randomIndex = Math.floor(Math.random() * programList.length);
        this.generateSpecificProgram(difficulty, randomIndex);
    }

    generateSpecificProgram(difficulty, programIndex) {
        const programList = programs[difficulty];
        const selectedProgram = programList[programIndex];
        
        this.currentDifficulty = difficulty;
        this.currentProgramIndex = programIndex;
        this.currentProgram = { ...selectedProgram };
        
        // If the program has multiple input sets, randomly select one
        if (this.currentProgram.inputSets && this.currentProgram.inputSets.length > 0) {
            const randomInputSet = this.currentProgram.inputSets[Math.floor(Math.random() * this.currentProgram.inputSets.length)];
            this.currentProgram.inputs = randomInputSet;
        }
        
        // If the program has multiple random values, randomly select one
        if (this.currentProgram.randomValues && this.currentProgram.randomValues.length > 0) {
            const randomValue = this.currentProgram.randomValues[Math.floor(Math.random() * this.currentProgram.randomValues.length)];
            this.currentProgram.randomValue = randomValue;
        }
        
        this.displayCode(this.currentProgram.code);
        this.executeProgram(this.currentProgram.code);
        this.traceTable.createTraceTable(this.expectedTrace, this.programVariables);
        this.updateButtonStates();
        this.updateContentVisibility(); // Show content sections now that program is selected
        this.updateURL(); // Update URL with current selection
        
        // Hide feedback
        document.getElementById('feedback').style.display = 'none';
    }

    displayCode(code) {
        const lines = code.split('\n');
        let numberedCode = '';
        
        lines.forEach((line, index) => {
            numberedCode += `<span class="line-number">${index + 1}</span>${line}\n`;
        });
        
        // Add input values display if available
        if (this.currentProgram && this.currentProgram.inputs && this.currentProgram.inputs.length > 0) {
            numberedCode += `\n<span style="color: #90cdf4;">Input values: ${this.currentProgram.inputs.map(input => `"${input}"`).join(', ')}</span>`;
        }
        
        // Add random value display if available
        if (this.currentProgram && this.currentProgram.randomValue !== undefined) {
            numberedCode += `\n<span style="color: #90cdf4;">Random value: ${this.currentProgram.randomValue}</span>`;
        }
        
        document.getElementById('codeDisplay').innerHTML = numberedCode;
        
        // Update program name in header
        this.updateProgramName();
        
        // Update ERL link
        this.updateERLLink(code);
    }

    updateProgramName() {
        const programNameElement = document.getElementById('programName');
        if (this.currentProgram && this.currentDifficulty !== null && this.currentProgramIndex !== null) {
            const difficultyName = this.currentDifficulty.charAt(0).toUpperCase() + this.currentDifficulty.slice(1);
            const programNumber = this.currentProgramIndex; // Use 0-based index to match URL
            programNameElement.textContent = `${difficultyName} #${programNumber}: ${this.currentProgram.description}`;
        } else {
            programNameElement.textContent = '';
        }
    }

    updateERLLink(code) {
        const erlLink = document.getElementById('erlLink');
        const shareBtn = document.getElementById('shareBtn');
        
        if (code && code.trim()) {
            // Format the code for ERL URL with proper encoding:
            let formattedCode = code
                .replace(/\\/g, '%5C')  // Convert backslashes to %5C
                .replace(/"/g, '%5C%22') // Convert double quotes to \\" -> %5C%22
                .replace(/'/g, '%27')   // Convert single quotes to %27
                .replace(/\?/g, '%3F')  // Convert question marks to %3F
                .replace(/=/g, '%3D')   // Convert equals signs to %3D
                .replace(/\+/g, '%2B')  // Convert + operators to %2B
                .replace(/\n/g, '%5Cn') // Convert newlines to %5Cn
                .replace(/ /g, '+')     // Convert spaces to +
                .replace(/\(/g, '%28') // Convert ( to %28
                .replace(/\)/g, '%29'); // Convert ) to %29
            
            const erlURL = `https://www.examreferencelanguage.co.uk/index.php?code=%5B%7B%22name%22%3A%22code%22%2C%22content%22%3A%22${formattedCode}%22%7D%5D`;
            
            erlLink.href = erlURL;
            erlLink.style.display = 'inline-block';
            shareBtn.style.display = 'inline-block';
        } else {
            erlLink.style.display = 'none';
            shareBtn.style.display = 'none';
        }
    }

    executeProgram(code) {
        // Use the interpreter to generate the trace
        const result = this.interpreter.executeProgram(code, this.currentProgram);
        this.expectedTrace = result.trace;
        this.programVariables = result.variables;
    }

    markAnswer() {
        const result = this.traceTable.markAnswer();
        
        // Save the score if we have a current program selected
        if (this.currentDifficulty && this.currentProgramIndex !== null && result) {
            this.scoreManager.saveScore(
                this.currentDifficulty,
                this.currentProgramIndex,
                result.correct,
                result.total
            );
            
            // Update the program table to show the new score
            this.updateProgramTable();
        }
        
        return result;
    }

    clearTable() {
        // Clear all input fields in the trace table
        const table = document.getElementById('traceTable');
        const inputs = table.querySelectorAll('input');
        
        inputs.forEach(input => {
            input.value = '';
            // Remove any highlighting classes
            input.classList.remove('correct', 'incorrect', 'partial');
        });
        
        // Hide feedback
        document.getElementById('feedback').style.display = 'none';
    }

    shuffleInputs() {
        // Only shuffle if we have a current program loaded
        if (!this.currentProgram) {
            alert('Please select a program first');
            return;
        }
        
        // Check if the current program has multiple input sets
        const programList = programs[this.currentDifficulty];
        const currentProgram = programList[this.currentProgramIndex];
        const hasMultipleInputs = currentProgram && currentProgram.inputSets && currentProgram.inputSets.length > 1;
        
        if (!hasMultipleInputs) {
            alert('This program only has one set of inputs - nothing to shuffle!');
            return;
        }
        
        // Clear the table first
        this.clearTable();
        
        // Regenerate the same program with different inputs
        this.generateSpecificProgram(this.currentDifficulty, this.currentProgramIndex);
    }

    navigateProgram(direction) {
        if (!this.currentDifficulty || this.currentProgramIndex === null) {
            return; // No program currently loaded
        }

        const programList = programs[this.currentDifficulty];
        const newIndex = this.currentProgramIndex + direction;

        // Check bounds
        if (newIndex < 0 || newIndex >= programList.length) {
            return; // Can't navigate beyond bounds
        }

        // Load the new program
        this.generateSpecificProgram(this.currentDifficulty, newIndex);
        this.updateButtonStates();
        this.clearTable(); // Clear the table when navigating
    }

    updateButtonStates() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const shuffleBtn = document.getElementById('shuffleBtn');

        if (!this.currentDifficulty || this.currentProgramIndex === null) {
            // No program loaded - disable navigation and shuffle buttons
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            shuffleBtn.disabled = true;
            return;
        }

        const programList = programs[this.currentDifficulty];
        
        // Update previous button
        prevBtn.disabled = this.currentProgramIndex <= 0;
        
        // Update next button
        nextBtn.disabled = this.currentProgramIndex >= programList.length - 1;
        
        // Update shuffle button - only enable if current program has multiple input sets
        const currentProgram = programList[this.currentProgramIndex];
        const hasMultipleInputs = currentProgram && currentProgram.inputSets && currentProgram.inputSets.length > 1;
        shuffleBtn.disabled = !hasMultipleInputs;
    }

    updateContentVisibility() {
        // Show/hide content sections based on whether a program is selected
        const hasProgramSelected = this.currentDifficulty && this.currentProgramIndex !== null;
        
        const sectionsToToggle = [
            '.code-section',
            '.mark-btn-container', 
            '.keyboard-shortcuts'
        ];
        
        sectionsToToggle.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = hasProgramSelected ? 'block' : 'none';
            }
        });
        
        // Also hide feedback div when no program is selected
        const feedbackDiv = document.getElementById('feedback');
        if (feedbackDiv && !hasProgramSelected) {
            feedbackDiv.style.display = 'none';
        }
    }

    handleKeyboardNavigation(event) {
        // Only handle keyboard shortcuts when not focused on input elements
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' || 
            activeElement.isContentEditable
        );

        if (isInputFocused) {
            return; // Don't handle shortcuts when typing in inputs
        }

        // Handle keyboard shortcuts
        switch(event.key.toLowerCase()) {
            case 'enter':
                event.preventDefault();
                this.markAnswer();
                break;
                
            case 'n':
                event.preventDefault();
                this.navigateProgram(1); // Next program
                break;
                
            case 'p':
                event.preventDefault();
                this.navigateProgram(-1); // Previous program
                break;
                
            case 's':
                event.preventDefault();
                this.shuffleInputs();
                break;
                
            case 'escape':
                event.preventDefault();
                this.clearTable();
                break;
        }
    }

    shareCurrentProgram() {
        // Copy the shareable URL to clipboard
        const shareableURL = this.getShareableURL();
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareableURL).then(() => {
                // Show temporary feedback
                const shareBtn = document.getElementById('shareBtn');
                const originalText = shareBtn.textContent;
                shareBtn.textContent = '✅ Copied!';
                shareBtn.style.background = '#48bb78';
                
                setTimeout(() => {
                    shareBtn.textContent = originalText;
                    shareBtn.style.background = '';
                }, 2000);
            }).catch(err => {
                // Fallback for older browsers
                this.fallbackCopyToClipboard(shareableURL);
            });
        } else {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(shareableURL);
        }
    }

    fallbackCopyToClipboard(text) {
        // Fallback method for copying to clipboard
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            // Show temporary feedback
            const shareBtn = document.getElementById('shareBtn');
            const originalText = shareBtn.textContent;
            shareBtn.textContent = '✅ Copied!';
            shareBtn.style.background = '#48bb78';
            
            setTimeout(() => {
                shareBtn.textContent = originalText;
                shareBtn.style.background = '';
            }, 2000);
        } catch (err) {
            console.error('Could not copy text: ', err);
            // Show URL in an alert as final fallback
            alert(`Copy this URL to share:\n${text}`);
        }
        
        document.body.removeChild(textArea);
    }

    // URL Management Methods
    setupURLNavigation() {
        // Listen for browser back/forward navigation
        window.addEventListener('popstate', () => {
            this.loadFromURL();
        });
    }

    updateURL() {
        // Update URL with current program selection
        if (this.currentDifficulty && this.currentProgramIndex !== null) {
            const params = new URLSearchParams();
            params.set('difficulty', this.currentDifficulty);
            params.set('program', this.currentProgramIndex.toString());
            
            const newURL = `${window.location.pathname}#${params.toString()}`;
            window.history.pushState(null, '', newURL);
        }
    }

    loadFromURL() {
        // Parse URL hash and load the specified program
        const hash = window.location.hash.substring(1); // Remove the #
        if (!hash) return;

        const params = new URLSearchParams(hash);
        const difficulty = params.get('difficulty');
        const programIndex = params.get('program');

        if (difficulty && programIndex !== null) {
            // Validate the parameters
            if (programs[difficulty] && parseInt(programIndex) < programs[difficulty].length) {
                // Update the difficulty selector
                document.getElementById('difficulty').value = difficulty;
                this.updateProgramTable();
                
                // Load the specific program
                const index = parseInt(programIndex);
                this.generateSpecificProgram(difficulty, index);
            }
        }
    }

    getShareableURL() {
        // Generate a shareable URL for the current program
        if (this.currentDifficulty && this.currentProgramIndex !== null) {
            const params = new URLSearchParams();
            params.set('difficulty', this.currentDifficulty);
            params.set('program', this.currentProgramIndex.toString());
            
            return `${window.location.origin}${window.location.pathname}#${params.toString()}`;
        }
        return window.location.href;
    }
}
