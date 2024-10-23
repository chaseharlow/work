// Constants for styles and dimensions
  styles = {
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
  body = document.body;
body.style.fontFamily = styles.bodyFont;
body.style.textAlign = 'center';
body.style.backgroundColor = styles.backgroundColor;
body.style.padding = '20px';

// Create password prompt
  password = prompt("Enter password to access the Pool and Hill Adjuster:");
 (password !== '2134') {
    alert("Incorrect password. Access denied.");
    body.innerHTML = "<h1 style='color: red;'>Access Denied</h1>";
}   {
    // Create title
      title = createElement('h1', {
        marginBottom: '20px',
        color: styles.textColor,
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
    }, 'Pool and Hill Adjuster');
    body.appendChild(title);

    // Create hill
    hill = createDiv('100%', styles.hillHeight, {
        background: styles.hillGradient,
        borderBottomLeftRadius: styles.borderRadius,
        borderBottomRightRadius: styles.borderRadius,
        boxShadow: styles.shadow,
        position: 'relative',
    });
    body.appendChild(hill);

    // Create slope indicator
     slopeIndicator = createDiv('2px', '100px', {
        backgroundColor: 'rgba(255, 0, 0, 0.7)',
    });
    slopeIndicator.style.position = 'absolute';
    slopeIndicator.style.left = '50%';
    slopeIndicator.style.transform = 'translateX(-50%) rotate(0deg)';
    hill.appendChild(slopeIndicator);

    // Create pool
     pool = createDiv(styles.poolWidth, styles.poolHeight, {
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
     controls = createElement('div', {
        backgroundColor: styles.controlColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.controlShadow,
        padding: '20px',
        marginTop: '20px',
    });
    body.appendChild(controls);

    // State variables
     slope = 0;
     poolHeight = parseInt(styles.poolHeight);
     poolSize = parseInt(styles.poolWidth);
     animationDuration = 300;

    // Sound function
     playSound() {
        Audio('https://www.soundjay.com/button/beep-07.wav').play();
    }

    // Utility function to create a div with specific styles
    createDiv(width, height, additionalStyles) {
         div = createElement('div', { width, height });
        Object.assign(div.style, additionalStyles);
         div;
    }

    // Helper function to create elements with optional styles and content
     createElement(tag, styles = {}, content = '') {
          element = document.createElement(tag);
        Object.assign(element.style, styles);
        element.textContent = content;
         element;
    }

    // Update functions
      updateSlope() {
        hill.style.transform = `skewY(${slope}deg)`;
        updateSlopeIndicator();
        changeHillColor();
        document.getElementById('slopeValue').textContent = slope;
    }

      updateSlopeIndicator() {
        slopeIndicator.style.transform = `translateX(-50%) rotate(${slope}deg)`;
    }

      changeHillColor() {
        greenValue = Math.min(Math.max(255 - slope * 5, 0), 255);
        hill.style.backgroundColor = `rgb(0, ${greenValue}, 0)`;
    }

     updatePoolHeight() {
        pool.style.height = `${poolHeight}px`;
        pool.style.bottom = `${poolHeight}px`;
        document.getElementById('poolHeightValue').textContent = poolHeight;
    }

  updatePoolSize() {
        pool.style.width = `${poolSize}px`;
        document.getElementById('poolSizeValue').textContent = poolSize;
    }

    // Slope adjustment function
      changeSlope(delta) {
        slope += delta;
        updateSlope();
        playSound();
    }

    // Pool height adjustment function
     changePoolHeight(delta) {
        poolHeight = Math.max(0, poolHeight + delta);
        updatePoolHeight();
        playSound();
    }

    // Pool size adjustment function
     changePoolSize(delta) {
        poolSize = Math.max(10, poolSize + delta * 10);
        updatePoolSize();
        playSound();
    }

    // Enhanced rain simulation logic
      simulateRain() {
          rainAmount = Math.floor(Math.random() * 100) + 1; // Random rainfall between 1 and 100 mm
         effectiveSlope = Math.abs(slope) / 45; // Normalize slope (0 to 1)
          poolArea = (poolSize / 100) * poolHeight; // Pool area in square meters
         waterReached = Math.max(0, rainAmount * (1 - effectiveSlope) * poolArea); // Water reaching the pool
        
        alert(`Rainfall: ${rainAmount} mm\nWater reaching the pool: ${Math.round(waterReached)} mm`);
    }

    // Create controls
      createControl(label, changeFunc, valueId) {
          container = createElement('div', { marginBottom: '10px' });

        container.appendChild(createElement('h2', { color: styles.textColor }, label));

          createButton = (text, color, delta) => {
              button = createElement('button', {
                marginRight: '5px',
                padding: '5px 10px',
                backgroundColor: color,
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
            }, text);
            button.onclick = () => changeFunc(delta);
              button;
        };

        container.appendChild(createButton('Increase', '#4caf50', 1));
        container.appendChild(createButton('Decrease', '#f44336', -1));

         input = createElement('input', { type: 'number', placeholder: 'Enter value', style: { marginRight: '5px' } });
        container.appendChild(input);

         setButton = createElement('button', {
            padding: '5px 10px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        }, 'Set');
        setButton.onclick = () => {
              inputValue = parseInt(input.value);
            (!isNaN(inputValue)) {
                changeFunc(inputValue);
            }
        };
        container.appendChild(setButton);

          valueDisplay = createElement('span', { id: valueId }, '0');
        container.appendChild(valueDisplay);

        controls.appendChild(container);
    }

    // Create controls sections
    createControl('Adjust Hill Slope', changeSlope, 'slopeValue');
    createControl('Adjust Pool Height', changePoolHeight, 'poolHeightValue');
    createControl('Adjust Pool Size', changePoolSize, 'poolSizeValue');

    // Rain button
      rainButton = createElement('button', {
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
    animationInput = createElement('input', {
        type: 'number',
        placeholder: 'Animation Duration (ms)',
        style: { margin: '5px 0' },
    });
    controls.appendChild(animationInput);

     setAnimationButton = createElement('button', {
        padding: '5px 10px',
        backgroundColor: '#3f51b5',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }, 'Set Animation Duration');
    setAnimationButton.onclick = () => {
          durationValue = parseInt(animationInput.value);
          (!isNaN(durationValue) && durationValue > 0) {
            animationDuration = durationValue;
            hill.style.transition = `transform ${animationDuration}ms`;
            pool.style.transition = `height ${animationDuration}ms, width ${animationDuration}ms`;
        }
    };
    controls.appendChild(setAnimationButton);

    // Reset function
    resetValues() {
         (confirm("Are you sure you want to reset to default values?")) {
            slope = 0;
            poolHeight = parseInt(styles.poolHeight);
            poolSize = parseInt(styles.poolWidth);
            updateSlope();
            updatePoolHeight();
            updatePoolSize();
        }
    }

    // Reset button
      resetButton = createElement('button', {
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
