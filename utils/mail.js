const nodemailer = require('nodemailer');  
require('dotenv').config();  


exports.sendMail = async (mail, token) => {
    let sent;
    const senderMail = process.env.SENDER_MAIL;  
    const smtpService = process.env.SMTP_SERVICE;  

    try {
        const transporter = nodemailer.createTransport({
            service: smtpService,  
            auth: {
                user: senderMail, 
                pass: process.env.SEND_MAIL_KEY,  
            },
        });

        let mailOptions = {
            from: senderMail, 
            to: mail,  
            subject: 'Forgot Password',  
            text: `Click on the following link to change your password.\n${process.env.LINK}?token=${token}\n\nThank You.`,  // Email body
        };

        // Sending the email
        sent = await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
        return sent;
    }

    return sent;
};
