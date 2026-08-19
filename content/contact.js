// ============================================================================
// CONTACT SECTION CONTENT
// ============================================================================

window.SITE_CONTENT = window.SITE_CONTENT || {};

SITE_CONTENT.contact = {
  intro: "Best way to reach me is email — I'm open to roles, freelance work, or just talking shop about IT/dev/security.",
  // TODO: replace formId with the real Formspree form ID for each inbox (from your Formspree
  // dashboard -> that form -> Settings -> "Your Forms Endpoint", e.g. "abcdwxyz").
  // Using two separate Formspree forms lets each route to a different inbox without ever
  // putting a real email address in the page source.
  recipients: [
    { label: "Send to Mikaela", formId: "YOUR_GENERAL_FORM_ID" },
    { label: "Send to CamiChameleon", formId: "YOUR_FREELANCE_FORM_ID" }
  ]
};
