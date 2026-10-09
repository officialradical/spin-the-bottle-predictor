// Supabase connection
const SUPABASE_URL = "https://fcxdazlpeagmuagsayja.supabase.co";
const SUPABASE_KEY = "PASTE_YOUR_PUBLISHABLE_KEY_HERE";

// Display the current year
document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const result = document.getElementById("result");
  const predictBtn = document.getElementById("predictBtn");
  const createAccountBtn = document.getElementById("createAccountBtn");
  const message = document.getElementById("message");

  // Demo only: this is a random result, not a real prediction
  if (predictBtn && result) {
    predictBtn.addEventListener("click", function () {
      const outcomes = ["UP", "DOWN"];
      const choice = outcomes[Math.floor(Math.random() * outcomes.length)];
      result.textContent = "Demo result: " + choice;
    });
  }

  if (createAccountBtn && message) {
    createAccountBtn.addEventListener("click", function () {
      message.textContent =
        "Account registration is not connected yet.";
    });
  }
});
