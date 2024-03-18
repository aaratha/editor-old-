let mode = 'normal';

const editor = document.getElementById('editor');
editor.setAttribute('contenteditable', 'false'); // Disable editing in normal mode

// Function to update the current line highlighting
function updateCurrentLine() {
    const lines = editor.querySelectorAll('div');
    lines.forEach(line => line.classList.remove('current-line'));

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const startContainer = range.startContainer;
        if (startContainer.nodeType === Node.TEXT_NODE && startContainer.parentNode.parentNode === editor) {
            startContainer.parentNode.classList.add('current-line');
        }
    }
}

// Listen for key events on the document
document.addEventListener('keydown', (event) => {
    if (event.key === 'i' && mode === 'normal') {
        mode = 'insert';
        editor.setAttribute('contenteditable', 'true'); // Enable editing in insert mode
        editor.focus();
        console.log('Insert mode');
    } else if (mode === 'insert' && event.key === 'Escape') {
        mode = 'normal';
        editor.setAttribute('contenteditable', 'false'); // Disable editing in normal mode
        console.log('Normal mode');
    } else if (mode === 'insert' && event.key === 'Enter') {
        event.preventDefault();
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const newLine = document.createElement('div');
        newLine.textContent = '\u00a0'; // Non-breaking space to ensure the div is visible
        editor.insertBefore(newLine, range.startContainer.parentNode.nextSibling);
        range.setStart(newLine, 0);
        range.setEnd(newLine, 0);
        selection.removeAllRanges();
        selection.addRange(range);
    } else if (mode === 'insert' && event.key === 'Tab') {
        event.preventDefault();
        document.execCommand('insertText', false, '\t');
    } else if (mode === 'normal' && event.key === 'Tab') {
            event.preventDefault();
            const currentLine = editor.querySelector('.current-line') || editor.querySelector('div');
            if (currentLine) {
                toggleChildren(currentLine);
            }
        }
});

// Listen for input events to update the hierarchy
editor.addEventListener('input', () => {
    if (mode === 'insert') {
        updateHierarchy();
    }
});

// Listen for click and keyup events to update the current line highlighting
editor.addEventListener('click', updateCurrentLine);
document.addEventListener('keyup', updateCurrentLine);

function updateHierarchy() {
    const lines = editor.querySelectorAll('div');
    lines.forEach((line, index) => {
        line.classList.remove('child');
        if (index > 0 && line.textContent.startsWith('\t')) {
            line.classList.add('child');
        }
    });
}

function toggleChildren(line) {
    if (!line) return; // Return early if no line is provided

    let nextSibling = line.nextElementSibling;
    let currentIndentLevel = (line.textContent.match(/^\t*/)[0] || "").length;

    while (nextSibling) {
        let nextIndentLevel = (nextSibling.textContent.match(/^\t*/)[0] || "").length;

        if (nextIndentLevel <= currentIndentLevel) {
            break; // Stop if the next line is not a descendant
        }

        nextSibling.classList.toggle('hidden'); // Toggle all descendants

        nextSibling = nextSibling.nextElementSibling;
    }
}


