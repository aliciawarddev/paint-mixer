// ============================================
// STATE MANAGEMENT
// ============================================

// Object to store both selected colors
const selected = {color1: null, color2: null};
let lastMixed = {color1: null, color2: null}; 

// Game state to track mode and target color
const gameState = {
    mode: 'practice',
    targetColor: null
};

// ============================================
// DATA - COLOR MIXING COMBINATIONS
// ============================================

// Pre-defined color mixing results (stored as combinations)
const mixingResults = {
    // Primary combinations
    '#1F4F99-#FF361C': '#823A84', // Blue + Red = Purple
    '#FF361C-#1F4F99': '#823A84', // Red + Blue = Purple
    '#FF361C-#FEFF01': '#FF851E', // Red + Yellow = Orange
    '#FEFF01-#FF361C': '#FF851E', // Yellow + Red = Orange
    '#FEFF01-#1F4F99': '#2A892D', // Yellow + Blue = Green
    '#1F4F99-#FEFF01': '#2A892D', // Blue + Yellow = Green
    
    // Secondary combinations with red
    '#FF361C-#823A84': '#E01F34', // Red + Purple = Dark Red
    '#823A84-#FF361C': '#E01F34', // Purple + Red = Dark Red
    '#FF361C-#FF851E': '#FE531B', // Red + Orange = Red-Orange
    '#FF851E-#FF361C': '#FE531B', // Orange + Red = Red-Orange
    
    // Secondary combinations with blue
    '#1F4F99-#2A892D': '#0173B1', // Blue + Green = Blue-Green
    '#2A892D-#1F4F99': '#0173B1', // Green + Blue = Blue-Green
    '#1F4F99-#823A84': '#3D317B', // Blue + Purple = Blue-Purple
    '#823A84-#1F4F99': '#3D317B', // Purple + Blue = Blue-Purple
    
    // Secondary combinations with yellow
    '#FEFF01-#2A892D': '#AEB71E', // Yellow + Green = Yellow-Green
    '#2A892D-#FEFF01': '#AEB71E', // Green + Yellow = Yellow-Green
    '#FEFF01-#FF851E': '#FDA230', // Yellow + Orange = Yellow-Orange
    '#FF851E-#FEFF01': '#FDA230'  // Orange + Yellow = Yellow-Orange
};

// ============================================
// COLOR NAMES MAPPING
// ============================================

const colorNames = {
    '#FF361C': 'Red',
    '#1F4F99': 'Blue',
    '#FEFF01': 'Yellow',
    '#823A84': 'Purple',
    '#FF851E': 'Orange',
    '#2A892D': 'Green',
    '#E01F34': 'Dark Red',
    '#FE531B': 'Red-Orange',
    '#0173B1': 'Blue-Green',
    '#3D317B': 'Blue-Purple',
    '#AEB71E': 'Yellow-Green',
    '#FDA230': 'Yellow-Orange'
};

// ============================================
// COLOR SELECTION - EVENT LISTENERS
// ============================================

// Color button click handlers with animation
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const color = this.dataset.color;
        const target = this.dataset.target;

        // Remove selected class from other buttons in same section
        document.querySelectorAll(`[data-target="${target}"]`).forEach(b => {
            b.classList.remove('selected');
        });

        // Add selected class to clicked button
        this.classList.add('selected');

        // Store the color
        selected[target] = color;
        
        // Update available colors in the other section
        updateAvailableColors(target, color);
        
        // Reset lastMixed when selection changes
        lastMixed.color1 = null;
        lastMixed.color2 = null;
    });
});

// ============================================
// MIX & RESET BUTTONS
// ============================================

