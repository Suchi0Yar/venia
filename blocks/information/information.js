export default function informationFun(block) {
    if (!block) {
        console.error('Block not provided');
        return;
    }

    // Quantity Selection
    const quantityContainer = Array.from(block.getElementsByTagName('div')).find(div =>
        div.textContent.trim() === 'Quantity'
    );

    if (quantityContainer) {
        let quantityHandle = document.createElement('div');
        quantityHandle.className = 'quantity-handle';

        let decrement = document.createElement('button');
        decrement.className = 'incr-decr-button decrement';
        decrement.textContent = '-';

        let input = document.createElement('input');
        input.type = 'text';
        input.className = 'quantity-count';
        input.value = '1';
        input.readOnly = true;

        let increment = document.createElement('button');
        increment.className = 'incr-decr-button increment';
        increment.textContent = '+';

        decrement.onclick = function () {
            let presentValue = parseInt(input.value);
            if (presentValue > 1) {
                input.value = presentValue - 1;
            }
        };

        increment.onclick = function () {
            let presentValue = parseInt(input.value);
            input.value = presentValue + 1;
        };

        quantityHandle.appendChild(decrement);
        quantityHandle.appendChild(input);
        quantityHandle.appendChild(increment);
        quantityContainer.appendChild(quantityHandle);
    }

    // Generate Size Options
    function generateSizeOptions(block) {
        const sizeContainer = Array.from(block.getElementsByTagName('div')).find(div =>
            div.textContent.trim().includes('Fashion Size')
        );

        if (!sizeContainer) return;

        const newWrapper = document.createElement('div');
        newWrapper.classList.add('size-wrapper');

        const title = document.createElement('div');
        title.textContent = 'Fashion Size';

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('size-buttons');

        const sizes = ['XS', 'S', 'M', 'L', 'XL'];

        sizes.forEach(size => {
            const button = document.createElement('button');
            button.type = 'button';
            button.value = size;
            button.innerHTML = `<span>${size}</span>`;
            button.addEventListener('click', () => handleSizeSelection(block, button));
            buttonContainer.appendChild(button);
        });

        const selectedSize = document.createElement('div');
        selectedSize.innerHTML = `<span class="selected">Selected Fashion Size: <span class="selected-size">None</span></span>`;

        newWrapper.append(title, buttonContainer, selectedSize);
        sizeContainer.replaceWith(newWrapper);
    }

    function handleSizeSelection(block, selectedButton) {
        block.querySelectorAll('.size-wrapper button').forEach(button => {
            button.classList.remove('active');
        });

        selectedButton.classList.add('active');
        block.querySelector('.selected-size').innerText = selectedButton.innerText;
        validateSelection();
    }

    generateSizeOptions(block);

    // Generate Color Options
    function generateColorOptions(block) {
        const colorContainer = Array.from(block.getElementsByTagName('div')).find(div =>
            div.textContent.trim().includes('Fashion Color')
        );

        if (!colorContainer) return;

        const newWrapper = document.createElement('div');
        newWrapper.classList.add('color-wrapper');

        const title = document.createElement('div');
        title.textContent = 'Fashion Color';

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('color-buttons');

        // Define colors with CSS class names for styling
        const colors = [
            { name: 'Peach', hex: '#f8c7b9' },
            { name: 'Khaki', hex: '#f5e6c4' },
            { name: 'Rain', hex: '#c7ddef' },
            { name: 'Mint', hex: '#c8e6c9' }
        ];

        colors.forEach(color => {
            const button = document.createElement('button');
            button.classList.add('color-button');
            button.style.backgroundColor = color.hex;
            button.setAttribute('data-color', color.name); // Store color name in dataset
            button.addEventListener('click', () => handleColorSelection(block, button));

            buttonContainer.appendChild(button);
        });

        const selectedColor = document.createElement('div');
        selectedColor.innerHTML = `<span class="selected">Selected Fashion Color: <span class="selected-color">None</span></span>`;

        newWrapper.append(title, buttonContainer, selectedColor);
        colorContainer.replaceWith(newWrapper);
    }

    function handleColorSelection(block, selectedButton) {
        block.querySelectorAll('.color-button').forEach(button => {
            button.classList.remove('active');
        });

        selectedButton.classList.add('active');
        block.querySelector('.selected-color').innerText = selectedButton.getAttribute('data-color');
        validateSelection();
    }

    generateColorOptions(block);

    // Find the existing "ADD TO CART" text and convert it into a button
    const addToCartText = Array.from(block.getElementsByTagName('p')).find(
        p => p.textContent.trim() === 'ADD TO CART'
    );

    if (!addToCartText) {
        console.error("Add to Cart text not found in block");
        return;
    }

    // Convert existing <p> to button
    let addToCartButton = document.createElement("button");
    addToCartButton.className = "cart-button disabled"; // Initially disabled
    addToCartButton.textContent = "ADD TO CART";
    addToCartButton.disabled = true;

    // Replace existing <p> with the new button
    addToCartText.replaceWith(addToCartButton);

    // Validate Selection
    function validateSelection() {
        const selectedSize = block.querySelector(".selected-size");
        const selectedColor = block.querySelector(".selected-color");

        const isSizeSelected = selectedSize && selectedSize.innerText !== "None";
        const isColorSelected = selectedColor && selectedColor.innerText !== "None";

        if (isSizeSelected && isColorSelected) {
            addToCartButton.classList.remove("disabled");
            addToCartButton.disabled = false;
        } else {
            addToCartButton.classList.add("disabled");
            addToCartButton.disabled = true;
        }
    }

    // Add Event Listeners for Size & Color
    block.querySelectorAll(".size-wrapper button").forEach(button => {
        button.addEventListener("click", () => {
            block.querySelector(".selected-size").innerText = button.innerText;
            validateSelection();
        });
    });

    block.querySelectorAll(".color-button").forEach(button => {
        button.addEventListener("click", () => {
            block.querySelector(".selected-color").innerText = button.getAttribute('data-color');
            validateSelection();
        });
    });

    // Add to Cart Click Event
    addToCartButton.addEventListener("click", () => {
        if (!addToCartButton.disabled) {
            console.log("Item added to cart!");
            addToCartButton.textContent = "Added to Cart";
            addToCartButton.classList.add("added");
        }
    });

    validateSelection();
}
