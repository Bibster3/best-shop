import test from "node:test";
import assert from "node:assert/strict";

function createEventTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, cb) {
      const arr = listeners.get(type) || [];
      arr.push(cb);
      listeners.set(type, arr);
    },
    dispatchEvent(event) {
      const arr = listeners.get(event.type) || [];
      for (const cb of arr) cb(event);
    },
  };
}

function createLocalStorageMock() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

function createFakeDocument(iconAnchor) {
  const docEvents = createEventTarget();
  return {
    ...docEvents,
    querySelector(selector) {
      if (selector === ".user_icons a[href*='cart']") return iconAnchor;
      if (selector === ".cart-count") return iconAnchor.children.find((c) => c.className.includes('cart-count')) || null;
      return null;
    },
    createElement(tag) {
      return {
        tagName: tag,
        className: "",
        textContent: "",
        style: {},
      };
    },
  };
}

test("browser integration: addToCart updates visible cart badge via cartUpdated event", async () => {
  const windowEvents = createEventTarget();
  const iconAnchor = {
    style: {},
    children: [],
    appendChild(node) {
      this.children.push(node);
    },
  };

  global.window = windowEvents;
  global.localStorage = createLocalStorageMock();
  global.document = createFakeDocument(iconAnchor);
  global.CustomEvent = class {
    constructor(type) {
      this.type = type;
    }
  };

  await import("../src/js/cart-badge.js");
  const { addToCart } = await import("../src/js/components.js");

  document.dispatchEvent(new CustomEvent("DOMContentLoaded"));

  addToCart({ id: "p-1", name: "Bag", price: 120, imageUrl: "img.png" });
  addToCart({ id: "p-1", name: "Bag", price: 120, imageUrl: "img.png" });

  const badge = iconAnchor.children.find((node) => node.className.includes("cart-count"));
  assert.ok(badge);
  assert.equal(badge.textContent, 2);
  assert.equal(badge.style.display, "flex");
});

test("calculateCartSummary computes subtotal, discounts and total", async () => {
  const { calculateCartSummary } = await import("../src/js/cart.js");

  const cart = [{ id: "p1", price: 2000, quantity: 2, discountValue: 100 }];

  const summary = calculateCartSummary(cart);
  assert.equal(summary.subTotal, 4000);
  assert.equal(summary.itemDiscount, 200);
  assert.equal(summary.volumeDiscount, 380);
  assert.equal(summary.totalDiscount, 580);
  assert.equal(summary.shipping, 50);
  assert.equal(summary.total, 3470);
});

test("search flow: Enter/single match resolves to product-details redirect URL", async () => {
  const { getSearchOutcome, applySearchOutcome } = await import("../src/js/catalog.js");

  const products = [
    { id: "1", name: "Travel Pro Max" },
    { id: "2", name: "City Case" },
  ];

  const outcome = getSearchOutcome(products, "pro max");
  let redirectedTo = "";

  applySearchOutcome(outcome, {
    applyFilters: () => {},
    onMultiple: () => {},
    onNone: () => {},
    redirect: (url) => {
      redirectedTo = url;
    },
  });

  assert.equal(outcome.type, "single");
  assert.equal(redirectedTo, "product-details.html?id=1");
});