// Mix button - combines the two colors
document.getElementById('mix-btn').addEventListener('click', function() {
    // Check if both colors are selected
    if (!selected.color1 || !selected.color2) {
        alert('Please select both colors before mixing!');
        return;
    }

    // Prevent re-mixing the same combination
    if (selected.color1 === lastMixed.color1 && selected.color2 === lastMixed.color2) {
        return; // Do nothing if same colors
    }

    // Store current selection
    lastMixed.color1 = selected.color1;
    lastMixed.color2 = selected.color2;

    // Mix the colors and display the result with animation
    const mixed = getMixedColor(selected.color1, selected.color2);
    const resultDisplay = document.getElementById('result-display');
    
    // Remove any existing animation classes
    resultDisplay.className = 'result-display';
    
    // Trigger animation
    setTimeout(() => {
        resultDisplay.classList.add('blend');
        resultDisplay.style.backgroundColor = mixed;
        resultDisplay.innerHTML = '';
        document.getElementById('result-hex').textContent = colorNames[mixed] || 'Unknown Color';
    }, 10);

    // Game mode: check if answer is correct
    if (gameState.mode === 'game') {
        const feedback = document.getElementById('feedback');
        if (mixed === gameState.targetColor) {
            // Correct answer
            feedback.textContent = '✓ Correct!';
            feedback.className = 'feedback correct';
            
            // Show next button
            document.getElementById('next-section').style.display = 'flex';
        } else {
            // Incorrect answer
            feedback.textContent = '✗ Not quite! Try a different combination.';
            feedback.className = 'feedback incorrect';
            
            // Auto-reset after 2.5 seconds on incorrect answer
            setTimeout(() => {
                resetSelections();
                feedback.textContent = '';
                feedback.className = 'feedback';
            }, 2500);
        }
    }
});

// Reset button - clears everything back to start state
document.getElementById('reset-btn').addEventListener('click', function() {
    // Clear stored colors
    selected.color1 = null;
    selected.color2 = null;

    // Remove selected class from all buttons and re-enable them
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
        btn.style.opacity = '1';
    });

    // Reset result display
    const resultDisplay = document.getElementById('result-display');
    resultDisplay.className = 'result-display';
    resultDisplay.style.backgroundColor = '';
    resultDisplay.innerHTML = '<p>Select two colours to mix</p>';
    document.getElementById('result-hex').textContent = '';

    // Reset feedback message
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';

    // Reset lastMixed
    lastMixed.color1 = null;
    lastMixed.color2 = null;
});

// ============================================
// MODE TOGGLE & TARGET GENERATION
// ============================================

// Mode toggle functionality
document.getElementById('practice-mode-btn').addEventListener('click', () => setMode('practice'));
document.getElementById('game-mode-btn').addEventListener('click', () => setMode('game'));

// Set mode and update UI
function setMode(mode) {
    gameState.mode = mode;
    const isPractice = mode === 'practice';
    
    document.getElementById('practice-mode-btn').classList.toggle('active', isPractice);
    document.getElementById('game-mode-btn').classList.toggle('active', !isPractice);
    document.getElementById('target-section').style.display = isPractice ? 'none' : 'block';
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('next-section').style.display = 'none';

    // Update reset section margin based on mode
    if (isPractice) {
        document.querySelector('.reset-section').classList.add('no-feedback');
        document.querySelector('.reset-section').classList.remove('game-mode');
    } else {
        document.querySelector('.reset-section').classList.remove('no-feedback');
        document.querySelector('.reset-section').classList.add('game-mode');
    }

    // Reset selections when switching modes
    selected.color1 = null;
    selected.color2 = null;
    
    // Reset lastMixed
    lastMixed.color1 = null;
    lastMixed.color2 = null;

    // Remove selected class from all buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
        btn.style.opacity = '1';
    });

    // Reset result display
    const resultDisplay = document.getElementById('result-display');
    resultDisplay.className = 'result-display';
    resultDisplay.style.backgroundColor = '';
    resultDisplay.innerHTML = '<p>Select two colours to mix</p>';
    document.getElementById('result-hex').textContent = '';

    if (!isPractice) {
        generateNewTarget();
    }
}

// Generate random target color
function generateNewTarget() {
    const allResults = Object.values(mixingResults);
    // Filter out primary colors (results of mixing same color)
    const validTargets = allResults.filter(color => 
        color !== '#FF361C' && // Red
        color !== '#1F4F99' && // Blue
        color !== '#FEFF01' && // Yellow
        color !== '#823A84' && // Purple
        color !== '#FF851E' && // Orange
        color !== '#2A892D'    // Green
    );
    gameState.targetColor = validTargets[Math.floor(Math.random() * validTargets.length)];
    document.getElementById('target-display').style.backgroundColor = gameState.targetColor;
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
}

