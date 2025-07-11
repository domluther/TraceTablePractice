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
        this.updateProgramTable();
    }

    setupEventListeners() {
        // Difficulty change
        document.getElementById('difficulty').addEventListener('change', () => {
            this.updateProgramTable();
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
        if (this.currentProgram.inputs && this.currentProgram.inputs.length > 0) {
            numberedCode += `\n<span style="color: #90cdf4;">Input values: ${this.currentProgram.inputs.map(input => `"${input}"`).join(', ')}</span>`;
        }
        
        // Add random value display if available
        if (this.currentProgram.randomValue !== undefined) {
            numberedCode += `\n<span style="color: #90cdf4;">Random value: ${this.currentProgram.randomValue}</span>`;
        }
        
        document.getElementById('codeDisplay').innerHTML = numberedCode;
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
        // Clear the table first
        this.clearTable();
        
        // Only shuffle if we have a current program loaded
        if (!this.currentProgram) {
            alert('Please select a program first');
            return;
        }
        
        // Regenerate the same program with different inputs
        this.generateSpecificProgram(this.currentDifficulty, this.currentProgramIndex);
    }
}
