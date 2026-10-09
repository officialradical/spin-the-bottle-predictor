// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL = "https://fcxdazlpeagmuagsayja.supabase.co";

const SUPABASE_KEY = "sb_publishable_DpRoplNSvHveMpStM5NolQ_ofoVRbeL";

// ==========================================
// INITIALIZE WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  // Update footer year
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // ==========================================
  // UP / DOWN DEMO
  // Note: This is random, not a real prediction.
  // ==========================================

  const predictBtn = document.getElementById("predictBtn");
  const result = document.getElementById("result");

  if (predictBtn && result) {
    predictBtn.addEventListener("click", function () {
      const outcomes = ["UP", "DOWN"];

      const choice =
        outcomes[Math.floor(Math.random() * outcomes.length)];

      result.textContent = "Demo result: " + choice;
    });
  }

  // ==========================================
  // SUPABASE CLIENT
  // ==========================================

  const form = document.getElementById("signupForm");
  const message = document.getElementById("message");
  const signupButton = document.getElementById("signupButton");

  let supabaseClient = null;

  function showMessage(text) {
    if (message) {
      message.textContent = text;
    } else {
      alert(text);
    }
  }

  function getSupabaseClient() {
    if (supabaseClient) {
      return supabaseClient;
    }

    if (!window.supabase) {
      throw new Error(
        "Supabase failed to load. Refresh the page and try again."
      );
    }

    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

    return supabaseClient;
  }

  // ==========================================
  // CREATE ACCOUNT
  // ==========================================

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const emailInput = document.getElementById("signupEmail");
      const passwordInput = document.getElementById("signupPassword");

      if (!emailInput || !passwordInput) {
        showMessage("The email or password field is missing in index.html.");
        return;
      }

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        showMessage("Please enter your email and password.");
        return;
      }

      if (password.length < 6) {
        showMessage("Your password must contain at least 6 characters.");
        return;
      }

      if (signupButton) {
        signupButton.disabled = true;
        signupButton.textContent = "Creating account...";
      }

      showMessage("Connecting securely...");

      try {
        const client = getSupabaseClient();

        const { data, error } = await client.auth.signUp({
          email: email,
          password: password
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          showMessage(
            "Your account has been created successfully!"
          );
        } else {
          showMessage(
            "Registration submitted. Please check your email for a confirmation link."
          );
        }

        form.reset();

      } catch (error) {
        console.error("Account registration error:", error);

        showMessage(
          "Registration failed: " +
          (error.message || "Please try again.")
        );

      } finally {
        if (signupButton) {
          signupButton.disabled = false;
          signupButton.textContent = "Create account";
        }
      }
    });
  }
});
