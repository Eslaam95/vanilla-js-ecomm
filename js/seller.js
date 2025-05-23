//helper functions
import {
  deleteProduct,
  getSingleProduct,
  updateProduct,
  addProduct,
  deleteOrder,
  updateOrderStatus,
  getAllProductsBySellerId,
  getOrdersBySellerId,
  updateNav,
  showPassword,
  toBase64,
} from "./helper-functions.js";

import { handleProfileUpdate } from "./profile-update.js";

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
  const saveProductBtn = document.getElementById("saveProduct");
  const addProductBtn = document.getElementById("addProduct");
  /*profile form info update*/

  // const DBUserobj = await getSingleUser(URLid);
  // if (DBUserobj) {
  //   this.localStorage.setItem("loggedUser", JSON.stringify(DBUserobj));
  // }
  updateNav();
  const userobj = JSON.parse(localStorage.getItem("loggedUser"));
  if (userobj?.name) {
    document.querySelector(".hello").textContent = `Hello, ${userobj.name}!`;
  }
  if (userobj?.role !== "admin" && userobj?.role !== "seller") {
    // alert("You are not allowed here");
    window.location.href = "index.html";
    return;
  }

  async function loadData() {
    try {
      //***************************************************************************************************************** */
      // Display Products For Seller
      const products = await getAllProductsBySellerId(userobj.id);
      const totalProducts = products.length;
      productSum.textContent = totalProducts;
      const pendingProducts = products.filter((p) => !p.approved).length;
      pendingProductsElement.textContent = pendingProducts;
      if (products.length > 0) {
        const tbody = productsTable.querySelector("tbody");
        products.forEach((product) => {
          tbody.innerHTML += `
          <tr>
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
          </tr>
        `;
        });
      } else {
        productsTable.querySelector("tbody").innerHTML += `
        <tr><td colspan="5" class="center-text">You didn't add any products yet.</td></tr>
      `;
      }
      //***************************************************************************************************************** */
      // Display Orders For Seller
      const sellerOrders = await getOrdersBySellerId(userobj.id);
      const pendingOrdersCount = sellerOrders.filter(
        (order) => order?.status?.toLowerCase() === "pending"
      ).length;
      orderSum.textContent = sellerOrders.length;
      pendingOrdersSum.textContent = pendingOrdersCount;
      if (sellerOrders.length > 0) {
        const tbody = ordersTable.querySelector("tbody");
        sellerOrders.forEach((order) => {
          tbody.innerHTML += `
          <tr>
            <td>${order.id}</td>
            <td>${order.items.reduce(
              (sum, item) => sum + (item.quantity || 1),
              0
            )}</td>
            <td>${
              order.customerId || "N/A"
            }</td> <!-- Changed from total price to customer ID -->
            <td class="status-${order.status.toLowerCase()}">${
            order.status
          }</td>
            <td>
              <button class="cancel cancel-order" data-id="${
                order.id
              }">Cancel</button>
              ${
                order.status === "pending"
                  ? `<button class="approve approve-order" data-id="${order.id}">Approve</button>`
                  : order.status === "shipped"
                  ? `<button class="deliver deliver-order" data-id="${order.id}">Deliver</button>`
                  : ""
              }
            </td>
          </tr>
        `;
        });
      } else {
        ordersTable.querySelector("tbody").innerHTML += `
        <tr><td colspan="5" class="center-text">You don't have any orders</td></tr>
      `;
      }
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

  // Initialize the dashboard with data int the Database
  loadData();

  //Delete Product
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("delete-product")) {
      const productID = e.target.getAttribute("data-id");
      // if (confirm("Are you sure you want to delete this product?")) {
      //   await deleteProduct(productID);
      //   window.location.reload(); // Reload to update the product table
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
          window.location.reload();
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
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
      productCategory.value = product.category;
      // productImage.value = product.image;
      productThumb.src = product.image;
    }
  });
  productImage.addEventListener("change", async (e) => {
    if (e.target.files.length > 0) {
      productThumb.style.display = "block";
      const file = e.target.files[0];
      if (!file) return;
      let imageSrc = await toBase64(file);
      productThumb.src = imageSrc;
    }
  });
  //Edit product Logic and Validations
  saveProductBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const title = productTitle.value.trim();
    const description = productDescription.value.trim();
    const price = parseFloat(productPrice.value);
    const category = productCategory.value.trim();
    // const image = productImage.value.trim();

    if (!title || !description || !category) {
      // alert("Please fill in all the required fields.");
      Swal.fire({
        icon: "error",
        title: "Incomplete",
        text: "Please, Fill all the product info",
      });
      return;
    }

    if (price <= 0) {
      // alert("Please enter a valid price greater than 0.");
      Swal.fire({
        icon: "error",
        title: "Incorrect product price",
        text: "Please enter a valid price greater than 0.",
      });
      return;
    }

    const updatedProduct = {
      title,
      description,
      price,
      category,
      ...(productImage.files.length > 0 && {
        image: await toBase64(productImage.files[0]),
      }),
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
    productThumb.style.display = "none";
  });
  //Add New Product
  addProductBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const title = productTitle.value.trim();
    const description = productDescription.value.trim();
    const price = parseFloat(productPrice.value);
    const category = productCategory.value.trim();
    // const image = productImage.value.trim();
    const sellerId = userobj.id;

    if (!title || !description || !category) {
      // alert("Please fill in all the required fields.");
      Swal.fire({
        icon: "error",
        title: "Incomplete",
        text: "Please, Fill all the product info",
      });
      return;
    }

    if (price <= 0) {
      // alert("Please enter a valid price greater than 0.");
      Swal.fire({
        icon: "error",
        title: "Incorrect product price",
        text: "Please enter a valid price greater than 0.",
      });
      return;
    }

    const updatedProduct = {
      title,
      description,
      price,
      category,
      sellerId: sellerId,
      approved: false,
      ...(productImage.files.length > 0 && {
        image: await toBase64(productImage.files[0]),
      }),
    };

    await addProduct(updatedProduct);
    document.getElementById("ProductEditModal").style.display = "none";
    window.location.reload();
  });

  //DELTE order
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
    if (e.target.classList.contains("approve-order")) {
      const orderID = e.target.getAttribute("data-id");

      updateOrderStatus(orderID, "shipped");
    }
  });
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("deliver-order")) {
      const orderID = e.target.getAttribute("data-id");

      updateOrderStatus(orderID, "Delivered");
    }
  });

  //close any form with the X span
  closeModal.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      document.getElementById("ProductEditModal").style.display = "none";
    });
  });

  //****************Profile Data Section******************************

  // const redirectURL = "admin.html";
  handleProfileUpdate(userobj, URLid);
  showPassword();
});
