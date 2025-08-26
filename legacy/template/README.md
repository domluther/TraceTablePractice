# GCSE Computer Science Site Template

This template provides a consistent look and feel across all GCSE Computer Science practice sites.

## 🚀 Quick Start

1. Copy all files from this template folder to your new site directory
2. Replace the placeholders in `index.html`:
   - `SITE_TITLE` - The title for the browser tab
   - `SITE_HEADING` - The main heading (h1) on the page
   - `SITE_TAGLINE` - The subtitle/description under the heading
   - `SITE_NAME` - Used in the welcome message
3. Update the navigation to mark your current site as active
4. Add your site-specific content
5. Enable score system if needed (see Score System section below)

## 📁 Files Included

### index.html
- Complete HTML structure with navigation
- Placeholder content sections
- Footer with Mr Luther branding
- Navigation JavaScript inclusion
- Score system HTML (commented out by default)

### css/styles.css
- Complete CSS framework with all variables and components
- Responsive design for mobile/desktop
- Navigation styling
- Button system and layouts
- Complete score system styling (hidden by default)
- Ready-to-use color scheme and spacing

### js/navigation.js
- Handles dropdown navigation functionality
- Works across all sites consistently
- Mobile-friendly with proper event handling

### js/score-manager.js
- Complete score tracking system
- Duck-themed level progression
- Local storage for persistence
- Cross-site compatible scoring
- Modal interface for score viewing

## � Score System

The template includes a complete scoring system that can be easily enabled or disabled.

### Enabling Score System

1. **Uncomment the score button** in `index.html`:
   ```html
   <button id="scoreButton" class="score-button" onclick="window.scoreManager.showScoreModal()">📊 Scores (0%)</button>
   ```

2. **Uncomment the JavaScript** at the bottom of `index.html`:
   ```html
   <script src="js/score-manager.js"></script>
   <script>
       window.scoreManager = new ScoreManager('your-site-key');
       document.querySelector('.score-button').style.display = 'block';
   </script>
   ```

3. **Replace 'your-site-key'** with a unique identifier for your site (e.g., 'data-units', 'programming-practice')

### Using Score System in Your Code

```javascript
// Record a score (score out of maxScore)
window.scoreManager.recordScore('exercise-1', 85, 100);

// Get score display info
const scoreInfo = window.scoreManager.getScoreDisplay('exercise-1');
// Returns: { text: '85%', className: 'score-good' }
```

### Duck-Themed Level System

- 🥚 **Egg** (0+ points) - Just starting out
- 🐣 **Hatchling** (50+ points) - Taking your first steps  
- 🐤 **Duckling** (150+ points) - Learning the basics
- 🦆 **Duck** (300+ points) - Swimming along nicely
- 🦢 **Swan** (500+ points) - Graceful and skilled
- 🦅 **Eagle** (750+ points) - Soaring to new heights
- 👑 **Duck King/Queen** (1000+ points) - Master of the pond!

### Customizing Point Thresholds

Edit the `levels` array in `js/score-manager.js` to adjust point requirements for your site's difficulty.

## �🎨 Customization

### Adding Your Site to Navigation
In `index.html`, find the navigation section and add `class="nav-item current"` to your site's link.

Example - for the Data Units site:
```html
<a href="https://convertdataunits.netlify.app/" class="nav-item current">
    <span class="nav-item-title">Data Units</span>
    <span class="nav-item-desc">Convert units and calculate file sizes</span>
</a>
```

### Site URLs in Navigation
Update these URLs to match your deployed sites:
- Trace Tables: `https://trace-table-practice.netlify.app/`
- Programming Practice: `https://input-output-practice.netlify.app/`
- Data Units: `https://convertdataunits.netlify.app/`
- Network Addresses: `https://ipormac.netlify.app/`
- Sort Algorithms: `https://ocrsortvisualiser.netlify.app/`

### Content Sections
Replace the placeholder content in the `.main-section` and `.feature-section` divs with your site-specific content.

### Additional Styling
The CSS includes utility classes for:
- Buttons: `.btn`, `.btn-success`, `.btn-warning`, `.btn-destructive`
- Layouts: `.main-section`, `.feature-section`
- Colors: CSS variables for consistent theming

## 🎯 Features

- ✅ Consistent navigation across all sites
- ✅ Responsive design (mobile + desktop)
- ✅ Professional styling with gradients and shadows
- ✅ Vertical centering for shorter content
- ✅ Footer with Mr Luther branding
- ✅ Easy customization system
- ✅ Accessibility considerations
- ✅ Complete score system with duck-themed levels
- ✅ Cross-site score tracking capability
- ✅ Local storage for score persistence
- ✅ Modal interface for progress viewing
- ✅ Easily enabled/disabled scoring

## 🔧 Development Notes

- All sites will have consistent styling automatically
- Navigation dropdown works on mobile and desktop
- Uses modern CSS features (flexbox, grid, CSS variables)
- JavaScript is vanilla (no dependencies)
- Works with any backend or static site setup

## 📱 Responsive Behavior

- **Desktop**: Navigation in top-left corner
- **Mobile**: Navigation below header, full-screen dropdown
- **Container**: Vertically centered on all screen sizes
- **Typography**: Scales appropriately for different devices
