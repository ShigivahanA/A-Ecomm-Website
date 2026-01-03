import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useToast } from "../components/ToastProvider";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const { changePasswordRequest, changePasswordConfirm } = useContext(ShopContext);
  const { addToast } = useToast();
  const navigate = useNavigate();

  // UI state
  const [step, setStep] = useState(1); // 1 = request OTP, 2 = submit OTP + new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // loading states
  const [sendingOtp, setSendingOtp] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // resend timer
  const [secondsLeft, setSecondsLeft] = useState(0);
  useEffect(() => {
    let t;
    if (secondsLeft > 0) t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  // helpers
  const startResendTimer = () => setSecondsLeft(120);

  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      addToast({ type: "error", message: "Enter a valid email" });
      return;
    }
    setSendingOtp(true);
    try {
      const res = await changePasswordRequest({ email });
      if (res?.success) {
        addToast({ type: "success", message: res.message || "OTP sent — check your email" });
        setStep(2);
        startResendTimer();
      } else {
        addToast({ type: "error", message: res?.message || "Failed to send OTP" });
      }
    } catch (err) {
      console.error(err);
      addToast({ type: "error", message: err?.message || "Failed to send OTP" });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleConfirm = async () => {
    if (!otp || otp.trim().length !== 6) {
      addToast({ type: "error", message: "Enter the 6-digit code" });
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      addToast({ type: "error", message: "Password must be at least 8 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast({ type: "error", message: "Passwords do not match" });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await changePasswordConfirm({ email, otp: otp.trim(), newPassword });
      if (res?.success) {
        addToast({ type: "success", message: res.message || "Password changed" });

        // redirect to login and prevent Back from returning here
        navigate("/login", { replace: true });
        try {
          // replace history entry to be extra-safe
          window.history.replaceState({}, document.title, "/login");
        } catch (e) {
          // ignore
        }
      } else {
        addToast({ type: "error", message: res?.message || "Failed to change password" });
      }
    } catch (err) {
      console.error(err);
      addToast({ type: "error", message: err?.message || "Failed to change password" });
    } finally {
      setSavingPassword(false);
    }
  };

  const resendOtp = async () => {
    if (secondsLeft > 0) return;
    setOtp("");
    await handleSendOtp();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg">
        <h2 className="text-2xl parata-regular mb-4">Reset your password</h2>

        {step === 1 && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Enter the email associated with your account. We'll send a 6-digit verification code.
            </p>

            <label className="text-sm block mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="border px-3 py-2 rounded-xl w-full mb-4"
              placeholder="you@example.com"
              autoFocus
            />

            <div className="flex justify-between items-center gap-3">
              <Link to="/login" className="text-sm underline text-gray-600">Back to login</Link>

              <div className="flex gap-3">
                <button
                  onClick={() => { setEmail(""); setOtp(""); setNewPassword(""); setConfirmPassword(""); setStep(1); }}
                  className="px-3 py-2 border rounded-xl"
                  type="button"
                >
                  Clear
                </button>

                <button
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className="px-4 py-2 rounded-xl text-white"
                  style={{ backgroundColor: '#4A70A9' }}
                >
                  {sendingOtp ? "Sending..." : "Send code"}
                </button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Enter the 6-digit code you received and choose a new password.
            </p>

            <label className="text-sm block mb-1">One-time code</label>
            <OTPInput otp={otp} setOtp={setOtp} />

            <label className="text-sm block mb-1">New password</label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border px-3 py-2 rounded-xl w-full mb-3"
              type="password"
              placeholder="At least 8 characters"
            />

            <label className="text-sm block mb-1">Confirm password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border px-3 py-2 rounded-xl w-full mb-4"
              type="password"
            />

            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-gray-600">
                {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : (
                  <button onClick={resendOtp} className="underline text-sm">Resend code</button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setStep(1); setOtp(""); }}
                  className="px-3 py-2 border rounded-xl"
                >
                  Back
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={savingPassword}
                  className="px-4 py-2 rounded-xl text-white"
                  style={{ backgroundColor: '#4A70A9' }}
                >
                  {savingPassword ? "Saving..." : "Save new password"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// OTPInput — paste above your ForgotPassword component
function OTPInput({ otp, setOtp, boxSize = 48 }) {
  const boxes = 6;
  const refs = Array.from({ length: boxes }).map(() => React.createRef());

  // keep otp as string of length <= boxes
  useEffect(() => {
    if (!otp) return;
    // clamp otp length
    if (otp.length > boxes) setOtp(otp.slice(0, boxes));
  }, [otp, setOtp, boxes]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // only one digit or empty
    const arr = otp.split("").slice(0, boxes);
    while (arr.length < boxes) arr.push("");
    arr[index] = value || "";
    const next = arr.join("").replace(/\s/g, "");
    setOtp(next);

    if (value && index < boxes - 1) {
      // focus next
      refs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    const key = e.key;
    if (key === "Backspace") {
      if (otp[index]) {
        // clear this box
        const arr = otp.split("");
        arr[index] = "";
        setOtp(arr.join(""));
      } else if (index > 0) {
        // move back
        refs[index - 1].current?.focus();
        const arr = otp.split("");
        arr[index - 1] = "";
        setOtp(arr.join(""));
      }
    } else if (key === "ArrowLeft" && index > 0) {
      refs[index - 1].current?.focus();
    } else if (key === "ArrowRight" && index < boxes - 1) {
      refs[index + 1].current?.focus();
    }
  };

  return (
    <div className="flex gap-2 mb-3">
      {Array.from({ length: boxes }).map((_, i) => (
        <input
          key={i}
          ref={refs[i]}
          value={(otp && otp[i]) || ""}
          onChange={(e) => handleChange(e.target.value.replace(/\D/g, ""), i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          inputMode="numeric"
          maxLength={1}
          className="border rounded-xl text-center text-xl focus:outline-none"
          style={{
            width: boxSize,
            height: boxSize,
            lineHeight: `${boxSize}px`,
            fontSize: 20,
            background: '#EFECE3',
            borderColor: '#4A70A9'
          }}
        />
      ))}
    </div>
  );
}

