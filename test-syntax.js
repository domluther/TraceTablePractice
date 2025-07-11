// Test syntax of interpreter
try {
    import('./js/interpreter.js');
    console.log('Syntax is OK');
} catch (error) {
    console.log('Syntax error:', error.message);
}