// ============================================
// NEXT BUTTON
// ============================================

// Next button - loads new target in game mode
document.getElementById('next-btn').addEventListener('click', function() {
    generateNewTarget();
    resetSelections();
    document.getElementById('feedback').textContent = '';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('next-section').style.display = 'none';
});

// Hint button - shows which colors to mix for the target
document.getElementById('hint-btn').addEventListener('click', function() {
    if (!gameState.targetColor) return;
    
    // Find which colors mix to make the target
    let hintColors = [];
    for (let combo in mixingResults) {
        if (mixingResults[combo] === gameState.targetColor) {
            hintColors = combo.split('-');
            break;
        }
    }
    
    if (hintColors.length === 2) {
        const color1Name = colorNames[hintColors[0]];
        const color2Name = colorNames[hintColors[1]];
        
        // Create or update hint message element
        let hintMessage = document.getElementById('hint-message');
        if (!hintMessage) {
            hintMessage = document.createElement('p');
            hintMessage.id = 'hint-message';
            hintMessage.className = 'feedback';
            // Insert after the hint button
            this.parentNode.insertBefore(hintMessage, this.nextSibling);
        }
        
        hintMessage.textContent = `Hint: Try mixing ${color1Name} and ${color2Name}`;
        hintMessage.style.color = '#666';
        hintMessage.style.display = 'block';
        
        // Clear hint after 4 seconds
        setTimeout(() => {
            if (hintMessage.textContent.includes('Hint:')) {
                hintMessage.textContent = '';
                hintMessage.style.display = 'none';
            }
        }, 4000);
    }
});



// ============================================
// UTILITY FUNCTIONS
// ============================================

// Helper function to reset color selections
function resetSelections() {
    // Clear stored color values
    selected.color1 = null;
    selected.color2 = null;
    
    // Reset lastMixed
    lastMixed.color1 = null;
    lastMixed.color2 = null;
    
    // Remove selected class from all buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
        btn.disabled = false;
        btn.style.opacity = '1';
    });
    
    const resultDisplay = document.getElementById('result-display');
    resultDisplay.className = 'result-display';
    resultDisplay.style.backgroundColor = '';
    resultDisplay.innerHTML = '<p>Select two colours to mix</p>';
    document.getElementById('result-hex').textContent = '';
}

// Function to get the mixed color from pre-stored results
function getMixedColor(color1, color2) {
    // Create key by combining both colors
    const key = `${color1}-${color2}`;

    // Check if this combination exists in our results
    if (mixingResults[key]) {
        return mixingResults[key];
    }

    // If not found, try the reverse order (e.g., color2-color1)
    const reverseKey = `${color2}-${color1}`;
    if (mixingResults[reverseKey]) {
        return mixingResults[reverseKey];
    }

    // If same color is selected twice, return that color
    if (color1 === color2) {
        return color1;
    }

    // Fallback (shouldn't happen if all combinations are defined)
    return null;
}

// Function to update which color buttons are available based on selection
function updateAvailableColors(targetSection, selectedColor) {
    // Get all buttons for the OTHER section (not the one that was just clicked)
    const otherSection = targetSection === 'color1' ? 'color2' : 'color1';
    const buttons = document.querySelectorAll(`[data-target="${otherSection}"]`);
    
    // If no color selected yet, enable all buttons
    if (!selectedColor) {
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
        return;
    }
    
    // Find all valid combinations for the selected color
    const validColors = new Set();
    Object.keys(mixingResults).forEach(key => {
        if (key.includes(selectedColor)) {
            // Extract the other color from the key
            const colors = key.split('-');
            const otherColor = colors[0] === selectedColor ? colors[1] : colors[0];
            validColors.add(otherColor);
        }
    });
    
    // Also allow mixing the same color with itself
    validColors.add(selectedColor);
    
    // Enable/disable buttons based on valid combinations
    buttons.forEach(btn => {
        const color = btn.dataset.color;
        if (validColors.has(color)) {
            btn.disabled = false;
            btn.style.opacity = '1';
        } else {
            btn.disabled = true;
            btn.style.opacity = '0.3';
        }
    });
}

// Initialize practice mode as default when page loads
document.addEventListener('DOMContentLoaded', function() {
    setMode('practice');
});