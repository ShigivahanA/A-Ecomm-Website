import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { useToast } from "../components/ToastProvider";


export default function Unsubscribe() {
  const { unsubscribeNewsletter } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  // parse email from query string
  const [email, setEmail] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("email") || "";
    setEmail(q);
  }, [location.search]);

  const [loading, setLoading] = useState(false);

  const handleUnsubscribe = async () => {
    setStatus(null);
    if (!email || !email.includes("@")) {
      addToast({ type: "error", message: "Please provide a valid email." });
      return;
    }

    setLoading(true);
    try {
      const res = await unsubscribeNewsletter({ email });
      if (res?.success) {
        addToast({
          type: "success",
          message: res.message || "You have been unsubscribed."
        });
      } else {
        addToast({
          type: "error",
          message: res?.message || "Unsubscribe failed. Try again later."
        });
      }
    } catch (err) {
      console.error("unsubscribe error", err);
      addToast({
        type: "error",
        message: "Network error. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-white text-black px-4 py-12">
      <div className="w-full max-w-xl border rounded p-6" style={{ borderColor: "#eee" }}>
        <h1 className="text-xl font-semibold mb-3">Unsubscribe from MAYILÉ Newsletter</h1>

        <p className="text-sm text-gray-600 mb-4">
          Click the button below to stop receiving marketing emails from us. This will process your unsubscribe request
          for the email address shown. (This action is reversible — you may re-subscribe anytime.)
        </p>

        <label className="text-xs block mb-1">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border px-3 py-2 mb-4"
          type="email"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleUnsubscribe}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded"
            aria-disabled={loading}
          >
            {loading ? "Processing..." : "Unsubscribe"}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
