import { getAllProducts } from "./helper-functions.js";
window.addEventListener("load", function () {
  getAllProducts().then((products) => {
    let c = document.querySelector("#products-container");
    if (products.length) {
      for (let k of products) {
        c.innerHTML += `<div class="box">
            <a href="#">
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
            <a href="#" class="btn white-color bg-blue text-center capitalize"
              >add to cart</a
            >
          </div>`;
      }
    } else {
      c.innerHTML = `<p class="xl-text dark-color text-center grid-full pt-40">Database Disconnected   :(</p>`;
    }
  });
});
