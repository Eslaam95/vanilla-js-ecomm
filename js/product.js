import {
  getAverageRating,
  getSingleProduct,
  addProductReview,
  getAllProducts,
  updateNav,
} from "./helper-functions.js";

window.addEventListener("load", async function () {
  /*get current user*/
  const userobj = JSON.parse(localStorage.getItem("loggedUser"));
  console.log(userobj);
  /*get current product*/
  const urlParams = new URLSearchParams(window.location.search);
  const URLid = urlParams.get("id");
  let product = await getSingleProduct(URLid);
  console.log("product", product);
  /*select product tags to add data in*/
  let currentProductTitle = this.document.getElementById(
    "current-product-title"
  );
  console.log(product);
  let currentProductDesc = this.document.querySelector(".product-desc");
  let currentProductPrice = this.document.querySelector(".produc-price");
  let currentProductMainImg = this.document.querySelector(".produc-main-img");
  let currentProductCartBtn = this.document.querySelector(
    "  .current-product-cart-btn"
  );

  function fillStars(rating) {
    if (rating) {
      const percentage = (rating / 5) * 100;
      const starFill = document.getElementById("star-fill");
      starFill.style.width = `${percentage}%`;
    } else {
      document.getElementById("avg-stars").style.display = "none";
    }
  }
  updateNav();
  /*reviews input*/
  let currentProductReviews = this.document.querySelector("#reviews-conainer");
  /*product details*/
  currentProductTitle.innerHTML = product.title;
  currentProductDesc.innerHTML = product.description;
  currentProductMainImg.src = product.image;
  currentProductPrice.innerHTML = "$" + product.price;
  currentProductCartBtn.setAttribute("data-id", product.id);

  fillStars(getAverageRating(product.reviews));

  /*add product's previous reviews*/
  if (product.reviews) {
    for (let r of product.reviews) {
      currentProductReviews.innerHTML += `   <div class="single-review">
            <p class="sm-text">${r.comment}</p>
            <p class="sm-text">${r.rating} ★ out of 5</p>
          </div>`;
    }
  } else {
    currentProductReviews.innerHTML = `   <div class="single-review">
            <p class="sm-text">No reviews yet!</p>
            <p class="sm-text">Be the first to review this product</p>
          </div>`;
  }
  /*product cusomter reveiw form*/
  const bar = document.getElementById("rating-bar");
  const fill = document.getElementById("rating-fill");
  const value = document.getElementById("rating-value");
  let submittedRating = 0,
    submittedPercentage = 0;
  let submmittedComment = document.getElementById("review-comment");
  let submitReviewBtn = this.document.getElementById("Submit-review");

  function calculateRating(e) {
    const rect = bar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = Math.min(Math.max(offsetX / rect.width, 0), 1); // Clamp between 0 and 1
    return percentage;
  }

  // Hover effect
  bar.addEventListener("mousemove", (e) => {
    let percentage = calculateRating(e);
    fill.style.width = `${percentage * 100}%`;
    let rating = +(percentage * 5).toFixed(1); // Rounded to 1 decimal
    value.textContent = rating;
  });
  bar.addEventListener("mouseleave", (e) => {
    fill.style.width = `${submittedPercentage * 100}%`;
    // Rounded to 1 decimal
    value.textContent = submittedRating;
  });
  // Lock value on click
  bar.addEventListener("click", (e) => {
    let percentage = calculateRating(e);
    fill.style.width = `${percentage * 100}%`;
    let rating = +(percentage * 5).toFixed(1); // Rounded to 1 decimal
    value.textContent = rating;
    submittedRating = rating;
    submittedPercentage = percentage;
  });

  submitReviewBtn.addEventListener("click", function () {
    if (submmittedComment.value.length < 5) {
      document.querySelector(".comment-error").style.display = "block";
      submmittedComment.style.border = "1px solid red";
      return;
    }
    addProductReview(
      product.id,
      userobj.id,
      product.sellerId,
      submittedRating,
      submmittedComment.value
    );
  });

  /*Add to cart*/
  /*show-hide cart*/
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
  /*click add-to-cart button*/
  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("add-to-cart")) {
      if (!localStorage.getItem("loggedUser")) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "You're not logged in!",
          footer: '<a href="login.html">Please log in here</a>',
          showConfirmButton: false,
        });
        return;
        // window.location.href = "login.html";
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

  function renderCartUI() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartList = document.querySelector(".cart .product-list");
    cartList.innerHTML = "";
    if (!localStorage.getItem("loggedUser")) {
      cartList.innerHTML = `
  <div class="single-element mt-20">
    <p class="sm-text">Please, log in to view your cart</p>
  </div>`;
      document.querySelector(".cart-action").innerHTML = "";
      return;
    }
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

  /*render products*/
  let productsContainer = document.querySelector("#products-container");
  let products = await getAllProducts();
  renderProducts(products);
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
});
