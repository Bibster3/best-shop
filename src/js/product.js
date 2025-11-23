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
  fetch("../assets/data.json")
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
});



// ----- REVIEWS ----


