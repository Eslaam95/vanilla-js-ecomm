import {
  isValidEmail,
  updateNav,
  showPassword,
} from "./helper-functions.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("email-error");
  const nameInput = document.getElementById("name");
  const nameError = document.getElementById("name-error");
  updateNav();
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

    // If inputs valid, check user by sending a request to the server with the email and password
    const email = emailInput.value.trim();
    const password = md5(document.getElementById("password").value.trim());

    const response = await fetch(`http://localhost:3000/users?email=${email}&password=${password}`);
    const users = await response.json(); // Conver the response to array 

    if (users.length > 0) { // because i convert it to array , but it always return max of 1 and we checked the uniqueness of email for each account
      const user = users[0];
      localStorage.setItem("loggedUser", JSON.stringify(user));
      // alert("Login successful!");

      // Redirect based on role
      switch (user.role) {
        case "admin":
          window.location.href = `${window.location.origin}/admin.html?id=${user.id}`;
          break;
        case "seller":
          window.location.href = `${window.location.origin}/seller.html?id=${user.id}`;
          break;
        case "customer":
          window.location.href = `${window.location.origin}/customer.html?id=${user.id}`;
          break;
        default:
          // alert("Unknown role. Access denied.");
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Unknown user role. Please, contact our techincal support.",
          });
      }
    } else {
      // alert("Invalid email or password");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please, make sure of your email and password",
      });
    }
  });
  showPassword();
});
