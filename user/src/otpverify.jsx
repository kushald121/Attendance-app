import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const OtpVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, name, phone, password } = location.state || {};
  const [otp, setOtp] = useState("");

  useEffect(() => {
    console.log("Received Data:", {email, name, phone, password});
    if (!email) navigate("/");
  }, [email, navigate]);

  const handleVerify = async () => {
    try {
      // Step 1: Verify OTP
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });

      alert(res.data.message);

      // Step 2: Register User after OTP verification
      const registerRes = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        phone,
        password,
      });

      alert(registerRes.data.msg || "User registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification or Registration failed");
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="p-8 bg-gray-800 rounded-xl">
        <h2 className="text-xl mb-4">Verify Your OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          className="mb-3 p-2 w-full rounded text-black"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
        />

        <button
          onClick={handleVerify}
          className="bg-blue-600 px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OtpVerify;
