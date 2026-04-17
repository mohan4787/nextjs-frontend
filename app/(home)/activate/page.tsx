"use client";

import authSvc from "@/services/auth.service";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Updated for Next.js
import { toast } from "sonner";

const ActivateUser = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Next.js App Router hook

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length < 6) {
      return toast.error("Please enter the 6-digit code.");
    }

    try {
      setLoading(true);
      console.log("hello:",otp);
      

      // It's better to type your response if possible, using 'any' sparingly
      const res = await authSvc.postRequest("/auth/activate", { 
        token:otp
       });
      console.log("response:", res);

      toast.success("Account activated! Redirecting to login...");

      // router.push is the Next.js equivalent of navigate()
      setTimeout(() => router.push("/login"), 2000);
    } catch (error: any) {
      // Handling potential Axios or Fetch error structures
      const message =
        error?.response?.data?.message ||
        error?.data?.message ||
        "Invalid OTP.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to ensure only numbers are entered
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ""); // Remove non-digits
    setOtp(val);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-black text-red-600 mb-2 uppercase">
          Verify Account
        </h2>
        <p className="text-slate-500 mb-6 text-sm">
          Enter the 6-digit code sent to your email.
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric" // Shows numeric keypad on mobile
            placeholder="000000"
            maxLength={6}
            value={otp}
            onChange={handleOtpChange}
            className="w-full text-center text-3xl font-mono tracking-[10px] py-4 bg-slate-50 border-2 text-black border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-all"
          />

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Verifying..." : "Activate Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActivateUser;
