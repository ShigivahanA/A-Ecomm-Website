import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

const MIN_MS = 1500;

export default function NavigationLoader() {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [pageMessage, setPageMessage] = useState("");
  const startRef = useRef(Date.now());
  const hideTimerRef = useRef(null);
  const lastPathRef = useRef(location.pathname); // track previous path

  // --- Fashion-themed message generator (now aware of origin) ---
    const getFashionMessage = (toPath, fromPath) => {
    // special case: coming from home -> collection
    if ((fromPath === "/" || fromPath === "") && toPath.includes("/collection")) {
      return "Darling, we’re escorting you to the Collections — the season’s edit awaits.";
    }

    // exact routes
    if (toPath === "/") return "You’re being whisked to the main showcase…";
    if (toPath.includes("/collection")) return "Curating pieces from our collection for you…";
    if (toPath.includes("/about")) return "A little background — meet the hands that craft our story…";
    if (toPath.includes("/contact")) return "Passing your note to the atelier — we’ll reply with care…";
    if (toPath.includes("/product")) return "Polishing the details of this piece for your eyes…";
    if (toPath.includes("/cart")) return "Gathering your selections for a flawless checkout…";
    if (toPath.includes("/login")) return "Opening your wardrobe access — welcome back, lovely…";
    if (toPath.includes("/place-order")) return "Sealing your order — a bespoke parcel is being prepared…";
    if (toPath.includes("/orders")) return "Reviewing your past orders — your wardrobe history, curated…";
    if (toPath.includes("/verify")) return "Verifying your details — nearly there, darling…";
    if (toPath.includes("/profile")) return "Smoothing your personal profile — tailoring preferences…";
    if (toPath.includes("/wishlist")) return "Unveiling your curated wishlist — favourites on display…";
    if (toPath.includes("/forgot-password")) return "Helping you regain entry — we’ll hand you the keys…";
    if (toPath.includes("/unsubscribe")) return "We’re processing your request — parting is such sweet sorrow…";
    if (toPath.includes("/delivery")) return "Checking delivery options — we’ll get this to your doorstep…";
    if (toPath.includes("/privacy-policy")) return "A quick glance at our promises — your privacy, elegantly kept…";
    if (toPath.includes("/custom-design")) return "Sketching your bespoke experience — couture in the making…";
    if (toPath.includes("/size-guide")) return "Finding your perfect fit — measurements made lovely…";

    // fallback
    return "Tailoring your next view…";
  };


  const showForMin = (minMs = MIN_MS, toPath, fromPath) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    startRef.current = Date.now();
    setPageMessage(getFashionMessage(toPath, fromPath));
    setVisible(true);

    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      hideTimerRef.current = null;
    }, minMs);
  };

  // Initial load: treat origin as same path
  useEffect(() => {
    showForMin(MIN_MS, location.pathname, lastPathRef.current);
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
    // eslint-disable-next-line
  }, []);

  // Every navigation change — use lastPathRef to know origin
  useEffect(() => {
    const prev = lastPathRef.current || "/";
    showForMin(MIN_MS, location.pathname, prev);
    // update lastPathRef for next navigation
    lastPathRef.current = location.pathname;
    // eslint-disable-next-line
  }, [location.pathname, location.search, location.hash]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
      style={{ pointerEvents: visible ? "auto" : "none" }}
      aria-live="polite"
    >
      {/* Responsive GIF: scales for small -> large screens, capped by viewport */}
      <img
        src={assets.loading}
        alt="Loading animation"
        className="mb-6 w-[44vw] max-w-[220px] sm:w-[36vw] sm:max-w-[280px] md:w-[28vw] md:max-w-[360px] lg:w-[20vw] lg:max-w-[420px] object-contain"
      />

      {/* Message in feminine/fashion tone */}
      <div className="text-center px-4">
        <div className="text-lg tracking-wide text-black-600 font-medium">
          {pageMessage}
        </div>
      </div>
    </div>
  );
}
