
  
  document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
  
      const users = await getAllUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
  
      if (user) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        alert("Login successful!");
        // Redirect or load appropriate page
      } else {
        alert("Invalid email or password");
      }
    });
  });
  