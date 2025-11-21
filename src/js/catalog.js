document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("product-grid");
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");
  const pageIndicator = document.getElementById("page-indicator");
  const resultsCount = document.querySelector(".results-count");

  function querySelectByLabel(label) {
    const labels = Array.from(document.querySelectorAll(".field__label"));
    const foundLabel = labels.find((l) => l.textContent.trim() === label);
    return foundLabel ? foundLabel.nextElementSibling : null;
  }

  const sizeSelect = querySelectByLabel("Size");
  const colorSelect = querySelectByLabel("Color");
  const categorySelect = querySelectByLabel("Category");
  const salesFilter = document.querySelector('input[name="sales"]');
  const clearFiltersButton = document.querySelector(
    ".filter-controls__action-bar .button-primary"
  );
  const sortSelect = document.querySelector(
    ".catalog-layout__main-content .field__select"
  );

  // --- State Variables ---
  let allProducts = [];
  let filteredProducts = [];
  let sortedProducts = [];
  const PRODUCTS_PER_PAGE = 12;
  let currentPage = 1;

  if (
    !productGrid ||
    !prevButton ||
    !nextButton ||
    !pageIndicator ||
    !resultsCount
  ) {
    console.error(
      "Critical elements not found. Please check your HTML structure and IDs."
    );
    return;
  }

  // --- Data Fetching ---
  async function fetchProducts() {
    try {
      const response = await fetch("../assets/data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      allProducts = data.data;
      applyFilters();
    } catch (error) {
      console.error("Could not fetch products:", error);
      productGrid.innerHTML =
        "<p>Error loading products. Please try again later.</p>";
    }
  }

  // --- Filtering Logic ---
  function applyFilters() {
    // FIX: Retrieve values directly from the initialized select variables.
    // The querySelectByLabel function already found these elements.
    const size = sizeSelect ? sizeSelect.value : "";
    const color = colorSelect ? colorSelect.value : "";
    const category = categorySelect ? categorySelect.value : "";

    // The sales filter uses a single radio button (which is correctly named "sales" in the HTML)
    const sales = salesFilter ? salesFilter.checked : false;

    filteredProducts = allProducts.filter((product) => {
      // Size Match Logic (Handles multi-size string in product.size like "S, M, XL")
      const sizeMatch =
        !size ||
        size === "" || // If the selected value is the default "Choose option" (empty string)
        product.size.split(", ").some((s) => s.trim() === size); // Check if the selected size is within the product's available sizes

      // Color Match Logic
      const colorMatch = !color || color === "" || product.color === color;

      // Category Match Logic
      const categoryMatch =
        !category || category === "" || product.category === category;

      // Sales Match Logic (Only match if 'sales' is checked AND the product is on sale)
      const salesMatch = !sales || product.salesStatus === true;

      return sizeMatch && colorMatch && categoryMatch && salesMatch;
    });

    currentPage = 1;
    sortProducts();
  }

  function sortProducts() {
    if (!sortSelect) {
      sortedProducts = [...filteredProducts];
      renderPage(currentPage);
      return;
    }

    const sortBy = sortSelect.value;
    sortedProducts = [...filteredProducts];

    switch (sortBy) {
      case "price-asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "popularity":
        sortedProducts.sort((a, b) => b.popularity - a.popularity);
        break;
      case "rating":
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
    }

    renderPage(currentPage);
  }

  function renderPage(page) {
    const totalProducts = sortedProducts.length;
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

    currentPage = Math.max(1, Math.min(page, totalPages || 1));

    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = Math.min(start + PRODUCTS_PER_PAGE, totalProducts);
    const paginatedProducts = sortedProducts.slice(start, end);

    productGrid.innerHTML = "";
    if (totalProducts === 0) {
      productGrid.innerHTML = "<p>No products match your criteria.</p>";
    } else {
      paginatedProducts.forEach((product) => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
      });
    }

    updatePaginationControls(totalPages);
    updateResultsCount(start, end, totalProducts);
  }

  function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <img src="../${product.imageUrl}" alt="${
      product.name
    }" class="product-card__image">
            <h3 class="product-card__name">${product.name}</h3>
            <p class="product-card__price">$${product.price.toFixed(2)}</p>
            ${
              product.salesStatus
                ? '<span class="product-card__sale">Sale</span>'
                : ""
            }
        `;
    return card;
  }

  function updatePaginationControls(totalPages) {
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  }

  function updateResultsCount(start, end, total) {
    if (total === 0) {
      resultsCount.textContent = `0 results`;
    } else {
      resultsCount.textContent = `Showing ${
        start + 1
      }–${end} of ${total} results`;
    }
  }

  function clearFilters() {
    if (sizeSelect) sizeSelect.selectedIndex = 0;
    if (colorSelect) colorSelect.selectedIndex = 0;
    if (categorySelect) categorySelect.selectedIndex = 0;
    if (salesFilter) salesFilter.checked = false;
    if (sortSelect) sortSelect.selectedIndex = 0;

    applyFilters();
  }

  if (sizeSelect) sizeSelect.addEventListener("change", applyFilters);
  if (colorSelect) colorSelect.addEventListener("change", applyFilters);
  if (categorySelect) categorySelect.addEventListener("change", applyFilters);
  if (salesFilter) {
    salesFilter.addEventListener("click", function (e) {
      if (this.wasChecked) {
        e.preventDefault();
        this.checked = false;
      }
      this.wasChecked = this.checked;
      applyFilters();
    });
    salesFilter.addEventListener("change", applyFilters);
  }
  if (sortSelect) sortSelect.addEventListener("change", sortProducts);
  if (clearFiltersButton)
    clearFiltersButton.addEventListener("click", clearFilters);

  // Pagination button listeners
  prevButton.addEventListener("click", () => renderPage(currentPage - 1));
  nextButton.addEventListener("click", () => renderPage(currentPage + 1));

  // --- Initialization ---
  fetchProducts();
});
