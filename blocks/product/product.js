export default async function decorate(block) {
    try {
        const response = await fetch("http://localhost:3000/product.json"); 

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        if (!data.data || !Array.isArray(data.data)) {
            throw new Error("Invalid JSON format: Expected 'data' array.");
        }

        const products = data.data; // Extract product list
        block.innerHTML = ""; // Clear previous content

        products.forEach((item) => {
            // Create product container
            const productDiv = document.createElement("div");
            productDiv.classList.add("product");

            // Product Image
            const img = document.createElement("img");
            img.src = item["product image"] || "https://via.placeholder.com/150";
            img.alt = item.Name || "Product Image";
            img.classList.add("product-image");

            // Product Name
            const name = document.createElement("h3");
            name.textContent = item.Name || "Unnamed Product";
            name.classList.add("product-name");

            // Product Price
            const price = document.createElement("p");
            price.textContent = item.Price ? `$${item.Price}` : "Price Not Available";
            price.classList.add("product-price");

            // Add to Cart Button
            const addToCartBtn = document.createElement("button");
            addToCartBtn.textContent = "ADD TO CART";
            addToCartBtn.classList.add("add-to-cart-btn");
            addToCartBtn.addEventListener("click", () => {
                console.log(`Added to cart: ${item.Name}`);
                alert(`${item.Name} added to cart!`);
            });

            // Append elements to product div
            productDiv.appendChild(img);
            productDiv.appendChild(name);
            productDiv.appendChild(price);
            productDiv.appendChild(addToCartBtn);

            // Append product to block
            block.appendChild(productDiv);
        });

    } catch (error) {
        console.error("Error fetching or rendering data:", error);
        block.innerHTML = `<p class="error-message">Failed to load data.</p>`;
    }
}
