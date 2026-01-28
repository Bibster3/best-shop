import { updateProductCard, addToCart } from "./components.js";
const JSON_URL = "../../src/assets/data.json";

async function loadHomeProducts() {
  try {
    const response = await fetch(JSON_URL);
    const fullData = await response.json();

    const allProducts = fullData.data || [];

    const selectedProducts = allProducts
      .filter((p) => p.blocks.includes("Selected Products"))
      .slice(0, 4);

    const newProducts = allProducts
      .filter((p) => p.blocks.includes("New Products Arrival"))
      .slice(0, 4);

    const selectedGrid = document.getElementById("selected-products-grid");
    selectedProducts.forEach((product, index) => {
      const card = selectedGrid.querySelector(`[data-card-index="${index}"]`);
      if (card) {
        updateProductCard(card, product);
        const addToCartBtn = card.querySelector(".button-secondary");
        if (addToCartBtn) {
          addToCartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            addToCart(product);
          });
        }
      }
    });

    const newGrid = document.getElementById("new-products-grid");
    newProducts.forEach((product, index) => {
      const card = newGrid.querySelector(`[data-card-index="${index}"]`);
      if (card) {
        updateProductCard(card, product);
        const viewProductBtn = card.querySelector(".button-secondary");
        if (viewProductBtn) {
          viewProductBtn.addEventListener("click", (e) => {
            e.preventDefault();
            addToCart(product);
          });
        }
      }
    });
  } catch (error) {
    console.error("Failed to load product data:", error);
  }
}

function initializeSliders() {
  return new Swiper(".categories-slider", {
    slidesPerView: 4,
    spaceBetween: 30,
    loop: true,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadHomeProducts();
  initializeSliders();
});
