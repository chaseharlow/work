
// Constants for styles and dimensions
const styles = {
    bodyFont: 'Arial, sans-serif',
    backgroundColor: '#e0f7fa',
    hillGradient: 'linear-gradient(to bottom right, #8bc34a, #f0e68c)',
    poolColor: '#2196f3',
    hillHeight: '300px',
    poolHeight: '50px',
    poolWidth: '100px',
};

// Create the main elements
const body = document.body;
body.style.fontFamily = styles.bodyFont;
body.style.textAlign = 'center';
body.style.backgroundColor = styles.backgroundColor;

// Title
const title = createElement('h1', {}, 'Pool and Hill Adjuster');
body.appendChild(title);

// Create hill
const hill = createDiv('100%', styles.hillHeight, { background: styles.hillGradient });
hill.style.transformOrigin = 'bottom';
hill.style.position = 'relative';
body.appendChild(hill);

// Create slope indicator
const slopeIndicator = createDiv('2px', '100px', { backgroundColor: 'red' });
slopeIndicator.style.position = 'absolute';
slopeIndicator.style.left = '50%';
slopeIndicator.style.transform = 'translateX(-50%) rotate(0deg)';
hill.appendChild(slopeIndicator);

// Create pool
const pool = createDiv(styles.poolWidth, styles.poolHeight, { backgroundColor: styles.poolColor });
pool.style.position = 'absolute';
pool.style.bottom = '0';
pool.style.left = '50%';
pool.style.transform = 'translateX(-50%)';
body.appendChild(pool);

// Controls container
const controls = createElement('div', { margin: '20px' });
body.appendChild(controls);

// State variables
let slope = 0, poolHeight = parseInt(styles.poolHeight), poolSize = parseInt(styles.poolWidth), animationDuration = 300;

// Create sound function
function playSound() {
    new Audio('https://www.soundjay.com/button/beep-07.wav').play();
}

// Utility function to create a div with specific styles
function createDiv(width, height, styles) {
    const div = createElement('div', { width, height });
    Object.assign(div.style, styles);
    return div;
}

// Helper to create elements with optional styles and content
function createElement(tag, styles = {}, content = '') {
    const element = document.createElement(tag);
    Object.assign(element.style, styles);
    element.textContent = content;
    return element;
}

// Slope functions
function changeSlope(delta) {
    slope += delta;
    updateSlope();
    playSound();
}

// Pool height functions
function changePoolHeight(delta) {
    poolHeight = Math.max(0, poolHeight + delta);
    updatePoolHeight();
    playSound();
}

// Pool size functions
function changePoolSize(delta) {
    poolSize = Math.max(10, poolSize + delta * 10);
    updatePoolSize();
    playSound();
}

// Update functions
function updateSlope() {
    hill.style.transform = `skewY(${slope}deg)`;
    updateSlopeIndicator();
    changeHillColor();
    document.getElementById('slopeValue').textContent = slope;
}

function updateSlopeIndicator() {
    slopeIndicator.style.transform = `translateX(-50%) rotate(${slope}deg)`;
}

function changeHillColor() {
    const greenValue = Math.min(Math.max(255 - slope * 5, 0), 255);
    hill.style.backgroundColor = `rgb(0, ${greenValue}, 0)`;
}

function updatePoolHeight() {
    pool.style.height = `${poolHeight}px`;
    pool.style.bottom = `${poolHeight}px`;
    document.getElementById('poolHeightValue').textContent = poolHeight;
}

function updatePoolSize() {
    pool.style.width = `${poolSize}px`;
    document.getElementById('poolSizeValue').textContent = poolSize;
}

// Rain simulation
function simulateRain() {
    const rainAmount = Math.floor(Math.random() * 100) + 1; // Random rainfall between 1 and 100
    const waterReached = Math.max(0, rainAmount - Math.abs(slope)); // Simple calculation based on slope
    alert(`Rainfall: ${rainAmount} mm\nWater reaching the pool: ${waterReached} mm`);
}

// Create controls
function createControl(label, changeFunc, valueId) {
    const container = createElement('div');
    
    container.appendChild(createElement('h2', {}, label));

    const increaseButton = createElement('button', {}, 'Increase');
    increaseButton.onclick = () => changeFunc(1);
    container.appendChild(increaseButton);

    const decreaseButton = createElement('button', {}, 'Decrease');
    decreaseButton.onclick = () => changeFunc(-1);
    container.appendChild(decreaseButton);

    const input = createElement('input', { type: 'number', placeholder: 'Enter value' });
    container.appendChild(input);

    const setButton = createElement('button', {}, 'Set');
    setButton.onclick = () => {
        const inputValue = parseInt(input.value);
        if (!isNaN(inputValue)) {
            changeFunc(inputValue);
        }
    };
    container.appendChild(setButton);

    const valueDisplay = createElement('span', { id: valueId }, '0');
    container.appendChild(valueDisplay);

    controls.appendChild(container);
}

// Create controls sections
createControl('Adjust Hill Slope', changeSlope, 'slopeValue');
createControl('Adjust Pool Height', changePoolHeight, 'poolHeightValue');
createControl('Adjust Pool Size', changePoolSize, 'poolSizeValue');

// Rain button
const rainButton = createElement('button', {}, 'Make it Rain!');
rainButton.onclick = simulateRain;
controls.appendChild(rainButton);

// Animation duration input
const animationInput = createElement('input', { type: 'number', placeholder: 'Animation Duration (ms)' });
controls.appendChild(animationInput);

const setAnimationButton = createElement('button', {}, 'Set Animation Duration');
setAnimationButton.onclick = () => {
    const durationValue = parseInt(animationInput.value);
    if (!isNaN(durationValue) && durationValue > 0) {
        animationDuration = durationValue;
        hill.style.transition = `transform ${animationDuration}ms`;
        pool.style.transition = `height ${animationDuration}ms, width ${animationDuration}ms`;
    }
};
controls.appendChild(setAnimationButton);

// Reset function
function resetValues() {
    if (confirm("Are you sure you want to reset to default values?")) {
        slope = 0;
        poolHeight = parseInt(styles.poolHeight);
        poolSize = parseInt(styles.poolWidth);
        updateSlope();
        updatePoolHeight();
        updatePoolSize();
    }
}

// Create reset button
const resetButton = createElement('button', {}, 'Reset to Defaults');
resetButton.onclick = resetValues;
controls.appendChild(resetButton);

// Help section
const help = createElement('div', {}, `
    <h3>Help</h3>
    <p>Use the buttons to adjust the hill slope, pool height, and pool size.</p>
    <p>Change the pool color and animation duration as needed.</p>
    <p>Click "Make it Rain!" to simulate rainfall and see how much water reaches the pool based on the slope.</p>
`);
controls.appendChild(help);

