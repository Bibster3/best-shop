document.addEventListener("DOMContentLoaded", () => {
  const catalogLink = document.querySelector(
    ".header_nav a[href*=\"catalog.html\"]"
  );
  const sidebar = document.querySelector(".catalog-layout__sidebar");

  if (catalogLink && sidebar) {
    let leaveTimeout;

    const showSidebar = () => {
      clearTimeout(leaveTimeout);
      sidebar.style.display = "block";
    };

    const hideSidebar = () => {
      leaveTimeout = setTimeout(() => {
        sidebar.style.display = "none";
      }, 200); 
    };

    
    catalogLink.parentElement.addEventListener("mouseenter", showSidebar);

    catalogLink.parentElement.addEventListener("mouseleave", hideSidebar);

    sidebar.addEventListener("mouseenter", showSidebar);

    sidebar.addEventListener("mouseleave", hideSidebar);

    sidebar.style.display = "none";
  }
});
