import { getAllProducts, getSingleProduct } from "./helper-functions.js";

window.addEventListener("load", function () {
  getAllProducts().then((products) => {
    let c = document.querySelector("#products-container");
    if (products.length) {
      for (let k of products) {
        c.innerHTML += `<div class="box">
            <a href="/product.html?id=${k.id}">
              <div>
                <img
                  class="product-img"
                  src="../${k.image}"
                />
              </div>
              <div class="content">
                <h3 class="dark-color">${k.title}</h3>
                <p class="sm-text grey-color pt-20">
                 ${k.description}
                </p>
                 <p class="sm-text grey-color pt-20">
                 ${k.price}
                </p>
              </div>
            </a>
            <a data-id=${k.id} class="add-to-cart btn white-color bg-blue text-center capitalize"
              >add to cart</a
            >
          </div>`;
      }
    } else {
      c.innerHTML = `<p class="xl-text dark-color text-center grid-full pt-40">Database Disconnected   :(</p>`;
    }
  });

  /*add to cart*/
  this.document
    .querySelector(".cart-icon")
    .addEventListener("click", function () {
      document.querySelector(".cart").classList.add("active");
      renderCartUI();
    });
  this.document
    .querySelector(".close-cart")
    .addEventListener("click", function () {
      document.querySelector(".cart").classList.remove("active");
    });
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("add-to-cart")) {
      let cartProductId = e.target.getAttribute("data-id");
      let cartProduct = await getSingleProduct(cartProductId);

      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      let existingItem = cart.find((item) => item.id === cartProduct.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: cartProduct.id,
          title: cartProduct.title,
          price: cartProduct.price,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartUI();
      document.querySelector(".cart").classList.add("active");
    }
  });

  function renderCartUI() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartList = document.querySelector(".cart .product-list");
    cartList.innerHTML = "";
    if (!cart.length) {
      cartList.innerHTML += `
  <div class="single-element mt-20">
    <p class="sm-text">You don't have any products yet! :(</p>
  </div>`;
      return;
    }
    cart.forEach((item) => {
      cartList.innerHTML += `
        <div class="single-element mt-20">
          <p class="sm-text">${item.title}</p>
          <p class="xs-text">Price: $${item.price} | Qty: ${item.quantity}</p>
        </div>`;
    });
  }
});
