const express = require("express");
const Review = require("../models/Review");
//const sendEmail = require("../Utils/sendEmails");
const { sendEmail } = require("../Utils/sendEmails");


const router = express.Router();

//import adminAuth from "../middleware/adminAuth.js";
const adminAuth= require('../middleware/adminAuth')

// Submit review
router.post("/", async (req, res) => {

    //honeypot check for spams, bots fill it humans do not
    if (req.body.website){
        return res.status(400).json({ error: "Spam detected"})
    }
    try{

        const { name, email,rating, message } = req.body;
        const numericRating = Number(rating);

        if (!name || !email || !rating || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }
    

    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ error: "Invalid rating" });
    }

        const isAutoApproved = numericRating === 5;
        //this saves info to database 
        //auto approves 5 star ratings
        const review = await Review.create({ 
            name,
            email, 
            rating:numericRating, 
            message, 
            approved: isAutoApproved
        });

        //notify admin and business owner
        await sendEmail({
         to:[process.env.ADMIN_EMAIL,process.env.BUSINESS_EMAIL],
         subject: "🆕 New Review Submitted",
         text: 
         ` New review submitted:
        
        Name: ${name}
        Email:${email}
        Rating: ${numericRating}/5

        "${message}"

Login to approve it.
`
  });
/*
//Thank you email to client(reviewer)
await sendEmail({
    to:email,
    subject: "Thank you for your review!",
    text: [
  `Hi ${name},`,
  ``,
  `Thank you for taking the time to leave us a review.`,
  `We truly appreciate your feedback and support.`,
  ``,
  `Your review will appear on our website once it is approved.`,
  ``,
   `If you have any questions, feel free to reach out.`,
  ``,
  `Best regards,`,
  `Ponce Countertops Inc`
].join("\n")

  });
*/
//const logoUrl = "https://yourdomain.com/images/logo.png";
const logoUrl = "https://relaxed-zuccutto-1d547d.netlify.app/images/logo.png";
try{
await sendEmail({
  to: email,
  subject: "Thank you for your review!",
  text: `Hi ${name}, thank you for your review.`, // fallback

  html: `
    <div style="font-family:Arial;padding:20px;">
      
      <div style="text-align:center;">
        <img src="${logoUrl}" style="width:180px;" />
      </div>

      <h2>Thank you, ${name}!</h2>

      <p>We truly appreciate you taking the time to leave us a review.</p>

      <p>Your feedback helps us grow and improve.</p>

      <p>Your review will appear on our website once it is approved.</p>

      <br/>

      <p>Best regards,<br/>
      <strong>Ponce Countertops Inc</strong><br/>
      (619) 288-1476</p>

    </div>
  `
});

}
catch (EmailErr){
  console.error("Email failed:", EmailErr);
}

  res.status(201).json({
    message:"Review submitted successfully"
  });

}catch (error){
    console.error(error);
    res.status(500).json({ error: "Review submission failed"});
}
});

//pending review route
//Get pending reviews
router.get("/pending", adminAuth, async (req,res) => {
  try {
    const reviews =await Review.find({ approved :false})
    res.json(reviews);
  }
  catch(err){
    res.status(500).json ({ error: "Failed to load pending reviews"});

  }
});

// Approve review (admin)
router.patch("/:id/approve", adminAuth, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    console.log(`✅ Review approved: ${req.params.id} at ${new Date().toISOString()}`);

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: "Failed to approve review" });
  }
});


//being able to delete a review
router.delete ("/:id", adminAuth, async (req, res) => {
    try{
        await Review.findByIdAndDelete(req.params.id);

        console.log(`🗑️ Review deleted: ${req.params.id} at ${new Date().toISOString()}`);

        res.json({message: "Review deleted"});
    }
    catch (err){
        res.status(500).json({error: "Failed to delete review"});
    }
});

// Get approved reviews (public)
router.get("/approved", async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to load approved reviews" });
  }
});
module.exports = router;

