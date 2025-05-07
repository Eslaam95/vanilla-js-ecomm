/*helper functions*/
import {
  getSingleUser,
  getAllUsers,
  getAllProducts,
  getAllOrders,
  updateUser,
  deleteUser,
  validateEmail,
  validateName,
  validatepassword,
  addUser,
  deleteProduct,
  getSingleProduct,
  updateProduct,
  addProduct,
  getAllSellerIds,
  deleteOrder,
  updateOrderStatus,
  updateNav,
  showPassword,
} from "./helper-functions.js";
window.addEventListener("load", async function () {
  /*get user id*/
  const urlParams = new URLSearchParams(window.location.search);
  const URLid = urlParams.get("id");
  /*table DOM elements*/
  const productSum = document.querySelector(".productSum");
  const userSum = document.querySelector(".userSum");
  const pendingProductsElement = document.querySelector(".pendingProducts"); // Renamed to avoid confusion
  const orderSum = document.querySelector(".OrderSum");
  const usersTable = document.getElementById("usersTable");
  const productsTable = document.getElementById("productsTable");
  const ordersTable = document.getElementById("ordersTable");
  /*user form elements*/
  const userEidtModal = document.getElementById("userEditModal");
  const closeModal = this.document.querySelectorAll(".close-btn");
  const nameInput = document.getElementById("editUsername");
  const emailInput = document.getElementById("editEmail");
  const passwordInput = document.getElementById("password");
  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");
  const passwordError = document.getElementById("password-error");
  const saveUserBtn = document.getElementById("saveUser");
  const addUserButn = document.getElementById("addUser");
  /*product form elemtns*/
  const productId = document.getElementById("productId");
  const productTitle = document.getElementById("productTitle");
  const productDescription = document.getElementById("productDescription");
  const productPrice = document.getElementById("productPrice");
  const productCategory = document.getElementById("productCategory");
  const productSeller = document.getElementById("productSeller");
  const productImage = document.getElementById("productImage");
  const productApproved = document.getElementById("productApproved");
  const saveProductBtn = document.getElementById("saveProduct");
  const addProductBtn = document.getElementById("addProduct");
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
  /*get cuurect user info and check if admin*/
  // const DBUserobj = await getSingleUser(URLid);
  // console.log(DBUserobj);
  // if (DBUserobj) {
  //   this.localStorage.setItem("loggedUser", JSON.stringify(DBUserobj));
  // }

  // Load user data and verify admin status
  const userobj = JSON.parse(localStorage.getItem("loggedUser"));
  if (!userobj) {
    this.window.location.href = "login.html";
  }
  if (userobj?.name) {
    document.querySelector(".hello").textContent = `Hello, ${userobj.name}!`;
  }
  console.log(userobj);
  if (userobj?.role != "admin") {
    // alert("You are not allowed here");
    window.location.href = "/";
    return;
  }
  updateNav();
  /*load orders, users, and products into talbes*/
  async function loadData() {
    try {
      const products = await getAllProducts();
      const totalProducts = products.length;
      productSum.textContent = totalProducts;
      products.forEach((product) => {
        const row = productsTable.insertRow();
        row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${product.sellerId}</td>
        <td>
          ${
            !product.approved
              ? `<button class="approve approve-product" data-id="${product.id}">Approve</button>`
              : `<button class="disapprove  disapprove-product " data-id="${product.id}">Disapprove</button>`
          }
          <button class="edit edit-product" data-id="${
            product.id
          }">Edit</button>
          <button class="delete delete-product" data-id="${
            product.id
          }">Delete</button>
        </td>
      `;
      });

      // Calculate pending products count
      const pendingProductsCount = products.filter(
        (product) => product.approved === false
      ).length;
      pendingProductsElement.textContent = pendingProductsCount;

      // Load additional data (users, orders, etc.)
      const users = await getAllUsers();
      userSum.textContent = users.length;

      users.forEach((user) => {
        const row = usersTable.insertRow();

        row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="edit edit-user"  data-id="${user.id}">Edit</button>
          <button class="delete delete-user" data-id="${user.id}">Delete</button>
        </td>
      `;
      });

      const orders = await getAllOrders();
      orderSum.textContent = orders.length;

      orders.forEach((order) => {
        const row = ordersTable.insertRow();
        row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.items.reduce(
          (sum, item) => sum + (item.quantity || 1),
          0
        )}</td>
        <td>$${order.items
          .reduce((sum, item) => sum + (item.price * item.quantity || 0), 0)
          .toFixed(2)}</td>
        <td class="status-${order.status.toLowerCase()}">${order.status}</td>
        <td>
          <button class="cancel cancel-order" data-id="${
            order.id
          }">Cancel</button>
          ${
            order.status === "pending"
              ? `<button class="deliver deliver-order" data-id="${order.id}">Deliver</button>`
              : ""
          }
        </td>
      `;
      });
    } catch (error) {
      console.error("Error loading data:", error);
      // alert("Failed to load dashboard data");
      Swal.fire({
        title: "Disconnected",
        text: "Failed to load dashboard data",
        icon: "question",
        showConfirmButton: false,
      });
    }
  }
  // Initialize the dashboard
  loadData();
  /*
=======================
=======================
=======================
=======================
==========User management logic=============
=======================
=======================
=======================
*/
  /*trigger modal to edit users*/
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("edit-user")) {
      const userID = e.target.getAttribute("data-id");
      let currentuser = await getSingleUser(userID);
      openUserEditModal(
        currentuser.id,
        currentuser.name,
        currentuser.email,
        currentuser.role
      );
      saveUserBtn.style.display = "block";
      addUserButn.style.display = "none";
    }
  });
  /*open model and set user vales*/
  function openUserEditModal(id, name, email, role) {
    userEidtModal.style.display = "flex";
    document.getElementById("editUserId").textContent = id;
    document.getElementById("editUsername").value = name;
    document.getElementById("editEmail").value = email;
    document.getElementById("editRole").value = role;
    document.getElementById("password-contianer").style.display = "none";
  }
  /*close user edit modal and reset fields to empty*/
  function closeUserEditModal() {
    document
      .querySelectorAll(".modal")
      .forEach((modal) => (modal.style.display = "none"));
    document.getElementById("editUsername").value = "";
    document.getElementById("editEmail").value = "";
    document.getElementById("editRole").value = "";
    nameInput.style.border = "";
    emailInput.style.border = "";
    passwordInput.style.border = "";
    nameError.style.display = "none";
    emailError.style.display = "none";
    passwordError.style.display = "none";
  }
  /*button to close open modal*/
  closeModal.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      closeUserEditModal();
    });
  });
  /*BLUR validations*/
  nameInput.addEventListener("blur", () => {
    validateName(nameInput, nameError);
  });

  emailInput.addEventListener("blur", () => {
    validateEmail(emailInput, emailError);
  });
  passwordInput.addEventListener("blur", () => {
    validatepassword(passwordInput, passwordError);
  });
  /*re-validate and update user on submitting*/
  saveUserBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let isFormValid = true;
    if (
      !validateName(nameInput, nameError) ||
      !validateEmail(emailInput, emailError)
    ) {
      isFormValid = false;
    } else {
      isFormValid = true;
    }

    if (!isFormValid) {
      return;
    } else {
      let updatedUser = {
        name: document.getElementById("editUsername").value,
        email: document.getElementById("editEmail").value,
        role: document.getElementById("editRole").value,
      };
      let updatedUserID = document.getElementById("editUserId").textContent;
      updateUser(updatedUserID, updatedUser);
    }
  });

  /*DELTER USER*/
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("delete-user")) {
      console.log("hello");
      const userID = e.target.getAttribute("data-id");
      // let confirmation = confirm("Are you sure?");
      // if (confirmation) {
      //   deleteUser(userID);
      // }
      Swal.fire({
        title: "Do you want to delete this user?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `Discard`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          deleteUser(userID);
          Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    }
  });

  /*open a modal to add a new user*/
  document.querySelector(".add-user").addEventListener("click", function () {
    userEidtModal.style.display = "flex";
    openUserEditModal("", "", "", "");
    saveUserBtn.style.display = "none";
    addUserButn.style.display = "block";
    document.getElementById("password-contianer").style.display = "block";
    document.getElementById("editRole").value = "customer";
  });
  /*re-validate and create a new user on submitting*/
  addUserButn.addEventListener("click", function (e) {
    e.preventDefault();
    let isFormValid = true;
    if (
      !validateName(nameInput, nameError) ||
      !validateEmail(emailInput, emailError) ||
      !validatepassword(passwordInput, passwordError)
    ) {
      isFormValid = false;
    } else {
      isFormValid = true;
    }

    if (!isFormValid) {
      return; // Stop form from submitting
    } else {
      let newUser = {
        name: document.getElementById("editUsername").value,
        email: document.getElementById("editEmail").value,
        role: document.getElementById("editRole").value || "cusotmer",
        password: document.getElementById("password").value,
      };
      getAllUsers().then((users) => {
        const matches = users.filter((user) => user.email === emailInput.value);

        if (matches.length > 0) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "User already exists",
            showConfirmButton: false,
          });
          return;
        } else {
          addUser(newUser);
        }
      });
    }
  });
  /*
=======================
=======================
=======================
=======================
==========Product management logic=============
=======================
=======================
=======================
*/
  /*DELTE product*/
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("delete-product")) {
      const productID = e.target.getAttribute("data-id");
      // let confirmation = confirm("Are you sure?");
      // if (confirmation) {
      //   deleteProduct(productID);
      // }
      Swal.fire({
        title: "Do you want to delete this product?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `Discard`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          deleteProduct(productID);
          Swal.fire("Deleted!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    }
  });
  /*approve product*/
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("approve-product")) {
      const productID = e.target.getAttribute("data-id");
      let product = await getSingleProduct(productID);
      product.approved = true;

      updateProduct(productID, product);
    }
  });
  /*disapprove product*/
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("disapprove-product")) {
      const productID = e.target.getAttribute("data-id");
      let product = await getSingleProduct(productID);
      product.approved = false;
      updateProduct(productID, product);
    }
  });
  /*edit product*/
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("edit-product")) {
      addProductBtn.style.display = "none";
      saveProductBtn.style.display = "block";
      const productID = e.target.getAttribute("data-id");
      document.getElementById("ProductEditModal").style.display = "flex";
      let product = await getSingleProduct(productID);
      productId.value = product.id;
      productDescription.value = product.description;
      productPrice.value = product.price;
      productCategory.value = product.categoryId;
      productSeller.value = product.sellerId;
      productImage.value = product.image;
      productTitle.value = product.title;
      productApproved.value = product.approved;
    }
  });
  /*save product after edit*/
  saveProductBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.preventDefault();
    if (
      productTitle.value.length > 8 &&
      Number(productPrice.value) > 0 &&
      productSeller.value.length != ""
    ) {
      let updatedProduct = {
        description: productDescription.value,
        price: Number(productPrice.value),
        categoryId: productCategory.value,
        sellerId: productSeller.value,
        image: productImage.value,
        title: productTitle.value,
        approved: Boolean(productApproved.value),
      };
      updateProduct(productId.value, updatedProduct);
    } else {
      // alert("Please, make sure to fill required fielda");
      Swal.fire({
        icon: "error",
        title: "Incomplete",
        text: "Please, Fill all the product info",
      });
    }
  });

  /*add new product*/
  document.querySelector(".add-product").addEventListener("click", function () {
    document.getElementById("ProductEditModal").style.display = "flex";
    addProductBtn.style.display = "block";
    saveProductBtn.style.display = "none";
    productId.value = "";
    productDescription.value = "";
    productPrice.value = "";
    productCategory.value = "";
    productSeller.value = "";
    productImage.value = "";
    productTitle.value = "";
    productApproved.value = "";
  });

  addProductBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (
      productTitle.value.length > 8 &&
      Number(productPrice.value) > 5 &&
      productSeller.value.length != ""
    ) {
      let newProduct = {
        description: productDescription.value,
        price: Number(productPrice.value),
        categoryId: productCategory.value,
        sellerId: productSeller.value,
        image: productImage.value,
        title: productTitle.value,
        approved: Boolean(productApproved.value),
      };
      addProduct(newProduct);
    } else {
      // alert("Please, make sure to fill required fielda");
      Swal.fire({
        icon: "error",
        title: "Incomplete",
        text: "Please, Fill all the product info",
      });
    }
  });
  /*HTML select list for seller ids*/
  getAllSellerIds().then((data) => {
    for (let id of data)
      productSeller.innerHTML += `<option value=${id}>${id}</option>`;
  });
  /*
=======================
=======================
=======================
=======================
==========Order management logic=============
=======================
=======================
=======================
*/

  /*DELTE order*/
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("cancel-order")) {
      const orderID = e.target.getAttribute("data-id");
      // let confirmation = confirm("Are you sure?");
      // if (confirmation) {
      //   deleteOrder(orderID);
      // }
      Swal.fire({
        title: "Do you want to cancel this order?",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `Discard`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          deleteOrder(orderID);
          Swal.fire("Canceled!", "", "success");
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    }
  });

  /*deliver order*/
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("deliver-order")) {
      const orderID = e.target.getAttribute("data-id");

      updateOrderStatus(orderID, "shipped");
    }
  });

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

      updateUser(URLid, updatedUser);
      window.location.href = `/admin.html?id=${userobj.id}`;
    }
  });
  /*Password reset*/
  // Blur validation
  oldPasswordInput.addEventListener("blur", () => {
    if (md5(oldPasswordInput.value) != userobj.password) {
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
      md5(oldPasswordInput.value) !== userobj.password ||
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
        password: md5(passwordResetInput.value),
      };
      userobj.password = md5(passwordResetInput.value);
      localStorage.setItem("loggedUser", JSON.stringify(userobj));
      updateUser(URLid, updatedUser);
      alert("Password Chaned Successfully");
    }
  });
  showPassword();
  /*end of window load*/
});
