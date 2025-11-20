const JSON_URL = '../../src/assets/data.json'; 
function updateProductCard(cardElement, product) {
    if (!product) {
        cardElement.style.display = 'none'; 
        return;
    }

    const imgElement = cardElement.querySelector('[data-field="image"]');
    imgElement.src = product.imageUrl; 
    imgElement.alt = product.name;

    cardElement.querySelector('[data-field="name"]').textContent = product.name; 

    cardElement.querySelector('[data-field="price"]').textContent = `$${product.price.toFixed(2)}`;

    const tagElement = cardElement.querySelector('[data-field="tag"]');
    
    
    if (product.salesStatus === true) {
        tagElement.textContent = 'SALE'; 
        tagElement.style.display = 'block'; 
    } else if (product.blocks.includes("New Products Arrival")) {
        tagElement.textContent = 'NEW';
        tagElement.style.display = 'block';
    } else {
        tagElement.style.display = 'none'; 
    }
}

async function loadHomeProducts() {
    try {
        const response = await fetch(JSON_URL);
        const fullData = await response.json(); 
        
        const allProducts = fullData.data || []; 

        const selectedProducts = allProducts
            .filter(p => p.blocks.includes("Selected Products"))
            .slice(0, 4); 

        const newProducts = allProducts
            .filter(p => p.blocks.includes("New Products Arrival"))
            .slice(0, 4); 

        const selectedGrid = document.getElementById('selected-products-grid');
        selectedProducts.forEach((product, index) => {
            const card = selectedGrid.querySelector(`[data-card-index="${index}"]`);
            if (card) {
                updateProductCard(card, product);
            }
        });
        
        const newGrid = document.getElementById('new-products-grid');
        newProducts.forEach((product, index) => {
            const card = newGrid.querySelector(`[data-card-index="${index}"]`);
            if (card) {
                updateProductCard(card, product);
            }
        });

    } catch (error) {
        console.error("Failed to load product data:", error);
    }
}

function initializeSliders() {
    const categoriesSlider = new Swiper('.categories-slider', {
        slidesPerView: 4,
        spaceBetween: 30,
        loop: true,
       });
}

document.addEventListener('DOMContentLoaded', () => {
    loadHomeProducts();
    initializeSliders();
});