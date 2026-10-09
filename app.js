// SPIN THE BOTTLE PREDICTOR
// Demo interactions only. Results are random, not real predictions.

document.addEventListener("DOMContentLoaded", function () {
  // Update the footer year
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Display a message to the user
  const toast = document.getElementById("toast");
  let toastTimer;

  function showMessage(message) {
    if (!toast) {
      alert(message);
      return;
    }

    toast.textContent = message;
    toast.hidden = false;

    clearTimeout(toastTimer);

    toastTimer = setTimeout(function () {
      toast.hidden = true;
    }, 3500);
  }

  // UP/DOWN demo button
  const tryButton = document.getElementById("try");
  const outcome = document.getElementById("outcome");

  if (tryButton && outcome) {
    tryButton.addEventListener("click", function () {
      const result = Math.random() < 0.5 ? "UP" : "DOWN";

      outcome.textContent = result;

      outcome.style.color =
        result === "UP" ? "#80f2ca" : "#ff9bba";

      showMessage(
        "Your demo result is " +
          result +
          ". This is random and is not a real prediction."
      );
    });
  }

  // Get started button
  const startButton = document.getElementById("start");

  if (startButton) {
    startButton.addEventListener("click", function () {
      const section = document.getElementById("how");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth"
        });
      } else {
        showMessage("The getting-started section is not available.");
      }
    });
  }

  // Create account button
  const accountButton = document.getElementById("accountBtn");

  if (accountButton) {
    accountButton.addEventListener("click", function () {
      showMessage(
        "Account registration is not connected yet. Please check back later."
      );
    });
  }

  // Log in button
  const loginButton = document.querySelector(".login");

  if (loginButton) {
    loginButton.addEventListener("click", function (event) {
      event.preventDefault();

      showMessage(
        "Login is not connected yet. Account setup is still required."
      );
    });
  }

  console.log("Spin the Bottle Predictor demo is ready.");
});
