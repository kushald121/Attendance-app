import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";
import otpStore from "./otpStore.js";
import jwt from "jsonwebtoken";
import {ApiError} from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessToken = (userId) => {
    return jwt.sign({_id: userId}, process.env.ACCESS_TOKEN_SECRET,  {
        expiresIn: "1d",
    });
};


// Login Controller
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = generateAccessToken(user._id);

    // Send token in cookie
    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 Day
    });

    res.status(200).json({
        message: "Login successful",
        token,
        user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            verified: user.verified,
        },
    });
});


export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const otp = Math.floor(100000 + Math.random() * 900000);
        otpStore[email] = { otp: otp, verified: false };

        console.log(`Generated OTP for ${email}: ${otp}`);

        await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}`);
        res.status(200).json({ message: "OTP sent to your email." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    console.log("Stored OTP:", otpStore[email]);
    console.log("Entered OTP:", otp);

    if (otpStore[email] && String(otpStore[email].otp).trim() === String(otp).trim()) {
        otpStore[email].verified = true;
        return res.status(200).json({ message: "OTP verified successfully" });
    } else {
        return res.status(400).json({ message: "Invalid OTP" });
    }
};



export const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!otpStore[email] || !otpStore[email].verified) {
            return res.status(400).json({ msg: "OTP not verified. Please verify OTP first." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already registered." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            verified: true
        });

        delete otpStore[email]; // Optional cleanup

        res.status(201).json({ msg: "User registered successfully", user: newUser });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

