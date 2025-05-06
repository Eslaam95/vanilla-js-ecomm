import {
  getAllProducts,
  getSingleProduct,
  updateNav,
} from "./helper-functions.js";

window.addEventListener("load", async function () {
  updateNav();
  /*prepare products and display them*/
  let productsContainer = document.querySelector("#products-container");
  let products = await getAllProducts();
  renderProducts(products);

  /*filter products on changing the filter inputs*/
  document
    .querySelector(".search-products-input")
    .addEventListener("input", filterproducts);
  // document
  //   .querySelector(".select-category")
  //   .addEventListener("change", filterproducts);
  document
    .querySelector(".select-price")
    .addEventListener("change", filterproducts);

  /*show/hide the cart widget*/
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

  /*
    add to cart button
    - check logg in user
    - check local storage
    - check if item exists
    */
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("add-to-cart")) {
      if (!localStorage.getItem("loggedUser")) {
        window.location.href = "login.html";
      }
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
          image: cartProduct.image,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cart));

      document.querySelector(".cart").classList.add("active");
      renderCartUI();
    }
  });

  /*render array of products into the html container*/
  function renderProducts(products) {
    if (products.length) {
      console.log(products);
      productsContainer.innerHTML = "";
      for (let k of products) {
        productsContainer.innerHTML += `<div class="box">
            <a href="/product.html?id=${k.id}">
              <div>
                <img
                  class="product-img"
                  src="../${k.image}"
                />
              </div>
              <div class="content">
                <h3 class="dark-color">${k.title}</h3>
                <p class="sm-text grey-color pt-20 ">
                 ${k.description}
                </p>
                 <p class="sm-text grey-color pt-20 strong">
                 $${k.price}
                </p>
              </div>
            </a>
            <a data-id=${k.id} class="add-to-cart btn white-color bg-blue text-center capitalize"
              >add to cart</a
            >
          </div>`;
      }
    } else {
      productsContainer.innerHTML = `<p class="xl-text dark-color text-center grid-full pt-40">No products</p>`;
    }
  }
  /*filter the array of products beased on the search values 
    sort the array based desc/asc based on price option*/
  function filterproducts() {
    const searchTerm = document
      .querySelector(".search-products-input")
      .value.toLowerCase();
    // const selectedCategory = document.querySelector(".select-category").value;
    const sortOrder = document.querySelector(".select-price").value;
    let filtered = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm);
      // const matchesCategory = selectedCategory
      //   ? product.category === selectedCategory
      //   : true;
      return matchesSearch /*&& matchesCategory*/;
    });

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered);
  }
  /*render the cart from local storage into the html cart container*/
  function renderCartUI() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartList = document.querySelector(".cart .product-list");
    cartList.innerHTML = "";

    if (!cart.length) {
      cartList.innerHTML = `
        <div class="single-element mt-20">
          <p class="sm-text">You don't have any products yet! :(</p>
        </div>`;
      document.querySelector(".cart-action").innerHTML = "";
      return;
    }

    cart.forEach((item) => {
      cartList.innerHTML += `
        <div class="single-element mt-20" data-id="${item.id}">
          <p class="sm-text">${item.title}</p>
          <p class="xs-text">Price: $${item.price * item.quantity}</p>
          <p class="xs-text mt-10">
            <button class="qty-decrease btn-tiny bg-blue">-</button>
            <span class="qty ">Qty: ${item.quantity}</span>
            <button class="qty-increase btn-tiny bg-blue">+</button>
          </p>
        </div>`;
    });

    document.querySelector(
      ".cart-action"
    ).innerHTML = `<a class="btn bg-blue white-color mt-20" href="checkout.html">Checkout</a>`;
  }
  /*
  handle cart items decrease/inrease 
  -- updates the local sotrage object and re-renders the cart
  */
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("qty-increase") ||
      e.target.classList.contains("qty-decrease")
    ) {
      const itemElement = e.target.closest(".single-element");
      const itemId = itemElement.getAttribute("data-id");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      const item = cart.find((i) => i.id === itemId || i.id == itemId); // Support numeric and string
      if (!item) return;

      if (e.target.classList.contains("qty-increase")) {
        item.quantity += 1;
      } else if (e.target.classList.contains("qty-decrease")) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          cart = cart.filter((i) => i.id !== item.id);
        }
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartUI();
    }
  });
});
