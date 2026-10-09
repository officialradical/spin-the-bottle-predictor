document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");
  const result = document.getElementById("result");
  const predictBtn = document.getElementById("predictBtn");
  const createAccountBtn = document.getElementById("createAccountBtn");
  const message = document.getElementById("message");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

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
        "Account registration needs to be connected to Supabase.";
    });
  }
});
