const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// Send email helper
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log("📤 RESEND EMAIL TO:", to);

    const data = await resend.emails.send({
      from: "Ponce Countertops <martin@poncecountertopsinc.com>",
      to,
      subject,
      text,
      html,
      reply_to:"martin@poncecountertopsinc.com"
    });

    console.log("✅ EMAIL SENT:", data);
    return data;

  } catch (error) {
    console.error("❌ RESEND ERROR:", error);
    throw error;
  }
};

module.exports = { sendEmail };