import {
  updateUser,
  validateEmail,
  validateName,
  validatepassword,
  checkEmailExists,
  toBase64,
  getSingleUser,
} from "./helper-functions.js";

export async function handleProfileUpdate(id) {
  /*check updated users*/

  const oldUser = JSON.parse(localStorage.getItem("loggedUser"));

  localStorage.setItem(
    "loggedUser",
    JSON.stringify(await getSingleUser(oldUser.id))
  );
  let userobj = JSON.parse(localStorage.getItem("loggedUser"));
  /*select form elements*/
  const nameUpdateInput = document.getElementById("nameUpdate");
  const emailUpdateInput = document.getElementById("emailUpdate");
  const nameUpdateError = document.getElementById("nameUpdate-error");
  const emailUpdateError = document.getElementById("emailUpdate-error");
  // const profilepic = document.getElementById("profilepic");
  const updateInfoForm = document.getElementById("updateInfoForm");
  const userImageUpdate = document.getElementById("userImageUpdate");
  const userThumbUpdate = document.getElementById("userThumbUpdate");
  /*password update form*/
  const passwordResetForm = document.getElementById("passwordResetForm");
  const oldPasswordInput = document.getElementById("old-password");
  const oldPasswordError = document.getElementById("old-password-error");
  const passwordResetInput = document.getElementById("password-reset");
  const passwordResetConfirmationInput = document.getElementById(
    "password-reset-confirmation"
  );
  const passwordResetError = document.getElementById("password-reset-error");
  const passwordResetConfirmationError = document.getElementById(
    "password-reset-error-confirmation"
  );

  // Fill form values
  nameUpdateInput.value = userobj.name;
  emailUpdateInput.value = userobj.email;
  // profilepic.value = userobj.image;
  userThumbUpdate.src = userobj.image;
  // Name & Email blur validation
  nameUpdateInput.addEventListener("blur", () =>
    validateName(nameUpdateInput, nameUpdateError)
  );
  emailUpdateInput.addEventListener("blur", () =>
    validateEmail(emailUpdateInput, emailUpdateError)
  );

  // Info form submit
  updateInfoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (
      !validateName(nameUpdateInput, nameUpdateError) ||
      !validateEmail(emailUpdateInput, emailUpdateError)
    ) {
      return;
    }

    const isEmailChanged = emailUpdateInput.value !== userobj.email;
    let emailExists = false;
    if (isEmailChanged) {
      emailExists = await checkEmailExists(emailUpdateInput.value);

      if (emailExists) {
        Swal.fire({
          icon: "error",
          title: "Email already exists",
          text: "This email is already registered. Please use a different email.",
        });
        emailUpdateInput.value = userobj.email;
        // location.reload(); // to change the email to its origina one if i don't it will remain the same that was refused until i refresh so i force refresh it
        return;
      }
    }
    let newImage = userobj.image;

    if (userImageUpdate.files.length > 0) {
      newImage = await toBase64(userImageUpdate.files[0]);
    }
    const updatedUser = {
      name: nameUpdateInput.value,
      email: emailUpdateInput.value,
      image: newImage,
    };
    userobj.name = nameUpdateInput.value;
    userobj.email = emailUpdateInput.value;
    userobj.image = newImage;

    localStorage.setItem("loggedUser", JSON.stringify(userobj));
    updateUser(userobj.id, updatedUser);
    Swal.fire({
      icon: "success",
      title: "Done!",
      text: "Your information has been updated successfully.",
    });
  });
  userImageUpdate.addEventListener("change", async (e) => {
    if (userImageUpdate.files.length > 0) {
      const file = e.target.files[0];
      if (!file) return;
      let imageSrc = await toBase64(file);
      userThumbUpdate.src = imageSrc;
    }
  });
  // Password form blur validation
  oldPasswordInput.addEventListener("blur", () => {
    if (md5(oldPasswordInput.value) !== userobj.password) {
      oldPasswordError.style.display = "block";
      oldPasswordInput.style.border = "2px solid red";
    } else {
      oldPasswordError.style.display = "none";
      oldPasswordInput.style.border = "";
    }
  });

  passwordResetInput.addEventListener("blur", () =>
    validatepassword(passwordResetInput, passwordResetError)
  );

  passwordResetConfirmationInput.addEventListener("blur", () => {
    if (passwordResetConfirmationInput.value !== passwordResetInput.value) {
      passwordResetConfirmationError.style.display = "block";
      passwordResetConfirmationInput.style.border = "2px solid red";
    } else {
      passwordResetConfirmationError.style.display = "none";
      passwordResetConfirmationInput.style.border = "";
    }
  });

  // Password form submit
  passwordResetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (
      !validatepassword(passwordResetInput, passwordResetError) ||
      md5(oldPasswordInput.value) !== userobj.password ||
      passwordResetConfirmationInput.value !== passwordResetInput.value
    ) {
      return;
    }
    if (oldPasswordInput.value === passwordResetInput.value) {
      Swal.fire({
        icon: "error",
        title: "Passwords cannot be the same",
        text: ".....",
      });
      return;
    }
    const updatedUser = {
      password: md5(passwordResetInput.value),
    };
    userobj.password = updatedUser.password;
    localStorage.setItem("loggedUser", JSON.stringify(userobj));
    updateUser(userobj.id, updatedUser);
    Swal.fire({
      icon: "success",
      title: "Done!",
      text: "Your Password has been updated successfully.",
    });
  });
}
