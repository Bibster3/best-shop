import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("homepage CTA points to catalog page", () => {
  const html = fs.readFileSync("index.html", "utf8");
  assert.ok(html.includes('href="src/html/catalog.html"'));
});

test("catalog exact search redirects to product-details page", () => {
  const js = fs.readFileSync("src/js/catalog.js", "utf8");
  assert.ok(js.includes('window.location.href = `product-details.html?id=${product.id}`;'));
});
