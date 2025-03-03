async function fetchData() {
    try {
        const anchor = document.querySelector(".product a");
        if (!anchor?.href) throw new Error("Anchor tag with valid href not found inside .product.");

        console.log("Fetching data from:", anchor.href);
        const response = await fetch(anchor.href);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        return Array.isArray(data.data) ? data.data : Promise.reject("Invalid JSON format: Expected 'data' array.");
    } catch (error) {
        console.error("❌ Error fetching data:", error);
        return null;
    }
}

const getProductsPerPage = () => (window.innerWidth <= 360 ? 2: window.innerWidth <= 600 ? 3: window.innerWidth <= 900 ? 4: 5);

function renderProducts(products, startIndex, productWrapper, productsPerPage) {
    productWrapper.innerHTML = products.slice(startIndex, startIndex + productsPerPage).map(item => `
        <div class="product-item">
            <a href="${item.path}">
                <img src="${item.pimage}" alt="${item.pname || 'Product Image'}" class="pimage" />
            </a>
            <h3 class="pname">${item.pname || 'Unnamed Product'}</h3>
            <p class="price">${item.price || 'Price Not Available'}</p>
            <div class="product-actions">
                <button class="add-to-cart-btn">ADD TO CART</button>
                <img src="./icons/wishlist.svg" alt="Wishlist" class="wishlist-icon" />
            </div>
        </div>
    `).join("");

    productWrapper.querySelectorAll(".add-to-cart-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            alert(`${products[startIndex + index].pname} added to cart!`);
        });
    });
}

function createDots(totalPages, dotsContainer, renderProducts, products, productWrapper, productsPerPage) {
    dotsContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => `<span class="dot${i === 0 ? ' active' : ''}"></span>`).join("");

    dotsContainer.querySelectorAll(".dot").forEach((dot, i) => {
        dot.addEventListener("click", () => {
            renderProducts(products, i * productsPerPage, productWrapper, productsPerPage);
            document.querySelectorAll(".dot").forEach(d => d.classList.remove("active"));
            dot.classList.add("active");
        });
    });
}

export default async function decorate(block) {
    const products = await fetchData();
    if (!products) return (block.innerHTML = `<p class="error-message">Failed to load data.</p>`);
    
    block.innerHTML = "";
    const carouselContainer = document.createElement("div");
    carouselContainer.className = "carousel-container";
    
    const productWrapper = document.createElement("div");
    productWrapper.className = "product-wrapper";
    
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "dots-container";
    
    let updateCarousel = () => {
        const productsPerPage = getProductsPerPage();
        const totalPages = Math.ceil(products.length / productsPerPage);
        
        renderProducts(products, 0, productWrapper, productsPerPage);
        createDots(totalPages, dotsContainer, renderProducts, products, productWrapper, productsPerPage);
    };
    
    updateCarousel();
    window.addEventListener("resize", updateCarousel);
    
    carouselContainer.append(productWrapper, dotsContainer);
    block.appendChild(carouselContainer);
}