// ============================================
// STATE MANAGEMENT
// ============================================

// Object to store both selected colors
const selected = {color1: null, color2:null};

// Game state to track mode, target color, and score
const gameState = {
    mode: 'practice',
    targetColor: null,
    score: 0
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

        // Store the color and update the display
        selected[target] = color;
        document.getElementById(`${target}-display`).style.backgroundColor = color;
        document.getElementById(`${target}-display`).innerHTML = '';
        
        // Update available colors in the other section
        updateAvailableColors(target, color);
    });
});

// ============================================
// PRACTICE MODE - MIX & RESET BUTTONS
// ============================================

// Mix button - combines the two colors
document.getElementById('mix-btn').addEventListener('click', function() {
    // Check if both colors are selected
    if (!selected.color1 || !selected.color2) {
        alert('Please select both colors before mixing!');
        return;
    }

    // Mix the colors and display the result with animation
    const mixed = getMixedColor(selected.color1, selected.color2);
    const resultDisplay = document.getElementById('result-display');
    
    // Remove any existing animation classes
    resultDisplay.className = 'result-display';
    
    // Trigger animation (choose one: swirl, blend, fade-in, grow, or pour)
    setTimeout(() => {
        resultDisplay.classList.add('blend'); // Change to: swirl, fade-in, grow, or pour
        resultDisplay.style.backgroundColor = mixed;
        resultDisplay.innerHTML = '';
        document.getElementById('result-hex').textContent = `Hex Code: ${mixed}`;
    }, 10);
});

// Reset button - clears everything back to start
document.getElementById('reset-btn').addEventListener('click', function() {
    // Clear stored colors
    selected.color1 = null;
    selected.color2 = null;

    // Remove selected class from all buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    // Reset all displays to original state
    ['color1', 'color2'].forEach(id => {
        document.getElementById(`${id}-display`).style.backgroundColor = '#f9f9f9';
        document.getElementById(`${id}-display`).innerHTML = '<p>No color selected</p>';
    });

    const resultDisplay = document.getElementById('result-display');
    resultDisplay.className = 'result-display'; // Remove animation classes
    resultDisplay.style.backgroundColor = '#f9f9f9';
    resultDisplay.innerHTML = '<p>Select two colors and click "Mix Colors!"</p>';
    document.getElementById('result-hex').textContent = '';

    // Re-enable all color buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    });
});

// ============================================
// GAME MODE - MODE TOGGLE & TARGET GENERATION
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
    document.getElementById('mix-btn').style.display = isPractice ? 'block' : 'none';
    document.getElementById('check-btn').style.display = isPractice ? 'none' : 'block';
    document.getElementById('feedback').textContent = '';

    if (!isPractice) {
        gameState.score = 0;
        document.getElementById('score-display').textContent = `Score: 0`;
        generateNewTarget();
    }
}

// Generate random target color
function generateNewTarget() {
    const allResults = Object.values(mixingResults);
    gameState.targetColor = allResults[Math.floor(Math.random() * allResults.length)];
    document.getElementById('target-display').style.backgroundColor = gameState.targetColor;
    document.getElementById('feedback').textContent = '';
}

// ============================================
// GAME MODE - CHECK ANSWER FUNCTIONALITY
// ============================================

// Check answer button - validates user's color mix against target
document.getElementById('check-btn').addEventListener('click', function() {
    // Ensure both colors are selected
    if (!selected.color1 || !selected.color2) {
        alert('Please select both colors before checking!');
        return;
    }

    // Get the mixed color result
    const mixed = getMixedColor(selected.color1, selected.color2);
    const resultDisplay = document.getElementById('result-display');
    
    // Remove any existing animation classes
    resultDisplay.className = 'result-display';
    
    // Trigger animation
    setTimeout(() => {
        resultDisplay.classList.add('blend'); // Change to: swirl, fade-in, grow, or pour
        resultDisplay.style.backgroundColor = mixed;
        resultDisplay.innerHTML = '';
        document.getElementById('result-hex').textContent = `Hex Code: ${mixed}`;
    }, 10);

    // Check if answer is correct and provide feedback
    const feedback = document.getElementById('feedback');
    if (mixed === gameState.targetColor) {
        // Correct answer
        gameState.score++;
        feedback.textContent = '✓ Correct!';
        feedback.className = 'feedback correct';
        document.getElementById('score-display').textContent = `Score: ${gameState.score}`;
        
        // After 1.5 seconds, load new target and reset selections
        setTimeout(() => {
            generateNewTarget();
            resetSelections();
        }, 1500);
    } else {
        // Incorrect answer
        feedback.textContent = '✗ Try again!';
        feedback.className = 'feedback incorrect';
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
    
    // Remove selected class from all buttons
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset display areas to default state
    ['color1', 'color2'].forEach(id => {
        document.getElementById(`${id}-display`).style.backgroundColor = '#f9f9f9';
        document.getElementById(`${id}-display`).innerHTML = '<p>No color selected</p>';
    });
    
    const resultDisplay = document.getElementById('result-display');
    resultDisplay.className = 'result-display';
    resultDisplay.style.backgroundColor = '#f9f9f9';
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
    return null; // Return null for invalid combinations
}

// Function to update which color buttons are available based on selection
function updateAvailableColors(targetSection, selectedColor) {
    // Don't restrict colors in game mode - keep the challenge!
    if (gameState.mode === 'game') {
        return;
    }
    
    // Get all buttons for the OTHER section (not the one that was just clicked)
    const otherSection = targetSection === 'color1' ? 'color2' : 'color1';
    const buttons = document.querySelectorAll(`[data-target="${otherSection}"]`);
    
    // If no color selected yet, enable all buttons
    if (!selectedColor) {
        buttons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
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
    
    // Enable/disable buttons based on valid combinations
    buttons.forEach(btn => {
        const color = btn.dataset.color;
        if (validColors.has(color)) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        } else {
            btn.disabled = true;
            btn.style.opacity = '0.3';
            btn.style.cursor = 'not-allowed';
        }
    });
}