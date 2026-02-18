import test from "node:test";
import assert from "node:assert/strict";

function createLocalStorageMock() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

test("addToCart increases quantity for existing item", async () => {
  global.localStorage = createLocalStorageMock();
  global.window = { dispatchEvent: () => {} };
  global.CustomEvent = class {
    constructor(type) {
      this.type = type;
    }
  };

  const { addToCart } = await import("../src/js/components.js");

  const product = { id: "p-1", name: "Bag", price: 120, imageUrl: "img.png" };
  addToCart(product);
  addToCart(product);

  const cart = JSON.parse(global.localStorage.getItem("cart"));
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 2);
});

test("calculateCartSummary computes subtotal, discounts and total", async () => {
  const { calculateCartSummary } = await import("../src/js/cart.js");

  const cart = [
    { id: "p1", price: 2000, quantity: 2, discountValue: 100 },
  ];

  const summary = calculateCartSummary(cart);
  assert.equal(summary.subTotal, 4000);
  assert.equal(summary.itemDiscount, 200);
  assert.equal(summary.volumeDiscount, 380);
  assert.equal(summary.totalDiscount, 580);
  assert.equal(summary.shipping, 50);
  assert.equal(summary.total, 3470);
});

test("getSearchOutcome returns single result redirect outcome", async () => {
  const { getSearchOutcome } = await import("../src/js/catalog.js");

  const products = [
    { id: "1", name: "Travel Pro Max" },
    { id: "2", name: "City Case" },
  ];

  const outcome = getSearchOutcome(products, "pro max");
  assert.equal(outcome.type, "single");
  assert.equal(outcome.product.id, "1");
});
