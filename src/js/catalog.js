import { createProductCard, addToCart } from "./components.js";

document.addEventListener("DOMContentLoaded", () => {
  // --- Dropdown Menu Logic ---
  const catalogNavItem = document.querySelector(".nav-item--dropdown");
  const filterMenu = document.querySelector(".filter-dropdown-menu");
  let hideTimeout;

  if (catalogNavItem && filterMenu) {
    const showMenu = () => {
      clearTimeout(hideTimeout);
      filterMenu.style.display = "block";
    };

    const hideMenu = () => {
      hideTimeout = setTimeout(() => {
        filterMenu.style.display = "none";
      }, 300); // 300ms delay before hiding
    };

    catalogNavItem.addEventListener("mouseenter", showMenu);
    catalogNavItem.addEventListener("mouseleave", hideMenu);
    filterMenu.addEventListener("mouseenter", showMenu);
    filterMenu.addEventListener("mouseleave", hideMenu);

    // Ensure the menu is hidden on initial load
    filterMenu.style.display = "none";
  }

  // --- Selectors ---
  const productGrid = document.getElementById("product-grid");
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");
  const pageIndicator = document.getElementById("page-indicator");
  const resultsCount = document.querySelector(".results-count");
  const bestSetsList = document.getElementById("best-sets-list");
  const searchInput = document.getElementById("searchModels"); // Search Input Selector

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
  const PRODUCTS_PER_PAGE = 9;
  let currentPage = 1;

  if (
    !productGrid ||
    !prevButton ||
    !nextButton ||
    !pageIndicator ||
    !resultsCount ||
    !bestSetsList
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
      renderBestSets(allProducts);
      applyFilters();
    } catch (error) {
      console.error("Could not fetch products:", error);
      productGrid.innerHTML =
        "<p>Error loading products. Please try again later.</p>";
    }
  }

  // --- Filtering Logic (Dropdowns) ---
  function applyFilters() {
    // Get current filter values
    const size = sizeSelect?.value || "";
    const color = colorSelect?.value || "";
    const category = categorySelect?.value || "";
    const sales = salesFilter?.checked || false;

    filteredProducts = allProducts.filter((product) => {
      // REFACTORED: Uses optional chaining (?.)
      // If product.size is null/undefined, it stops automatically and returns undefined (falsy).
      // Otherwise, it proceeds to split and check the size.
      const sizeMatch =
        !size || product.size?.split(", ").some((s) => s.trim() === size);

      const colorMatch = !color || product.color === color;
      const categoryMatch = !category || product.category === category;
      const salesMatch = !sales || product.salesStatus;

      // Checks if image exists AND excludes images with "set-"
      const imageResolutionMatch =
        product.imageUrl && !product.imageUrl.includes("set-");

      return (
        sizeMatch &&
        colorMatch &&
        categoryMatch &&
        salesMatch &&
        imageResolutionMatch
      );
    });

    currentPage = 1;
    sortProducts();
  }

  // --- Search Logic (Pressing Enter) ---
  function handleSearch(searchTerm) {
    if (!searchTerm.trim()) {
      // If empty, just reset to standard filters
      applyFilters();
      return;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    // Filter based on name containing the keyword
    const results = allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchLower)
    );

    if (results.length > 0) {
      if (results.length === 1) {
        // 1. Exact Match (Single Result) -> Redirect to Product Page
        const product = results[0];
        // Assuming product.html is in the same directory as catalog.html
        window.location.href = `product-details.html?id=${product.id}`;
      } else {
        // 2. Multiple Results -> Filter the grid
        filteredProducts = results;
        currentPage = 1;
        sortProducts();
      }
    } else {
      // 3. No Results -> Show Popup
      showNotFoundPopup(searchTerm);
    }
  }

  function showNotFoundPopup(searchTerm) {
    const popup = document.createElement("div");
    popup.className = "search-popup";

    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    const content = document.createElement("div");
    content.className = "popup-content";

    const title = document.createElement("h3");
    title.textContent = "Product Not Found";

    const message = document.createElement("p");
    message.textContent = `No products found for "${searchTerm}"`;

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "popup-close-btn button button-primary";
    closeBtn.textContent = "OK";

    content.append(title, message, closeBtn);
    popup.append(overlay, content);
    document.body.appendChild(popup);

    const closePopup = () => {
      document.body.removeChild(popup);
    };

    closeBtn.addEventListener("click", closePopup);
    overlay.addEventListener("click", closePopup);

    // Close on Escape key
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        closePopup();
        document.removeEventListener("keydown", handleEsc);
      }
    };
    document.addEventListener("keydown", handleEsc);
  }

  // --- Event Listeners ---

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission if wrapped in a form
        handleSearch(searchInput.value);
      }
    });
  }

  function sortProducts() {
    const sortBy = sortSelect ? sortSelect.value : "";
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
      default:
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
        // Pass the imported addToCart function as the second argument
        const card = createProductCard(product, addToCart); 
        productGrid.appendChild(card);
      });
    }

    updatePaginationControls(totalPages);
    updateResultsCount(start, end, totalProducts);
  }

  

  function updatePaginationControls(totalPages) {
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
    prevButton.disabled = currentPage <= 1;
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

  function generateRatingStars(rating) {
    const safeRating = rating || 0;
    const fullStars = Math.round(safeRating);
    const totalStars = 5;
    let starsHtml = '<div class="best-sets-list__rating">';

    const starSvg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>';

    for (let i = 0; i < totalStars; i++) {
      if (i < fullStars) {
        starsHtml += `<span class="star star--filled">${starSvg}</span>`;
      } else {
        starsHtml += `<span class="star star--empty">${starSvg}</span>`;
      }
    }
    starsHtml += "</div>";
    return starsHtml;
  }

  function createSidebarItem(product) {
    const ratingHtml = generateRatingStars(product.rating);
    return `
    <li class="best-sets-list__item">
      <a href="../html/product-details.html?id=${
        product.id
      }" class="best-sets-list__link">
        <div class="best-sets-list__image-wrapper">
            <img
              src="../${product.imageUrl}"
              alt="${product.name}"
              class="best-sets-list__image"
            />
        </div>
        <div class="best-sets-list__details">
          <p class="best-sets-list__name">${product.name}</p>
          ${ratingHtml}
          <p class="best-sets-list__price">$${product.price.toFixed(0)}</p>
        </div>
      </a>
    </li>
  `;
  }

  function renderBestSets(allProducts) {
    if (!bestSetsList) return;

    // 1. Filter: Find products where size is exactly "S, M, XL"
    const setProducts = allProducts.filter(
      (product) => product.size === "S, M, XL"
    );

    // 2. Shuffle: Randomize the order of the sets
    const shuffledSets = shuffleArray(setProducts);

    // 3. Select: Take the first 4 (or fewer if less than 4 exist)
    const top4Sets = shuffledSets.slice(0, 4);

    // 4. Render: Create and insert the HTML
    bestSetsList.innerHTML = "";
    top4Sets.forEach((set) => {
      bestSetsList.insertAdjacentHTML("beforeend", createSidebarItem(set));
    });
  }
  // Helper function for shuffling an array (Fisher-Yates)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

  prevButton.addEventListener("click", () => renderPage(currentPage - 1));
  nextButton.addEventListener("click", () => renderPage(currentPage + 1));

  fetchProducts();
});
