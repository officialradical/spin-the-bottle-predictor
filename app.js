// Supabase project configuration
const SUPABASE_URL = "https://fcxdazlpeagmuagsayja.supabase.co";
const SUPABASE_KEY = "sb_publishable_DpRoplNSvHveMpStM5NolQ_ofoVRbeL";

document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");
  const result = document.getElementById("result");
  const predictBtn = document.getElementById("predictBtn");
  const createAccountBtn = document.getElementById("createAccountBtn");
  const message = document.getElementById("message");

  // Update footer year
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Demo only: random UP/DOWN result
  if (predictBtn && result) {
    predictBtn.addEventListener("click", function () {
      const outcomes = ["UP", "DOWN"];
      const choice =
        outcomes[Math.floor(Math.random() * outcomes.length)];

      result.textContent = "Demo result: " + choice;
    });
  }

  // Registration will be connected after Supabase authentication is configured
  if (createAccountBtn && message) {
    createAccountBtn.addEventListener("click", function () {
      message.textContent =
        "Account registration is being set up. Please try again later.";
    });
  }
});
