// SUPABASE CONFIGURATION
const SUPABASE_URL = "https://fcxdazlpeagmuagsav.supabase.co";
const SUPABASE_KEY = "PASTE_YOUR_EXISTING_SUPABASE_PUBLISHABLE_KEY_HERE";

// LOAD SUPABASE
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

script.onload = function () {
  startApp();
};

script.onerror = function () {
  showMessage("Could not load the sign-up service. Please refresh.");
};

document.head.appendChild(script);

// DISPLAY MESSAGES
function showMessage(text) {
  const message = document.getElementById("message");

  if (message) {
    message.textContent = text;
    message.style.display = "block";
  } else {
    alert(text);
  }
}

// START WEBSITE
function startApp() {
  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  const form = document.getElementById("signupForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const signupButton = document.getElementById("signupButton");
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (!form) {
    console.error("Signup form not found. Check index.html.");
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

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

    showMessage("Please wait while we create your account...");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });

      if (error) {
        showMessage("Sign-up failed: " + error.message);
        return;
      }

      if (data.user && data.user.identities &&
          data.user.identities.length === 0) {
        showMessage("This email may already be registered. Try logging in.");
        return;
      }

      if (data.session) {
        showMessage("Account created successfully! You are now signed in.");
      } else {
        showMessage(
          "Account created! Check your email for a confirmation link before logging in."
        );
      }

      form.reset();

    } catch (error) {
      console.error("Sign-up error:", error);
      showMessage("Something went wrong: " + error.message);
    } finally {
      if (signupButton) {
        signupButton.disabled = false;
        signupButton.textContent = "Create account";
      }
    }
  });
}
