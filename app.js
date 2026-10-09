// Supabase connection settings
const SUPABASE_URL = "https://fcxdazlpeagmuagsayja.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_DpRoplNSvHveMpStM5NolQ_ofoVRbeL";

// Update the footer year
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Check that the connection settings have been added
if (
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_PUBLISHABLE_KEY.startsWith("sb_publishable_")
) {
  console.log("Supabase settings are configured.");
} else {
  console.log("Please add your Supabase URL and publishable key.");
}
