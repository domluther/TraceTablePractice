// Comprehensive Interpreter module for executing pseudocode programs and generating trace tables

export class Interpreter {
    constructor() {
        this.variables = {};
        this.constants = {}; // Track which variables are constants
        this.outputs = [];
        this.trace = [];
        this.inputs = [];
        this.inputIndex = 0;
        this.currentProgram = null;
    }

    // Convenience method for executing code without a program object
    execute(code) {
        return this.executeProgram(code, { inputs: [], randomValue: undefined });
    }

    executeProgram(code, program) {
        // Initialize state
        this.variables = {};
        this.constants = {};
        this.outputs = [];
        this.trace = [];
        this.inputs = program.inputs || [];
        this.inputIndex = 0;
        this.currentProgram = program;

        // Simple interpreter for trace table generation
        const lines = code.split('\n')
            .map(line => line.trim())
            .filter(line => line);  // Filter out only empty lines, keep comments
        
        let i = 0;
        let executionSteps = 0;
        const maxExecutionSteps = 1000; // Safety limit
        
        while (i < lines.length && executionSteps < maxExecutionSteps) {
            executionSteps++;
            const line = lines[i];
            const lineNum = i + 1;
            
            // Skip comments - lines starting with //
            if (line.startsWith('//')) {
                i++;
                continue;
            }
            
            if (line.startsWith('if ') && line.includes(' then')) {
                // Handle if statement - condition evaluation doesn't change variables
                i = this.handleIfStatement(lines, i);
            } else if (line.startsWith('switch ')) {
                // Handle switch statement
                i = this.handleSwitchStatement(lines, i);
            } else if (line.startsWith('while ')) {
                // Handle while loop - condition evaluation doesn't change variables
                i = this.handleWhileLoop(lines, i);
            } else if (line === 'do') {
                // Handle do-until loop
                i = this.handleDoUntilLoop(lines, i);
            } else if (line.startsWith('for ') && line.includes(' to ')) {
                // Handle for loop
                i = this.handleForLoop(lines, i);
            } else if (line.startsWith('next ') || line === 'endif' || line === 'else' || 
                       line.startsWith('elseif ') || line === 'endwhile' || line.startsWith('until ') ||
                       line.startsWith('case ') || line === 'default' || line === 'endswitch') {
                // Skip control flow statements as they're handled by their parent structures
                i++;
            } else {
                // Regular statement - only trace if it actually changes variables OR produces output
                const result = this.executeStatement(line, lineNum, this.variables);
                if (result.shouldTrace && (Object.keys(result.changedVariables || {}).length > 0 || result.output)) {
                    this.addTraceEntry(lineNum, this.variables, result.output, result.changedVariables);
                }
                i++;            }
        }
        
        if (executionSteps >= maxExecutionSteps) {
            throw new Error('Execution exceeded maximum steps - possible infinite loop detected');
        }

        return {
            trace: this.trace,
            variables: this.getExpandedVariableNames(),
            outputs: this.outputs
        };
    }

    getExpandedVariableNames() {
        const expandedNames = [];
        
        for (const [name, value] of Object.entries(this.variables)) {
            if (Array.isArray(value)) {
                // Expand array variables into individual elements
                for (let i = 0; i < value.length; i++) {
                    expandedNames.push(`${name}[${i}]`);
                }
            } else {
                // Add regular variables as is
                expandedNames.push(name);
            }
        }
        
        return expandedNames;
    }

    addTraceEntry(lineNum, vars, output = '', changedVariables = {}) {
        this.trace.push({
            lineNumber: lineNum,
            variables: { ...vars },
            output: output,
            changedVariables: changedVariables
        });
    }

