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
    method: "PUT",
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

//Sign in & Register
// export function signIn(email, password) {
//   fetch("http://localhost:3000/users")
//     .then((res) => res.json())
//     .then((users) => {
//       const foundUser = users.find(
//         (user) => user.email === email && user.password === password
//       );

//       if (foundUser) {
//         console.log("Login successful. Role:", foundUser.role);
//         // You can save user info in localStorage to keep the session
//         localStorage.setItem("currentUser", JSON.stringify(foundUser));

//         if (foundUser.role === "admin") {
//           // redirect to admin page or show admin features
//         } else if (foundUser.role === "seller") {
//           // redirect to customer home
//         }
//       } else if (foundUser.role === "seller") {
//         // redirect to seller home
//       } else {
//         console.log("Invalid credentials");
//       }
//     })
//     .catch((err) => console.error("Login error:", err));
// }

// Testing
// let newUser = {
//   name: "Bahaa",
//   age: 26,
//   role: "admin",
//   email: "bahaa@gmail.com",
// };

// const form = document.getElementById("addUserForm");
// form.addEventListener("submit", export function (event) {
//   event.preventDefault(); // Prevent form from submitting normally

//   // Get form values
//   const name = document.getElementById("name").value;
//   const age = document.getElementById("age").value;
//   const role = document.getElementById("role").value;
//   const email = document.getElementById("email").value;

//   // Create a new user object
//   const newUser = {
//     name: name,
//     age: parseInt(age), // Convert age to an integer
//     role: role,
//     email: email,
//   };

//   // Call the addUser export function
//   addUser(newUser);
//   form.reset();
// });
