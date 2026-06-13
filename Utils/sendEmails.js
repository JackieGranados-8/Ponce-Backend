const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER, //sending email
        pass:process.env.EMAIL_PASS //app specific password
    }
});


//Helper: send email
const sendEmail =async ({to, subject,text,html}) => {
    try {

        console.log("📤 EMAIL FUNCTION CALLED", to);
        await transporter.sendMail({
            from: `"Ponce Countertops" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        });
        console.log(`✅ Email sent to ${to}`);

    } catch (error){
        console.error(`❌ Error sending email to ${to}:`, error);
        throw error;
    
    }
};

//Notify admin(me) and business owner(Beto) when a new review is left
const notifyReview = async (reviewData) => {
    try {
    const recipients = [process.env.ADMIN_EMAIL, process.env.BUSINESS_EMAIL];
    const subject = `New Review Submitted!`;
    const text = `New review submitted:\n\nName:${reviewData.name}\nRating: ${reviewData.rating}\nComment: ${reviewData.message}`;

    await sendEmail({to: recipients, subject, text});
    } catch (error){
        console.error("Error sending review notification:", error);
    }
};

//Notify business owner( beto) when a new contact form is submitted
const notifyContactForm = async (contactData) =>{
    const recipients = process.env.BUSINESS_EMAIL;
    const subject = `New Contact Form Submission`;
    const text = `New contact form submission:
        Name: ${contactData.name|| 'NA'}
        Email: ${contactData.email || 'NA'}
        Phone: ${contactData.phone ||'NA'}
        Message: ${contactData.message ||'NA'} 
        `;

    //await sendEmail ({to: ADMIN_EMAIL, subject, text});
    try {
        await sendEmail({ to: recipients, subject, text });
        console.log(`✅ Contact form email sent to ${recipients}`);
    } catch (error) {
        console.error(`❌ Error sending contact form email:`, error);
    }
};

module.exports = { sendEmail, notifyReview, notifyContactForm };