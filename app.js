// SUPABASE PROJECT SETTINGS
const SUPABASE_URL = "PASTE_YOUR_SUPABASE_PROJECT_URL_HERE";
const SUPABASE_KEY = "PASTE_YOUR_SUPABASE_PUBLISHABLE_KEY_HERE";

document.addEventListener("DOMContentLoaded", async () => {
  const get = (id) => document.getElementById(id);

  const signupForm = get("signupForm");
  const loginForm = get("loginForm");

  const signupButton = get("signupButton");
  const loginButton = get("loginButton");

  const message = get("message");
  const loginMessage = get("loginMessage");

  const account = get("account");
  const dashboard = get("userDashboard");

  const dashboardEmail = get("dashboardEmail");
  const dashboardUserId = get("dashboardUserId");
  const dashboardMessage = get("dashboardMessage");

  const logoutButton = get("logoutButton");

  if (get("year")) {
    get("year").textContent = new Date().getFullYear();
  }

  function showMessage(element, text, success = false) {
    if (!element) return;

    element.textContent = text;
    element.style.color = success ? "#4ade80" : "#ff8585";
  }

  function showDashboard(user) {
    if (!user) {
      if (dashboard) dashboard.hidden = true;
      if (account) account.hidden = false;
      return;
    }

    if (dashboard) dashboard.hidden = false;
    if (account) account.hidden = true;

    if (dashboardEmail) {
      dashboardEmail.textContent = user.email || "Unavailable";
    }

    if (dashboardUserId) {
      dashboardUserId.textContent = user.id || "Unavailable";
    }
  }

  let supabaseClient = null;

  // CONNECT TO SUPABASE
  try {
    if (!window.supabase) {
      throw new Error(
        "The account service could not load. Refresh the website and try again."
      );
    }

    if (
      SUPABASE_URL.includes("PASTE_YOUR") ||
      SUPABASE_KEY.includes("PASTE_YOUR")
    ) {
      throw new Error(
        "Add your actual Supabase project URL and publishable key in app.js."
      );
    }

    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

    const { data, error } =
      await supabaseClient.auth.getSession();

    if (error) throw error;

    showDashboard(data.session?.user || null);

    supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        showDashboard(session?.user || null);
      }
    );
  } catch (error) {
    console.error("Supabase setup error:", error);

    showMessage(
      message,
      "Account service error: " + error.message
    );

    showMessage(
      loginMessage,
      "Account service error: " + error.message
    );
  }

  // UP / DOWN DEMO
  const predictButton = get("predictBtn");
  const result = get("result");

  if (predictButton && result) {
    predictButton.addEventListener("click", () => {
      const outcome = Math.random() < 0.5 ? "UP" : "DOWN";
      result.textContent = "Demo result: " + outcome;
    });
  }

  // CREATE ACCOUNT
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = get("signupEmail").value.trim();
      const password = get("signupPassword").value;

      if (!email || !password) {
        showMessage(
          message,
          "Please enter your email and password."
        );
        return;
      }

      if (password.length < 6) {
        showMessage(
          message,
          "Your password must contain at least 6 characters."
        );
        return;
      }

      if (!supabaseClient) {
        showMessage(
          message,
          "The account service is not connected. Check your Supabase settings."
        );
        return;
      }

      signupButton.disabled = true;
      signupButton.textContent = "Creating account...";

      showMessage(
        message,
        "Creating your account...",
        true
      );

      try {
        const { data, error } =
          await supabaseClient.auth.signUp({
            email: email,
            password: password
          });

        if (error) throw error;

        if (data.user && data.session) {
          signupForm.reset();

          showDashboard(data.user);

          showMessage(
            dashboardMessage,
            "Account created successfully! You are now logged in.",
            true
          );

          dashboard.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        } else if (data.user) {
          showMessage(
            message,
            "Your account was created, but no login session was returned. Check that Confirm email is turned off in Supabase."
          );

        } else {
          showMessage(
            message,
            "The account was not created. Please try again."
          );
        }

      } catch (error) {
        console.error("Signup error:", error);

        let errorText = error.message || "Please try again.";

        if (/already registered/i.test(errorText)) {
          errorText =
            "This email is already registered. Please use the login form.";
        }

        showMessage(
          message,
          "Registration failed: " + errorText
        );

      } finally {
        signupButton.disabled = false;
        signupButton.textContent = "Create account";
      }
    });
  }

  // LOG IN
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = get("loginEmail").value.trim();
      const password = get("loginPassword").value;

      if (!email || !password) {
        showMessage(
          loginMessage,
          "Please enter your email and password."
        );
        return;
      }

      if (!supabaseClient) {
        showMessage(
          loginMessage,
          "The account service is not connected. Check your Supabase settings."
        );
        return;
      }

      loginButton.disabled = true;
      loginButton.textContent = "Logging in...";

      showMessage(
        loginMessage,
        "Signing you in...",
        true
      );

      try {
        const { data, error } =
          await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
          });

        if (error) throw error;

        showDashboard(data.user);
        loginForm.reset();

        showMessage(
          dashboardMessage,
          "You are now logged in.",
          true
        );

        dashboard.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      } catch (error) {
        console.error("Login error:", error);

        showMessage(
          loginMessage,
          "Login failed: " +
          (error.message || "Check your email and password.")
        );

      } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Log in";
      }
    });
  }

  // LOG OUT
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      if (!supabaseClient) return;

      logoutButton.disabled = true;

      try {
        const { error } =
          await supabaseClient.auth.signOut();

        if (error) throw error;

        showDashboard(null);

        showMessage(
          dashboardMessage,
          "You have logged out.",
          true
        );

        account.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      } catch (error) {
        showMessage(
          dashboardMessage,
          "Logout failed: " + error.message
        );

      } finally {
        logoutButton.disabled = false;
      }
    });
  }
});
