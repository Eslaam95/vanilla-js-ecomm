import {
  getSingleUser,
  validateEmail,
  validateName,
  validatepassword,
  updateUser,
  customerOrders,
  getUserReviews,
  updateNav,
} from "./helper-functions.js";
window.addEventListener("load", async function () {
  updateNav();
  if (!this.localStorage.getItem("loggedUser")) {
    this.window.location.href = "login.html";
  }
  /*get user id*/
  const urlParams = new URLSearchParams(window.location.search);
  const URLid = urlParams.get("id");
  /*get cuurect user info and check if admin*/
  // const DBUserobj = await getSingleUser(URLid);
  // console.log(DBUserobj);
  // if (DBUserobj) {
  //   this.localStorage.setItem("loggedUser", JSON.stringify(DBUserobj));
  // }
  /*profile form info update*/
  const nameUpdateInput = document.getElementById("nameUpdate");
  const emailUpdateInput = document.getElementById("emailUpdate");
  const nameUpdateError = document.getElementById("nameUpdate-error");
  const emailUpdateError = document.getElementById("emailUpdate-error");
  const profilepic = document.getElementById("profilepic");
  const updateInfoForm = document.getElementById("updateInfoForm");
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
  /**
   *
   */
  const ordersTable = document.getElementById("ordersTable");
  const reviewsTable = document.getElementById("reviewsTable");

  const userobj = JSON.parse(localStorage.getItem("loggedUser"));
  console.log(userobj);

  /*
  =======================
  =======================
  =======================
  =======================
  ==========Profile settings/update logic=============
  =======================
  =======================
  =======================
  */
  nameUpdateInput.value = userobj.name;
  emailUpdateInput.value = userobj.email;
  profilepic.value = userobj.image;

  // Blur validation
  nameUpdateInput.addEventListener("blur", () => {
    validateName(nameUpdateInput, nameUpdateError);
  });

  emailUpdateInput.addEventListener("blur", () => {
    validateEmail(emailUpdateInput, emailUpdateError);
  });
  updateInfoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let isFormValid = true;

    if (
      !validateName(nameUpdateInput, nameUpdateError) ||
      !validateEmail(emailUpdateInput, emailUpdateError)
    ) {
      isFormValid = false;
    } else {
      isFormValid = true;
    }

    if (!isFormValid) {
      return; // Stop form from submitting
    } else {
      let updatedUser = {
        name: nameUpdateInput.value,
        email: emailUpdateInput.value,
        image: profilepic.value,
      };
      userobj.name = nameUpdateInput.value;
      userobj.email = emailUpdateInput.value;
      userobj.image = profilepic.value;
      localStorage.setItem("loggedUser", JSON.stringify(userobj));
      updateUser(userobj.id, updatedUser);
    }
  });
  /*Password reset*/
  // Blur validation
  oldPasswordInput.addEventListener("blur", () => {
    if (oldPasswordInput.value != userobj.password) {
      oldPasswordError.style.display = "block";
      oldPasswordInput.style.border = "2px solid red";
    } else {
      oldPasswordError.style.display = "none";
      oldPasswordInput.style.border = "";
    }
  });

  passwordResetInput.addEventListener("blur", () => {
    validatepassword(passwordResetInput, passwordResetError);
  });
  passwordResetConfirmationInput.addEventListener("blur", () => {
    if (passwordResetConfirmationInput.value != passwordResetInput.value) {
      passwordResetConfirmationError.style.display = "block";
      passwordResetConfirmationInput.style.border = "2px solid red";
    } else {
      passwordResetConfirmationError.style.display = "none";
      passwordResetConfirmationInput.style.border = "none";
    }
  });
  passwordResetForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let isFormValid = true;

    if (
      !validatepassword(passwordResetInput, passwordResetError) ||
      oldPasswordInput.value !== userobj.password ||
      passwordResetConfirmationInput.value != passwordResetInput.value
    ) {
      isFormValid = false;
    } else {
      isFormValid = true;
    }

    if (!isFormValid) {
      return; // Stop form from submitting
    } else {
      let updatedUser = {
        password: passwordResetInput.value,
      };
      userobj.password = passwordResetInput.value;
      localStorage.setItem("loggedUser", JSON.stringify(userobj));
      updateUser(userobj.id, updatedUser);
    }
  });
  /*=============================*/
  let cusomterOrders = await customerOrders(userobj.id);
  cusomterOrders.forEach((order) => {
    const row = ordersTable.insertRow();
    row.innerHTML = `
    <td>${order.id}</td>
    <td>${order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)}</td>
    <td>$${order.items
      .reduce((sum, item) => sum + (item.price * item.quantity || 0), 0)
      .toFixed(2)}</td>
    <td class="status-${order.status.toLowerCase()}">${order.status}</td>
   
  `;
  });

  let userReviews = await getUserReviews(userobj.id);
  console.log(userReviews);
  userReviews.forEach((review) => {
    const row = reviewsTable.insertRow();
    row.innerHTML = `
      <td>${review.productTitle}</td>
       <td>${review.rating}</td>
        <td>${review.comment}</td>
    

    `;
  });
});
