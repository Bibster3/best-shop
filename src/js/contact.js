document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const emailInput = document.getElementById("email");
  const messageDisplay = document.getElementById("formMessage");

  // This ensures the custom validation message is shown only when needed
  emailInput.addEventListener("input", () => {
    if (emailInput.validity.typeMismatch) {
      emailInput.setCustomValidity(
        "Please enter a valid email address (e.g., example@domain.com)."
      );
    } else {
      emailInput.setCustomValidity(""); // Clear custom message if valid
    }
    emailInput.reportValidity();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop the default form submission (Crucial for no reload)

    // 1. CHECK VALIDITY
    if (!form.checkValidity()) {
      messageDisplay.textContent =
        "❌ Please fill out all required fields and correct any errors.";
      messageDisplay.style.color = "red";
      form.reportValidity();
      return; // Stop the function here
    }

    // --- 2. SUCCESS LOGIC (runs only if validity passes) ---

    const formData = new FormData(form);
    console.log("Form Data:", Object.fromEntries(formData.entries()));

    // Display success message
    messageDisplay.textContent =
      "✅ Thank you for your feedback! We will be in touch soon.";
    messageDisplay.style.color = "green";
    form.reset(); // Clears the form

    // Clear the message after 5 seconds
    setTimeout(() => {
      messageDisplay.textContent = "";
    }, 5000);
  });
});
