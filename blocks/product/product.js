async function fetchData() {
    try {
        // Find the anchor tag inside the .product div
        const productDiv = document.querySelector(".product");
        if (!productDiv) throw new Error("Product container not found.");

        const anchor = productDiv.querySelector("a");
        if (!anchor || !anchor.href) throw new Error("Anchor tag with valid href not found inside .product.");

        console.log("Fetching data from:", anchor.href);

        const response = await fetch(anchor.href);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Fetched Data:", data);

        if (!data.data || !Array.isArray(data.data)) {
            throw new Error("Invalid JSON format: Expected 'data' array.");
        }

        return data.data;
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        return null;
    }
}

function getProductsPerPage() {
    if (window.innerWidth <= 360) return 1;
    if (window.innerWidth <= 600) return 2;
    if (window.innerWidth <= 900) return 3;
    return 5;
}

function renderProducts(products, startIndex, productWrapper, productsPerPage) {
    productWrapper.innerHTML = "";
    const endIndex = Math.min(startIndex + productsPerPage, products.length);

    for (let i = startIndex; i < endIndex; i++) {
        const item = products[i];

        const productDiv = document.createElement("div");
        productDiv.classList.add("product-item");

        const productLink = document.createElement("a");
        productLink.href = item.path;

        const img = document.createElement("img");
        img.src = item.pimage;
        img.alt = item.pname || "Product Image";
        img.classList.add("pimage");
        productLink.appendChild(img);

        const name = document.createElement("h3");
        name.textContent = item.pname || "Unnamed Product";
        name.classList.add("pname");

        const price = document.createElement("p");
        price.textContent = item.price ? `${item.price}` : "Price Not Available";
        price.classList.add("price");

        const productActions = document.createElement("div");
        productActions.classList.add("product-actions");

        const addToCartBtn = document.createElement("button");
        addToCartBtn.textContent = "ADD TO CART";
        addToCartBtn.classList.add("add-to-cart-btn");
        addToCartBtn.addEventListener("click", () => {
            console.log(`Added to cart: ${item.pname}`);
            alert(`${item.pname} added to cart!`);
        });

        const wishlistIcon = document.createElement("img");
        wishlistIcon.src = "./icons/wishlist.svg";
        wishlistIcon.alt = "Wishlist";
        wishlistIcon.classList.add("wishlist-icon");

        productActions.appendChild(addToCartBtn);
        productActions.appendChild(wishlistIcon);

        productDiv.appendChild(productLink);
        productDiv.appendChild(name);
        productDiv.appendChild(price);
        productDiv.appendChild(productActions);
        productWrapper.appendChild(productDiv);
    }
}

function createDots(totalPages, dotsContainer, updateActiveDot, renderProducts, products, productWrapper, productsPerPage) {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            const currentIndex = i * productsPerPage;
            renderProducts(products, currentIndex, productWrapper, productsPerPage);
            updateActiveDot(i, dotsContainer);
        });
        dotsContainer.appendChild(dot);
    }
}

function updateActiveDot(activeIndex, dotsContainer) {
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === activeIndex);
    });
}

export default async function decorate(block) {
    const products = await fetchData();
    if (!products) {
        block.innerHTML = `<p class="error-message">Failed to load data.</p>`;
        return;
    }

    block.innerHTML = "";

    const carouselContainer = document.createElement("div");
    carouselContainer.classList.add("carousel-container");

    const productWrapper = document.createElement("div");
    productWrapper.classList.add("product-wrapper");

    const dotsContainer = document.createElement("div");
    dotsContainer.classList.add("dots-container");

    let productsPerPage = getProductsPerPage();
    let totalPages = Math.ceil(products.length / productsPerPage);
    let currentIndex = 0;

    function updateCarousel() {
        productsPerPage = getProductsPerPage();
        totalPages = Math.ceil(products.length / productsPerPage);
        currentIndex = 0;

        renderProducts(products, currentIndex, productWrapper, productsPerPage);
        createDots(totalPages, dotsContainer, updateActiveDot, renderProducts, products, productWrapper, productsPerPage);
    }

    updateCarousel();
    window.addEventListener("resize", updateCarousel);

    carouselContainer.appendChild(productWrapper);
    carouselContainer.appendChild(dotsContainer);
    block.appendChild(carouselContainer);
}
