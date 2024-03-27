const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user:'varnika1522.be21@chitkara.edu.in' ,
                pass: 'VARNIKACHUTKARA',
            }
        });

        await transporter.sendMail({
            from: 'varnika1522.be21@chitkara.edu.in',
            to: email,
            subject: subject,
            text: "Click on the link to verify your email: " + text,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;