import {
  addUser,
  getAllUsers,
  isValidEmail,
  isValidName,
  isValidPassword,
} from "./helper-functions.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

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

  signupForm.addEventListener("submit", async (e) => {
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
        password: md5(passwordInput.value.trim()),
        role: document.querySelector('input[name="role"]:checked').value,
   
      };
      getAllUsers().then(async (e) => {
        for (let k of e) {
          if (k.email === emailInput.value) {
            alert("user already exists!");
            return;
          } else {
            addUser(newUser);

            /*  signupForm.reset();*/
            window.location.href = "login.html";
            alert("User successfully created!");

            break;
          }
        }
      });
    } else {
      alert("Please fix the errors and try again.");
    }
  });
});
