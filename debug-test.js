// Debug test for string concatenation
const testExpression = '"You won in " + str(attempts) + " attempts!"';
const testVars = { attempts: 3 };

// Simulate parseStringConcatenation
function parseStringConcatenation(value) {
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

const parts = parseStringConcatenation(testExpression);
console.log('Input:', testExpression);
console.log('Parsed parts:', parts);

// Expected: ['"You won in "', 'str(attempts)', '" attempts!"']
