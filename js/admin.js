import { getSingleUser, getAllUsers, getAllProducts,getAllOrders } from "./helper-functions.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const productSum = document.querySelector('.productSum');
const userSum = document.querySelector('.userSum');
const pendingProductsElement = document.querySelector('.pendingProducts'); // Renamed to avoid confusion
const orderSum = document.querySelector('.OrderSum');
const usersTable = document.getElementById('usersTable');
const productsTable = document.getElementById('productsTable');
const ordersTable = document.getElementById('ordersTable');


    // // Load user data and verify admin status
    // const userobj = await getSingleUser(id);
    // if (userobj.role != "admin") {
    //   alert("You are not allowed here");
    //   window.location.href = "/";
    //   return;
    // }

    // // Display user info
    // const userInfoContainer = document.querySelector(".intro-section .container");
    // userInfoContainer.innerHTML = "<h1 class='white-color text-center'>Admin Dashboard</h1>";
    // for (let k in userobj) {
    //   userInfoContainer.innerHTML += `<p class="white-color">${k}: ${userobj[k]}</p>`;
    // }


async function loadData() {
  try {
    const products = await getAllProducts();
    const totalProducts = products.length;
    productSum.textContent = totalProducts;
    products.forEach(product => {
      const row = productsTable.insertRow();
      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.title}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${product.sellerId}</td>
        <td>
          ${!product.approved ? 
            `<button class="approve" data-id="${product.id}">Approve</button>` : ''}
          <button class="edit" data-id="${product.id}">Edit</button>
          <button class="delete" data-id="${product.id}">Delete</button>
        </td>
      `;
    });

    // Calculate pending products count
    const pendingProductsCount = products.filter(product => product.approved === false).length;
    pendingProductsElement.textContent = pendingProductsCount;


    // Load additional data (users, orders, etc.)
    const users = await getAllUsers();
    userSum.textContent = users.length;

    users.forEach(user => {
      const row = usersTable.insertRow();
      
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="edit" data-id="${user.id}">Edit</button>
          <button class="delete" data-id="${user.id}">Delete</button>
        </td>
      `;
    });

    // TODO: Load and display orders
    const orders = await getAllOrders();
    orderSum.textContent = orders.length;   

    orders.forEach(order => {
      const row = ordersTable.insertRow();
      row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)}</td>
          <td>${order.items.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}$</td>
          <td class="status-${order.status.toLowerCase()}">${order.status}</td>
          <td>
              <button class="delete" data-id="${order.id}">Cancel</button>
              <button class="edit" data-id="${order.id}">Edit</button>
          </td>
      `;
  });

  } catch (error) {
    console.error("Error loading data:", error);
    alert("Failed to load dashboard data");
  }

}
// Initialize the dashboard
loadData();


