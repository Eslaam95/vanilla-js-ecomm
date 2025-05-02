import { getAllUsers, isValidEmail } from "./helper-functions.js";
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("email-error");
  const nameInput = document.getElementById("name");
  const nameError = document.getElementById("name-error");

  // Hide errors initially
  emailError.style.display = "none";
  if (nameError) nameError.style.display = "none";

  // Blur validation
  emailInput.addEventListener("blur", () => {
    if (!isValidEmail(emailInput.value)) {
      emailError.style.display = "block";
      emailInput.style.border = "2px solid red";
    } else {
      emailError.style.display = "none";
      emailInput.style.border = "";
    }
  });

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

  // On form submit
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

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

    if (!valid) return;

    // If inputs valid, check user
    const email = emailInput.value.trim();
    const password = document.getElementById("password").value.trim();

    const users = await getAllUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("loggedUser", JSON.stringify(user));
      alert("Login successful!");

      // Redirect based on role
      switch (user.role) {
        case "admin":
          window.location.href = `${window.location.origin}/admin.html?id=${user.id}`;
          break;
        case "seller":
          window.location.href = `${window.location.origin}/seller.html?id=${user.id}`;
          break;
        case "customer":
          window.location.href = `${window.location.origin}/user.html?id=${user.id}`;
          break;
        default:
          alert("Unknown role. Access denied.");
      }
    } else {
      alert("Invalid email or password");
    }
  });
});
