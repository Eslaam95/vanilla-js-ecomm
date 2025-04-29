window.addEventListener("load", function () {
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("email-error");
  const nameInput = document.getElementById("name");
  const nameError = document.getElementById("name-error");
  const form = document.querySelector("form");

  // Hide errors initially
  emailError.style.display = "none";
  if (nameError) nameError.style.display = "none";

  function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  function isValidName(name) {
    const pattern = /^[A-Za-z\s]{4,}$/; // Only letters and spaces, min 4 chars
    return pattern.test(name);
  }

  // Email blur validation
  emailInput.addEventListener("blur", () => {
    if (!isValidEmail(emailInput.value)) {
      emailError.style.display = "block";
      emailInput.style.border = "2px solid red";
    } else {
      emailError.style.display = "none";
      emailInput.style.border = "";
    }
  });

  // Name blur validation (if exists)
  if (nameInput) {
    nameInput.addEventListener("blur", () => {
      if (!isValidName(nameInput.value)) {
        nameError.style.display = "block";
        nameInput.style.border = "2px solid red";
      } else {
        nameError.style.display = "none";
        nameInput.style.border = "";
      }
    });
  }

  // Submit validation
  form.addEventListener("submit", (e) => {
    let valid = true;

    if (!isValidEmail(emailInput.value)) {
      emailError.style.display = "block";
      emailInput.style.border = "2px solid red";
      valid = false;
    }

    if (nameInput && !isValidName(nameInput.value)) {
      nameError.style.display = "block";
      nameInput.style.border = "2px solid red";
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
    } else {
      e.preventDefault(); // simulate login
      window.location.href = "user.html";
    }
  });
});
