// Constants for styles and dimensions
const styles = {
    bodyFont: 'Arial, sans-serif',
    backgroundColor: '#b3e5fc',
    hillGradient: 'linear-gradient(to bottom right, #4caf50, #a5d6a7)',
    poolColor: '#2196f3',
    hillHeight: '300px',
    poolHeight: '50px',
    poolWidth: '120px',
    shadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    borderRadius: '10px',
    controlColor: '#ffffff',
    controlShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    textColor: '#263238',
};

// Initialize main elements
const body = document.body;
body.style.fontFamily = styles.bodyFont;
body.style.textAlign = 'center';
body.style.backgroundColor = styles.backgroundColor;
body.style.padding = '20px';

// Create password prompt
const password = prompt("Enter password to access the Pool and Hill Adjuster:");
if (password !== '2134') {
    alert("Incorrect password. Access denied.");
    body.innerHTML = "<h1 style='color: red;'>Access Denied</h1>";
} else {
    // Create title
    const title = createElement('h1', {
        marginBottom: '20px',
        color: styles.textColor,
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
    }, 'Pool and Hill Adjuster');
    body.appendChild(title);

    // Create hill
    const hill = createDiv('100%', styles.hillHeight, {
        background: styles.hillGradient,
        borderBottomLeftRadius: styles.borderRadius,
        borderBottomRightRadius: styles.borderRadius,
        boxShadow: styles.shadow,
        position: 'relative',
    });
    body.appendChild(hill);

    // Create slope indicator
    const slopeIndicator = createDiv('2px', '100px', {
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
    });
    slopeIndicator.style.position = 'absolute';
    slopeIndicator.style.left = '50%';
    slopeIndicator.style.transform = 'translateX(-50%) rotate(0deg)';
    hill.appendChild(slopeIndicator);

    // Create pool
    const pool = createDiv(styles.poolWidth, styles.poolHeight, {
        backgroundColor: styles.poolColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.shadow,
        border: '5px solid rgba(255, 255, 255, 0.7)',
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
    });
    body.appendChild(pool);

    // Controls container
    const controls = createElement('div', {
        backgroundColor: styles.controlColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.controlShadow,
        padding: '20px',
        marginTop: '20px',
    });
    body.appendChild(controls);

    // State variables
    let slope = 0;
    let poolHeight = parseInt(styles.poolHeight);
    let poolSize = parseInt(styles.poolWidth);
    let animationDuration = 300;

    // Sound function
    function playSound() {
        new Audio('https://www.soundjay.com/button/beep-07.wav').play();
    }

    // Utility function to create a div with specific styles
    function createDiv(width, height, additionalStyles) {
        const div = createElement('div', { width, height });
        Object.assign(div.style, additionalStyles);
        return div;
    }

    // Helper function to create elements with optional styles and content
    function createElement(tag, styles = {}, content = '') {
        const element = document.createElement(tag);
        Object.assign(element.style, styles);
        element.textContent = content;
        return element;
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

    // Slope adjustment function
    function changeSlope(delta) {
        slope += delta;
        updateSlope();
        playSound();
    }

    // Pool height adjustment function
    function changePoolHeight(delta) {
        poolHeight = Math.max(0, poolHeight + delta);
        updatePoolHeight();
        playSound();
    }

    // Pool size adjustment function
    function changePoolSize(delta) {
        poolSize = Math.max(10, poolSize + delta * 10);
        updatePoolSize();
        playSound();
    }

    // Enhanced rain simulation logic
    function simulateRain() {
        const rainAmount = Math.floor(Math.random() * 100) + 1; // Random rainfall between 1 and 100 mm
        const effectiveSlope = Math.abs(slope) / 45; // Normalize slope (0 to 1)
        const poolArea = (poolSize / 100) * poolHeight; // Pool area in square meters
        const waterReached = Math.max(0, rainAmount * (1 - effectiveSlope) * poolArea); // Water reaching the pool
        
        alert(`Rainfall: ${rainAmount} mm\nWater reaching the pool: ${Math.round(waterReached)} mm`);
    }

    // Create controls
    function createControl(label, changeFunc, valueId) {
        const container = createElement('div', { marginBottom: '10px' });

        container.appendChild(createElement('h2', { color: styles.textColor }, label));

        const createButton = (text, color, delta) => {
            const button = createElement('button', {
                marginRight: '5px',
                padding: '5px 10px',
                backgroundColor: color,
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
            }, text);
            button.onclick = () => changeFunc(delta);
            return button;
        };

        container.appendChild(createButton('Increase', '#4caf50', 1));
        container.appendChild(createButton('Decrease', '#f44336', -1));

        const input = createElement('input', { type: 'number', placeholder: 'Enter value', style: { marginRight: '5px' } });
        container.appendChild(input);

        const setButton = createElement('button', {
            padding: '5px 10px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        }, 'Set');
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
    const rainButton = createElement('button', {
        padding: '10px 15px',
        backgroundColor: '#ff9800',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '10px',
    }, 'Make it Rain!');
    rainButton.onclick = simulateRain;
    controls.appendChild(rainButton);

    // Animation duration input
    const animationInput = createElement('input', {
        type: 'number',
        placeholder: 'Animation Duration (ms)',
        style: { margin: '5px 0' },
    });
    controls.appendChild(animationInput);

    const setAnimationButton = createElement('button', {
        padding: '5px 10px',
        backgroundColor: '#3f51b5',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }, 'Set Animation Duration');
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

    // Reset button
    const resetButton = createElement('button', {
        padding: '10px 15px',
        backgroundColor: '#9e9e9e',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }, 'Reset to Defaults');
    resetButton.onclick = resetValues;
    controls.appendChild(resetButton);
}
