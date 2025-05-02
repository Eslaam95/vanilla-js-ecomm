//Admin Main export functions
let Employees = [];
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
    method: "PUT",
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
