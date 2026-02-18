import { getCart, saveCart, getCartItemCount } from "./cart-store.js";

const MIN_TOTAL_FOR_VOLUME_DISCOUNT = 3000;
const VOLUME_DISCOUNT_RATE = 0.1;
const SHIPPING_COST = 50;

const parsePrice = (price) => parseFloat(price.toString().replace("$", "")) || 0;

export const calculateCartSummary = (cart) => {
  const subTotal = cart.reduce((sum, item) => {
    const originalPrice = parsePrice(item.price);
    return sum + originalPrice * (item?.quantity || 0);
  }, 0);

  const itemDiscount = cart.reduce((sum, item) => {
    const discountPerItem = parseFloat(item.discountValue || 0);
    return sum + discountPerItem * (item?.quantity || 0);
  }, 0);

  const subTotalAfterItemDiscount = subTotal - itemDiscount;
  const volumeDiscount =
    subTotalAfterItemDiscount > MIN_TOTAL_FOR_VOLUME_DISCOUNT
      ? subTotalAfterItemDiscount * VOLUME_DISCOUNT_RATE
      : 0;

  const totalDiscount = itemDiscount + volumeDiscount;
  const total = subTotal - totalDiscount + SHIPPING_COST;

  return {
    subTotal,
    itemDiscount,
    volumeDiscount,
    totalDiscount,
    shipping: SHIPPING_COST,
    total,
  };
};
const updateCartItemQuantity = (productId, change) => {
  let cart = getCart();
  const index = cart.findIndex((item) => item.id === productId);
  if (index !== -1) {
    let newQuantity = cart[index].quantity + change;
    if (newQuantity <= 0) {
      cart.splice(index, 1);
    } else {
      const price =
        parseFloat(cart[index].price.toString().replace("$", "")) || 0;
      cart[index].quantity = newQuantity;
      cart[index].total = (price * newQuantity).toFixed(2);
    }
    saveCart(cart);
    getCartContent();
    updateSummary();
  }
};
const deleteCartItem = (productId) => {
  let cart = getCart();
  const newCart = cart.filter((item) => item.id !== productId);
  saveCart(newCart);
  getCartContent();
  updateSummary();
};
const updateCartBadge = () => {
  const totalItems = getCartItemCount();
  const badge = document.querySelector(".cart-count");
  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems.toString();
      badge.style.display = "flex";
    } else {
      badge.textContent = "0";
      badge.style.display = "none";
    }
  }
};
const updateSummary = () => {
  const cart = getCart();
  const summary = calculateCartSummary(cart);

  const subTotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const shippingEl = document.querySelector(
    ".summary-line:nth-child(3) span:last-child"
  );
  const discountLineEl = document.querySelector(".summary-line.discount");
  const discountValueEl = document.getElementById("discount-value");

  if (subTotalEl) subTotalEl.textContent = `$${summary.subTotal.toFixed(2)}`;
  if (shippingEl) shippingEl.textContent = `$${summary.shipping.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${summary.total.toFixed(2)}`;

  if (discountLineEl && discountValueEl) {
    if (summary.totalDiscount > 0.01) {
      discountValueEl.textContent = `-$${summary.totalDiscount.toFixed(2)}`;
      discountLineEl.style.display = "flex";
    } else {
      discountLineEl.style.display = "none";
    }
  }
};
const getCartContent = () => {
  const cartContainer = document.querySelector(".cart-container");
  const cartHeader = document.querySelector(".cart-header");
  const cartLowerContainer = document.querySelector(".cart-lower_container");
  if (!cartContainer) return;
  const cart = getCart();
  if (cart.length === 0) {
    cartContainer.innerHTML = `
        <div class="empty-cart-message">
            Your cart is empty. Use the catalog to add new items.
        </div>
    `;
    if (cartHeader) cartHeader.style.display = "none";
    if (cartLowerContainer) cartLowerContainer.style.display = "none";
    return;
  }
  cartContainer.innerHTML = "";
  cart.forEach((product) => {
    const price = parseFloat(product.price.toString().replace("$", "")) || 0;
    const itemTotal = (price * product.quantity).toFixed(2);
    const tableRow = document.createElement("div");
    tableRow.innerHTML = `
    <div class="cart-item" data-id="${product.id}">
          <div class="cart-item-img_container">
            <img
              src="../${product.imageUrl}"
              alt="${product.name}"
            />
          </div>
          <div class="cart-product-name">${product.name}</div>
          <div class="cart-price">$${product.price}</div>          
          <div class="cart-quantity">
            <div class="cart-deduct" data-product-id="${product.id}">
              <p>-</p>
            </div>
            <div class="cart-quantity">
              <p>${product.quantity}</p>
            </div>
            <div class="cart-add" data-product-id="${product.id}">
              <p>+</p>
            </div>
          </div>
          <div class="cart-total">$${itemTotal}</div>
          <div class="cart-delete" data-product-id="${product.id}">
            <img
              src="../assets/images/trash-bin.svg"
              alt="trash bin"
            />
          </div>
      </div>
  `;
    cartContainer.appendChild(tableRow);
  });
  document.querySelectorAll(".cart-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      updateCartItemQuantity(productId, 1);
    });
  });
  document.querySelectorAll(".cart-deduct").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.productId;
      updateCartItemQuantity(productId, -1);
    });
  });
  document.querySelectorAll(".cart-delete").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cartItem = btn.closest(".cart-item");
      if (cartItem) {
        const productId = cartItem.dataset.id;
        deleteCartItem(productId);
      }
    });
  });
  updateSummary();
};
const clearCart = () => {
  saveCart([]);
  getCartContent();
  updateSummary();
};
const showThankYou = () => {
  const cartContainer = document.querySelector(".cart-container");
  if (cartContainer) {
    cartContainer.innerHTML = `
      <div class="empty-cart-message">
        Thank you for your purchase.
      </div>
    `;
  }
};
const checkout = () => {
  clearCart();
  showThankYou();
};
function initCartPage() {
  document.querySelector(".btn-clear")?.addEventListener("click", clearCart);
  document.querySelector(".btn-checkout")?.addEventListener("click", checkout);
  document.querySelector(".btn-continue")?.addEventListener("click", () => {
    window.location.href = "catalog.html";
  });
  getCartContent();
  updateSummary();
  updateCartBadge();
}
export {
  updateCartBadge,
  getCartContent,
  updateSummary,
  clearCart,
  checkout,
  initCartPage,
};
