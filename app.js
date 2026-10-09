// =====================================
// SUPABASE CONFIGURATION
// =====================================

const SUPABASE_URL = "https://fcxdazlpeagmuagsayja.supabase.co";

const SUPABASE_KEY = "sb_publishable_DpRoplNSvHveMpStM5NolQ_ofoVRbeL";

// =====================================
// INITIALIZE WEBSITE
// =====================================

document.addEventListener("DOMContentLoaded", async () => {
  const $ = (id) => document.getElementById(id);

  const signupForm = $("signupForm");
  const loginForm = $("loginForm");
const protectedContent = $("protectedContent");
  const signupButton = $("signupButton");
  const loginButton = $("loginButton");
  const logoutButton = $("logoutButton");

  const message = $("message");
  const loginMessage = $("loginMessage");
  const dashboardMessage = $("dashboardMessage");

  const account = $("account");
  const dashboard = $("userDashboard");

  const dashboardEmail = $("dashboardEmail");
  const dashboardUserId = $("dashboardUserId");

  if ($("year")) {
    $("year").textContent = new Date().getFullYear();
  }

  function showMessage(element, text, success = false) {
    if (!element) return;

    element.textContent = text;
    element.style.color = success ? "#4ade80" : "#ff8585";
  }

  
  function showDashboard(user) {
  if (protectedContent) {
    protectedContent.hidden = !user;
  }

  if (!user) {
    if (dashboard) dashboard.hidden = true;
    if (account) account.hidden = false;
    return;
  }

  if (dashboard) dashboard.hidden = false;
  if (account) account.hidden = true;

  if (dashboardEmail) {
    dashboardEmail.textContent = user.email || "";
  }

  if (dashboardUserId) {
    dashboardUserId.textContent = user.id || "";
  }
}

  let client;

  // CONNECT TO SUPABASE
  try {
    if (!window.supabase) {
      throw new Error("Supabase failed to load. Refresh the website.");
    }

    client = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

    const { data, error } = await client.auth.getSession();

    if (error) throw error;

    showDashboard(data.session ? data.session.user : null);

    client.auth.onAuthStateChange((_event, session) => {
      showDashboard(session ? session.user : null);
    });

  } catch (error) {
    console.error("Supabase error:", error);

    showMessage(message, "Connection error: " + error.message);
    showMessage(loginMessage, "Connection error: " + error.message);
  }

  // UP / DOWN DEMO
  const predictButton = $("predictBtn");
  const result = $("result");

  if (predictButton && result) {
    predictButton.addEventListener("click", () => {
      result.textContent =
        "Demo result: " + (Math.random() < 0.5 ? "UP" : "DOWN");
    });
  }

  // CREATE ACCOUNT
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = $("signupEmail")?.value.trim();
      const password = $("signupPassword")?.value;

      if (!email || !password) {
        showMessage(message, "Enter your email and password.");
        return;
      }

      if (password.length < 6) {
        showMessage(message, "Password must contain at least 6 characters.");
        return;
      }

      if (!client) {
        showMessage(message, "Supabase is not connected. Refresh and try again.");
        return;
      }

      signupButton.disabled = true;
      signupButton.textContent = "Creating account...";

      try {
        const { data, error } = await client.auth.signUp({
          email,
          password
        });

        if (error) throw error;

        if (data.user && data.session) {
          signupForm.reset();
          showDashboard(data.user);

          showMessage(
            dashboardMessage,
            "Account created successfully! You are logged in.",
            true
          );

          dashboard?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        } else {
          showMessage(
            message,
            "No login session was returned. Check that Confirm email is OFF in Supabase."
          );
        }

      } catch (error) {
        console.error("Signup error:", error);

        showMessage(
          message,
          "Registration failed: " + error.message
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

      const email = $("loginEmail")?.value.trim();
      const password = $("loginPassword")?.value;

      if (!email || !password) {
        showMessage(loginMessage, "Enter your email and password.");
        return;
      }

      if (!client) {
        showMessage(loginMessage, "Supabase is not connected.");
        return;
      }

      loginButton.disabled = true;
      loginButton.textContent = "Logging in...";

      try {
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        loginForm.reset();
        showDashboard(data.user);

        showMessage(
          dashboardMessage,
          "Login successful! Welcome back.",
          true
        );

        dashboard?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      } catch (error) {
        showMessage(
          loginMessage,
          "Login failed: " + error.message
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
      if (!client) return;

      logoutButton.disabled = true;

      try {
        const { error } = await client.auth.signOut();

        if (error) throw error;

        showDashboard(null);

        showMessage(
          message,
          "You have logged out successfully.",
          true
        );

        account?.scrollIntoView({
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
