document.addEventListener("DOMContentLoaded", () => {
  // --- Header Catalog Hover ---
  const catalogLink = document.querySelector(
    '.header_nav a[href*="catalog.html"]'
  );
  const sidebar = document.querySelector(".catalog-layout__sidebar");

  if (catalogLink && sidebar) {
    let leaveTimeout;

    // Function to show the sidebar
    const showSidebar = () => {
      clearTimeout(leaveTimeout);
      sidebar.style.display = "block";
    };

    // Function to hide the sidebar after a short delay
    const hideSidebar = () => {
      leaveTimeout = setTimeout(() => {
        sidebar.style.display = "none";
      }, 200); // Delay allows moving the mouse from the link to the sidebar
    };

    // --- Event Listeners for Hover ---
    // When the mouse enters the catalog link's parent element, show the sidebar.
    catalogLink.parentElement.addEventListener("mouseenter", showSidebar);

    // When the mouse leaves the catalog link's parent element, start the timer to hide the sidebar.
    catalogLink.parentElement.addEventListener("mouseleave", hideSidebar);

    // If the mouse enters the sidebar itself, keep it open.
    sidebar.addEventListener("mouseenter", showSidebar);

    // When the mouse leaves the sidebar, start the timer to hide it.
    sidebar.addEventListener("mouseleave", hideSidebar);

    // Hide sidebar by default
    sidebar.style.display = "none";
  }
});
