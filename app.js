// SUPABASE PROJECT SETTINGS
const SUPABASE_URL = "https://fcxdazlpeagmuagsayja.supabase.co";
const SUPABASE_KEY = "sb_publishable_DpRoplNSvHveMpStM5NolQ_ofoVRbeL";

// WEBSITE ELEMENTS
document.addEventListener("DOMContentLoaded", function () {
  const year = document.getElementById("year");
  const result = document.getElementById("result");
  const predictBtn = document.getElementById("predictBtn");
  const createAccountBtn = document.getElementById("createAccountBtn");
  const message = document.getElementById("message");

  function showMessage(text) {
    if (message) {
      message.textContent = text;
    } else {
      alert(text);
    }
  }

  async function supabaseAuth(endpoint, data) {
    const response = await fetch(
      SUPABASE_URL + "/auth/v1/" + endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_KEY
        },
        body: JSON.stringify(data)
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(
        responseData.msg ||
        responseData.message ||
        responseData.error_description ||
        responseData.error ||
        "Authentication failed. Please try again."
      );
    }

    return responseData;
  }

  // UPDATE FOOTER YEAR
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // DEMO BUTTON — RANDOM ILLUSTRATION ONLY
  if (predictBtn && result) {
    predictBtn.addEventListener("click", function () {
      const outcomes = ["UP", "DOWN"];
      const choice =
        outcomes[Math.floor(Math.random() * outcomes.length)];

      result.textContent = "Demo result: " + choice;
    });
  }

  // CREATE ACCOUNT WITH EMAIL AND PASSWORD
  if (createAccountBtn) {
    createAccountBtn.addEventListener("click", async function () {
      const email = prompt("Enter your email address:");
      if (!email) return;

      const password = prompt(
        "Create a password (at least 6 characters):"
      );
      if (!password) return;

      if (password.length < 6) {
        showMessage("Your password must contain at least 6 characters.");
        return;
      }

      createAccountBtn.disabled = true;
      showMessage("Creating your account...");

      try {
        const data = await supabaseAuth("signup", {
          email: email.trim(),
          password: password
        });

        if (data.access_token) {
          localStorage.setItem(
            "sb_access_token",
            data.access_token
          );
        }

        if (data.refresh_token) {
          localStorage.setItem(
            "sb_refresh_token",
            data.refresh_token
          );
        }

        if (data.user && data.user.email) {
          localStorage.setItem(
            "sb_user_email",
            data.user.email
          );
        }

        if (data.session) {
          showMessage("Account created successfully! You are signed in.");
        } else {
          showMessage(
            "Registration submitted. Check your email for a confirmation link, then log in."
          );
        }
      } catch (error) {
        showMessage("Registration failed: " + error.message);
      } finally {
        createAccountBtn.disabled = false;
      }
    });
  }

  // LOG IN WITH EMAIL AND PASSWORD
  const loginLink = document.querySelector('a[href="#account"]');

  if (loginLink) {
    loginLink.addEventListener("click", async function (event) {
      event.preventDefault();

      const email = prompt("Enter your registered email address:");
      if (!email) return;

      const password = prompt("Enter your password:");
      if (!password) return;

      showMessage("Signing in...");

      try {
        const data = await supabaseAuth(
          "token?grant_type=password",
          {
            email: email.trim(),
            password: password
          }
        );

        if (data.access_token) {
          localStorage.setItem(
            "sb_access_token",
            data.access_token
          );
        }

        if (data.refresh_token) {
          localStorage.setItem(
            "sb_refresh_token",
            data.refresh_token
          );
        }

        if (data.user && data.user.email) {
          localStorage.setItem(
            "sb_user_email",
            data.user.email
          );
        }

        showMessage("Login successful! Welcome, " + email + ".");
      } catch (error) {
        showMessage("Login failed: " + error.message);
      }
    });
  }
});
