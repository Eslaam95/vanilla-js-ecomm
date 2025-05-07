//helper functions
import {
  getSingleUser,
  updateUser,
  validateEmail,
  validateName,
  validatepassword,
  deleteProduct,
  getSingleProduct,
  updateProduct,
  addProduct,
  deleteOrder,
  updateOrderStatus,
  getAllProductsBySellerId,
  getOrdersBySellerId,
  updateNav,
} from "./helper-functions.js";
window.addEventListener("load", async function () {
  /*get user id*/
  const urlParams = new URLSearchParams(window.location.search);
  const URLid = urlParams.get("id");
  /*table DOM elements*/
  const productSum = document.querySelector(".productSum");
  const pendingProductsElement = document.querySelector(".pendingProducts");
  const orderSum = document.querySelector(".OrderSum");
  const productsTable = document.getElementById("productsTable");
  const ordersTable = document.getElementById("ordersTable");
  const pendingOrdersSum = document.querySelector(".pendingOrdersSum");
  const closeModal = this.document.querySelectorAll(".close-btn");
  /*product form elemtns*/
  const productId = document.getElementById("productId");
  const productTitle = document.getElementById("productTitle");
  const productDescription = document.getElementById("productDescription");
  const productPrice = document.getElementById("productPrice");
  const productCategory = document.getElementById("productCategory");
  const productImage = document.getElementById("productImage");
  // const productApproved = document.getElementById("productApproved");
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

  //get cuurect user info and check if seller
  const DBUserobj = await getSingleUser(URLid);
  if (DBUserobj) {
    this.localStorage.setItem("loggedUser", JSON.stringify(DBUserobj));
  }
  updateNav();
  const userobj = JSON.parse(localStorage.getItem("loggedUser"));
  if (userobj.name) {
    document.querySelector(".hello").textContent = `Hello, ${userobj.name}!`;
  }
  if (userobj.role != "seller") {
    alert("You are not allowed here");
    window.location.href = "/";
    return;
  }

  async function loadData() {
    try {
      //***************************************************************************************************************** */
      //Display Products For Seller
      const products = await getAllProductsBySellerId(URLid);
      const totalProducts = products.length;
      productSum.textContent = totalProducts;
      const pendingProducts = products.filter((p) => !p.approved).length;
      pendingProductsElement.textContent = pendingProducts;

      products.forEach((product) => {
        const row = productsTable.insertRow();
        row.innerHTML = `
          <td>${product.id}</td>
          <td>${product.title}</td>
          <td>$${product.price.toFixed(2)}</td>
          <td>${product.approved ? "Approved" : "Pending"}</td>
          <td>
            <button class="edit edit-product" data-id="${
              product.id
            }">Edit</button>
            <button class="delete delete-product" data-id="${
              product.id
            }">Delete</button>
          </td>
        `;
      });

      //***************************************************************************************************************** */
      //Display Orders For Seller
      const sellerOrders = await getOrdersBySellerId(URLid);
      const pendingOrdersCount = sellerOrders.filter(
        (order) => order?.status?.toLowerCase() === "pending"
      ).length;
      orderSum.textContent = sellerOrders.length;
      pendingOrdersSum.textContent = pendingOrdersCount;

      sellerOrders.forEach((order) => {
        const row = ordersTable.insertRow();
        row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.items.reduce(
            (sum, item) => sum + (item.quantity || 1),
            0
          )}</td>
          <td>${
            order.customerId || "N/A"
          }</td> <!-- Changed from total price to customer ID -->
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
      alert("Failed to load dashboard data");
    }
  }
  // Initialize the dashboard with data int the Database
  loadData();

  //Delete Product
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("delete-product")) {
      const productID = e.target.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this product?")) {
        await deleteProduct(productID);
        window.location.reload(); // Reload to update the product table
      }
    }
  });

  // Edit Product Form
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("edit-product")) {
      addProductBtn.style.display = "none";
      saveProductBtn.style.display = "block";
      const productID = e.target.getAttribute("data-id");
      document.getElementById("ProductEditModal").style.display = "flex";
      const product = await getSingleProduct(productID);
      productId.value = product.id;
      productTitle.value = product.title;
      productDescription.value = product.description;
      productPrice.value = product.price;
      productCategory.value = product.categoryId;
      productImage.value = product.image;
    }
  });

  //Edit product Logic and Validations
  saveProductBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const title = productTitle.value.trim();
    const description = productDescription.value.trim();
    const price = parseFloat(productPrice.value);
    const categoryId = productCategory.value.trim();
    const image = productImage.value.trim();

    if (!title || !description || !categoryId) {
      alert("Please fill in all the required fields.");
      return;
    }

    if (price <= 0) {
      alert("Please enter a valid price greater than 0.");
      return;
    }

    const updatedProduct = {
      title,
      description,
      price,
      categoryId,
      image,
    };

    await updateProduct(productId.value, updatedProduct);
    document.getElementById("ProductEditModal").style.display = "none";
    // window.location.reload(); // Refresh table
  });

  //Add New Product
  document.querySelector(".add-product").addEventListener("click", function () {
    document.getElementById("ProductEditModal").style.display = "flex";
    addProductBtn.style.display = "block";
    saveProductBtn.style.display = "none";
    productId.value = "";
    productDescription.value = "";
    productPrice.value = "";
    productCategory.value = "";
    productImage.value = "";
    productTitle.value = "";
  });
  //Add New Product
  addProductBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const title = productTitle.value.trim();
    const description = productDescription.value.trim();
    const price = parseFloat(productPrice.value);
    const categoryId = productCategory.value.trim();
    const image = productImage.value.trim();

    if (!title || !description || !categoryId) {
      alert("Please fill in all the required fields.");
      return;
    }

    if (price <= 0) {
      alert("Please enter a valid price greater than 0.");
      return;
    }

    const updatedProduct = {
      title,
      description,
      price,
      categoryId,
      image,
      sellerId: URLid,
      approved: false,
    };

    await addProduct(updatedProduct);
    document.getElementById("ProductEditModal").style.display = "none";
    window.location.reload();
  });

  //DELTE order
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("cancel-order")) {
      const orderID = e.target.getAttribute("data-id");
      let confirmation = confirm("Are you sure?");
      if (confirmation) {
        deleteOrder(orderID);
      }
    }
  });

  //deliver order
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("deliver-order")) {
      const orderID = e.target.getAttribute("data-id");
      console.log(orderID);
      updateOrderStatus(orderID, "shipped");
      window.location.reload();
    }
  });

  //close any form with the X span
  closeModal.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      document.getElementById("ProductEditModal").style.display = "none";
    });
  });

  //****************Profile Data Section******************************
  nameUpdateInput.value = userobj.name;
  emailUpdateInput.value = userobj.email;
  profilepic.value = userobj.image;

  // Blur validation on name
  nameUpdateInput.addEventListener("blur", () => {
    validateName(nameUpdateInput, nameUpdateError);
  });

  // Blur validation on email
  emailUpdateInput.addEventListener("blur", () => {
    validateEmail(emailUpdateInput, emailUpdateError);
  });

  // Update User Info Submission
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
      updateUser(URLid, updatedUser);
      window.location.href = `/seller.html?id=${userobj.id}`;
    }
  });

  // Blur validation on oldPassword
  oldPasswordInput.addEventListener("blur", () => {
    if (md5(oldPasswordInput.value) != userobj.password) {
      oldPasswordError.style.display = "block";
      oldPasswordInput.style.border = "2px solid red";
    } else {
      oldPasswordError.style.display = "none";
      oldPasswordInput.style.border = "";
    }
  });

  // Blur validation on newPassword
  passwordResetInput.addEventListener("blur", () => {
    validatepassword(passwordResetInput, passwordResetError);
  });

  // Blur validation on newPasswordConfirm
  passwordResetConfirmationInput.addEventListener("blur", () => {
    if (passwordResetConfirmationInput.value != passwordResetInput.value) {
      passwordResetConfirmationError.style.display = "block";
      passwordResetConfirmationInput.style.border = "2px solid red";
    } else {
      passwordResetConfirmationError.style.display = "none";
      passwordResetConfirmationInput.style.border = "none";
    }
  });

  // Update User Password Submission
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

  //end of window load
});
