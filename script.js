// Constants
const MOVE_THRESHOLD = 5;
const VIEWPORT_PADDING = 20;

// DOM Elements
const widget = document.getElementById('accessibility-widget');
const toggle = document.getElementById('accessibility-toggle');
const panel = document.getElementById('accessibility-panel');
const closeButton = document.getElementById('close-panel');
const textSizeButtons = document.querySelectorAll('.text-size-btn');
const contrastButtons = document.querySelectorAll('.contrast-btn');
const visionImpairedToggle = document.getElementById('vision-impaired-toggle');
const adhdToggle = document.getElementById('adhd-toggle');
const highlightLinksToggle = document.getElementById('highlight-links');
const readableFontToggle = document.getElementById('readable-font');
const resetButton = document.getElementById('reset-settings');

// Drag state
let dragState = {
    isDragging: false,
    hasMoved: false,
    startX: 0,
    startY: 0,
    initialMouseX: 0,
    initialMouseY: 0
};

// Initialize widget
document.addEventListener('DOMContentLoaded', initializeWidget);

function initializeWidget() {
    setInitialPosition();
    setupEventListeners();
}

function setInitialPosition() {
    const buttonRect = toggle.getBoundingClientRect();
    widget.style.left = `${window.innerWidth - buttonRect.width - VIEWPORT_PADDING}px`;
    widget.style.top = `${window.innerHeight - buttonRect.height - VIEWPORT_PADDING}px`;
}

function setupEventListeners() {
    // Drag and drop
    toggle.addEventListener('mousedown', initDrag);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);

    // Panel controls
    closeButton.addEventListener('click', () => widget.classList.remove('widget-expanded'));
    window.addEventListener('resize', handleResize);

    // Accessibility controls
    setupAccessibilityControls();
}

// Drag and Drop Functions
function initDrag(e) {
    const rect = widget.getBoundingClientRect();
    dragState = {
        isDragging: true,
        hasMoved: false,
        startX: rect.left,
        startY: rect.top,
        initialMouseX: e.clientX,
        initialMouseY: e.clientY
    };
    e.preventDefault();
}

function handleDrag(e) {
    if (!dragState.isDragging) return;

    const dx = e.clientX - dragState.initialMouseX;
    const dy = e.clientY - dragState.initialMouseY;

    if (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD) {
        dragState.hasMoved = true;
    }

    const newPosition = calculateNewPosition(
        dragState.startX + dx,
        dragState.startY + dy
    );

    widget.style.left = `${newPosition.x}px`;
    widget.style.top = `${newPosition.y}px`;
    e.preventDefault();
}

function stopDrag() {
    if (dragState.isDragging && !dragState.hasMoved) {
        togglePanel();
    }
    dragState.isDragging = false;
}

function calculateNewPosition(x, y) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const buttonRect = toggle.getBoundingClientRect();

    return {
        x: Math.max(0, Math.min(viewportWidth - buttonRect.width, x)),
        y: Math.max(0, Math.min(viewportHeight - buttonRect.height, y))
    };
}

function togglePanel() {
    const widgetRect = widget.getBoundingClientRect();
    const isOnRightHalf = widgetRect.left > window.innerWidth / 2;
    
    widget.classList.toggle('widget-expanded');
    
    if (widget.classList.contains('widget-expanded')) {
        panel.style.right = isOnRightHalf ? '0' : 'auto';
        panel.style.left = isOnRightHalf ? 'auto' : '0';
    }
}

function handleResize() {
    const rect = widget.getBoundingClientRect();
    const newPosition = calculateNewPosition(rect.left, rect.top);
    
    widget.style.left = `${newPosition.x}px`;
    widget.style.top = `${newPosition.y}px`;
}

// Accessibility Control Setup
function setupAccessibilityControls() {
    setupTextSizeControls();
    setupContrastControls();
    setupProfileToggles();
    setupOtherOptions();
    setupResetButton();
}

function setupTextSizeControls() {
    textSizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            textSizeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const sizes = {
                'smaller': '14px',
                'normal': '16px',
                'larger': '18px'
            };
            document.documentElement.style.fontSize = sizes[button.dataset.size];
        });
    });
}

function setupContrastControls() {
    contrastButtons.forEach(button => {
        button.addEventListener('click', () => {
            contrastButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const isHighContrast = button.dataset.contrast === 'high';
            document.body.classList.toggle('high-contrast', isHighContrast);
            applyContrastStyles(isHighContrast);
        });
    });
}

function applyContrastStyles(isHighContrast) {
    const styles = isHighContrast ? {
        backgroundColor: '#000',
        color: '#fff'
    } : {
        backgroundColor: '',
        color: ''
    };

    Object.assign(document.body.style, styles);
}

function setupProfileToggles() {
    visionImpairedToggle.addEventListener('change', handleVisionToggle);
    adhdToggle.addEventListener('change', handleAdhdToggle);
}

function handleVisionToggle(e) {
    const styles = e.target.checked ? {
        fontSize: '120%',
        lineHeight: '1.8',
        letterSpacing: '1px'
    } : {
        fontSize: '',
        lineHeight: '',
        letterSpacing: ''
    };

    Object.assign(document.body.style, styles);
    document.body.classList.toggle('vision-impaired-mode', e.target.checked);
}

function handleAdhdToggle(e) {
    const styles = e.target.checked ? {
        lineHeight: '1.8',
        maxWidth: '800px',
        margin: 'auto'
    } : {
        lineHeight: '',
        maxWidth: '',
        margin: ''
    };

    Object.assign(document.body.style, styles);
    document.body.classList.toggle('adhd-mode', e.target.checked);
    document.querySelectorAll('animation').forEach(el => {
        el.style.animationPlayState = e.target.checked ? 'paused' : '';
    });
}

function setupOtherOptions() {
    highlightLinksToggle.addEventListener('change', handleLinkHighlighting);
    readableFontToggle.addEventListener('change', handleReadableFont);
}

function handleLinkHighlighting(e) {
    const linkStyles = e.target.checked ? {
        textDecoration: 'underline',
        backgroundColor: '#ffeb3b',
        color: '#000',
        padding: '2px 4px',
        borderRadius: '3px'
    } : {
        textDecoration: '',
        backgroundColor: '',
        color: '',
        padding: '',
        borderRadius: ''
    };

    document.querySelectorAll('a').forEach(link => {
        if (!link.closest('#accessibility-panel')) {
            Object.assign(link.style, linkStyles);
        }
    });
}

function handleReadableFont(e) {
    const styles = e.target.checked ? {
        fontFamily: "'Open Sans', 'Arial', sans-serif",
        letterSpacing: '0.5px',
        wordSpacing: '2px',
        lineHeight: '1.6'
    } : {
        fontFamily: '',
        letterSpacing: '',
        wordSpacing: '',
        lineHeight: ''
    };

    Object.assign(document.body.style, styles);
}

function setupResetButton() {
    resetButton.addEventListener('click', () => {
        // Reset all settings to default
        document.documentElement.style.fontSize = '16px';
        textSizeButtons.forEach(btn => btn.classList.remove('active'));
        textSizeButtons[1].classList.add('active'); // Normal size button
        
        // Reset all toggles
        [visionImpairedToggle, adhdToggle, highlightLinksToggle, readableFontToggle].forEach(toggle => {
            toggle.checked = false;
            toggle.dispatchEvent(new Event('change'));
        });
        
        // Reset contrast
        contrastButtons[0].click(); // Normal contrast button
    });
} 