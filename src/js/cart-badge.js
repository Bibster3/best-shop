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
      badge.className = "cart-count";
      badge.style.cssText =
        "position: absolute; top: -8px; right: -8px; background: #FFFFFF; color: #b92770; font-size: 10px; font-weight: bold; border: 2px solid #b92770; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;";
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
  
  document.addEventListener("DOMContentLoaded", () => {
      updateCartBadge();
  });

    window.addEventListener("cartUpdated", () => {
        updateCartBadge();
    });