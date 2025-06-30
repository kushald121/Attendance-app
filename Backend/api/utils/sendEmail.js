import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("SMTP_EMAIL in sendEmail.js:", process.env.SMTP_EMAIL);
console.log("SMTP_PASSWORD in sendEmail.js:", process.env.SMTP_PASSWORD);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to,
            subject,
            html,
        });
        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Email error:", error);
        throw error;
    }
};
