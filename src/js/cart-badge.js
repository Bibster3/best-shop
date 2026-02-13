function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
  
    let badge = document.querySelector(".cart-count");
    const cartIconContainer = document.querySelector(
      ".user_icons a[href*='cart']"
    );
  
    if (!badge && cartIconContainer) {
      badge = document.createElement("span");
      badge.className = "cart-count cart-count--badge";
      cartIconContainer.style.position = "relative";
      cartIconContainer.appendChild(badge);
    }
  
    if (badge) {
      if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.style.display = "flex";
      } else {
        badge.style.display = "none";
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
      updateCartBadge();
  });

    window.addEventListener('cartUpdated', () => {
        updateCartBadge();
    });