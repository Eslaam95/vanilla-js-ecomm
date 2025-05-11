import {
  getSingleUser,
  customerOrders,
  getUserReviews,
  updateNav,
  showPassword,
} from "./helper-functions.js";
import { handleProfileUpdate } from "./profile-update.js";

window.addEventListener("load", async function () {
  updateNav();
  if (!this.localStorage.getItem("loggedUser")) {
    this.window.location.href = "login.html";
  }
  /*get user id*/
  const urlParams = new URLSearchParams(window.location.search);
  const URLid = urlParams.get("id");
  // /*get cuurect user info and check if admin*/
  const DBUserobj = await getSingleUser(URLid);
  console.log(DBUserobj);
  // if (DBUserobj) {
  //   this.localStorage.setItem("loggedUser", JSON.stringify(DBUserobj));
  // }

  const ordersTable = document.getElementById("ordersTable");
  const reviewsTable = document.getElementById("reviewsTable");

  const userobj = JSON.parse(localStorage.getItem("loggedUser"));
  console.log(userobj);

  // Profile Edit Section (Password- Name - Email)
  const redirectURL = "customer.html";
  handleProfileUpdate(userobj, URLid);

  /*=============================*/
  let cusomterOrders = await customerOrders(userobj.id);
  if (cusomterOrders.length) {
    cusomterOrders.forEach((order) => {
      ordersTable.querySelector("tbody").innerHTML += `
    <tr>
      <td>${order.id}</td>
      <td>${order.items.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      )}</td>
      <td>$${order.items
        .reduce((sum, item) => sum + (item.price * item.quantity || 0), 0)
        .toFixed(2)}</td>
      <td class="status-${order.status.toLowerCase()}">${order.status}</td>
    </tr>
  `;
    });
  } else {
    ordersTable.querySelector(
      "tbody"
    ).innerHTML += `   <td class="center=text">You don't have any orders</td>`;
  }

  let userReviews = await getUserReviews(userobj.id);
  if (userReviews.length) {
    userReviews.forEach((review) => {
      const row = reviewsTable.querySelector("tbody").insertRow();
      row.innerHTML = `
      <td>${review.productTitle}</td>
       <td>${review.rating}</td>
        <td>${review.comment}</td>
    

    `;
    });
  } else {
    reviewsTable.querySelector(
      "tbody"
    ).innerHTML += `   <td class="center=text">You don't have any reviews</td>`;
  }
  showPassword();
});
