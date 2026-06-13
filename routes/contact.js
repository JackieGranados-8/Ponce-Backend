const express = require('express');
const router = express.Router();

const { notifyContactForm, sendEmail } = require('../Utils/sendEmails');

console.log("🔥 CONTACT ROUTE LOADED");

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    console.log("🔥 CONTACT ROUTE HIT");
    console.log("📩 BODY RECEIVED:", req.body);

    const contactData = req.body;
    
    if (!contactData.name || !contactData.message || !contactData.email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    contactData.email = contactData.email.trim().toLowerCase();



    // 1. Send admin notification email
    await notifyContactForm(contactData);

    // 2. Validate email exists
    if (!contactData.email) {
      console.log("❌ NO EMAIL FOUND - STOPPING THANK YOU EMAIL");
      return res.status(400).json({ error: "Email missing" });
    }

    console.log("➡️ Sending thank you email to:", contactData.email);

    // 3. Send thank you email to client
    await sendEmail({
      to: contactData.email,
      subject: "We received your message",
      text: "We received your request and will get back to you soon.",
      html: `
        <div style="font-family:Arial;padding:20px;">
          <h2>Thank you, ${contactData.name || "there"}!</h2>
          <p>We received your message and will get back to you within 24–48 hours.</p>

          <p><strong>Your message:</strong></p>
          <p>${(contactData.message || "")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/&/g, "&amp;")
  
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
          }</p>

          <br/>

          <p>Best regards,<br/>
          <strong>Ponce Countertops Inc</strong><br/>
          (619) 288-1476</p>
        </div>
      `
    });

    console.log("✅ THANK YOU EMAIL SENT");

    return res.status(201).json({
      message: "Contact form submitted + emails sent"
    });

  } catch (error) {
    console.error("❌ CONTACT ERROR:", error);
    return res.status(500).json({ error: "Failed to submit contact form" });
  }
});

module.exports = router;