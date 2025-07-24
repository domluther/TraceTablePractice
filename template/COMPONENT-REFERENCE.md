# Quick Component Reference

## 🏗️ Main Sections

### Light Content Section
```html
<div class="feature-section">
    <h3>Title</h3>
    <p>Description</p>
</div>
```

### Dark Code Section  
```html
<div class="dark-section">
    <div class="dark-header">
        <div class="dark-title">
            <h3>Code Title</h3>
            <span class="dark-subtitle">Subtitle</span>
        </div>
    </div>
    <div class="dark-content">
        <div class="line-content">
            <span class="line-number">1</span>code here
        </div>
    </div>
</div>
```

### Data Table
```html
<div class="table-section">
    <h3>Table Title</h3>
    <div class="table-container">
        <table class="data-table">
            <thead><tr><th>Header</th></tr></thead>
            <tbody><tr><td>Data</td></tr></tbody>
        </table>
    </div>
</div>
```

## 🎨 Buttons & UI

### Buttons
```html
<button class="btn">Primary</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-warning">Warning</button>
<button class="btn btn-destructive">Delete</button>
<button class="btn-small">Small</button>
```

### Status Badges
```html
<span class="status-badge status-success">Complete</span>
<span class="status-badge status-warning">In Progress</span>
<span class="status-badge status-error">Failed</span>
<span class="status-badge status-na">Not Started</span>
```

## 📊 Score System

### Enable in HTML
```html
<!-- Uncomment these lines -->
<button id="scoreButton" class="score-button" onclick="window.scoreManager.showScoreModal()">📊 Scores (0%)</button>

<script src="js/score-manager.js"></script>
<script>
    window.scoreManager = new ScoreManager('your-site-key');
    document.querySelector('.score-button').style.display = 'block';
</script>
```

### Use in JavaScript
```javascript
// Record score
window.scoreManager.recordScore('item-id', score, maxScore);

// Get display info
const info = window.scoreManager.getScoreDisplay('item-id');
// Returns: { text: '85%', className: 'score-good' }
```

## 🎯 Common Patterns

### Exercise Selection
```html
<div class="feature-section">
    <h3>Choose Exercise</h3>
    <div class="table-container">
        <table class="data-table">
            <tr>
                <td>Exercise 1</td>
                <td><span class="score-display score-good">85%</span></td>
                <td><button class="btn-small">Select</button></td>
            </tr>
        </table>
    </div>
</div>
```

### Problem Display
```html
<div class="dark-section">
    <div class="dark-header">
        <div class="dark-title">
            <h3>Problem</h3>
        </div>
    </div>
    <div class="dark-content">
        Problem text or code here...
    </div>
</div>
```

## 📱 Key CSS Classes

- `.feature-section` - Light content areas
- `.dark-section` - Dark content areas  
- `.table-section` - Table containers
- `.sub-section` - Nested content
- `.btn`, `.btn-small` - Buttons
- `.status-badge` - Status indicators
- `.score-display` - Score displays
- `.data-table` - Data tables
