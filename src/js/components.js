import { addItemToCart } from "./cart-store.js";

export const headerTemplate = `
      <header>

     <div class="header__top">
        <div class="social_icons">
          <a href="#"><img src="../assets/images/facebook.svg" alt ="facebook" /></a>
          <a href="#"><img src="../assets/images/twitter.svg" alt ="twitter"/></a>
          <a href="#"><img src="../assets/images/instagram.svg" alt="instagram" /></a>
        </div>
        <div class="header_container">
          <a href="../../index.html" class="header__logo">
            <img src="../assets/images/logo-briefcase.svg" alt="Suitcase" />
            BEST SHOP</a
          >
        </div>
        <div class="user_icons">
          <a href="#"><img src="../assets/images/user.svg" alt ="user" /></a>
          <a href="../html/cart.html"
            ><img src="../assets/images/shopping-cart.svg" alt="shopping-cart"
          /></a>
        </div>
      </div>
      <nav class="header_nav">
        <ul>
          <li><a href="../../index.html" class="active">Home</a></li>
          <li>
            <a href="../html/catalog.html"
              >Catalog<img src="../assets/images/catalog-arrow.svg" alt="arrow"
            /></a>
          </li>
          <li><a href="../html/about.html">About Us</a></li>
          <li><a href="../html/contact.html">Contact Us</a></li>
        </ul>
      </nav>
      </header>
`;

export const footerTemplate = `
    <footer class="footer">
    <div class="benefits">
        <div class="benefits__inner">
          <h3 class="benefits__title">Our Benefits</h3>

          <div class="benefits__items">
            <div class="benefit">
              <img
                src="../assets/images/travel.svg"
                alt="icon-travel-hospitality"
              />
              <p>Velit nisl sodales eget donec quis. volutpat orci.</p>
            </div>

            <div class="benefit">
              <img src="../assets/images/truck.svg" alt="icon-truck" />
              <p>Dolor eu varius. Morbi fermentum velit nisl.</p>
            </div>

            <div class="benefit">
              <img src="../assets/images/coins.svg" alt="icon-coins" />
              <p>Malesuada fames ac ante ipsum primis in faucibus.</p>
            </div>

            <div class="benefit">
              <img
                src="../assets/images/learning-hat.svg"
                alt="icon-education"
              />
              <p>Nisi sodales eget donec quis. volutpat orci.</p>
            </div>
          </div>
        </div>
      </div>
      <div class="footer__content">
        <!-- LEFT SIDE -->
        <div class="footer__left">
          <div class="footer__links-grid">
            <div class="footer__column">
              <h4><a href="../html/about.html">About Us</a></h4>
              <ul>
                <li>Organisation</li>
                <li>Partners</li>
                <li>Clients</li>
              </ul>
            </div>

            <div class="footer__column">
              <h4>Interesting Links</h4>
              <ul>
                <li>Photo Gallery</li>
                <li>Our Team</li>
                <li>Socials</li>
              </ul>
            </div>

            <div class="footer__column">
              <h4>Achievements</h4>
              <ul>
                <li>Winning Awards</li>
                <li>Press</li>
                <li>Our Amazing Clients</li>
              </ul>
            </div>
          </div>

          <div class="footer__shipping">
            <h4>Shipping Information</h4>
            <p>
              Nulla eleifend pulvinar purus, molestie euismod odio imperdiet ac.
              Ut sit amet erat nec nibh rhoncus varius in non lorem. Donec
              interdum, lectus in convallis pulvinar, enim elit porta sapien,
              vel finibus erat felis sed neque. Etiam aliquet neque sagittis
              erat tincidunt aliquam.
            </p>
          </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="footer__contact">
          <h4><a href="../html/contact.html">Contact Us</a></h4>
          <p>
            Bendum dolor eu varius. Morbi fermentum velit sodales egesonec.
            volutpat orci. Sed ipsum felis, tristique egestas et, convallis ac
            velitin consequat nec luctus.
          </p>

          <ul class="contact__info">
            <li>
              <img src="../assets/images/phone_icon.svg" alt="phone" /> Phone:
              (+63) 236 6322
            </li>
            <li>
              <img src="../assets/images/mail.svg" alt="mail" />
              <a href="mailto:public@news.com">public@news.com</a>
            </li>
            <li>
              <img src="../assets/images/clock.svg" alt="clock" /> Mon – Fri:
              10am – 6pm
              <br />
              Sat – Sun: 10am – 6pm
            </li>
            <li>
              <img src="../assets/images/pin.svg" alt="pin" /> 639 Jade Valley,
              Washington Dc
            </li>
          </ul>
        </div>
      </div>
        </footer>
`;

/*******  d742e835-06bf-4309-a483-252eb1d994ab  *******/
export function updateProductCard(cardElement, product) {
  if (!product) {
    cardElement.style.display = "none";
    return;
  }

  const isRoot = !window.location.pathname.includes("/html/");
  const basePath = isRoot ? "src/" : "../";
  // Adjust the product details link based on where we are
  const detailsPath = isRoot
    ? "src/html/product-details.html"
    : "product-details.html";

  // Update Image
  const imgElement = cardElement.querySelector('[data-field="image"]');
  if (imgElement) {
    imgElement.src = `${basePath}${product.imageUrl}`;
    imgElement.alt = product.name;
  }

  // Update Name and Price
  const nameEl = cardElement.querySelector('[data-field="name"]');
  if (nameEl) nameEl.textContent = product.name;

  const priceEl = cardElement.querySelector('[data-field="price"]');
  if (priceEl) priceEl.textContent = `$${product.price.toFixed(2)}`;

  // Update the Link (The "View Product" button)
  const linkEl =
    cardElement.querySelector(".button-secondary") ||
    cardElement.querySelector('a[data-field="link"]');
  if (linkEl) {
    linkEl.setAttribute("href", `${detailsPath}?id=${product.id}`);
    linkEl.onclick = null;
  }

  // Update Tags
  const tagElement = cardElement.querySelector('[data-field="tag"]');
  if (tagElement) {
    if (product.salesStatus === true) {
      tagElement.textContent = "SALE";
      tagElement.style.display = "block";
    } else if (
      product.blocks &&
      product.blocks.includes("New Products Arrival")
    ) {
      tagElement.textContent = "NEW";
      tagElement.style.display = "block";
    } else {
      tagElement.style.display = "none";
    }
  }
}

export function addToCart(product) {
  addItemToCart(product);
}

export function createProductCard(product, addToCartCallback) {
  const card = document.createElement("div");
  card.className = "product-card";

  // Tag Logic
  let tagHtml = "";
  if (product.salesStatus === true) {
    tagHtml =
      '<span class="product-card__tag" style="display: block;">SALE</span>';
  } else if (
    product.blocks &&
    product.blocks.includes("New Products Arrival")
  ) {
    tagHtml =
      '<span class="product-card__tag" style="display: block;">NEW</span>';
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

  const btn = card.querySelector(".product-card__button");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    if (addToCartCallback) {

      // Visual feedback
      btn.textContent = "Added!";
      btn.classList.add("added"); // Add a CSS class for styling
      setTimeout(() => {
        btn.textContent = "Add to Cart";
        btn.classList.remove("added");
      }, 1000);
      addToCartCallback(product);

    }
  });

  return card;
}
