import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function useNavigateWithLoader() {
  const navigate = useNavigate();

  const navigateWithLoader = useCallback(
    (to, options = {}) => {
      // If the loader helper exists, use it so navigation waits for fill
      if (typeof window?.animateThenNavigate === "function") {
        window.animateThenNavigate(() => navigate(to, options));
      } else {
        // fallback
        navigate(to, options);
      }
    },
    [navigate]
  );

  return navigateWithLoader;
}
