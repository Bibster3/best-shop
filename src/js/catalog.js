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
  const getCart = () => {
    try {
      const data = JSON.parse(localStorage.getItem("cart")) || [];
      // Ensure data is an array before filtering
      return Array.isArray(data)
        ? data.filter((i) => i && typeof i === "object")
        : [];
    } catch {
      return [];
    }
  };

  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
        discountValue: product.discountValue || 0, // Optional: if you have discounts
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
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
    const size = sizeSelect ? sizeSelect.value : "";
    const color = colorSelect ? colorSelect.value : "";
    const category = categorySelect ? categorySelect.value : "";
    const sales = salesFilter ? salesFilter.checked : false;

    filteredProducts = allProducts.filter((product) => {
      const sizeMatch =
        !size ||
        size === "" ||
        (product.size &&
          product.size.split(", ").some((s) => s.trim() === size));

      const colorMatch = !color || color === "" || product.color === color;
      const categoryMatch =
        !category || category === "" || product.category === category;
      const salesMatch = !sales || (sales && product.salesStatus);
      // Exclude products if their imageUrl contains "set-"
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
        window.location.href = `product.html?id=${product.id}`;
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
    // Create popup element
    const popup = document.createElement("div");
    popup.className = "search-popup";
    popup.innerHTML = `
      <div class="popup-overlay"></div>
      <div class="popup-content">
        <h3>Product Not Found</h3>
        <p>No products found for "<strong>${searchTerm}</strong>"</p>
        <div class="popup-close-btn button button-primary" style="width: fit-content; margin: 0 auto; padding: 5px 20px; cursor: pointer;">OK</div>
      </div>
    `;
    document.body.appendChild(popup);

    // Styling for the popup (Dynamically added since CSS file wasn't provided for this part)
    const style = document.createElement("style");
    style.innerHTML = `
      .search-popup { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; display: flex; justify-content: center; align-items: center; }
      .popup-overlay { position: absolute; width: 100%; height: 100%; background: rgba(0,0,0,0.5); }
      .popup-content { position: relative; background: white; padding: 30px; border-radius: 8px; text-align: center; min-width: 300px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
      .popup-content h3 { margin-top: 0; color: #333; }
      .popup-content p { margin-bottom: 20px; color: #666; }
    `;
    document.head.appendChild(style);

    // Close Logic
    const closeBtn = popup.querySelector(".popup-close-btn");
    const overlay = popup.querySelector(".popup-overlay");

    const closePopup = () => {
      document.body.removeChild(popup);
      document.head.removeChild(style); // Clean up style
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

    let tagHtml = "";
    if (product.salesStatus === true) {
      tagHtml =
        '<span class="product-card__tag" style="display: block;" >SALE</span>';
    }

    card.innerHTML = `
      <a href="../html/product-details.html?id=${product.id}" class="product-card__image-link">
        <div class="product-card__image-container">
          <img src="../${product.imageUrl}" alt="${product.name}" class="product-card__image">
          ${tagHtml}
        </div>
      </a>
      <div class="product-card__details">
        <div class="product-card__content">
          <h3 class="product-card__name">${product.name}</h3>
          <p class="product-card__price">$${product.price.toFixed(2)}</p>
        </div>
        <button class="button button-primary product-card__button">Add to Cart</button>
      </div>`;
    const addToCartBtn = card.querySelector(".product-card__button");
    addToCartBtn.addEventListener("click", (e) => {
      // Prevent navigation if inside a link
      e.preventDefault();
      addToCart(product);

      const originalText = addToCartBtn.textContent;
      addToCartBtn.textContent = "Added!";
      addToCartBtn.style.backgroundColor = "#504e4a";
      addToCartBtn.disabled = true; // Prevent double clicks

      setTimeout(() => {
        addToCartBtn.textContent = originalText;
        addToCartBtn.style.backgroundColor = "";
        addToCartBtn.disabled = false;
      }, 500);
    });
    return card;
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
      <a href="../html/product-details.html?id=${product.id}" class="best-sets-list__link">
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

