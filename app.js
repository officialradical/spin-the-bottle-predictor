const SUPABASE_URL = "https://fcxdazlpeagmuagsayja.supabase.co";
const SUPABASE_KEY = "sb_publishable_DpRoplNSvHveMpStM5NolQ_ofoVRbeL";

let supabaseClient = null;

function showMessage(text, success = false) {
    const message = document.getElementById("message");

    if (message) {
        message.textContent = text;
        message.style.color = success ? "#4ade80" : "#ff7777";
    } else {
        alert(text);
    }
}

function loadSupabase() {
    return new Promise((resolve, reject) => {
        if (window.supabase) {
            resolve(window.supabase);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

        script.onload = () => {
            if (window.supabase) {
                resolve(window.supabase);
            } else {
                reject(new Error("Supabase failed to initialize."));
            }
        };

        script.onerror = () => {
            reject(new Error("Could not load the account service. Check your internet connection."));
        };

        document.head.appendChild(script);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const year = document.getElementById("year");
    const result = document.getElementById("result");
    const predictBtn = document.getElementById("predictBtn");
    const form = document.getElementById("signupForm");
    const emailInput = document.getElementById("signupEmail");
    const passwordInput = document.getElementById("signupPassword");
    const signupButton = document.getElementById("signupButton");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Demo button
    if (predictBtn && result) {
        predictBtn.addEventListener("click", () => {
            result.textContent =
                "Demo result: " + (Math.random() < 0.5 ? "UP" : "DOWN");
        });
    }

    // Always attach the registration handler
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

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

            showMessage("Connecting to create your account...", true);

            try {
                const library = await loadSupabase();

                if (!supabaseClient) {
                    supabaseClient = library.createClient(
                        SUPABASE_URL,
                        SUPABASE_KEY
                    );
                }

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
                        "Account created successfully! You are logged in.",
                        true
                    );
                } else if (data.user) {
                    showMessage(
                        "Account created, but no active login session was returned. Check that email confirmation is disabled in Supabase.",
                        true
                    );
                } else {
                    showMessage(
                        "The account could not be confirmed. Please try again."
                    );
                }
            } catch (error) {
                console.error("Signup error:", error);
                showMessage("Error: " + error.message);
            } finally {
                if (signupButton) {
                    signupButton.disabled = false;
                    signupButton.textContent = "Create account";
                }
            }
        });
    } else {
        console.error("Signup form not found. Check index.html.");
    }
});
