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
        event.preventDefault(); // Prevent the default action to manually handle new line insertion
        const selection = window.getSelection();
        if (!selection.rangeCount) return; // Exit if no selection is made
        
        const range = selection.getRangeAt(0);
        // Create a new div and ensure it has a non-breaking space to be visible and interactable
        const newLine = document.createElement('div');
        newLine.innerHTML = '&nbsp;'; // Using innerHTML to ensure the non-breaking space is correctly interpreted
        
        // Insert the new line div at the correct position in the editor
        if (range.startContainer.parentNode === editor) {
            // If the selection is directly inside the editor (not wrapped in a div), append at the end
            editor.appendChild(newLine);
        } else {
            // Otherwise, insert after the current line/div
            range.startContainer.parentNode.parentNode.insertBefore(newLine, range.startContainer.parentNode.nextSibling);
        }

        // Set the cursor inside the newly created line
        const newRange = document.createRange();
        newRange.setStart(newLine, 0);
        newRange.collapse(true); // Collapse the range to the start position to place the cursor there
        
        selection.removeAllRanges();
        selection.addRange(newRange);

        updateCurrentLine(); // Update the current line highlighting
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

function applyBoldToTextWithAsterisks(node) {
    const content = node.textContent;
    const fragment = document.createDocumentFragment();
    let parentNode = node.parentNode;

    let regex = /\*(.*?)\*/g;
    let match, lastIdx = 0;
    let addedNodes = []; // To keep track of all nodes added to the fragment

    while ((match = regex.exec(content)) !== null) {
        // Add text before the asterisk
        if (match.index > lastIdx) {
            let textNode = document.createTextNode(content.substring(lastIdx, match.index));
            fragment.appendChild(textNode);
            addedNodes.push(textNode);
        }

        // Add bold text
        if (match[1].length > 0) { // Ensure there's something to bold
            const strongElement = document.createElement('strong');
            strongElement.textContent = match[1];
            fragment.appendChild(strongElement);
            addedNodes.push(strongElement);
        }

        lastIdx = regex.lastIndex;
    }

    // Append any remaining text after the last match
    if (lastIdx < content.length) {
        let textNode = document.createTextNode(content.substring(lastIdx));
        fragment.appendChild(textNode);
        addedNodes.push(textNode);
    }

    // Replace the original node with the new fragment
    parentNode.replaceChild(fragment, node);

    // Attempt to set the cursor after the last added node
    if (addedNodes.length > 0) {
        let range = document.createRange();
        let sel = window.getSelection();
        let lastAddedNode = addedNodes[addedNodes.length - 1];
        let focusNode = lastAddedNode.nodeType === Node.TEXT_NODE ? lastAddedNode : lastAddedNode.childNodes[lastAddedNode.childNodes.length - 1] || lastAddedNode;
        range.setStartAfter(focusNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

function updateTextContent(line) {
    const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
        if (/\*(.*?)\*/.test(node.textContent)) {
            applyBoldToTextWithAsterisks(node);
        }
    }
}

function updateHierarchy() {
    const lines = editor.querySelectorAll('div');
    lines.forEach((line, index) => {
        line.classList.remove('child');
        if (index > 0 && line.textContent.startsWith('\t')) {
            line.classList.add('child');
        }
        updateTextContent(line);
    });
}

function toggleChildren(line) {
    if (!line) return;

    let nextSibling = line.nextElementSibling;
    let currentIndentLevel = (line.textContent.match(/^\t*/)[0] || "").length;

    while (nextSibling) {
        let nextIndentLevel = (nextSibling.textContent.match(/^\t*/)[0] || "").length;

        if (nextIndentLevel <= currentIndentLevel) {
            break;
        }

        nextSibling.classList.toggle('hidden');

        nextSibling = nextSibling.nextElementSibling;
    }
}


