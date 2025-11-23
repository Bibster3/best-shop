const JSON_URL = "../assets/data.json";

document.addEventListener("DOMContentLoaded", () => {
  const productTitleEl = document.getElementById("product-title");
  const productImageEl = document.getElementById("product-image");
  const productPriceEl = document.getElementById("product-price");
  const productRatingEl = document.getElementById("product-rating");

  // Get product ID from URL
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  if (!productId) {
    document.getElementById("product-details-content").innerHTML =
      "<p>Product not found. Please select a product from the catalog.</p>";
    return;
  }

  // Fetch product data
  fetch(JSON_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const products = data.data;
      const product = products.find((p) => p.id === productId);

      if (product) {
        renderProductDetails(product);
      } else {
        document.getElementById("product-details-content").innerHTML =
          "<p>Product not found.</p>";
      }
    })
    .catch((error) => {
      console.error("Error fetching product data:", error);
      document.getElementById("product-details-content").innerHTML =
        "<p>There was an error loading the product details.</p>";
    });

  /**
   * Renders the product details on the page.
   * @param {object} product - The product object.
   */
  function renderProductDetails(product) {
    productTitleEl.textContent = product.name;
    productImageEl.src = `../${product.imageUrl}`;
    productImageEl.alt = product.name;
    productPriceEl.textContent = product.price;
    renderRating(product.rating);
  }

  /**
   * Renders the star rating for a product.
   * @param {number} rating - The product's rating.
   */
  function renderRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    productRatingEl.innerHTML =
      "★".repeat(fullStars) +
      (halfStar ? "½" : "") +
      "☆".repeat(5 - fullStars - (halfStar ? 1 : 0));
  }

  loadMayLikeProducts();
});

const tabButtons = document.querySelectorAll(".tab-button");
const tabPanes = document.querySelectorAll(".tab-pane");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // 1. Remove active class from all buttons and panes
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabPanes.forEach((pane) => pane.classList.remove("active"));

    // 2. Add active class to clicked button
    button.classList.add("active");

    // 3. Show corresponding tab pane
    const tabId = button.getAttribute("data-tab");
    const targetPane = document.getElementById(`${tabId}-tab`);
    if (targetPane) {
      targetPane.classList.add("active");
    }
  });
});

async function loadMayLikeProducts() {
  try {
    const response = await fetch(JSON_URL);
    const fullData = await response.json();

    const allProducts = fullData.data || [];

    let mayLikeProducts = allProducts.filter((p) =>
      p.blocks.includes("You May Also Like")
    );

    // Shuffle the array (Fisher–Yates shuffle)
    for (let i = mayLikeProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [mayLikeProducts[i], mayLikeProducts[j]] = [
        mayLikeProducts[j],
        mayLikeProducts[i],
      ];
    }

    //Take the first 4 items after shuffle
    mayLikeProducts = mayLikeProducts.slice(0, 4);

    const mayLikeGrid = document.getElementById("may-also-like-grid");

    mayLikeProducts.forEach((product, index) => {
      const card = mayLikeGrid.querySelector(`[data-card-index="${index}"]`);
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
  } catch (error) {
    console.error("Failed to load product data:", error);
  }
}

