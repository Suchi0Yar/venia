
export default async function decorate(block) {
    
    try {
        const response = await fetch("http://localhost:3000/query-index.json");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        if (!data.data || !Array.isArray(data.data)) {
            throw new Error("Invalid JSON format: Expected 'data' array.");
        }

        const products = data.data;
        block.innerHTML = ""; // Clear previous content

        // Create carousel container
        const carouselContainer = document.createElement("div");
        carouselContainer.classList.add("carousel-container");

        // Create product wrapper
        const productWrapper = document.createElement("div");
        productWrapper.classList.add("product-wrapper");

        // Create dots container
        const dotsContainer = document.createElement("div");
        dotsContainer.classList.add("dots-container");

        const productsPerPage = 5;
        const totalPages = Math.ceil(products.length / productsPerPage);
        let currentIndex = 0;

        function renderProducts(startIndex) {
            productWrapper.innerHTML = "";
            const endIndex = Math.min(startIndex + productsPerPage, products.length);

            for (let i = startIndex; i < endIndex; i++) {
                const item = products[i];
                const productDiv = document.createElement("div");
                productDiv.classList.add("product");

                // Product Image
                const img = document.createElement("img");
                img.src = item.pimage || "https://via.placeholder.com/150";
                img.alt = item.pname || "Product Image";
                img.classList.add("pimage");

                // Product Name
                const name = document.createElement("h3");
                name.textContent = item.pname || "Unnamed Product";
                name.classList.add("pname");

                // Product Price
                const price = document.createElement("p");
                price.textContent = item.price ? `${item.price}` : "Price Not Available";
                price.classList.add("price");

                // Product Actions Container
                const productActions = document.createElement("div");
                productActions.classList.add("product-actions");

                // Add to Cart Button
                const addToCartBtn = document.createElement("button");
                addToCartBtn.textContent = "ADD TO CART";
                addToCartBtn.classList.add("add-to-cart-btn");
                addToCartBtn.addEventListener("click", () => {
                    console.log(`Added to cart: ${item.pname}`);
                    alert(`${item.pname} added to cart!`);
                });

                // Wishlist Icon
                const wishlistIcon = document.createElement("img");
                wishlistIcon.src = "./icons/wishlist.svg";
                wishlistIcon.alt = "Wishlist";
                wishlistIcon.classList.add("wishlist-icon");

                // Append button and icon to actions container
                productActions.appendChild(addToCartBtn);
                productActions.appendChild(wishlistIcon);

                // Append elements to product div
                productDiv.appendChild(img);
                productDiv.appendChild(name);
                productDiv.appendChild(price);
                productDiv.appendChild(productActions);

                // Append product to wrapper
                productWrapper.appendChild(productDiv);
            }
        }

        function createDots() {
            dotsContainer.innerHTML = "";
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement("span");
                dot.classList.add("dot");
                if (i === 0) dot.classList.add("active");
                dot.addEventListener("click", () => {
                    currentIndex = i * productsPerPage;
                    renderProducts(currentIndex);
                    updateActiveDot(i);
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateActiveDot(activeIndex) {
            const dots = dotsContainer.querySelectorAll(".dot");
            dots.forEach((dot, index) => {
                if (index === activeIndex) {
                    dot.classList.add("active");
                } else {
                    dot.classList.remove("active");
                }
            });
        }

        carouselContainer.appendChild(productWrapper);
        carouselContainer.appendChild(dotsContainer);
        block.appendChild(carouselContainer);

        // Debugging logs
        console.log("Carousel Container Appended:", document.querySelector(".carousel-container"));
        console.log("Product Wrapper Appended:", document.querySelector(".product-wrapper"));
        console.log("Dots Container Appended:", document.querySelector(".dots-container"));

        renderProducts(currentIndex);
        createDots();
    } catch (error) {
        console.error("Error fetching or rendering data:", error);
        block.innerHTML = `<p class="error-message">Failed to load data.</p>`;
    }
}



