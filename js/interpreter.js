// Comprehensive Interpreter module for executing pseudocode programs and generating trace tables

export class Interpreter {
    constructor() {
        this.variables = {};
        this.outputs = [];
        this.trace = [];
        this.inputs = [];
        this.inputIndex = 0;
        this.currentProgram = null;
    }

    executeProgram(code, program) {
        // Initialize state
        this.variables = {};
        this.outputs = [];
        this.trace = [];
        this.inputs = program.inputs || [];
        this.inputIndex = 0;
        this.currentProgram = program;

        // Simple interpreter for trace table generation
        const lines = code.split('\n').map(line => line.trim()).filter(line => line);
        
        let i = 0;
        
        while (i < lines.length) {
            const line = lines[i];
            const lineNum = i + 1;
            
            if (line.startsWith('if ') && line.includes(' then')) {
                // Handle if statement - condition evaluation doesn't change variables
                i = this.handleIfStatement(lines, i);
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
                       line.startsWith('elseif ') || line === 'endwhile' || line.startsWith('until ')) {
                // Skip control flow statements as they're handled by their parent structures
                i++;
            } else {
                // Regular statement - only trace if it actually changes variables OR produces output
                const result = this.executeStatement(line, lineNum, this.variables);
                if (result.shouldTrace && (Object.keys(result.changedVariables || {}).length > 0 || result.output)) {
                    this.addTraceEntry(lineNum, this.variables, result.output, result.changedVariables);
                }
                i++;
            }
        }
        
        return {
            trace: this.trace,
            variables: Object.keys(this.variables),
            outputs: this.outputs
        };
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
        } else if (line.includes('=') && !line.includes('==') && !line.includes('!=') && !line.includes('<=') && !line.includes('>=')) {
            // Assignment
            const parts = line.split('=');
            const varName = parts[0].trim();
            const value = parts[1].trim();
            
            // Check if this is an array element assignment like "nums[0] = 10"
            if (varName.includes('[') && varName.includes(']')) {
                const arrayMatch = varName.match(/(\w+)\[(\d+)\]/);
                if (arrayMatch) {
                    const arrayName = arrayMatch[1];
                    const index = parseInt(arrayMatch[2]);
                    
                    if (vars[arrayName] && Array.isArray(vars[arrayName])) {
                        if (!isNaN(value)) {
                            vars[arrayName][index] = parseInt(value);
                        } else if (value.startsWith('"') && value.endsWith('"')) {
                            vars[arrayName][index] = value.slice(1, -1);
                        } else if (vars[value] !== undefined) {
                            vars[arrayName][index] = vars[value];
                        }
                        changeRecord[arrayName] = vars[arrayName];
                    }
                }
            } else if (value.startsWith('input(')) {
                // Input statement - use predefined input value
                if (this.inputIndex < this.inputs.length) {
                    vars[varName] = this.inputs[this.inputIndex];
                    changeRecord[varName] = vars[varName];
                    this.inputIndex++;
                } else {
                    vars[varName] = "undefined_input";
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.startsWith('int(input(')) {
                // int(input()) statement - use predefined input value and convert to integer
                if (this.inputIndex < this.inputs.length) {
                    vars[varName] = parseInt(this.inputs[this.inputIndex]);
                    changeRecord[varName] = vars[varName];
                    this.inputIndex++;
                } else {
                    vars[varName] = 0;
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.startsWith('random(')) {
                // random() statement - use predefined random value
                if (this.currentProgram.randomValue !== undefined) {
                    vars[varName] = this.currentProgram.randomValue;
                } else {
                    vars[varName] = Math.floor(Math.random() * 10) + 1;
                }
                changeRecord[varName] = vars[varName];
            } else if (value.includes('.left(')) {
                // String left method - extract left N characters
                const match = value.match(/(\w+)\.left\((\d+)\)/);
                if (match && vars[match[1]] !== undefined) {
                    const sourceVar = match[1];
                    const length = parseInt(match[2]);
                    vars[varName] = vars[sourceVar].toString().substring(0, length);
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.includes('.right(')) {
                // String right method - extract right N characters
                const match = value.match(/(\w+)\.right\((\d+)\)/);
                if (match && vars[match[1]] !== undefined) {
                    const sourceVar = match[1];
                    const length = parseInt(match[2]);
                    const str = vars[sourceVar].toString();
                    vars[varName] = str.substring(str.length - length);
                    changeRecord[varName] = vars[varName];
                }
            } else if (value.includes('.substring(')) {
                // String substring method - extract substring(start, length)
                const match = value.match(/(\w+)\.substring\((\d+),\s*(\d+)\)/);
                if (match && vars[match[1]] !== undefined) {
                    const sourceVar = match[1];
                    const start = parseInt(match[2]);
                    const length = parseInt(match[3]);
                    vars[varName] = vars[sourceVar].toString().substring(start, start + length);
                    changeRecord[varName] = vars[varName];
                }
            } else if (value === '""') {
                vars[varName] = '';
                changeRecord[varName] = vars[varName];
            } else if (value.startsWith('"') && value.endsWith('"')) {
                // String literal
                vars[varName] = value.slice(1, -1);
                changeRecord[varName] = vars[varName];
            } else if (!isNaN(value)) {
                // Numeric literal - use parseFloat to handle both integers and decimals
                vars[varName] = parseFloat(value);
                changeRecord[varName] = vars[varName];
            } else if (this.isStringConcatenation(value, vars)) {
                // String concatenation
                vars[varName] = this.evaluateStringConcatenation(value, vars);
                changeRecord[varName] = vars[varName];
            } else if (this.isArithmeticExpression(value)) {
                // Arithmetic expression
                vars[varName] = this.evaluateArithmeticExpression(value, vars);
                changeRecord[varName] = vars[varName];
            } else if (vars[value] !== undefined) {
                // Variable assignment
                vars[varName] = vars[value];
                changeRecord[varName] = vars[varName];
            } else if (value.includes('[') && value.includes(']')) {
                // Array access
                const arrayValue = this.getVariableValue(value, vars);
                if (arrayValue !== undefined) {
                    vars[varName] = arrayValue;
                    changeRecord[varName] = vars[varName];
                }
            }
        } else if (line.startsWith('print(')) {
            // Print statement - doesn't change variables, only produces output
            const content = line.substring(6, line.length - 1);
            if (content.startsWith('"') && content.endsWith('"')) {
                output = content.slice(1, -1);
            } else if (content.includes('+')) {
                // String concatenation or complex expression
                const parts = content.split('+').map(p => p.trim());
                let result = '';
                parts.forEach(part => {
                    if (part.startsWith('"') && part.endsWith('"')) {
                        result += part.slice(1, -1);
                    } else if (part.includes('.upper')) {
                        const varName = part.split('.')[0];
                        if (vars[varName] !== undefined) {
                            result += vars[varName].toString().toUpperCase();
                        }
                    } else if (part.includes('.lower')) {
                        const varName = part.split('.')[0];
                        if (vars[varName] !== undefined) {
                            result += vars[varName].toString().toLowerCase();
                        }
                    } else if (part.includes('.length')) {
                        const varName = part.split('.')[0];
                        if (vars[varName] !== undefined) {
                            result += vars[varName].toString().length.toString();
                        }
                    } else if (part.includes('.left(')) {
                        const match = part.match(/(\w+)\.left\((\d+)\)/);
                        if (match && vars[match[1]] !== undefined) {
                            const varName = match[1];
                            const length = parseInt(match[2]);
                            result += vars[varName].toString().substring(0, length);
                        }
                    } else if (part.includes('.right(')) {
                        const match = part.match(/(\w+)\.right\((\d+)\)/);
                        if (match && vars[match[1]] !== undefined) {
                            const varName = match[1];
                            const length = parseInt(match[2]);
                            const str = vars[varName].toString();
                            result += str.substring(str.length - length);
                        }
                    } else if (part.includes('.substring(')) {
                        const match = part.match(/(\w+)\.substring\((\d+),\s*(\d+)\)/);
                        if (match && vars[match[1]] !== undefined) {
                            const varName = match[1];
                            const start = parseInt(match[2]);
                            const length = parseInt(match[3]);
                            result += vars[varName].toString().substring(start, start + length);
                        }
                    } else if (vars[part] !== undefined) {
                        result += vars[part].toString();
                    } else if (part.startsWith('str(') && part.endsWith(')')) {
                        const varName = part.substring(4, part.length - 1);
                        if (vars[varName] !== undefined) {
                            result += vars[varName].toString();
                        }
                    }
                });
                output = result;
            } else if (vars[content] !== undefined) {
                output = vars[content].toString();
            } else if (content.startsWith('str(') && content.endsWith(')')) {
                const varName = content.substring(4, content.length - 1);
                if (vars[varName] !== undefined) {
                    output = vars[varName].toString();
                }
            }
            if (output) this.outputs.push(output);
        }
        
        return { output, shouldTrace, changedVariables: changeRecord };
    }

    getVariableValue(operand, vars) {
        // Helper function to get value from variable or array access
        if (operand.includes('[') && operand.includes(']')) {
            // Array access like nums[i]
            const arrayMatch = operand.match(/(\w+)\[(\w+)\]/);
            if (arrayMatch) {
                const arrayName = arrayMatch[1];
                const indexVar = arrayMatch[2];
                
                if (vars[arrayName] && Array.isArray(vars[arrayName]) && vars[indexVar] !== undefined) {
                    const index = parseInt(vars[indexVar]);
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
        return value.includes('+') && 
               value.split('+').some(part => {
                    const trimmed = part.trim();
                    return (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
                           (vars[trimmed] !== undefined && typeof vars[trimmed] === 'string');
               });
    }

    isArithmeticExpression(value) {
        // Check if the expression contains arithmetic operators
        return value.includes('+') || value.includes('-') || value.includes('*') || 
               value.includes('/') || value.includes('MOD') || value.includes('DIV') ||
               value.includes('(') || value.includes(')');
    }

    evaluateStringConcatenation(value, vars) {
        const parts = value.split('+').map(p => p.trim());
        let result = '';
        parts.forEach(part => {
            if (part.startsWith('"') && part.endsWith('"')) {
                result += part.slice(1, -1);
            } else if (vars[part] !== undefined) {
                result += vars[part].toString();
            } else if (part.startsWith('str(') && part.endsWith(')')) {
                const varName = part.substring(4, part.length - 1);
                if (vars[varName] !== undefined) {
                    result += vars[varName].toString();
                }
            }
        });
        return result;
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
            
            // Find left operand
            let leftStart = pos - 1;
            while (leftStart >= 0 && /[A-Za-z0-9_\[\]]/.test(expression[leftStart])) {
                leftStart--;
            }
            leftStart++;
            
            // Find right operand
            let rightEnd = pos + 1;
            while (rightEnd < expression.length && /[A-Za-z0-9_\[\]]/.test(expression[rightEnd])) {
                rightEnd++;
            }
            
            const leftOperand = expression.substring(leftStart, pos).trim();
            const rightOperand = expression.substring(pos + 1, rightEnd).trim();
            
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
        // Handle array access
        if (operand.includes('[') && operand.includes(']')) {
            const arrayMatch = operand.match(/(\w+)\[(\w+)\]/);
            if (arrayMatch) {
                const arrayName = arrayMatch[1];
                const indexVar = arrayMatch[2];
                
                if (vars[arrayName] && Array.isArray(vars[arrayName])) {
                    const index = vars[indexVar] !== undefined ? parseInt(vars[indexVar]) : parseInt(indexVar);
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
                            result = leftVal / rightVal; // Use floating-point division
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
        // Simple condition evaluation for basic comparisons
        if (condition.includes('>=')) {
            const [left, right] = condition.split('>=').map(s => s.trim());
            let leftVal = vars[left] !== undefined ? vars[left] : left;
            let rightVal = vars[right] !== undefined ? vars[right] : right;
            
            // Handle string methods like .length
            if (left.includes('.length')) {
                const varName = left.split('.')[0];
                if (vars[varName] !== undefined) {
                    leftVal = vars[varName].toString().length;
                }
            } else {
                // Convert to numbers if both values are numeric
                if (!isNaN(leftVal) && !isNaN(rightVal)) {
                    leftVal = parseFloat(leftVal);
                    rightVal = parseFloat(rightVal);
                }
            }
            
            return leftVal >= rightVal;
        } else if (condition.includes('<=')) {
            const [left, right] = condition.split('<=').map(s => s.trim());
            let leftVal = vars[left] !== undefined ? vars[left] : left;
            let rightVal = vars[right] !== undefined ? vars[right] : right;
            
            // Handle string methods like .length
            if (left.includes('.length')) {
                const varName = left.split('.')[0];
                if (vars[varName] !== undefined) {
                    leftVal = vars[varName].toString().length;
                }
            } else {
                // Convert to numbers if both values are numeric
                if (!isNaN(leftVal) && !isNaN(rightVal)) {
                    leftVal = parseFloat(leftVal);
                    rightVal = parseFloat(rightVal);
                }
            }
            
            return leftVal <= rightVal;
        } else if (condition.includes('==')) {
            const [left, right] = condition.split('==').map(s => s.trim());
            let leftVal = vars[left] !== undefined ? vars[left] : left;
            let rightVal = vars[right] !== undefined ? vars[right] : right;
            
            // Handle string literals
            if (leftVal.startsWith && leftVal.startsWith('"') && leftVal.endsWith('"')) {
                leftVal = leftVal.slice(1, -1);
            }
            if (rightVal.startsWith && rightVal.startsWith('"') && rightVal.endsWith('"')) {
                rightVal = rightVal.slice(1, -1);
            }
            
            return leftVal == rightVal;
        } else if (condition.includes('!=')) {
            const [left, right] = condition.split('!=').map(s => s.trim());
            let leftVal = vars[left] !== undefined ? vars[left] : left;
            let rightVal = vars[right] !== undefined ? vars[right] : right;
            
            // Handle string literals
            if (leftVal.startsWith && leftVal.startsWith('"') && leftVal.endsWith('"')) {
                leftVal = leftVal.slice(1, -1);
            }
            if (rightVal.startsWith && rightVal.startsWith('"') && rightVal.endsWith('"')) {
                rightVal = rightVal.slice(1, -1);
            }
            
            return leftVal != rightVal;
        } else if (condition.includes('>')) {
            const [left, right] = condition.split('>').map(s => s.trim());
            let leftVal = vars[left] !== undefined ? vars[left] : left;
            let rightVal = vars[right] !== undefined ? vars[right] : right;
            
            // Handle string methods like .length
            if (left.includes('.length')) {
                const varName = left.split('.')[0];
                if (vars[varName] !== undefined) {
                    leftVal = vars[varName].toString().length;
                }
            } else {
                // Convert to numbers if both values are numeric
                if (!isNaN(leftVal) && !isNaN(rightVal)) {
                    leftVal = parseFloat(leftVal);
                    rightVal = parseFloat(rightVal);
                }
            }
            
            return leftVal > rightVal;
        } else if (condition.includes('<')) {
            const [left, right] = condition.split('<').map(s => s.trim());
            let leftVal = vars[left] !== undefined ? vars[left] : left;
            let rightVal = vars[right] !== undefined ? vars[right] : right;
            
            // Handle string methods like .length
            if (left.includes('.length')) {
                const varName = left.split('.')[0];
                if (vars[varName] !== undefined) {
                    leftVal = vars[varName].toString().length;
                }
            } else {
                // Convert to numbers if both values are numeric
                if (!isNaN(leftVal) && !isNaN(rightVal)) {
                    leftVal = parseFloat(leftVal);
                    rightVal = parseFloat(rightVal);
                }
            }
            
            return leftVal < rightVal;
        }
        
        return false;
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
            for (let bodyLine = executionStart; bodyLine < executionEnd; bodyLine++) {
                const bodyLineCode = lines[bodyLine];
                const bodyLineNum = bodyLine + 1;
                const result = this.executeStatement(bodyLineCode, bodyLineNum, this.variables);
                if (result.shouldTrace && (Object.keys(result.changedVariables || {}).length > 0 || result.output)) {
                    this.addTraceEntry(bodyLineNum, this.variables, result.output, result.changedVariables);
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
            for (let bodyLine = i + 1; bodyLine < endwhileIndex; bodyLine++) {
                const bodyLineCode = lines[bodyLine];
                const bodyLineNum = bodyLine + 1;
                const result = this.executeStatement(bodyLineCode, bodyLineNum, this.variables);
                if (result.shouldTrace && (Object.keys(result.changedVariables || {}).length > 0 || result.output)) {
                    this.addTraceEntry(bodyLineNum, this.variables, result.output, result.changedVariables);
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
        // For loop
        const line = lines[i];
        const forMatch = line.match(/for\s+(\w+)\s*=\s*(\d+)\s+to\s+(\d+)/);
        if (forMatch) {
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
            
            // Execute the loop
            for (let loopVal = startVal; loopVal <= endVal; loopVal++) {
                // Set the loop variable and trace the for line
                this.variables[loopVar] = loopVal;
                const forLineChanges = {};
                forLineChanges[loopVar] = loopVal;
                this.addTraceEntry(i + 1, this.variables, '', forLineChanges);
                
                // Execute loop body
                for (let bodyLine = i + 1; bodyLine < nextLineIndex; bodyLine++) {
                    const bodyLineCode = lines[bodyLine];
                    const bodyLineNum = bodyLine + 1;
                    const result = this.executeStatement(bodyLineCode, bodyLineNum, this.variables);
                    if (result.shouldTrace && (Object.keys(result.changedVariables || {}).length > 0 || result.output)) {
                        this.addTraceEntry(bodyLineNum, this.variables, result.output, result.changedVariables);
                    }
                }
            }
            
            // Return the position after the next statement
            return nextLineIndex + 1;
        }
        
        // If no match, just skip this line
        return i + 1;
    }
}
