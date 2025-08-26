# GCSE Computer Science Practice Site Development Guide

## 🎯 Project Overview

You are tasked with creating a GCSE Computer Science practice website using the provided template. This template provides a complete foundation with consistent styling, navigation, and optional scoring system across all practice sites.

## 📁 Template Structure

The template includes:
- **index.html** - Complete HTML structure with navigation and examples
- **css/styles.css** - Full CSS framework with components and responsive design  
- **js/navigation.js** - Site navigation dropdown functionality
- **js/score-manager.js** - Complete scoring system with duck-themed levels
- **favicon.svg** - Site icon
- **README.md** - Detailed setup instructions

## 🚀 Development Process

### Step 1: Setup and Customization

1. **Copy all template files** to your new site directory
2. **Replace placeholders in index.html**:
   - `SITE_TITLE` → "Data Units Practice | Mr Luther"
   - `SITE_HEADING` → "🔢 Data Units Practice" 
   - `SITE_TAGLINE` → "Master data unit conversions and file size calculations"
   - `SITE_NAME` → "Data Units Practice"

3. **Update navigation** - Add `class="nav-item current"` to your site's link in the nav menu

4. **Enable score system** (if needed):
   - Uncomment score button in HTML
   - Uncomment score JavaScript includes
   - Replace 'your-site-key' with unique identifier (e.g., 'data-units')

### Step 2: Content Development

Remove the example sections and add your site-specific content using these components:

#### **Light Content Sections** (.feature-section)
```html
<div class="feature-section">
    <h3>Section Title</h3>
    <p>Description text...</p>
    
    <div class="sub-section">
        <h4>Subsection</h4>
        <!-- Content here -->
    </div>
</div>
```

#### **Dark Sections** (for code, algorithms, etc.)
```html
<div class="dark-section">
    <div class="dark-header">
        <div class="dark-title">
            <h3>Code Display</h3>
            <span class="dark-subtitle">Algorithm or code content</span>
        </div>
        <div class="dark-header-actions">
            <button class="dark-action-btn">Action</button>
        </div>
    </div>
    <div class="dark-content">
        <div class="line-content">
            <span class="line-number">1</span>algorithm Example
        </div>
        <!-- More lines... -->
    </div>
</div>
```

#### **Data Tables**
```html
<div class="table-section">
    <h3>Table Title</h3>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Column 1</th>
                    <th>Column 2</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Data</td>
                    <td>Value</td>
                    <td><span class="status-badge status-success">Complete</span></td>
                    <td><button class="btn-small">Select</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
```

### Step 3: Interactive Elements

#### **Buttons**
- `.btn` - Primary action buttons
- `.btn-success` - Positive actions (submit, confirm)
- `.btn-warning` - Caution actions (reset, shuffle)  
- `.btn-destructive` - Destructive actions (delete, clear)
- `.btn-small` - Compact buttons for tables/inline use

#### **Status Badges**
- `.status-success` - Completed/correct items
- `.status-warning` - In progress/partial items
- `.status-error` - Failed/incorrect items
- `.status-na` - Not attempted/unavailable items

#### **Score Integration** (if enabled)
```javascript
// Record a score
window.scoreManager.recordScore('exercise-id', userScore, maxScore);

// Get score display for UI
const scoreInfo = window.scoreManager.getScoreDisplay('exercise-id');
// Returns: { text: '85%', className: 'score-good' }

// Use in HTML
<span class="score-display ${scoreInfo.className}">${scoreInfo.text}</span>
```

## 🎨 Design Principles

### **Visual Hierarchy**
- Use `.feature-section` for main content areas
- Use `.dark-section` for code/algorithm displays
- Use `.table-section` for data presentations
- Use `.sub-section` for nested content within main areas

### **Color Coding**
- **Green borders** (#48bb78) - Starting points, selection areas
- **Blue borders** (#667eea) - Information displays, code sections
- **Status colors** - Success (green), warning (orange), error (red), neutral (gray)

### **Responsive Behavior**
- All components are mobile-responsive
- Navigation becomes full-screen on mobile
- Tables scroll horizontally when needed
- Content sections stack vertically on small screens

## 🔧 Common Implementation Patterns

### **Exercise/Practice Items**
1. Use `.feature-section` for exercise selection
2. Use `.dark-section` for problem display
3. Use `.table-section` for input/results
4. Implement scoring with unique exercise IDs

### **Interactive Learning**
1. Use buttons for user actions
2. Use status badges for feedback
3. Update UI dynamically based on user progress
4. Save progress with score manager

### **Content Organization**
1. Group related functionality in sections
2. Use clear headings and descriptions
3. Provide visual feedback for all interactions
4. Maintain consistent spacing and alignment

## 📱 Testing Checklist

- [ ] All placeholders replaced with actual content
- [ ] Navigation shows current site correctly
- [ ] Mobile responsive design works properly
- [ ] All interactive elements function correctly
- [ ] Score system works (if enabled)
- [ ] Content is educationally appropriate for GCSE level
- [ ] Consistent styling with other sites in the platform

## 🎓 Educational Focus

Remember this is for GCSE Computer Science students:
- Keep content age-appropriate (14-16 years)
- Provide clear instructions and feedback
- Use engaging but professional tone
- Include helpful hints and explanations
- Make errors educational rather than punitive
- Support different learning paces and styles

## 🦆 Duck-Themed Level System

If using scores, students progress through:
- 🥚 Egg (0+ points) - Just starting out
- 🐣 Hatchling (50+ points) - Taking your first steps  
- 🐤 Duckling (150+ points) - Learning the basics
- 🦆 Duck (300+ points) - Swimming along nicely
- 🦢 Swan (500+ points) - Graceful and skilled
- 🦅 Eagle (750+ points) - Soaring to new heights
- 👑 Duck King/Queen (1000+ points) - Master of the pond!

Adjust point thresholds in `js/score-manager.js` based on your site's difficulty and expected usage patterns.

## 🎯 Success Criteria

A successful implementation should:
- Provide educational value for GCSE Computer Science topics
- Maintain visual and functional consistency with the template
- Offer appropriate challenge and feedback
- Work seamlessly across devices and browsers
- Integrate smoothly with the broader platform navigation
- Support the long-term vision of connected learning tools
