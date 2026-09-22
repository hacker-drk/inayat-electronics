/**
 * INAYAT ELECTRONICS - Central Configuration
 * ==========================================================
 * To connect your real WhatsApp number:
 * 1. Change WHATSAPP_NUMBER below to your Pakistani WhatsApp number.
 * 2. Format: Country code followed by mobile number with NO '+' or '-' or spaces.
 *    Example: "923001234567" (92 is Pakistan's country code)
 * 3. Save this file. All WhatsApp buttons across the website will update immediately!
 * ==========================================================
 */

const WHATSAPP_NUMBER = "923459848847"; // Inayat Electronics WhatsApp

const BUSINESS_DETAILS = {
  name: "Inayat Electronics",
  tagline: "Electrical, Home Wiring, Electrical Repair, Fans, LED Lighting & Solar Solutions",
  phoneDisplay: "+92 345 9848847",
  addressDisplay: "Rangpur Adda, Paharpur Road",
  emailDisplay: "info@inayatelectronics.pk",
  workingHours: "Monday - Sunday: 8:00 AM - 5:00 PM (Open 7 Days)",
  emergencySupport: "Available for electrical fault emergencies & solar consultation"
};

const WHATSAPP_MESSAGES = {
  general: "Hello Inayat Electronics, I would like to inquire about your electrical and solar services.",
  home_wiring: "Hello, I want information about home wiring.",
  electrical_repair: "Hello, I need electrical repair service.",
  fault_finding: "Hello, I need electrical fault finding and troubleshooting assistance.",
  fan_service: "Hello, I want to ask about fan installation and repair.",
  led_lighting: "Hello, I want to ask about LED lights and fans.",
  solar_system: "Hello, I want information about solar system installation.",
  solar_consultation: "Hello, I want information about solar system installation.",
  product_inquiry: (productName) => `Hello, I want to ask about ${productName} available at Inayat Electronics.`
};

/**
 * Generates an official WhatsApp Click-to-Chat URL
 * @param {string} text - Pre-filled message text
 * @returns {string} - Full WhatsApp URL
 */
function getWhatsAppUrl(text = "") {
  const number = WHATSAPP_NUMBER.trim();
  const encodedText = encodeURIComponent(text);
  
  // If the placeholder hasn't been replaced yet, warn gently or prompt user
  if (number === "YOUR_NUMBER_HERE" || !number) {
    return `https://wa.me/?text=${encodedText}`;
  }
  
  return `https://wa.me/${number}?text=${encodedText}`;
}

// Expose globally for browser usage
window.INAYAT_CONFIG = {
  WHATSAPP_NUMBER,
  BUSINESS_DETAILS,
  WHATSAPP_MESSAGES,
  getWhatsAppUrl
};
