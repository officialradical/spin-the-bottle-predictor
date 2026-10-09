// ========================================
// SUPABASE CONFIGURATION
// ========================================

const SUPABASE_URL = "https://fcxdazlpeagmuagsayja.supabase.co";

// Use the exact publishable key from your Supabase project.
const SUPABASE_KEY =
  "sb_publishable_DpRoplNSvHveMpStM5NolQ_ofoVRbeL";


// ========================================
// START THE WEBSITE
// ========================================

document.addEventListener("DOMContentLoaded", async function () {
  const year = document.getElementById("year");

  const form = document.getElementById("signupForm");
  const emailInput = document.getElementById("signupEmail");
  const passwordInput = document.getElementById("signupPassword");
  const signupButton = document.getElementById("signupButton");
  const message = document.getElementById("message");

  const dashboard = document.getElementById("userDashboard");
  const dashboardEmail = document.getElementById("dashboardEmail");
  const dashboardUserId = document.getElementById("dashboardUserId");
  const dashboardMessage = document.getElementById("dashboardMessage");
  const logoutButton = document.getElementById("logoutButton");

  const accountSection = document.getElementById("account");

  const predictButton = document.getElementById("predictBtn");
  const result = document.getElementById("result");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  // ========================================
  // DISPLAY MESSAGES
  // ========================================

  function showMessage(text, success = false) {
    if (!message) return;

    message.textContent = text;
    message.style.color = success ? "#4ade80" : "#ff7777";
  }


  // ========================================
  // DISPLAY USER DASHBOARD
  // ========================================

  function showDashboard(user) {
    if (!user) {
      if (dashboard) {
        dashboard.hidden = true;
      }

      if (accountSection) {
        accountSection.hidden = false;
      }

      return;
    }

    if (dashboard) {
      dashboard.hidden = false;
    }

    if (dashboardEmail) {
      dashboardEmail.textContent = user.email || "Not available";
    }

    if (dashboardUserId) {
      dashboardUserId.textContent = user.id || "Not available";
    }

    if (accountSection) {
      accountSection.hidden = true;
    }
  }


  // ========================================
  // CONNECT TO SUPABASE
  // ========================================

  let supabaseClient = null;

  try {
    if (!window.supabase) {
      throw new Error(
        "The Supabase library did not load. Refresh your website."
      );
    }

    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

    const { data, error } =
      await supabaseClient.auth.getSession();

    if (error) {
      throw error;
    }

    if (data.session) {
      showDashboard(data.session.user);
    } else {
      showDashboard(null);
    }

    supabaseClient.auth.onAuthStateChange(
      function (_event, session) {
        showDashboard(session ? session.user : null);
      }
    );

  } catch (error) {
    console.error("Supabase connection error:", error);

    showMessage(
      "Account connection failed: " + error.message
    );
  }


  // ========================================
  // UP / DOWN DEMO
  // ========================================

  if (predictButton && result) {
    predictButton.addEventListener("click", function () {
      const outcome =
        Math.random() < 0.5 ? "UP" : "DOWN";

      result.textContent = "Demo result: " + outcome;
    });
  }


  // ========================================
  // CREATE ACCOUNT
  // ========================================

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!emailInput || !passwordInput || !signupButton) {
        showMessage(
          "The registration form is missing required fields."
        );
        return;
      }

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!email || !password) {
        showMessage(
          "Please enter your email address and password."
        );
        return;
      }

      if (password.length < 6) {
        showMessage(
          "Your password must contain at least 6 characters."
        );
        return;
      }

      if (!supabaseClient) {
        showMessage(
          "The account service is not connected. Please refresh the page."
        );
        return;
      }

      signupButton.disabled = true;
      signupButton.textContent = "Creating account...";

      showMessage("Creating your account...", true);

      try {
        const { data, error } =
          await supabaseClient.auth.signUp({
            email: email,
            password: password
          });

        if (error) {
          throw error;
        }

        // Account created and user logged in.
        if (data.user && data.session) {
          form.reset();

          showDashboard(data.user);

          if (dashboardMessage) {
            dashboardMessage.textContent =
              "Your account was created successfully. You are now logged in.";

            dashboardMessage.style.color = "#4ade80";
          }

          if (dashboard) {
            dashboard.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }

          return;
        }

        // Account created but email confirmation is still required.
        if (data.user && !data.session) {
          showMessage(
            "Your account was created, but Supabase did not start a login session. Check that Confirm email is turned OFF in Supabase Authentication settings."
          );

          return;
        }

        showMessage(
          "We could not complete registration. Please try again."
        );

      } catch (error) {
        console.error("Registration error:", error);

        let errorText = error.message || "Please try again.";

        if (
          errorText.toLowerCase().includes("already registered")
        ) {
          errorText =
            "This email already has an account. Please use another email or sign in.";
        }

        if (
          errorText.toLowerCase().includes("invalid api key")
        ) {
          errorText =
            "The Supabase key is incorrect. Check the publishable key in your Supabase project.";
        }

        showMessage("Registration failed: " + errorText);

      } finally {
        signupButton.disabled = false;
        signupButton.textContent = "Create account";
      }
    });
  }


  // ========================================
  // LOG OUT
  // ========================================

  if (logoutButton) {
    logoutButton.addEventListener("click", async function () {
      if (!supabaseClient) {
        return;
      }

      logoutButton.disabled = true;

      try {
        const { error } =
          await supabaseClient.auth.signOut();

        if (error) {
          throw error;
        }

        showDashboard(null);

        if (dashboardMessage) {
          dashboardMessage.textContent =
            "You have logged out successfully.";

          dashboardMessage.style.color = "#4ade80";
        }

        if (accountSection) {
          accountSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }

      } catch (error) {
        console.error("Logout error:", error);

        if (dashboardMessage) {
          dashboardMessage.textContent =
            "Logout failed: " + error.message;

          dashboardMessage.style.color = "#ff7777";
        }

      } finally {
        logoutButton.disabled = false;
      }
    });
  }

});
