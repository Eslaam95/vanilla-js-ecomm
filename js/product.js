import {
  getAverageRating,
  getSingleProduct,
  addProductReview,
} from "./helper-functions.js";

function fillStars(rating) {
  const percentage = (rating / 5) * 100;
  const starFill = document.getElementById("star-fill");
  starFill.style.width = `${percentage}%`;
}

window.addEventListener("load", async function () {
  const userobj = JSON.parse(localStorage.getItem("loggedUser"));
  console.log(userobj);
  const urlParams = new URLSearchParams(window.location.search);
  const URLid = urlParams.get("id");
  let product = await getSingleProduct(URLid);
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

  /*reviews input*/

  let currentProductReviews = this.document.querySelector("#reviews-conainer");
  /*product details*/
  currentProductTitle.innerHTML = product.title;
  currentProductDesc.innerHTML = product.description;
  currentProductMainImg.src = product.image;
  currentProductPrice.innerHTML = "$" + product.price;
  currentProductCartBtn.setAttribute("data-id", product.id);
  fillStars(getAverageRating(product.reviews));

  for (let r of product.reviews) {
    currentProductReviews.innerHTML += `   <div class="single-review">
            <p class="sm-text">${r.comment}</p>
            <p class="sm-text">${r.rating} ★ out of 5</p>
          </div>`;
  }

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
    if (submmittedComment.value.length < 15) {
      document.querySelector(".comment-error").style.display = "block";
      submmittedComment.style.border = "1px solid red";
      return;
    }
    addProductReview(
      product.id,
      userobj.id,
      product.sellrId,
      submittedRating,
      submmittedComment.value
    );
  });
});
