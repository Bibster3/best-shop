export function getCart() {
  try {
    const data = JSON.parse(localStorage.getItem("cart")) || [];
    return Array.isArray(data)
      ? data.filter((item) => item && typeof item === "object")
      : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("cartUpdated"));
}

export function addItemToCart(product) {
  const cart = getCart();
  const existingItemIndex = cart.findIndex((item) => item.id === product.id);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
}

export function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item?.quantity || 0), 0);
}
