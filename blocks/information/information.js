// Utility function to create elements
function createElement(tag, className = '', text = '') {
    const elem = document.createElement(tag);
    if (className) elem.className = className;
    if (text) elem.textContent = text;
    return elem;
}

// Handles selection for size and color
function handleSelection(block, selectedButton, displayElement) {
    selectedButton.parentElement.querySelectorAll('button').forEach(button => button.classList.remove('active'));
    selectedButton.classList.add('active');
    displayElement.innerText = selectedButton.value;
    validateSelection(block);
}

// Generates buttons for size and color selection
function generateOptions(block, type, options, handleSelection, showText = true) {
    const container = [...block.getElementsByTagName('div')].find(div => div.textContent.trim().includes(`Fashion ${type}`));
    if (!container) return;

    const wrapper = createElement('div', `${type.toLowerCase()}-wrapper`);
    const title = createElement('div', `title`, `Fashion ${type}`);
    const buttonContainer = createElement('div', `${type.toLowerCase()}-buttons`);
    const selectedDisplay = createElement('div', 'selected', `Selected Fashion ${type}: `);
    const selectedValue = createElement('span', `selected-${type.toLowerCase()}`, 'None');
    selectedDisplay.appendChild(selectedValue);

    options.forEach(option => {
        const button = createElement('button', type.toLowerCase() === 'color' ? 'color-button' : 'size-button');
        button.type = 'button';
        button.value = option.value || option;
        if (option.hex) {
            button.style.backgroundColor = option.hex;
        }
        if (showText) button.textContent = option.value || option;

        button.addEventListener('click', () => handleSelection(block, button, selectedValue));
        buttonContainer.appendChild(button);
    });

    wrapper.append(title, buttonContainer, selectedDisplay);
    container.replaceWith(wrapper);
}


function validateSelection(block) {
    const addToCartButton = block.querySelector('.cart-button');
    if (!addToCartButton) return;

    const isSizeSelected = block.querySelector('.selected-size')?.innerText !== 'None';
    const isColorSelected = block.querySelector('.selected-color')?.innerText !== 'None';
    addToCartButton.disabled = !(isSizeSelected && isColorSelected);
    addToCartButton.classList.toggle('disabled', addToCartButton.disabled);
}


export default function informationFun(block) {
    if (!block) {
        console.error('Block not provided');
        return;
    }

 
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/styles/informationFun.css';
    document.head.appendChild(link);

   
    const quantityContainer = [...block.getElementsByTagName('div')].find(div => div.textContent.trim() === 'Quantity');
    if (quantityContainer) {
        const quantityHandle = createElement('div', 'quantity-handle');
        const decrement = createElement('button', 'incr-decr-button decrement', '-');
        const input = createElement('input', 'quantity-count');
        input.type = 'text';
        input.value = '1';
        input.readOnly = true;
        const increment = createElement('button', 'incr-decr-button increment', '+');

        decrement.onclick = () => (input.value = Math.max(1, parseInt(input.value) - 1));
        increment.onclick = () => (input.value = parseInt(input.value) + 1);

        quantityHandle.append(decrement, input, increment);
        quantityContainer.appendChild(quantityHandle);
    }

    generateOptions(block, 'Size', ['XS', 'S', 'M', 'L', 'XL'], handleSelection, true);
    generateOptions(block, 'Color', [
        { value: 'Peach', hex: '#f8c7b9' },
        { value: 'Khaki', hex: '#f5e6c4' },
        { value: 'Rain', hex: '#c7ddef' },
        { value: 'Mint', hex: '#c8e6c9' }
    ], handleSelection, false);

    const addToCartText = [...block.getElementsByTagName('p')].find(p => p.textContent.trim() === 'ADD TO CART');
    if (!addToCartText) return console.error("Add to Cart text not found in block");

    const addToCartButton = createElement('button', 'cart-button disabled', 'ADD TO CART');
    addToCartButton.disabled = true;
    addToCartText.replaceWith(addToCartButton);

    addToCartButton.addEventListener("click", () => {
        if (!addToCartButton.disabled) {
            console.log("Item added to cart!");
            addToCartButton.textContent = "Added to Cart";
            addToCartButton.classList.add("added");
        }
    });

    validateSelection(block);
}
