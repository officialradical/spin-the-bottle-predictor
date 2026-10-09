// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL = "https://fcxdazlpeagmuagsayja.supabase.co";

const SUPABASE_KEY = "sb_publishable_DpRoplNSvHveMpStM5NolQ_ofoVRbeL";

let supabaseClient = null;

// ==========================================
// INITIALIZE WEBSITE
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    const year = document.getElementById("year");
    const result = document.getElementById("result");
    const predictBtn = document.getElementById("predictBtn");
    const signupForm = document.getElementById("signupForm");
    const emailInput = document.getElementById("signupEmail");
    const passwordInput = document.getElementById("signupPassword");
    const signupButton = document.getElementById("signupButton");
    const message = document.getElementById("message");

    // Update footer year
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Display messages
    function showMessage(text, success = false) {
        if (message) {
            message.textContent = text;
            message.style.color = success ? "#4ade80" : "#ff7777";
        } else {
            alert(text);
        }
    }

    // Connect to Supabase
    try {
        if (!window.supabase) {
            showMessage(
                "The account service could not load. Refresh the page and try again."
            );
            return;
        }

        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
    } catch (error) {
        console.error("Supabase initialization error:", error);
        showMessage("Could not connect to the account service.");
        return;
    }

    // ==========================================
    // UP / DOWN DEMO
    // ==========================================

    if (predictBtn && result) {
        predictBtn.addEventListener("click", function () {
            const outcome = Math.random() < 0.5 ? "UP" : "DOWN";
            result.textContent = "Demo result: " + outcome;
        });
    }

    // ==========================================
    // CREATE ACCOUNT
    // ==========================================

    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = emailInput
                ? emailInput.value.trim()
                : "";

            const password = passwordInput
                ? passwordInput.value
                : "";

            if (!email || !password) {
                showMessage("Please enter your email and password.");
                return;
            }

            if (password.length < 6) {
                showMessage(
                    "Your password must contain at least 6 characters."
                );
                return;
            }

            if (signupButton) {
                signupButton.disabled = true;
                signupButton.textContent = "Creating account...";
            }

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

                if (data.session) {
                    showMessage(
                        "Account created successfully! You are now logged in.",
                        true
                    );
                } else if (data.user) {
                    showMessage(
                        "Your account was created, but no active session was returned. Check your Supabase email-confirmation settings.",
                        true
                    );
                } else {
                    showMessage(
                        "Account creation could not be confirmed. Please try again."
                    );
                }
            } catch (error) {
                console.error("Registration error:", error);

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
    } else {
        console.error("Could not find the signup form in index.html.");
    }

    // ==========================================
    // CHECK LOGIN SESSION
    // ==========================================

    supabaseClient.auth.getSession()
        .then(({ data, error }) => {
            if (error) {
                console.error("Session check error:", error);
                return;
            }

            if (data.session) {
                console.log("User is logged in.");
            }
        })
        .catch((error) => {
            console.error("Could not check login session:", error);
        });
});
