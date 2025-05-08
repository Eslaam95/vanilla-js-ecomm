//Admin Main export functions
export function getAllUsers() {
  return fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching users:", error);
      return [];
    });
}

export function getSingleUser(id) {
  return fetch(`http://localhost:3000/users/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("User not found");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched user:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      return null;
    });
}

export function addUser(newUser) {
  fetch("http://localhost:3000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("New user added:", data);
    })
    .catch((error) => console.error("Error adding user:", error));
}

export function updateUser(id, updatedUser) {
  fetch(`http://localhost:3000/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUser),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User updated:", data);
    })
    .catch((error) => console.error("Error updating user:", error));
}

export function deleteUser(id) {
  fetch(`http://localhost:3000/users/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      console.log(`User with ID ${id} deleted`);
    })
    .catch((error) => console.error("Error deleting user:", error));
}

export function getAllSellerIds() {
  return fetch("http://localhost:3000/users")
    .then((response) => response.json())
    .then((users) => {
      // Filter users by role 'seller' and return their sellerIds
      const sellerIds = users
        .filter((user) => user.role === "seller") // Filter users with role 'seller'
        .map((user) => user.id); // Map to get the sellerId

      return sellerIds; // Returns an array of seller IDs
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      return [];
    });
}

//Products Main export functions
export function getAllProducts() {
  return fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching products:", error);
      return [];
    });
}

export function getAllProductsBySellerId(sellerId) {
  return fetch(`http://localhost:3000/products?sellerId=${sellerId}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching products:", error);
      return [];
    });
}

export async function displayAllProducts() {
  const products = await getAllProducts();
  const productList = document.getElementById("productList");

  products.forEach((product) => {
    const div = document.createElement("div");
    div.innerHTML = `
        <h3>${product.name}</h3>
        <p>Price: ${product.price}</p>
        <hr>
      `;
    productList.appendChild(div);
  });
}
export function getSingleProduct(id) {
  return fetch(`http://localhost:3000/products/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Product not found");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched product:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error fetching product:", error);
      return null;
    });
}
// export function getProductById(id) {
//     return fetch(`http://localhost:3000/products/${id}`)
//       .then((response) => response.json())
//       .catch((error) => {
//         console.error("Error fetching product:", error);
//         return null;
//       });
//   }

export function addProduct(newProduct) {
  fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProduct),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("New product added:", data);
    })
    .catch((error) => console.error("Error adding product:", error));
}

export function updateProduct(id, updatedProduct) {
  fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProduct),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Product updated:", data);
    })
    .catch((error) => console.error("Error updating product:", error));
}

export function deleteProduct(id) {
  fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      console.log(`Product with ID ${id} deleted`);
    })
    .catch((error) => console.error("Error deleting product:", error));
}

export function getAllOrders() {
  return fetch("http://localhost:3000/orders")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching orders:", error);
      return [];
    });
}

export async function getOrdersBySellerId(sellerId) {
  const sellerProducts = await getAllProductsBySellerId(sellerId);
  const sellerProductIds = sellerProducts.map((p) => String(p.id));

  const allOrders = await getAllOrders();

  return allOrders.filter((order) => {
    // Skip if order has no items array
    if (!order?.items || !Array.isArray(order.items)) return false;
    // Check if any item belongs to this seller
    return order.items.some(
      (item) =>
        item?.productId && sellerProductIds.includes(String(item.productId))
    );
  });
}

export function deleteOrder(orderId) {
  return fetch(`http://localhost:3000/orders/${orderId}`, {
    method: "DELETE",
  })
    .then(() => {
      console.log(`Order with ID ${orderId} deleted successfully.`);
    })
    .catch((error) => {
      console.error("Error deleting order:", error);
    });
}

export function updateOrderStatus(orderId, newStatus) {
  return fetch(`http://localhost:3000/orders/${orderId}`, {
    method: "PATCH", // Use PATCH for partial update, or PUT if replacing entire order object
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(`Order status updated:`, data);
    })
    .catch((error) => {
      console.error("Error updating order status:", error);
    });
}
// Validation helpers
export function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

export function isValidName(name) {
  const pattern = /^[A-Za-z\s]{4,}$/;
  return pattern.test(name);
}

export function isValidPassword(password) {
  return password.length >= 6;
}
export function validateEmail(mailElement, errorElement) {
  if (!isValidEmail(mailElement.value)) {
    errorElement.style.display = "block";
    mailElement.style.border = "2px solid red";
  } else {
    errorElement.style.display = "none";
    mailElement.style.border = "";
  }
  return isValidEmail(mailElement.value);
}
export function validateName(nameElement, errorElement) {
  if (!isValidName(nameElement.value)) {
    errorElement.style.display = "block";
    nameElement.style.border = "2px solid red";
  } else {
    errorElement.style.display = "none";
    nameElement.style.border = "";
  }
  return isValidName(nameElement.value);
}
export function validatepassword(passElement, errorElement) {
  if (!isValidPassword(passElement.value)) {
    errorElement.style.display = "block";
    passElement.style.border = "2px solid red";
  } else {
    errorElement.style.display = "none";
    passElement.style.border = "";
  }
  return isValidPassword(passElement.value);
}
/*get product average ratnings*/
export function getAverageRating(reviews) {
  if (!reviews || reviews.length == 0) return;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1); // return as string like "4.3"
}

