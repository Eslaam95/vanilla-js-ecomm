import { addUser } from "./helper-functions.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  // Email pattern validation
  function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  function isValidName(name) {
    const pattern = /^[A-Za-z\s]{4,}$/; // Only letters and spaces, min 4 chars
    return pattern.test(name);
  }

  function isValidPassword(password) {
    return password.length >= 6;
  }

  // Validate input fields on blur
  const emailInput = document.getElementById("email");
  const nameInput = document.getElementById("name");
  const passwordInput = document.getElementById("password");
  const emailError = document.getElementById("email-error");
  const nameError = document.getElementById("name-error");
  const passwordError = document.getElementById("password-error");

  emailInput.addEventListener("blur", () => {
    if (!isValidEmail(emailInput.value)) {
      emailError.style.display = "block";
      emailInput.style.border = "2px solid red";
    } else {
      emailError.style.display = "none";
      emailInput.style.border = "";
    }
  });

  nameInput.addEventListener("blur", () => {
    if (!isValidName(nameInput.value)) {
      nameError.style.display = "block";
      nameInput.style.border = "2px solid red";
    } else {
      nameError.style.display = "none";
      nameInput.style.border = "";
    }
  });

  passwordInput.addEventListener("blur", () => {
    if (!isValidPassword(passwordInput.value)) {
      passwordError.style.display = "block";
      passwordInput.style.border = "2px solid red";
    } else {
      passwordError.style.display = "none";
      passwordInput.style.border = "";
    }
  });

  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    if (!isValidEmail(emailInput.value)) {
      valid = false;
      const emailError = document.getElementById("email-error");
      emailError.style.display = "block";
      emailInput.style.border = "2px solid red";
    }

    if (!isValidName(nameInput.value)) {
      valid = false;
      const nameError = document.getElementById("name-error");
      nameError.style.display = "block";
      nameInput.style.border = "2px solid red";
    }

    if (!isValidPassword(passwordInput.value)) {
      valid = false;
      const passwordError = document.getElementById("password-error");
      passwordError.style.display = "block";
      passwordInput.style.border = "2px solid red";
    }

    if (valid) {
      const newUser = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value.trim(),
      };

      addUser(newUser);

      signupForm.reset();

      alert("User successfully created!");
      window.location.href = "/user.html";
    } else {
      alert("Please fix the errors and try again.");
    }
  });
});