    executeStatement(line, lineNum, vars) {
        let output = '';
        let shouldTrace = true;
        const changeRecord = {}; // Track which variables actually change
        
        if (line.startsWith('array ')) {
            // Array declaration with initialization like "array scores = [85, 92, 78, 90]"
            const initMatch = line.match(/array\s+(\w+)\s*=\s*\[([^\]]+)\]/);
            if (initMatch) {
                const arrayName = initMatch[1];
                const valuesStr = initMatch[2];
                // Parse the values - handle numbers and strings
                const values = valuesStr.split(',').map(v => {
                    const trimmed = v.trim();
                    // Remove quotes for strings
                    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || 
                        (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
                        return trimmed.slice(1, -1);
                    }
                    // Parse as number if it's numeric
                    const num = parseFloat(trimmed);
                    return isNaN(num) ? trimmed : num;
                });
                vars[arrayName] = values;
                changeRecord[arrayName] = vars[arrayName];
                shouldTrace = false; // Don't trace array declarations
            } else {
                // Array declaration like "array nums[3]"
                const match = line.match(/array\s+(\w+)\[(\d+)\]/);
                if (match) {
                    const arrayName = match[1];
                    const arraySize = parseInt(match[2]);
                    // Initialize array with undefined values
                    vars[arrayName] = new Array(arraySize);
                    for (let i = 0; i < arraySize; i++) {
                        vars[arrayName][i] = undefined;
                    }
                    changeRecord[arrayName] = vars[arrayName];
                    shouldTrace = false; // Don't trace array declarations
                }
            }
        } else if (line.startsWith('const ')) {
            // Constant declaration like "const vat = 0.2"
            const constMatch = line.match(/const\s+(\w+)\s*=\s*(.+)/);
            if (constMatch) {
                const constName = constMatch[1];
                const constValue = constMatch[2].trim();
                
                // Check if constant already exists
                if (this.constants[constName]) {
                    // In a real implementation, this would be an error
                    // For trace tables, we'll ignore the redeclaration
                    shouldTrace = false;
                } else {
                    // Evaluate the constant value
                    const evaluatedValue = this.evaluateExpression(constValue, vars);
                    vars[constName] = evaluatedValue;
                    this.constants[constName] = true; // Mark as constant
                    changeRecord[constName] = vars[constName];
                }
            }
        } else if (line.startsWith('print(')) {
            // Print statement - doesn't change variables, only produces output
            const content = line.substring(6, line.length - 1);
            if (content.startsWith('"') && content.endsWith('"')) {
                output = content.slice(1, -1);
            } else if (content.includes(',') && !content.includes('.substring(') && !content.includes('.left(') && !content.includes('.right(')) {
                // Handle comma-separated arguments like print("The score is", score)
                // But NOT method calls that contain commas like substring(x, 1)
                const parts = content.split(',').map(p => p.trim());
                let result = '';
                parts.forEach((part, index) => {
                    if (index > 0) result += ' '; // Add space between parts
                    
                    if (part.startsWith('"') && part.endsWith('"')) {
                        result += part.slice(1, -1);
                    } else if (vars[part] !== undefined) {
                        result += vars[part].toString();
                    } else if (part.startsWith('str(') && part.endsWith(')')) {
                        const varName = part.substring(4, part.length - 1);
                        if (vars[varName] !== undefined) {
                            result += vars[varName].toString();
                        }
                    } else if (this.isArithmeticExpression(part)) {
                        // Handle arithmetic expressions in print arguments
                        result += this.evaluateArithmeticExpression(part, vars).toString();
                    }
                });
                output = result;
            } else if (content.includes('.substring(')) {
                // Handle string .substring() method FIRST before other checks
                const match = content.match(/(\w+)\.substring\(([^,]+),\s*([^)]+)\)/);
                if (match && vars[match[1]] !== undefined) {
                    const varName = match[1];
                    const startParam = match[2].trim();
                    const lengthParam = match[3].trim();
                    
                    // Parse start parameter (could be variable or literal)
                    let start;
                    if (vars[startParam] !== undefined) {
                        start = parseInt(vars[startParam]); // Use 0-based indexing
                    } else if (!isNaN(startParam)) {
                        start = parseInt(startParam); // Use 0-based indexing
                    } else {
                        start = 0; // fallback
                    }
                    
                    // Parse length parameter (could be variable or literal)
                    let length;
                    if (vars[lengthParam] !== undefined) {
                        length = parseInt(vars[lengthParam]);
                    } else if (!isNaN(lengthParam)) {
                        length = parseInt(lengthParam);
                    } else {
                        length = 1; // fallback
                    }
                    
                    output = vars[varName].toString().substring(start, start + length);
                }
            } else if (content.includes('.left(')) {
                // Handle string .left() method
                const match = content.match(/(\w+)\.left\((\d+)\)/);
                if (match && vars[match[1]] !== undefined) {
                    const varName = match[1];
                    const length = parseInt(match[2]);
                    output = vars[varName].toString().substring(0, length);
                }
            } else if (content.includes('.right(')) {
                // Handle string .right() method
                const match = content.match(/(\w+)\.right\((\d+)\)/);
                if (match && vars[match[1]] !== undefined) {
                    const varName = match[1];
                    const length = parseInt(match[2]);
                    const str = vars[varName].toString();
                    output = str.substring(str.length - length);
                }
            } else if (content.includes('.upper')) {
                // Handle string .upper method
                const varName = content.split('.')[0];
                if (vars[varName] !== undefined) {
                    output = vars[varName].toString().toUpperCase();
                }
            } else if (content.includes('.lower')) {
                // Handle string .lower method
                const varName = content.split('.')[0];
                if (vars[varName] !== undefined) {
                    output = vars[varName].toString().toLowerCase();
                }
            } else if (content.includes('.length')) {
                // Handle string .length method
                const varName = content.split('.')[0];
                if (vars[varName] !== undefined) {
                    output = vars[varName].toString().length.toString();
                }
            } else if (content.includes('+')) {
                // Use the existing string concatenation method which handles complex expressions
                output = this.evaluateStringConcatenation(content, vars);
            } else if (this.isArithmeticExpression(content)) {
                // Handle arithmetic expressions like print(x*2) - AFTER checking for string methods
                output = this.evaluateArithmeticExpression(content, vars).toString();
            } else if (vars[content] !== undefined) {
                output = vars[content].toString();
            } else if (content.startsWith('str(') && content.endsWith(')')) {
                const varName = content.substring(4, content.length - 1);
                if (vars[varName] !== undefined) {
                    output = vars[varName].toString();
                }
            }
            if (output) this.outputs.push(output);
        } else if (line.includes('=') && !line.includes('==') && !line.includes('!=') && !line.includes('<=') && !line.includes('>=')) {
            // Assignment - check if trying to assign to a constant
            const parts = line.split('=');
            const varName = parts[0].trim();
            const value = parts[1].trim();
            
            // Check if this is trying to reassign a constant
            if (this.constants[varName]) {
                // In a real implementation, this would be an error
                // For trace tables, we'll ignore the assignment
                shouldTrace = false;
            } else if (varName.includes('[') && varName.includes(']')) {
                const arrayMatch = varName.match(/(\w+)\[(\d+)\]/);
                if (arrayMatch) {
                    const arrayName = arrayMatch[1];
                    const index = parseInt(arrayMatch[2]);
                    const elementName = `${arrayName}[${index}]`;
                    
                    if (vars[arrayName] && Array.isArray(vars[arrayName])) {
                        const oldValue = vars[arrayName][index];
                        let newValue;
                        if (!isNaN(value)) {
                            newValue = parseInt(value);
                        } else if (value.startsWith('"') && value.endsWith('"')) {
                            newValue = value.slice(1, -1);
                        } else if (vars[value] !== undefined) {
                            newValue = vars[value];
                        }
                        vars[arrayName][index] = newValue;
                        if (oldValue !== newValue) {
                            // Track the change for the specific array element, not the whole array
                            changeRecord[elementName] = newValue;
                        }
                    }
                }
            } else if (value.startsWith('input(')) {
                // Input statement - use predefined input value
                if (this.inputIndex < this.inputs.length) {
                    const oldValue = vars[varName];
                    vars[varName] = this.inputs[this.inputIndex];
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                    this.inputIndex++;
                } else {
                    const oldValue = vars[varName];
                    vars[varName] = "undefined_input";
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                }
            } else if (value.startsWith('int(input(')) {
                // int(input()) statement - use predefined input value and convert to integer
                if (this.inputIndex < this.inputs.length) {
                    const oldValue = vars[varName];
                    vars[varName] = parseInt(this.inputs[this.inputIndex]);
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                    this.inputIndex++;
                } else {
                    const oldValue = vars[varName];
                    vars[varName] = 0;
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                }
            } else if (value.startsWith('float(input(')) {
                // float(input()) statement - use predefined input value and convert to float
                if (this.inputIndex < this.inputs.length) {
                    const oldValue = vars[varName];
                    vars[varName] = parseFloat(this.inputs[this.inputIndex]);
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                    this.inputIndex++;
                } else {
                    const oldValue = vars[varName];
                    vars[varName] = 0.0;
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                }
            } else if (value.startsWith('real(input(')) {
                // real(input()) statement - use predefined input value and convert to float (alternative syntax)
                if (this.inputIndex < this.inputs.length) {
                    const oldValue = vars[varName];
                    vars[varName] = parseFloat(this.inputs[this.inputIndex]);
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                    this.inputIndex++;
                } else {
                    const oldValue = vars[varName];
                    vars[varName] = 0.0;
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                }
            } else if (value.startsWith('random(')) {
                // random() statement - use predefined random value
                const oldValue = vars[varName];
                if (this.currentProgram.randomValue !== undefined) {
                    vars[varName] = this.currentProgram.randomValue;
                } else {
                    vars[varName] = Math.floor(Math.random() * 10) + 1;
                }
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.startsWith('bool(') && value.endsWith(')')) {
                // bool() conversion
                const inner = value.substring(5, value.length - 1).trim();
                const oldValue = vars[varName];
                if (inner.startsWith('"') && inner.endsWith('"')) {
                    // String literal
                    const strValue = inner.slice(1, -1).toLowerCase();
                    vars[varName] = strValue === 'true';
                } else if (vars[inner] !== undefined) {
                    // Variable
                    const val = vars[inner];
                    if (typeof val === 'boolean') {
                        vars[varName] = val;
                    } else if (typeof val === 'string') {
                        vars[varName] = val.toLowerCase() === 'true';
                    } else if (typeof val === 'number') {
                        vars[varName] = val !== 0;
                    } else {
                        vars[varName] = false;
                    }
                } else if (!isNaN(inner)) {
                    // Numeric literal
                    vars[varName] = parseFloat(inner) !== 0;
                } else {
                    vars[varName] = false;
                }
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (this.isStringConcatenation(value, vars)) {
                // String concatenation - check this BEFORE individual string methods
                const oldValue = vars[varName];
                vars[varName] = this.evaluateStringConcatenation(value, vars);
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.includes('.left(')) {
                // String left method - extract left N characters
                const match = value.match(/(\w+)\.left\((\d+)\)/);
                if (match && vars[match[1]] !== undefined) {
                    const sourceVar = match[1];
                    const length = parseInt(match[2]);
                    const oldValue = vars[varName];
                    vars[varName] = vars[sourceVar].toString().substring(0, length);
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                }
            } else if (value.includes('.right(')) {
                // String right method - extract right N characters
                const match = value.match(/(\w+)\.right\((\d+)\)/);
                if (match && vars[match[1]] !== undefined) {
                    const sourceVar = match[1];
                    const length = parseInt(match[2]);
                    const str = vars[sourceVar].toString();
                    const oldValue = vars[varName];
                    vars[varName] = str.substring(str.length - length);
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                }
            } else if (value.includes('.substring(')) {
                // String substring method - extract substring(start, length)
                const match = value.match(/(\w+)\.substring\(([^,]+),\s*([^)]+)\)/);
                if (match && vars[match[1]] !== undefined) {
                    const sourceVar = match[1];
                    const startParam = match[2].trim();
                    const lengthParam = match[3].trim();
                    
                    // Parse start parameter (could be variable or literal)
                    // substring uses 0-based indexing (like JavaScript)
                    let start;
                    if (vars[startParam] !== undefined) {
                        start = parseInt(vars[startParam]); // Use 0-based indexing directly
                    } else if (!isNaN(startParam)) {
                        start = parseInt(startParam); // Use 0-based indexing directly
                    } else {
                        start = 0; // fallback
                    }
                    
                    // Parse length parameter (could be variable or literal)
                    let length;
                    if (vars[lengthParam] !== undefined) {
                        length = parseInt(vars[lengthParam]);
                    } else if (!isNaN(lengthParam)) {
                        length = parseInt(lengthParam);
                    } else {
                        length = 1; // fallback
                    }
                    
                    const oldValue = vars[varName];
                    vars[varName] = vars[sourceVar].toString().substring(start, start + length);
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                }
            } else if (value === '""') {
                const oldValue = vars[varName];
                vars[varName] = '';
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.startsWith('"') && value.endsWith('"')) {
                // String literal
                const oldValue = vars[varName];
                vars[varName] = value.slice(1, -1);
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (!isNaN(value)) {
                // Numeric literal - use parseFloat to handle both integers and decimals
                const oldValue = vars[varName];
                vars[varName] = parseFloat(value);
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (this.isStringConcatenation(value, vars)) {
                // String concatenation
                const oldValue = vars[varName];
                vars[varName] = this.evaluateStringConcatenation(value, vars);
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (this.isArithmeticExpression(value)) {
                // Arithmetic expression
                const oldValue = vars[varName];
                vars[varName] = this.evaluateArithmeticExpression(value, vars);
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.includes('.length')) {
                // String length property access
                const sourceVar = value.split('.')[0];
                if (vars[sourceVar] !== undefined) {
                    const oldValue = vars[varName];
                    vars[varName] = vars[sourceVar].toString().length;
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                }
            } else if (value.includes('.upper')) {
                // String upper method
                const sourceVar = value.split('.')[0];
                if (vars[sourceVar] !== undefined) {
                    const oldValue = vars[varName];
                    vars[varName] = vars[sourceVar].toString().toUpperCase();
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                }
            } else if (value.includes('.lower')) {
                // String lower method
                const sourceVar = value.split('.')[0];
                if (vars[sourceVar] !== undefined) {
                    const oldValue = vars[varName];
                    vars[varName] = vars[sourceVar].toString().toLowerCase();
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                }
            } else if (value.startsWith('str(') && value.endsWith(')')) {
                // str() function - convert to string
                const inner = value.substring(4, value.length - 1).trim();
                const oldValue = vars[varName];
                if (vars[inner] !== undefined) {
                    vars[varName] = vars[inner].toString();
                } else if (!isNaN(inner)) {
                    vars[varName] = inner.toString();
                } else {
                    vars[varName] = inner.toString();
                }
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.startsWith('ASC(') && value.endsWith(')')) {
                // ASC() function - character to ASCII value
                const inner = value.substring(4, value.length - 1).trim();
                const oldValue = vars[varName];
                let charValue;
                if (inner.startsWith('"') && inner.endsWith('"')) {
                    // String literal like ASC("A")
                    charValue = inner.slice(1, -1);
                } else if (vars[inner] !== undefined) {
                    // Variable like ASC(char)
                    charValue = vars[inner].toString();
                } else {
                    // Could be an expression
                    charValue = this.evaluateExpressionOrVariable(inner, vars);
                    if (typeof charValue !== 'string') {
                        charValue = charValue.toString();
                    }
                }
                if (charValue && charValue.length > 0) {
                    vars[varName] = charValue.charCodeAt(0);
                } else {
                    vars[varName] = 0;
                }
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.startsWith('CHR(') && value.endsWith(')')) {
                // CHR() function - ASCII value to character
                const inner = value.substring(4, value.length - 1).trim();
                const oldValue = vars[varName];
                let asciiValue;
                if (!isNaN(inner)) {
                    asciiValue = parseInt(inner);
                } else if (vars[inner] !== undefined) {
                    asciiValue = parseInt(vars[inner]);
                } else {
                    asciiValue = this.evaluateArithmeticExpression(inner, vars);
                }
                if (!isNaN(asciiValue)) {
                    vars[varName] = String.fromCharCode(asciiValue);
                } else {
                    vars[varName] = "";
                }
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.startsWith('int(') && value.endsWith(')')) {
                // int() function - convert to integer
                const inner = value.substring(4, value.length - 1).trim();
                const oldValue = vars[varName];
                if (vars[inner] !== undefined) {
                    vars[varName] = parseInt(vars[inner]);
                } else if (!isNaN(inner)) {
                    vars[varName] = parseInt(inner);
                } else {
                    vars[varName] = 0;
                }
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.startsWith('float(') && value.endsWith(')')) {
                // float() function - convert to float
                const inner = value.substring(6, value.length - 1).trim();
                const oldValue = vars[varName];
                if (vars[inner] !== undefined) {
                    vars[varName] = parseFloat(vars[inner]);
                } else if (!isNaN(inner)) {
                    vars[varName] = parseFloat(inner);
                } else {
                    vars[varName] = 0.0;
                }
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.startsWith('real(') && value.endsWith(')')) {
                // real() function - convert to real/float
                const inner = value.substring(5, value.length - 1).trim();
                const oldValue = vars[varName];
                if (vars[inner] !== undefined) {
                    vars[varName] = parseFloat(vars[inner]);
                } else if (!isNaN(inner)) {
                    vars[varName] = parseFloat(inner);
                } else {
                    vars[varName] = 0.0;
                }
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (vars[value] !== undefined) {
                // Variable assignment
                const oldValue = vars[varName];
                vars[varName] = vars[value];
                if (oldValue !== vars[varName]) {
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.includes('[') && value.includes(']')) {
                // Array access
                const arrayValue = this.getVariableValue(value, vars);
                if (arrayValue !== undefined) {
                    const oldValue = vars[varName];
                    vars[varName] = arrayValue;
                    if (oldValue !== vars[varName]) {
                        changeRecord[varName] = vars[varName];
                    }
                }
            }
        }
            
            return { output, shouldTrace, changedVariables: changeRecord };
    }

    evaluateExpression(expression, vars) {
            // Handle type conversions and simple expressions
            expression = expression.trim();
            
            // Handle bool() conversion
            if (expression.startsWith('bool(') && expression.endsWith(')')) {
                const inner = expression.substring(5, expression.length - 1).trim();
                if (inner.startsWith('"') && inner.endsWith('"')) {
                    // String literal
                    const strValue = inner.slice(1, -1).toLowerCase();
                    return strValue === 'true';
                } else if (vars[inner] !== undefined) {
                    // Variable
                    const value = vars[inner];
                    if (typeof value === 'boolean') {
                        return value;
                    } else if (typeof value === 'string') {
                        return value.toLowerCase() === 'true';
                    } else if (typeof value === 'number') {
                        return value !== 0;
                    } else {
                        return false;
                    }
                } else if (!isNaN(inner)) {
                    // Numeric literal
                    return parseFloat(inner) !== 0;
                } else {
                    return false;
                }
            }
            
            // Handle other type conversions
            if (expression.startsWith('int(') && expression.endsWith(')')) {
                const inner = expression.substring(4, expression.length - 1).trim();
                if (vars[inner] !== undefined) {
                    return parseInt(vars[inner]);
                } else if (!isNaN(inner)) {
                    return parseInt(inner);
                } else {
                    return 0;
                }
            }
            
            if (expression.startsWith('str(') && expression.endsWith(')')) {
                const inner = expression.substring(4, expression.length - 1).trim();
                if (vars[inner] !== undefined) {
                    return vars[inner].toString();
                } else {
                    return inner.toString();
                }
            }
            
            if (expression.startsWith('float(') && expression.endsWith(')')) {
                const inner = expression.substring(6, expression.length - 1).trim();
                if (vars[inner] !== undefined) {
                    return parseFloat(vars[inner]);
                } else if (!isNaN(inner)) {
                    return parseFloat(inner);
                } else {
                    return 0.0;
                }
            }
            
            if (expression.startsWith('real(') && expression.endsWith(')')) {
                const inner = expression.substring(5, expression.length - 1).trim();
                if (vars[inner] !== undefined) {
                    return parseFloat(vars[inner]);
                } else if (!isNaN(inner)) {
                    return parseFloat(inner);
                } else {
                    return 0.0;
                }
            }
            
            // Handle variables
            if (vars[expression] !== undefined) {
                return vars[expression];
            }
            
            // Handle numeric literals
            if (!isNaN(expression)) {
                return parseFloat(expression);
            }
            
            // Handle string literals
            if (expression.startsWith('"') && expression.endsWith('"')) {
                return expression.slice(1, -1);
            }
            
            // Handle boolean literals
            if (expression.toLowerCase() === 'true') {
                return true;
            }
            if (expression.toLowerCase() === 'false') {
                return false;
            }
            
            // Default to evaluating as arithmetic expression
            return this.evaluateArithmeticExpression(expression, vars);
        }

        getVariableValue(operand, vars) {
            // Helper function to get value from variable or array access
            if (operand.includes('[') && operand.includes(']')) {
                // Array access like nums[i] or nums[0]
                const arrayMatch = operand.match(/(\w+)\[(\w+|\d+)\]/);
                if (arrayMatch) {
                    const arrayName = arrayMatch[1];
                    const indexStr = arrayMatch[2];
                    
                    if (vars[arrayName] && Array.isArray(vars[arrayName])) {
                        let index;
                        // Check if index is a literal number or a variable
                        if (/^\d+$/.test(indexStr)) {
                            // Literal index like [0], [1], etc.
                            index = parseInt(indexStr);
                        } else {
                            // Variable index like [i], [counter], etc.
                            if (vars[indexStr] !== undefined) {
                                index = parseInt(vars[indexStr]);
                            } else {
                                return undefined;
                            }
                        }
                        
                        if (index >= 0 && index < vars[arrayName].length) {
                            return vars[arrayName][index];
                        }
                    }
                }
                return undefined;
            } else {
                return vars[operand];
            }
        }

        isStringConcatenation(value, vars) {
            // Check if the expression is a string concatenation
            
            // Check for CHR function calls (which return strings)
            if (value.startsWith('CHR(') && value.endsWith(')')) {
                return true;
            }
            
            const result = value.includes('+') && 
                   value.split('+').some(part => {
                        const trimmed = part.trim();
                        return (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
                               (vars[trimmed] !== undefined && typeof vars[trimmed] === 'string') ||
                               trimmed.includes('.left(') || trimmed.includes('.right(') ||
                               trimmed.includes('.substring(') || trimmed.includes('.upper') ||
                               trimmed.includes('.lower') || trimmed.startsWith('str(') ||
                               trimmed.startsWith('CHR(') || trimmed.startsWith('ASC(');
                   });
            return result;
        }

        isArithmeticExpression(value) {
            // Don't treat string methods or type conversion functions as arithmetic expressions
            if (value.includes('.substring(') || value.includes('.left(') || 
                value.includes('.right(') || value.includes('.upper') || 
                value.includes('.lower') || value.includes('.length') ||
                value.startsWith('str(') || value.startsWith('int(') ||
                value.startsWith('float(') || value.startsWith('real(') ||
                value.startsWith('bool(') || value.startsWith('ASC(') ||
                value.startsWith('CHR(')) {
                return false;
            }
            
            // Check if the expression contains arithmetic operators
            return value.includes('+') || value.includes('-') || value.includes('*') || 
                   value.includes('/') || value.includes('MOD') || value.includes('DIV') ||
                   value.includes('(') || value.includes(')');
        }

        evaluateStringConcatenation(value, vars) {
            // Handle single function calls that aren't part of concatenation
            if ((value.startsWith('ASC(') && value.endsWith(')')) || 
                (value.startsWith('CHR(') && value.endsWith(')'))) {
                if (value.startsWith('ASC(')) {
                    const argument = value.slice(4, -1).trim();
                    let charValue;
                    if (argument.startsWith('"') && argument.endsWith('"')) {
                        charValue = argument.slice(1, -1);
                    } else if (vars[argument] !== undefined) {
                        charValue = vars[argument].toString();
                    } else {
                        charValue = this.evaluateExpressionOrVariable(argument, vars);
                        if (typeof charValue !== 'string') {
                            charValue = charValue.toString();
                        }
                    }
                    if (charValue && charValue.length > 0) {
                        return charValue.charCodeAt(0); // Return number, not string
                    }
                    return 0;
                } else if (value.startsWith('CHR(')) {
                    const argument = value.slice(4, -1).trim();
                    let asciiValue;
                    if (!isNaN(argument)) {
                        asciiValue = parseInt(argument);
                    } else if (vars[argument] !== undefined) {
                        asciiValue = parseInt(vars[argument]);
                    } else {
                        asciiValue = this.evaluateArithmeticExpression(argument, vars);
                    }
                    if (!isNaN(asciiValue)) {
                        return String.fromCharCode(asciiValue);
                    }
                    return '';
                }
            }
            
            // Smart parsing for string concatenation that handles quotes and parentheses
            const parts = this.parseStringConcatenation(value);
            let result = '';
            
            parts.forEach(part => {
                if (part.startsWith('str(') && part.endsWith(')')) {
                    // Handle str() function - convert to string
                    const argument = part.slice(4, -1).trim();
                    if (vars[argument] !== undefined) {
                        result += vars[argument].toString();
                    } else if (!isNaN(argument)) {
                        result += argument.toString();
                    } else {
                        // Could be an expression
                        const value = this.evaluateArithmeticExpression(argument, vars);
                        result += value.toString();
                    }
                } else if (part.startsWith('ASC(') && part.endsWith(')')) {
                    // Handle ASC() function - character to ASCII value
                    const argument = part.slice(4, -1).trim();
                    let charValue;
                    if (argument.startsWith('"') && argument.endsWith('"')) {
                        // String literal like ASC("A")
                        charValue = argument.slice(1, -1);
                    } else if (vars[argument] !== undefined) {
                        // Variable like ASC(letter)
                        charValue = vars[argument].toString();
                    } else {
                        // Could be an expression or method call
                        charValue = this.evaluateExpressionOrVariable(argument, vars);
                        if (typeof charValue !== 'string') {
                            charValue = charValue.toString();
                        }
                    }
                    if (charValue && charValue.length > 0) {
                        result += charValue.charCodeAt(0).toString();
                    }
                } else if (part.startsWith('CHR(') && part.endsWith(')')) {
                    // Handle CHR() function - ASCII value to character
                    const argument = part.slice(4, -1).trim();
                    let asciiValue;
                    if (!isNaN(argument)) {
                        // Numeric literal like CHR(65)
                        asciiValue = parseInt(argument);
                    } else if (vars[argument] !== undefined) {
                        // Variable like CHR(ascii_val)
                        asciiValue = parseInt(vars[argument]);
                    } else {
                        // Could be an expression like CHR(ascii_value + 1)
                        asciiValue = this.evaluateArithmeticExpression(argument, vars);
                    }
                    if (!isNaN(asciiValue)) {
                        result += String.fromCharCode(asciiValue);
                    }
                } else if (part.startsWith('"') && part.endsWith('"')) {
                    result += part.slice(1, -1);
                } else if (part.includes('.left(')) {
                    // Handle string left method
                    const match = part.match(/(\w+)\.left\((\d+)\)/);
                    if (match && vars[match[1]] !== undefined) {
                        const varName = match[1];
                        const length = parseInt(match[2]);
                        result += vars[varName].toString().substring(0, length);
                    }
                } else if (part.includes('.right(')) {
                    // Handle string right method
                    const match = part.match(/(\w+)\.right\((\d+)\)/);
                    if (match && vars[match[1]] !== undefined) {
                        const varName = match[1];
                        const length = parseInt(match[2]);
                        const str = vars[varName].toString();
                        result += str.substring(str.length - length);
                    }
                } else if (part.includes('.substring(')) {
                    // Handle string substring method
                    const match = part.match(/(\w+)\.substring\(([^,]+),\s*([^)]+)\)/);
                    if (match && vars[match[1]] !== undefined) {
                        const sourceVar = match[1];
                        const startParam = match[2].trim();
                        const lengthParam = match[3].trim();
                        
                        // Parse start parameter (could be variable or literal)
                        let start;
                        if (vars[startParam] !== undefined) {
                            start = parseInt(vars[startParam]); // Use 0-based indexing
                        } else if (!isNaN(startParam)) {
                            start = parseInt(startParam); // Use 0-based indexing
                        } else {
                            start = 0; // fallback
                        }
                        
                        // Parse length parameter (could be variable or literal)
                        let length;
                        if (vars[lengthParam] !== undefined) {
                            length = parseInt(vars[lengthParam]);
                        } else if (!isNaN(lengthParam)) {
                            length = parseInt(lengthParam);
                        } else {
                            length = 1; // fallback
                        }
                        
                        result += vars[sourceVar].toString().substring(start, start + length);
                    }
                } else if (part.includes('.upper')) {
                    // Handle string .upper method
                    const varName = part.split('.')[0];
                    if (vars[varName] !== undefined) {
                        result += vars[varName].toString().toUpperCase();
                    }
                } else if (part.includes('.lower')) {
                    // Handle string .lower method
                    const varName = part.split('.')[0];
                    if (vars[varName] !== undefined) {
                        result += vars[varName].toString().toLowerCase();
                    }
                } else if (part.includes('.length')) {
                    // Handle string .length method
                    const varName = part.split('.')[0];
                    if (vars[varName] !== undefined) {
                        result += vars[varName].toString().length.toString();
                    }
                } else if (part === '""') {
                    result += '';
                } else if (part.startsWith('"') && part.endsWith('"')) {
                    // String literal
                    result += part.slice(1, -1);
                } else if (vars[part] !== undefined) {
                    result += vars[part].toString();
                } else if (this.isArithmeticExpression(part)) {
                    // Handle arithmetic expressions like (i + 1)
                    result += this.evaluateArithmeticExpression(part, vars).toString();
                } else if (part.startsWith('(') && part.endsWith(')')) {
                    // Handle parenthesized expressions
                    const innerExpression = part.slice(1, -1);
                    if (this.isArithmeticExpression(innerExpression)) {
                        result += this.evaluateArithmeticExpression(innerExpression, vars).toString();
                    } else if (vars[innerExpression] !== undefined) {
                        result += vars[innerExpression].toString();
                    }
                }
            });
            return result;
        }

        parseStringConcatenation(value) {
            // Smart parser that handles quotes, parentheses, and function calls
            const parts = [];
            let current = '';
            let inQuotes = false;
            let parenDepth = 0;
            let i = 0;
            
            while (i < value.length) {
                const char = value[i];
                
                if (char === '"' && (i === 0 || value[i-1] !== '\\')) {
                    inQuotes = !inQuotes;
                    current += char;
                } else if (!inQuotes && char === '(') {
                    parenDepth++;
                    current += char;
                } else if (!inQuotes && char === ')') {
                    parenDepth--;
                    current += char;
                } else if (!inQuotes && parenDepth === 0 && char === '+') {
                    // This is a concatenation operator
                    if (current.trim()) {
                        parts.push(current.trim());
                    }
                    current = '';
                } else {
                    current += char;
                }
                i++;
            }
            
            if (current.trim()) {
                parts.push(current.trim());
            }
            
            return parts;
        }

        evaluateArithmeticExpression(expression, vars) {
            // Normalize whitespace around word operators
            expression = expression.replace(/\s*\bMOD\b\s*/g, ' MOD ');
            expression = expression.replace(/\s*\bDIV\b\s*/g, ' DIV ');
            
            // Clean up multiple spaces
            expression = expression.replace(/\s+/g, ' ').trim();
            
            // Handle parentheses by recursively evaluating inner expressions
            while (expression.includes('(')) {
                let depth = 0;
                let start = -1;
                
                for (let i = 0; i < expression.length; i++) {
                    if (expression[i] === '(') {
                        if (depth === 0) start = i;
                        depth++;
                    } else if (expression[i] === ')') {
                        depth--;
                        if (depth === 0) {
                            const innerExpression = expression.substring(start + 1, i);
                            const innerResult = this.evaluateArithmeticExpression(innerExpression, vars);
                            expression = expression.substring(0, start) + innerResult + expression.substring(i + 1);
                            break;
                        }
                    }
                }
            }
            
            // Handle exponentiation first (right to left)
            while (expression.includes('^')) {
                const pos = expression.lastIndexOf('^');
                
                // Find left operand (skip spaces)
                let leftStart = pos - 1;
                while (leftStart >= 0 && expression[leftStart] === ' ') {
                    leftStart--; // Skip spaces
                }
                let leftEnd = leftStart + 1;
                while (leftStart >= 0 && /[A-Za-z0-9_\[\].]/.test(expression[leftStart])) {
                    leftStart--;
                }
                leftStart++;
                
                // Find right operand (skip spaces)
                let rightStart = pos + 1;
                while (rightStart < expression.length && expression[rightStart] === ' ') {
                    rightStart++; // Skip spaces
                }
                let rightEnd = rightStart;
                while (rightEnd < expression.length && /[A-Za-z0-9_\[\].]/.test(expression[rightEnd])) {
                    rightEnd++;
                }
                
                const leftOperand = expression.substring(leftStart, leftEnd).trim();
                const rightOperand = expression.substring(rightStart, rightEnd).trim();
                
                const leftVal = this.getExpressionValue(leftOperand, vars);
                const rightVal = this.getExpressionValue(rightOperand, vars);
                const result = Math.pow(leftVal, rightVal);
                
                expression = expression.substring(0, leftStart) + result + expression.substring(rightEnd);
            }
            
            // Then handle *, /, DIV, MOD (left to right)
            expression = this.handleLeftToRightOperators(expression, ['*', '/', 'DIV', 'MOD'], vars);
            
            // Finally handle +, - (left to right)
            expression = this.handleLeftToRightOperators(expression, ['+', '-'], vars);
            
            // At this point, expression should be a single value
            return this.getExpressionValue(expression, vars);
        }

        getExpressionValue(operand, vars) {
            // Handle ASC() function
            if (operand.startsWith('ASC(') && operand.endsWith(')')) {
                const argument = operand.slice(4, -1).trim();
                let charValue;
                if (argument.startsWith('"') && argument.endsWith('"')) {
                    // String literal like ASC("A")
                    charValue = argument.slice(1, -1);
                } else if (vars[argument] !== undefined) {
                    // Variable like ASC(letter)
                    charValue = vars[argument].toString();
                } else {
                    // Could be an expression or method call
                    charValue = this.evaluateExpressionOrVariable(argument, vars);
                    if (typeof charValue !== 'string') {
                        charValue = charValue.toString();
                    }
                }
                if (charValue && charValue.length > 0) {
                    return charValue.charCodeAt(0);
                }
                return 0;
            }
            
            // Handle CHR() function - CHR returns a string, but in arithmetic context it should be 0
            if (operand.startsWith('CHR(') && operand.endsWith(')')) {
                // CHR in arithmetic context is unusual, but return 0 for safety
                return 0;
            }
            
            // Handle array access
            if (operand.includes('[') && operand.includes(']')) {
                const arrayMatch = operand.match(/(\w+)\[(\w+|\d+)\]/);
                if (arrayMatch) {
                    const arrayName = arrayMatch[1];
                    const indexStr = arrayMatch[2];
                    
                    if (vars[arrayName] && Array.isArray(vars[arrayName])) {
                        let index;
                        // Check if index is a literal number or a variable
                        if (/^\d+$/.test(indexStr)) {
                            // Literal index like [0], [1], etc.
                            index = parseInt(indexStr);
                        } else {
                            // Variable index like [i], [counter], etc.
                            if (vars[indexStr] !== undefined) {
                                index = parseInt(vars[indexStr]);
                            } else {
                                return 0;
                            }
                        }
                        
                        if (index >= 0 && index < vars[arrayName].length) {
                            return vars[arrayName][index];
                        }
                    }
                }
                return 0;
            }
            
            // Handle regular variables
            if (vars[operand] !== undefined) {
                return parseFloat(vars[operand]);
            }
            
            // Handle numeric literals
            if (!isNaN(operand)) {
                return parseFloat(operand);
            }
            
            return 0;
        }

        handleLeftToRightOperators(expression, operators, vars) {
            let changed = true;
            while (changed) {
                changed = false;
                
                // Find the leftmost operator from our list
                let earliestPos = expression.length;
                let earliestOp = null;
                let earliestLength = 0;
                
                for (const op of operators) {
                    let pos = 0;
                    while (pos < expression.length) {
                        if (op === 'DIV' || op === 'MOD') {
                            // Find whole word operators
                            pos = expression.indexOf(op, pos);
                            if (pos === -1) break;
                            
                            // Check if it's a whole word (not part of another word)
                            if ((pos === 0 || !/[A-Za-z0-9_]/.test(expression[pos - 1])) &&
                                (pos + op.length === expression.length || !/[A-Za-z0-9_]/.test(expression[pos + op.length]))) {
                                if (pos < earliestPos) {
                                    earliestPos = pos;
                                    earliestOp = op;
                                    earliestLength = op.length;
                                }
                                break;
                            }
                            pos++;
                        } else {
                            pos = expression.indexOf(op, pos);
                            if (pos === -1) break;
                            
                            if (pos < earliestPos) {
                                earliestPos = pos;
                                earliestOp = op;
                                earliestLength = 1;
                            }
                            break;
                        }
                    }
                }
                
                if (earliestOp && earliestPos < expression.length) {
                    // Find left operand (skip spaces)
                    let leftStart = earliestPos - 1;
                    while (leftStart >= 0 && expression[leftStart] === ' ') {
                        leftStart--; // Skip spaces
                    }
                    let leftEnd = leftStart + 1;
                    while (leftStart >= 0 && /[A-Za-z0-9_\[\].]/.test(expression[leftStart])) {
                        leftStart--;
                    }
                    leftStart++;
                    
                    // Find right operand (skip spaces)
                    let rightStart = earliestPos + earliestLength;
                    while (rightStart < expression.length && expression[rightStart] === ' ') {
                        rightStart++; // Skip spaces
                    }
                    let rightEnd = rightStart;
                    while (rightEnd < expression.length && /[A-Za-z0-9_\[\].]/.test(expression[rightEnd])) {
                        rightEnd++;
                    }
                    
                    const leftOperand = expression.substring(leftStart, leftEnd).trim();
                    const rightOperand = expression.substring(rightStart, rightEnd).trim();
                    
                    if (leftOperand && rightOperand) {
                        const leftVal = this.getExpressionValue(leftOperand, vars);
                        const rightVal = this.getExpressionValue(rightOperand, vars);
                        let result;
                        
                        switch (earliestOp) {
                            case '+':
                                result = leftVal + rightVal;
                                break;
                            case '-':
                                result = leftVal - rightVal;
                                break;
                            case '*':
                                result = leftVal * rightVal;
                                break;
                            case '/':
                                result = leftVal / rightVal; // Normal division (floating-point)
                                break;
                            case 'DIV':
                                result = Math.floor(leftVal / rightVal); // Integer division
                                break;
                            case 'MOD':
                                result = leftVal % rightVal;
                                break;
                        }
                        
                        // Replace the entire operation (from leftStart to rightEnd) with the result
                        const beforeOperation = expression.substring(0, leftStart);
                        const afterOperation = expression.substring(rightEnd);
                        expression = beforeOperation + result + afterOperation;
                        changed = true;
                    }
                }
            }
            
            return expression;
        }

        evaluateCondition(condition, vars) {
            // Enhanced condition evaluation that handles arithmetic expressions
            
            // Handle AND operator
            if (condition.includes(' AND ')) {
                const parts = condition.split(' AND ');
                let result = true;
                for (const part of parts) {
                    if (!this.evaluateCondition(part.trim(), vars)) {
                        result = false;
                        break;
                    }
                }
                return result;
            }
            
            // Handle OR operator
            if (condition.includes(' OR ')) {
                const parts = condition.split(' OR ');
                let result = false;
                for (const part of parts) {
                    if (this.evaluateCondition(part.trim(), vars)) {
                        result = true;
                        break;
                    }
                }
                return result;
            }
            
            if (condition.includes('>=')) {
                const [left, right] = condition.split('>=').map(s => s.trim());
                let leftVal = this.evaluateExpressionOrVariable(left, vars);
                let rightVal = this.evaluateExpressionOrVariable(right, vars);
                
                return leftVal >= rightVal;
            } else if (condition.includes('<=')) {
                const [left, right] = condition.split('<=').map(s => s.trim());
                let leftVal = this.evaluateExpressionOrVariable(left, vars);
                let rightVal = this.evaluateExpressionOrVariable(right, vars);
                
                return leftVal <= rightVal;
            } else if (condition.includes('==')) {
                const [left, right] = condition.split('==').map(s => s.trim());
                let leftVal = this.evaluateExpressionOrVariable(left, vars);
                let rightVal = this.evaluateExpressionOrVariable(right, vars);
                
                return leftVal == rightVal;
            } else if (condition.includes('!=')) {
                const [left, right] = condition.split('!=').map(s => s.trim());
                let leftVal = this.evaluateExpressionOrVariable(left, vars);
                let rightVal = this.evaluateExpressionOrVariable(right, vars);
                
                return leftVal != rightVal;
            } else if (condition.includes('>')) {
                const [left, right] = condition.split('>').map(s => s.trim());
                let leftVal = this.evaluateExpressionOrVariable(left, vars);
                let rightVal = this.evaluateExpressionOrVariable(right, vars);
                
                return leftVal > rightVal;
            } else if (condition.includes('<')) {
                const [left, right] = condition.split('<').map(s => s.trim());
                let leftVal = this.evaluateExpressionOrVariable(left, vars);
                let rightVal = this.evaluateExpressionOrVariable(right, vars);
                
                return leftVal < rightVal;
            }
            
            return false;
        }

        evaluateExpressionOrVariable(expression, vars) {
            // Helper function to evaluate expressions or variables in conditions
            expression = expression.trim();
            
            // Handle ASC() function
            if (expression.startsWith('ASC(') && expression.endsWith(')')) {
                const argument = expression.slice(4, -1).trim();
                let charValue;
                if (argument.startsWith('"') && argument.endsWith('"')) {
                    // String literal like ASC("A")
                    charValue = argument.slice(1, -1);
                } else if (vars[argument] !== undefined) {
                    // Variable like ASC(letter)
                    charValue = vars[argument].toString();
                } else {
                    // Could be an expression or method call
                    charValue = this.evaluateExpressionOrVariable(argument, vars);
                    if (typeof charValue !== 'string') {
                        charValue = charValue.toString();
                    }
                }
                if (charValue && charValue.length > 0) {
                    return charValue.charCodeAt(0);
                }
                return 0;
            }
            
            // Handle CHR() function
            if (expression.startsWith('CHR(') && expression.endsWith(')')) {
                const argument = expression.slice(4, -1).trim();
                let asciiValue;
                if (!isNaN(argument)) {
                    // Numeric literal like CHR(65)
                    asciiValue = parseInt(argument);
                } else if (vars[argument] !== undefined) {
                    // Variable like CHR(ascii_val)
                    asciiValue = parseInt(vars[argument]);
                } else {
                    // Could be an expression like CHR(ascii_value + 1)
                    asciiValue = this.evaluateArithmeticExpression(argument, vars);
                }
                if (!isNaN(asciiValue)) {
                    return String.fromCharCode(asciiValue);
                }
                return '';
            }
            
            // Check if it's a string literal
            if (expression.startsWith('"') && expression.endsWith('"')) {
                return expression.slice(1, -1);
            }
            
            // Check if it contains operators (arithmetic expression)
            if (expression.includes('+') || expression.includes('-') || 
                expression.includes('*') || expression.includes('/') || 
                expression.includes('MOD') || expression.includes('DIV')) {
                return this.evaluateArithmeticExpression(expression, vars);
            }
            
            // Check if it's a string method like .length
            if (expression.includes('.length')) {
                const varName = expression.split('.')[0];
                if (vars[varName] !== undefined) {
                    return vars[varName].toString().length;
                }
            }
            
            // Check if it's a variable
            if (vars[expression] !== undefined) {
                return vars[expression];
            }
            
            // Check if it's a number
            if (!isNaN(expression)) {
                return parseFloat(expression);
            }
            
            // Return as string literal
            return expression;
        }

        handleIfStatement(lines, i) {
            // If-elseif-else statement
            const line = lines[i];
            const condition = line.substring(3, line.indexOf(' then')).trim();
            
            // Find the structure of the if statement
            let endifIndex = -1;
            let elseifIndices = [];
            let elseIndex = -1;
            let depth = 0;
            
            for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].startsWith('if ')) depth++;
                if (lines[j] === 'endif') {
                    if (depth === 0) {
                        endifIndex = j;
                        break;
                    }
                    depth--;
                } else if (lines[j].startsWith('elseif ') && depth === 0) {
                    elseifIndices.push(j);
                } else if (lines[j] === 'else' && depth === 0) {
                    elseIndex = j;
                }
            }
            
            // Evaluate conditions and execute the appropriate block
            let conditionMet = this.evaluateCondition(condition, this.variables);
            let executionStart = i + 1;
            let executionEnd = elseifIndices.length > 0 ? elseifIndices[0] : 
                              (elseIndex !== -1 ? elseIndex : endifIndex);
            
            if (!conditionMet) {
                // Check elseif conditions
                for (let k = 0; k < elseifIndices.length; k++) {
                    const elseifLine = lines[elseifIndices[k]];
                    const elseifCondition = elseifLine.substring(7, elseifLine.indexOf(' then')).trim();
                    
                    if (this.evaluateCondition(elseifCondition, this.variables)) {
                        conditionMet = true;
                        executionStart = elseifIndices[k] + 1;
                        executionEnd = k + 1 < elseifIndices.length ? elseifIndices[k + 1] : 
                                      (elseIndex !== -1 ? elseIndex : endifIndex);
                        break;
                    }
                }
                
                // If no conditions met and there's an else
                if (!conditionMet && elseIndex !== -1) {
                    executionStart = elseIndex + 1;
                    executionEnd = endifIndex;
                    conditionMet = true;
                }
            }
            
            // Execute the appropriate block (only trace lines that actually execute)
            if (conditionMet) {
                let bodyLine = executionStart;
                while (bodyLine < executionEnd) {
                    const bodyLineCode = lines[bodyLine];
                    const bodyLineNum = bodyLine + 1;
                    
                    // Check if this line is a nested control structure
                    if (bodyLineCode.startsWith('if ') && bodyLineCode.includes(' then')) {
                        // Handle nested if statement
                        bodyLine = this.handleIfStatement(lines, bodyLine);
                    } else if (bodyLineCode.startsWith('while ')) {
                        // Handle nested while loop
                        bodyLine = this.handleWhileLoop(lines, bodyLine);
                    } else if (bodyLineCode === 'do') {
                        // Handle nested do-until loop
                        bodyLine = this.handleDoUntilLoop(lines, bodyLine);
                    } else if (bodyLineCode.startsWith('for ') && bodyLineCode.includes(' to ')) {
                        // Handle nested for loop
                        bodyLine = this.handleForLoop(lines, bodyLine);
                    } else {
                        // Regular statement
                        const result = this.executeStatement(bodyLineCode, bodyLineNum, this.variables);
                        if (result.shouldTrace && (Object.keys(result.changedVariables || {}).length > 0 || result.output)) {
                            this.addTraceEntry(bodyLineNum, this.variables, result.output, result.changedVariables);
                        }
                        bodyLine++;
                    }
                }
            }
            
            // Return the position after endif
            return endifIndex + 1;
        }

        handleWhileLoop(lines, i) {
            // While loop
            const line = lines[i];
            const condition = line.substring(6).trim();
            
            // Find the matching endwhile statement
            let endwhileIndex = -1;
            let depth = 0;
            for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].startsWith('while ')) depth++;
                if (lines[j] === 'endwhile') {
                    if (depth === 0) {
                        endwhileIndex = j;
                        break;
                    }
                    depth--;
                }
            }
            
            // Execute the while loop (only trace executing statements, not condition evaluations)
            while (this.evaluateCondition(condition, this.variables)) {
                // Execute loop body
                let bodyLine = i + 1;
                while (bodyLine < endwhileIndex) {
                    const bodyLineCode = lines[bodyLine];
                    const bodyLineNum = bodyLine + 1;
                    
                    if (bodyLineCode.startsWith('if ')) {
                        // Handle if statement
                        bodyLine = this.handleIfStatement(lines, bodyLine);
                    } else if (bodyLineCode.startsWith('switch ')) {
                        // Handle switch statement
                        bodyLine = this.handleSwitchStatement(lines, bodyLine);
                    } else if (bodyLineCode.startsWith('while ')) {
                        // Handle nested while loop
                        bodyLine = this.handleWhileLoop(lines, bodyLine);
                    } else if (bodyLineCode === 'do') {
                        // Handle do-until loop
                        bodyLine = this.handleDoUntilLoop(lines, bodyLine);
                    } else if (bodyLineCode.startsWith('for ') && bodyLineCode.includes(' to ')) {
                        // Handle for loop
                        bodyLine = this.handleForLoop(lines, bodyLine);
                    } else if (bodyLineCode.startsWith('next ') || bodyLineCode === 'endif' || bodyLineCode === 'else' || 
                               bodyLineCode.startsWith('elseif ') || bodyLineCode === 'endwhile' || bodyLineCode.startsWith('until ') ||
                               bodyLineCode.startsWith('case ') || bodyLineCode === 'default' || bodyLineCode === 'endswitch') {
                        // Skip control flow statements as they're handled by their parent structures
                        bodyLine++;
                    } else {
                        // Regular statement
                        const result = this.executeStatement(bodyLineCode, bodyLineNum, this.variables);
                        if (result.shouldTrace && (Object.keys(result.changedVariables || {}).length > 0 || result.output)) {
                            this.addTraceEntry(bodyLineNum, this.variables, result.output, result.changedVariables);
                        }
                        bodyLine++;
                    }
                }
            }
            
            // Return the position after endwhile
            return endwhileIndex + 1;
        }

        handleDoUntilLoop(lines, i) {
            // Do-until loop
            // Find the matching until statement
            let untilIndex = -1;
            let depth = 0;
            for (let j = i + 1; j < lines.length; j++) {
                if (lines[j] === 'do') depth++;
                if (lines[j].startsWith('until ')) {
                    if (depth === 0) {
                        untilIndex = j;
                        break;
                    }
                    depth--;
                }
            }
            
            // Execute the do-until loop (execute body at least once, then check condition)
            do {
                // Execute loop body
                for (let bodyLine = i + 1; bodyLine < untilIndex; bodyLine++) {
                    const bodyLineCode = lines[bodyLine];
                    const bodyLineNum = bodyLine + 1;
                    const result = this.executeStatement(bodyLineCode, bodyLineNum, this.variables);
                    if (result.shouldTrace && (Object.keys(result.changedVariables || {}).length > 0 || result.output)) {
                        this.addTraceEntry(bodyLineNum, this.variables, result.output, result.changedVariables);
                    }
                }
                
                // Get the until condition
                const untilLine = lines[untilIndex];
                const condition = untilLine.substring(6).trim(); // Remove "until "
                
                // Check if condition is met to exit the loop
                if (this.evaluateCondition(condition, this.variables)) {
                    break;
                }
            } while (true);
            
            // Return the position after until
            return untilIndex + 1;
        }

        handleForLoop(lines, i) {
            // For loop with optional step
            const line = lines[i];
            
            // Try to match pattern with step first: "for var = start to end step stepValue"
            let forMatch = line.match(/for\s+(\w+)\s*=\s*(-?\d+)\s+to\s+(-?\d+)\s+step\s+(-?\d+)/);
            let stepValue = 1; // Default step value
            
            if (forMatch) {
                // Pattern with step found
                stepValue = parseInt(forMatch[4]);
            } else {
                // Try pattern without step: "for var = start to end"
                forMatch = line.match(/for\s+(\w+)\s*=\s*(-?\d+)\s+to\s+(-?\d+)/);
                if (!forMatch) {
                    // If no match, just skip this line
                    return i + 1;
                }
            }
            
            const loopVar = forMatch[1];
            const startVal = parseInt(forMatch[2]);
            const endVal = parseInt(forMatch[3]);
            
            // Find the matching next statement
            let nextLineIndex = -1;
            let depth = 0;
            for (let j = i + 1; j < lines.length; j++) {
                if (lines[j].startsWith('for ')) depth++;
                if (lines[j].startsWith('next ')) {
                    if (depth === 0) {
                        nextLineIndex = j;
                        break;
                    }
                    depth--;
                }
            }
            
            // Execute the loop with proper step handling
            let loopVal = startVal;
            
            // Determine loop condition based on step direction
            const shouldContinue = (stepValue > 0) ? 
                () => loopVal <= endVal : 
                () => loopVal >= endVal;
            
            while (shouldContinue()) {
                // Set the loop variable - trace this as if it's an assignment on the for line
                this.variables[loopVar] = loopVal;
                const forLineChanges = {};
                forLineChanges[loopVar] = loopVal;
                this.addTraceEntry(i + 1, this.variables, '', forLineChanges);
                
                // Execute loop body
                for (let bodyLine = i + 1; bodyLine < nextLineIndex; bodyLine++) {
                    const bodyLineCode = lines[bodyLine];
                    const bodyLineNum = bodyLine + 1;
                    
                    // Check if this line is a nested control structure
                    if (bodyLineCode.startsWith('if ') && bodyLineCode.includes(' then')) {
                        // Handle nested if statement
                        bodyLine = this.handleIfStatement(lines, bodyLine) - 1; // -1 because the for loop will increment
                    } else if (bodyLineCode.startsWith('switch ')) {
                        // Handle nested switch statement
                        bodyLine = this.handleSwitchStatement(lines, bodyLine) - 1;
                    } else if (bodyLineCode.startsWith('while ')) {
                        // Handle nested while loop
                        bodyLine = this.handleWhileLoop(lines, bodyLine) - 1;
                    } else if (bodyLineCode === 'do') {
                        // Handle nested do-until loop
                        bodyLine = this.handleDoUntilLoop(lines, bodyLine) - 1;
                    } else if (bodyLineCode.startsWith('for ') && bodyLineCode.includes(' to ')) {
                        // Handle nested for loop
                        bodyLine = this.handleForLoop(lines, bodyLine) - 1;
                    } else {
                        // Regular statement
                        const result = this.executeStatement(bodyLineCode, bodyLineNum, this.variables);
                        if (result.shouldTrace && (Object.keys(result.changedVariables || {}).length > 0 || result.output)) {
                            this.addTraceEntry(bodyLineNum, this.variables, result.output, result.changedVariables);
                        }
                    }
                }
                
                // Increment by step value
                loopVal += stepValue;
            }
            
            // Return the position after the next statement
            return nextLineIndex + 1;
        }

        handleSwitchStatement(lines, i) {
            // Switch statement: switch variableName:
            const line = lines[i];
            
            // Extract the switch variable (format: "switch varName:")
            const switchMatch = line.match(/switch\s+(\w+):/);
            if (!switchMatch) {
                return i + 1; // Skip if invalid syntax
            }
            
            const switchVar = switchMatch[1];
            const switchValue = this.variables[switchVar]; // Get raw value, not parsed
            
            // Find all case statements and default, plus endswitch
            let endswitchIndex = -1;
            let caseIndices = [];
            let defaultIndex = -1;
            let depth = 0;
            
            for (let j = i + 1; j < lines.length; j++) {
                const currentLine = lines[j].trim();
                
                if (currentLine.startsWith('switch ')) depth++;
                if (currentLine === 'endswitch') {
                    if (depth === 0) {
                        endswitchIndex = j;
                        break;
                    }
                    depth--;
                } else if (currentLine.startsWith('case ') && depth === 0) {
                    // Extract case value (format: 'case "value":' or 'case value:')
                    const caseMatch = currentLine.match(/case\s+(.+?):/);
                    if (caseMatch) {
                        const caseValue = caseMatch[1].trim();
                        // Remove quotes if present
                        const cleanCaseValue = caseValue.startsWith('"') && caseValue.endsWith('"') 
                            ? caseValue.slice(1, -1) 
                            : caseValue;
                        
                        caseIndices.push({
                            index: j,
                            value: cleanCaseValue
                        });
                    }
                } else if (currentLine === 'default:' && depth === 0) {
                    defaultIndex = j;
                }
            }
            
            // Find which case matches the switch value
            let matchedCaseIndex = -1;
            let executionStart = -1;
            let executionEnd = endswitchIndex;
            
            // Convert switch value to string for comparison
            const switchValueStr = String(switchValue);
            
            for (let k = 0; k < caseIndices.length; k++) {
                if (caseIndices[k].value === switchValueStr) {
                    matchedCaseIndex = k;
                    executionStart = caseIndices[k].index + 1;
                    
                    // Find execution end (next case or default or endswitch)
                    if (k + 1 < caseIndices.length) {
                        executionEnd = caseIndices[k + 1].index;
                    } else if (defaultIndex !== -1 && defaultIndex > caseIndices[k].index) {
                        executionEnd = defaultIndex;
                    } else {
                        executionEnd = endswitchIndex;
                    }
                    break;
                }
            }
            
            // If no case matched and there's a default
            if (matchedCaseIndex === -1 && defaultIndex !== -1) {
                executionStart = defaultIndex + 1;
                executionEnd = endswitchIndex;
            }
            
            // Execute the matching block
            if (executionStart !== -1) {
                for (let bodyLine = executionStart; bodyLine < executionEnd; bodyLine++) {
                    const bodyLineCode = lines[bodyLine];
                    const bodyLineNum = bodyLine + 1;
                    
                    // Check if this line is a nested control structure
                    if (bodyLineCode.startsWith('if ') && bodyLineCode.includes(' then')) {
                        bodyLine = this.handleIfStatement(lines, bodyLine) - 1;
                    } else if (bodyLineCode.startsWith('switch ')) {
                        bodyLine = this.handleSwitchStatement(lines, bodyLine) - 1;
                    } else if (bodyLineCode.startsWith('while ')) {
                        bodyLine = this.handleWhileLoop(lines, bodyLine) - 1;
                    } else if (bodyLineCode === 'do') {
                        bodyLine = this.handleDoUntilLoop(lines, bodyLine) - 1;
                    } else if (bodyLineCode.startsWith('for ') && bodyLineCode.includes(' to ')) {
                        bodyLine = this.handleForLoop(lines, bodyLine) - 1;
                    } else {
                        // Regular statement
                        const result = this.executeStatement(bodyLineCode, bodyLineNum, this.variables);
                        if (result.shouldTrace && (Object.keys(result.changedVariables || {}).length > 0 || result.output)) {
                            this.addTraceEntry(bodyLineNum, this.variables, result.output, result.changedVariables);
                        }
                    }
                }
            }
            
            // Return the position after the endswitch statement
            return endswitchIndex + 1;
        }
    }