/*add review to a product*/
export async function addProductReview(
  productId,
  customerId,
  sellerId,
  rating,
  comment
) {
  const baseUrl = "http://localhost:3000";
  try {
    // Step 1: Get the product
    const productRes = await fetch(`${baseUrl}/products/${productId}`);
    const product = await productRes.json();

    if (!product) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Didn't find this product",
        showConfirmButton: false,
      });
      return;
    }

    // Step 2: Prevent seller from reviewing own product
    if (sellerId === customerId) {
      // alert("Sellers cannot review their own products.");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You're this product's seller",
        footer: "You cannot review the product youre selling",
        showConfirmButton: false,
        confirmButtonColor: "#0D5AB6",
      });
      return;
    }

    // Step 3: Check if customer has ordered the product
    const ordersRes = await fetch(`${baseUrl}/orders?customerId=${customerId}`);
    const orders = await ordersRes.json();

    const hasOrderedProduct = orders.some((order) =>
      order.items.some((item) => item.productId === productId)
    );

    if (!hasOrderedProduct) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You didn't buy this product yet!!",
        footer: "Please, order it first so that, you can add your review",
        showConfirmButton: false,
        confirmButtonColor: "#0D5AB6",
      });
      return;
    }

    // Step 4: Create new review
    const newReview = {
      customerId,
      rating,
      comment,
    };

    if (!Array.isArray(product.reviews)) {
      product.reviews = [];
    }

    product.reviews.push(newReview);

    // Step 5: Update the product with the new review
    await fetch(`${baseUrl}/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    console.log("Review added successfully.");
  } catch (error) {
    console.error("Error adding review:", error);
  }
}

export async function customerOrders(customerId) {
  const productRes = await fetch(
    `http://localhost:3000/orders?customerId=${customerId}`
  );
  return await productRes.json();
}
export async function getUserReviews(customerId) {
  const productRes = await fetch(`http://localhost:3000/products`);
  const productsList = await productRes.json();
  let reviews = [];
  for (const product of productsList) {
    if (product.reviews && Array.isArray(product.reviews)) {
      for (const review of product.reviews) {
        if (review.customerId === customerId) {
          reviews.push({
            ...review,
            productId: product.id,
            productTitle: product.title,
          });
        }
      }
    }
  }

  return reviews;
}

export function updateNav() {
  let loginDiv = document.querySelectorAll(".main-nav .login")[0];
  let userobj = JSON.parse(localStorage.getItem("loggedUser"));
  console.log("sssssss", userobj);
  if (userobj) {
    loginDiv.innerHTML = `
     ${
       userobj.role === "admin"
         ? '<a href="admin.html" class="btn header-btn bg-transparent" >Dashboard</a>'
         : userobj.role === "seller"
         ? '<a href="seller.html" class="btn header-btn bg-transparent ">Dashboard</a>'
         : '<a href="customer.html" class="btn header-btn bg-transparent ">Dashboard</a>'
     }
    <a href="#" class="btn header-btn white-color bg-blue logout-btn">Logout</a>`;
  } else {
    loginDiv.innerHTML = `
    <a href="login.html" class="btn header-btn bg-transparent login-btn">Login</a>
    <a href="signup.html" class="btn header-btn white-color bg-blue signup-btn">Sign up</a>`;
  }

  document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("logout-btn")) {
      localStorage.removeItem("loggedUser");
      location.reload();
    }
  });
}

export async function addOrder(cart, userId) {
  if (!Array.isArray(cart) || cart.length === 0 || !userId) {
    console.error("Invalid cart or userId.");
    return;
  }

  const orderItems = cart.map((item) => ({
    productId: item.id,
    quantity: item.quantity || 1,
    price: item.price,
  }));

  const order = {
    customerId: userId,
    items: orderItems,
    status: "pending",
  };

  try {
    const res = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    console.log("New order added:", data);
    return data;
  } catch (error) {
    console.error("Error adding order:", error);
  }
}
export function showPassword() {
  const toggles = document.querySelectorAll(".toggle-password");

  toggles.forEach((toggle) => {
    toggle.addEventListener("change", () => {
      const passwordInput = toggle
        .closest(".password-group")
        .querySelector(".password-input");
      if (passwordInput) {
        passwordInput.type = toggle.checked ? "text" : "password";
      }
    });
  });
}

export async function checkEmailExists(email) {
  try {
    const response = await fetch(`http://localhost:3000/users?email=${email}`);
    const data = await response.json();
    return data.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    return false;
  }
}
export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
