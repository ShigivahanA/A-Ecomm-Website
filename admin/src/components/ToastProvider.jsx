import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

const ToastContext = createContext(null);
let idCounter = 0;

const MAX_TOASTS = 5;
const EXIT_ANIM_MS = 220; // keep in sync with CSS animation

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]); // newest first
  const timersRef = useRef(new Map());

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t.timeout));
      timersRef.current.clear();
    };
  }, []);

  const scheduleRemoval = useCallback((id, duration) => {
    if (duration <= 0) return;
    const existing = timersRef.current.get(id);
    if (existing) clearTimeout(existing.timeout);

    const start = Date.now();
    const timeout = setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      const finalTimeout = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        timersRef.current.delete(id);
      }, EXIT_ANIM_MS);
      timersRef.current.set(id, { timeout: finalTimeout, start: Date.now() });
    }, duration);

    timersRef.current.set(id, { timeout, start, remaining: duration });
  }, []);

  const addToast = useCallback(
    ({ type = "info", message = "", duration = 4000 } = {}) => {
      const id = ++idCounter;
      setToasts((current) => {
        const next = [{ id, type, message }, ...current];
        if (next.length > MAX_TOASTS) {
          const toRemove = next[next.length - 1].id;
          const ti = timersRef.current.get(toRemove);
          if (ti) clearTimeout(ti.timeout);
          timersRef.current.delete(toRemove);
          return next.slice(0, MAX_TOASTS);
        }
        return next;
      });

      requestAnimationFrame(() => scheduleRemoval(id, duration));
      return id;
    },
    [scheduleRemoval]
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    const meta = timersRef.current.get(id);
    if (meta) {
      clearTimeout(meta.timeout);
      timersRef.current.delete(id);
    }
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), EXIT_ANIM_MS);
  }, []);

  const pauseToast = useCallback((id) => {
    const meta = timersRef.current.get(id);
    if (!meta) return;
    if (meta.timeout) {
      clearTimeout(meta.timeout);
      const elapsed = Date.now() - (meta.start || 0);
      const remaining = (meta.remaining ?? meta.duration ?? 0) - elapsed;
      timersRef.current.set(id, { ...meta, remaining: Math.max(0, remaining) });
    }
  }, []);

  const resumeToast = useCallback((id) => {
    const meta = timersRef.current.get(id);
    if (!meta) return;
    const remaining = meta.remaining ?? 0;
    const timeout = setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      const finalTimeout = setTimeout(() => {
        setToasts((p) => p.filter((t) => t.id !== id));
        timersRef.current.delete(id);
      }, EXIT_ANIM_MS);
      timersRef.current.set(id, { timeout: finalTimeout, start: Date.now() });
    }, remaining);
    timersRef.current.set(id, { ...meta, timeout, start: Date.now(), remaining });
  }, []);

  const ctx = { addToast, removeToast, pauseToast, resumeToast };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <ToastContainer
        toasts={toasts}
        onClose={removeToast}
        onPause={pauseToast}
        onResume={resumeToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};

/* ---------------- Toast UI ---------------- */

function ToastContainer({ toasts, onClose, onPause, onResume }) {
  return createPortal(
    <>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(-6px) scale(.995); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes toast-out {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-6px) scale(.995); }
        }
        .toast-enter { animation: toast-in 220ms cubic-bezier(.2,.9,.25,1) both; }
        .toast-exit  { animation: toast-out ${EXIT_ANIM_MS}ms cubic-bezier(.2,.9,.25,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .toast-enter, .toast-exit { animation: none; }
        }
      `}</style>

      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-xs touch-manipulation">
        {toasts.map((t) => (
          <ToastItem
            key={t.id}
            toast={t}
            onClose={() => onClose(t.id)}
            onPause={() => onPause(t.id)}
            onResume={() => onResume(t.id)}
          />
        ))}
      </div>
    </>,
    document.body
  );
}

function ToastItem({ toast, onClose, onPause, onResume }) {
  const { id, type, message, exiting } = toast;
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    el.addEventListener("pointerenter", onPause);
    el.addEventListener("pointerleave", onResume);
    el.addEventListener("focusin", onPause);
    el.addEventListener("focusout", onResume);
    return () => {
      el.removeEventListener("pointerenter", onPause);
      el.removeEventListener("pointerleave", onResume);
      el.removeEventListener("focusin", onPause);
      el.removeEventListener("focusout", onResume);
    };
  }, [onPause, onResume]);

  const base = "rounded-md shadow-[0_6px_18px_rgba(16,24,40,0.06)] flex items-center";
  const typeStyles = {
    success: "bg-green-50 border border-green-100 text-green-800",
    error: "bg-red-50 border border-red-100 text-red-800",
    info: "bg-blue-50 border border-blue-100 text-blue-800",
    warn: "bg-yellow-50 border border-yellow-100 text-yellow-800",
  }[type] || "bg-gray-50 border border-gray-100 text-gray-800";

  return (
    <div
      ref={rootRef}
      role="status"
      tabIndex={0}
      className={`${base} ${typeStyles} ${exiting ? "toast-exit" : "toast-enter"}`}
      style={{
        padding: "6px 8px",          // reduced padding (compact)
        gap: 8,
        minWidth: 160,
        maxWidth: "100%",
        boxSizing: "border-box",
        alignItems: "center",        // center vertically
      }}
      aria-live="polite"
    >
      {/* Message only */}
      <div style={{ flex: 1, fontSize: 13, lineHeight: "1.1", paddingRight: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {message}
      </div>

      {/* Close X */}
      <button
        onClick={onClose}
        style={{
          border: "none",
          background: "transparent",
          padding: 6,
          marginLeft: 4,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        aria-label="Close notification"
        title="Close"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
