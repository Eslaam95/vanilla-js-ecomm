import { getSingleUser } from "./helper-functions.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

getSingleUser(id).then((userobj) => {
  if (userobj.role != "user") {
    alert("not allowed here");
    return;
  }
  for (let k in userobj) {
    document.querySelector(
      ".intro-section .container"
    ).innerHTML += `<p class="white-color">${k}: ${userobj[k]}</p>`;
  }
});
