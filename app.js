// ========================================
// SUPABASE CONFIGURATION
// ========================================

const SUPABASE_URL = "https://fcxdazlpeagmuagsayja.supabase.co";

const SUPABASE_KEY = "sb_publishable_DpRoplNSvHveMpStM5NolQ_ofoVRbeL";

let supabaseClient = null;

// ========================================
// WEBSITE INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", async () => {
    const year = document.getElementById("year");
    const result = document.getElementById("result");
    const predictBtn = document.getElementById("predictBtn");

    const form = document.getElementById("signupForm");
    const emailInput = document.getElementById("signupEmail");
    const passwordInput = document.getElementById("signupPassword");
    const signupButton = document.getElementById("signupButton");
    const message = document.getElementById("message");

    // Update copyright year
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Display messages on the page
    function showMessage(text, success = false) {
        if (message) {
            message.textContent = text;
            message.style.color = success ? "#4ade80" : "#ff7777";
        }
    }

    // ========================================
    // CONNECT TO SUPABASE
    // ========================================

    try {
        if (!window.supabase) {
            throw new Error(
                "Supabase did not load. Check your internet connection."
            );
        }

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    } catch (error) {
        console.error("Supabase connection error:", error);
    }

    // ========================================
    // UP / DOWN DEMO
    // ========================================

    if (predictBtn && result) {
        predictBtn.addEventListener("click", () => {
            const outcome = Math.random() < 0.5 ? "UP" : "DOWN";

            result.textContent = "Demo result: " + outcome;
        });
    }

    // ========================================
    // CREATE ACCOUNT
    // ========================================

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Read the correct fields from index.html
            const email = emailInput
                ? emailInput.value.trim()
                : "";

            const password = passwordInput
                ? passwordInput.value
                : "";

            // Validate email
            if (!email) {
                showMessage("Please enter your email address.");
                return;
            }

            // Validate password
            if (!password) {
                showMessage("Please enter your password.");
                return;
            }

            if (password.length < 6) {
                showMessage(
                    "Your password must contain at least 6 characters."
                );
                return;
            }

            // Check Supabase connection
            if (!supabaseClient) {
                showMessage(
                    "Account service is unavailable. Refresh and try again."
                );
                return;
            }

            // Prevent multiple submissions
            if (signupButton) {
                signupButton.disabled = true;
                signupButton.textContent = "Creating account...";
            }

            showMessage("Creating your account...", true);

            try {
                // Create account using Supabase Authentication
                const { data, error } =
                    await supabaseClient.auth.signUp({
                        email: email,
                        password: password
                    });

                if (error) {
                    throw error;
                }

                // Account created and user logged in
                if (data.session) {
                    showMessage(
                        "Account created successfully! You are now logged in.",
                        true
                    );

                    form.reset();

                } else if (data.user) {
                    showMessage(
                        "Your account was created, but you are not logged in. Check that email confirmation is disabled in Supabase."
                    );

                } else {
                    showMessage(
                        "We could not confirm account creation. Please try again."
                    );
                }

            } catch (error) {
                console.error("Account creation error:", error);

                if (
                    error.message &&
                    error.message.toLowerCase().includes("already registered")
                ) {
                    showMessage(
                        "This email is already registered. Please log in instead."
                    );
                } else {
                    showMessage(
                        "Registration failed: " +
                        (error.message || "Please try again.")
                    );
                }

            } finally {
                if (signupButton) {
                    signupButton.disabled = false;
                    signupButton.textContent = "Create account";
                }
            }
        });

    } else {
        console.error(
            "Signup form not found. Check the form ID in index.html."
        );
    }
});
