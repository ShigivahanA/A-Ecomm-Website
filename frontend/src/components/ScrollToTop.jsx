// App.js (or components/ScrollToTop.jsx)
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // debugging help (uncomment while testing)
    // console.log("ScrollToTop running for:", pathname, hash);

    // Best target for scrolling
    const scrollToTop = (behavior = "smooth") => {
      try {
        const el = document.scrollingElement || document.documentElement || document.body;
        // Some browsers ignore options on scrollTop assignments, so try both:
        if (el && typeof el.scrollTo === "function") {
          el.scrollTo({ top: 0, left: 0, behavior });
        } else {
          // fallback
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      } catch (e) {
        // absolute fallback
        try { window.scrollTo(0, 0); } catch (_) {}
      }
    };

    // If there's a hash (anchor), let the browser try to jump to that element,
    // but do it *after* a short delay so layout/images have a chance to settle.
    if (hash) {
      // first ensure at top to avoid intermediate positions
      scrollToTop("auto");

      const tryScrollToHash = () => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // if element not found yet, scroll to top
          scrollToTop("smooth");
        }
      };

      // run a couple times: immediate, +after 120ms, +after 350ms (robust for images)
      tryScrollToHash();
      const t1 = setTimeout(tryScrollToHash, 120);
      const t2 = setTimeout(tryScrollToHash, 350);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    // No hash — ensure we're at top. Do immediate + retry after small delays.
    scrollToTop("auto"); // instant first
    const tA = setTimeout(() => scrollToTop("smooth"), 80);
    const tB = setTimeout(() => scrollToTop("smooth"), 260);

    return () => {
      clearTimeout(tA);
      clearTimeout(tB);
    };
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
