import otpStore from "./otpStore.js";
export const verifyOtpController = (req, res) => {
    const { email, otp } = req.body;

    console.log("Stored OTP Object:", otpStore[email]);
    console.log("Entered OTP:", otp);

    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    if (otpStore[email] && String(otpStore[email].otp) === String(otp)) {
        otpStore[email].verified = true;  // Mark as verified, don't delete yet
        return res.status(200).json({ message: "OTP Verified Successfully" });
    } else {
        return res.status(400).json({ message: "Invalid or Expired OTP" });
    }
};
