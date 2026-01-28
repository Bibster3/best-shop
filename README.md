# BEST SHOP — Front-end E‑commerce Project

**Live Demo:** [View Live Site](https://bibster3.github.io/best-shop/)  
**Figma Design:** [Figma Template](https://www.figma.com/design/xIJCLjWNQJdM8rfzdinqRr/Best-Shop--Fundamentals-?node-id=0-1&p=f)

A comprehensive, multi-page responsive e‑commerce platform built entirely with **Vanilla JavaScript (ES Modules)**. 

### 💡 Project Origin
This project was originally developed as part of the **EPAM Campus** curriculum. Due to a relocation to a different city, I transitioned to independent development. I utilized this opportunity to take full ownership of the project, architecture, and final implementation, successfully bringing the Figma design to life as a functional, logic-driven application.

---

## 📖 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [What I Learned](#-what-i-learned)
- [Author & Contact](#-author--contact)

---

## 🚀 Features

* **Modular Architecture:** Built using ES modules for maintainable and scalable code.
* **Dynamic Product Catalog:** Features client-side filtering, sorting (price, name), and pagination (12 items per page).
* **Intelligent Shopping Cart:** * Persistence via `LocalStorage`.
    * Real-time UI synchronization using Custom Events.
    * Merging logic based on product ID, size, and color.
    * Dynamic discount calculation rules.
* **Dynamic Routing:** Product Detail pages populated via URL parameters (`?id=...`) fetching data from a central JSON.
* **Responsive Design:** Mobile-first approach with breakpoints at 768px, 1024px, and 1440px.
* **Form Validation:** Client-side validation for the contact form ensuring correct email formats and required fields.
* **Interactive UI:** High-performance sliders powered by Swiper.js.

---

## 🛠 Tech Stack

* **HTML5:** Semantic markup for accessibility and SEO.
* **SCSS (Sass):** BEM naming convention, variables, mixins, and modular partials.
* **JavaScript (ES6+):** Vanilla JS with ES modules (No frameworks used).
* **NPM:** Development scripts for SASS compilation and live-reloading.
* **Data Source:** Local JSON-driven product engine.

---

## ⚙️ How It Works

1.  **Data Management:** All product information resides in `src/assets/data.json`. The app fetches this data dynamically to populate the Catalog and Detail pages.
2.  **State Sync:** When a user clicks "Add to Cart", a custom `cartUpdated` event is dispatched. A global listener in the header catches this to update the cart badge count instantly across all pages.
3.  **Persistence:** The cart state is saved to `localStorage`, ensuring the user's items remain even after a page refresh or browser restart.
4.  **Styling:** SCSS is compiled into a single `main.css` file. Layouts utilize CSS Grid and Flexbox for high-fidelity alignment to the Figma source.



---

## 📂 Project Structure

```text
├── src/
│   ├── html/       # Page templates (index, catalog, product, about, contact)
│   ├── js/         # Logic modules (components.js, cart.js, car-badge.js)
│   ├── scss/       # SASS architecture (abstracts, components, layouts)
│   ├── assets/     
│   │   ├── data.json     # The "Database" - Central product source
│   │   └── images/       # Optimized SVG and PNG assets
├── dist/           # Production output (compiled CSS)
├── index.html      # Main entry point
└── package.json    # Build scripts & dev dependencies
🛠 Setup & Installation
Prerequisites: Node.js and npm installed.

Clone the repository:

Bash
git clone [https://github.com/Bibster3/best-shop.git](https://github.com/Bibster3/best-shop.git)
Install dependencies:

Bash
npm install
Start development server:

Bash
npm run dev
🧠 What I Learned
Vanilla State Handling: Managing complex data flow between different pages without a framework like React.

Component-Based Thinking: Creating reusable HTML templates (Header/Footer) injected via JavaScript.

CSS Architecture: Structuring large-scale SCSS files to keep styles modular and easy to debug.

UX Design: Implementing small but crucial details like "Added!" visual feedback and smooth tab transitions.

📬 Author / Contact
Bilyana

GitHub:[Bibster3] (https://github.com/Bibster3)

Portfolio: [View My Work] (https://bibster3.github.io/bilyana-st/)

Email: bilyana.f.st@gmail.com