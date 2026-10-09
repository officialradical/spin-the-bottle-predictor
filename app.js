// ========================================
// SUPABASE CONFIGURATION
// ========================================

const SUPABASE_URL = "PASTE_YOUR_EXISTING_SUPABASE_PROJECT_URL";
const SUPABASE_KEY = "PASTE_YOUR_EXISTING_SUPABASE_PUBLISHABLE_KEY";

let supabaseClient = null;

// ========================================
// INITIALIZE WEBSITE
// ========================================

document.addEventListener("DOMContentLoaded", async () => {
    const message = document.getElementById("message");
    const year = document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    function showMessage(text, success = false) {
        if (message) {
            message.textContent = text;
            message.style.color = success ? "#4ade80" : "#ff7777";
        } else {
            alert(text);
        }
    }

    // Load Supabase
    try {
        if (!window.supabase) {
            await new Promise((resolve, reject) => {
                const script = document.createElement("script");
                script.src =
                    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

                script.onload = resolve;
                script.onerror = () =>
                    reject(new Error("Could not load Supabase."));

                document.head.appendChild(script);
            });
        }

        if (
            SUPABASE_URL.includes("PASTE_") ||
            SUPABASE_KEY.includes("PASTE_")
        ) {
            showMessage("Please configure your Supabase URL and publishable key.");
            return;
        }

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
    } catch (error) {
        console.error(error);
        showMessage("Connection failed. Please refresh and try again.");
        return;
    }

    // ========================================
    // UP / DOWN DEMO
    // ========================================

    const predictButton = document.getElementById("predictBtn");
    const result = document.getElementById("result");

    if (predictButton && result) {
        predictButton.addEventListener("click", () => {
            result.textContent =
                Math.random() < 0.5 ? "UP" : "DOWN";
        });
    }

    // ========================================
    // ACCOUNT REGISTRATION
    // ========================================

    const signupButton =
        document.getElementById("createAccountBtn") ||
        document.getElementById("signupBtn");

    const emailInput =
        document.getElementById("email") ||
        document.getElementById("signupEmail") ||
        document.querySelector('input[type="email"]');

    const passwordInput =
        document.getElementById("password") ||
        document.getElementById("signupPassword") ||
        document.querySelector('input[type="password"]');

    async function createAccount(event) {
        if (event) {
            event.preventDefault();
        }

        if (!supabaseClient) {
            showMessage("The account service is not connected.");
            return;
        }

        const email = emailInput?.value.trim();
        const password = passwordInput?.value;

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

        try {
            const { data, error } =
                await supabaseClient.auth.signUp({
                    email: email,
                    password: password
                });

            if (error) {
                throw error;
            }

            if (data.session) {
                showMessage(
                    "Account created successfully! You are now logged in.",
                    true
                );
            } else if (data.user) {
                showMessage(
                    "Account submitted. Check that email confirmation is disabled in Supabase.",
                    true
                );
            } else {
                showMessage("Account creation could not be confirmed.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            showMessage("Registration failed: " + error.message);
        } finally {
            if (signupButton) {
                signupButton.disabled = false;
                signupButton.textContent = "Create account";
            }
        }
    }

    if (signupButton) {
        signupButton.addEventListener("click", createAccount);
    }

    const signupForm =
        document.getElementById("signupForm") ||
        document.getElementById("signup-form");

    if (signupForm) {
        signupForm.addEventListener("submit", createAccount);
    }

    // ========================================
    // CHECK EXISTING LOGIN
    // ========================================

    try {
        const { data } = await supabaseClient.auth.getSession();

        if (data.session) {
            console.log("A user is already logged in.");
        }
    } catch (error) {
        console.error("Session check failed:", error);
    }
});
