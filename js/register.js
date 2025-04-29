document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
  
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const role = document.getElementById("role").value;
  
      const users = await getAllUsers();
      const userExists = users.some((u) => u.email === email);
  
      if (userExists) {
        alert("Email is already registered.");
        return;
      }
  
      const newUser = {
        name,
        email,
        password,
        role,
      };
  
      await addUser(newUser);
      alert("Registration successful!");
    });
  });
  