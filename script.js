// Object to store both selected colors
const selected = {color1: null, color2:null};

// Pre-defined color mixing results (stored as combinations)
const mixingResults = {
    // Red combinations
    '#FF0000-#0000FF': '#800080', // Red + Blue = Purple
    '#FF0000-#FFFF00': '#FF8000', // Red + Yellow = Orange
    '#FF0000-#00FF00': '#808000', // Red + Green = Olive/Brown
    '#FF0000-#FF00FF': '#FF0080', // Red + Magenta = Rose
    '#FF0000-#FFFFFF': '#FF8080', // Red + White = Light Red/Pink
    
    // Blue combinations
    '#0000FF-#FF0000': '#800080', // Blue + Red = Purple
    '#0000FF-#FFFF00': '#00FF00', // Blue + Yellow = Green
    '#0000FF-#00FF00': '#008080', // Blue + Green = Teal/Cyan
    '#0000FF-#FF00FF': '#8000FF', // Blue + Magenta = Blue-Violet
    '#0000FF-#FFFFFF': '#8080FF', // Blue + White = Light Blue
    
    // Yellow combinations
    '#FFFF00-#FF0000': '#FF8000', // Yellow + Red = Orange
    '#FFFF00-#0000FF': '#00FF00', // Yellow + Blue = Green
    '#FFFF00-#00FF00': '#80FF00', // Yellow + Green = Yellow-Green
    '#FFFF00-#FF00FF': '#FF80FF', // Yellow + Magenta = Light Pink
    '#FFFF00-#FFFFFF': '#FFFF80', // Yellow + White = Light Yellow
    
    // Green combinations
    '#00FF00-#FF0000': '#808000', // Green + Red = Olive/Brown
    '#00FF00-#0000FF': '#008080', // Green + Blue = Teal/Cyan
    '#00FF00-#FFFF00': '#80FF00', // Green + Yellow = Yellow-Green
    '#00FF00-#FF00FF': '#80FF80', // Green + Magenta = Light Green
    '#00FF00-#FFFFFF': '#80FF80', // Green + White = Light Green
    
    // Magenta combinations
    '#FF00FF-#FF0000': '#FF0080', // Magenta + Red = Rose
    '#FF00FF-#0000FF': '#8000FF', // Magenta + Blue = Blue-Violet
    '#FF00FF-#FFFF00': '#FF80FF', // Magenta + Yellow = Light Pink
    '#FF00FF-#00FF00': '#80FF80', // Magenta + Green = Light Green
    '#FF00FF-#FFFFFF': '#FF80FF', // Magenta + White = Light Magenta
    
    // White combinations
    '#FFFFFF-#FF0000': '#FF8080', // White + Red = Light Red/Pink
    '#FFFFFF-#0000FF': '#8080FF', // White + Blue = Light Blue
    '#FFFFFF-#FFFF00': '#FFFF80', // White + Yellow = Light Yellow
    '#FFFFFF-#00FF00': '#80FF80', // White + Green = Light Green
    '#FFFFFF-#FF00FF': '#FF80FF'  // White + Magenta = Light Magenta
};


// Add click event to all color buttons at once
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Get the color and which slot it's for from the button
        const color = this.dataset.color;
        const target = this.dataset.target;

        // Store the color and update the display
        selected[target] = color;
        document.getElementById(`${target}-display`).style.backgroundColor = color;
        document.getElementById(`${target}-display`).innerHTML = '';
    });
});

// Mix button - combines the two colors
document.getElementById('mix-btn').addEventListener('click', function() {
    // Check if both colors are selected
    if (!selected.color1 || !selected.color2) {
        alert('Please select both colors before mixing!');
        return;
    }

    // Mix the colors and display the result
    const mixed = getMixedColor(selected.color1, selected.color2);
    document.getElementById('result-display').style.backgroundColor = mixed;
    document.getElementById('result-display').innerHTML ='';
    document.getElementById('result-hex').textContent = `Hex Code: ${mixed}`;
});

// Reset button - clears everything back to start
document.getElementById('reset-btn').addEventListener('click', function() {
    // Clear stored colors
    selected.color1 = null;
    selected.color2 = null;

    // Reset all displays to original state
    ['color1', 'color2'].forEach(id => {
        document.getElementById(`${id}-display`).style.backgroundColor = '#f9f9f9';
        document.getElementById(`${id}-display`).innerHTML = '<p>No color selected</p>';
    });

    document.getElementById('result-display').style.backgroundColor = '#f9f9f9';
    document.getElementById('result-display').innerHTML = '<p>Select two colors and click "Mix Colors!"</p>';
    document.getElementById('result-hex').textContent = '';
});

// Function to get the mixed color from pre-stored results
function getMixedColor(color1, color2) {
    // Create key by combining both colors
    const key = `${color1}-${color2}`;

    // Check if this combination exists in our results
    if (mixingResults[key]) {
        return mixingResults[key];
    }

    // If not found, try the reverse order
    const reverseKey = `${color2}-${color1}`;
    if (mixingResults[reverseKey]) {
        return mixingResults[reverseKey];
    }

    //if same color is selected twice, return that color
    if (color1 === color2) {
        return color1;
    }

    // Fallback (shouldn't happen if all combinations are defined)
    return '#808080'; // Grey as default
}