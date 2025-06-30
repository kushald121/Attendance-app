import otpStore from "./otpStore.js";
import { sendEmail } from "./sendEmail.js";

export const sendOtpToEmail = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    
    otpStore[email] = otp;   // OTP ko memory me store karo
    console.log(`OTP for ${email} is ${otp}`);

    await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });
};
