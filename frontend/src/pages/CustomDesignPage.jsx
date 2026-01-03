import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import { useToast } from "../components/ToastProvider";
import { useNavigate } from "react-router-dom";

export default function CustomDesignPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [fabric, setFabric] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [files, setFiles] = useState([]); // {id, file, url}
  const [sending, setSending] = useState(false);

  useEffect(() => {
    try { window.scrollTo({ top: 0, behavior: "smooth" }); }
    catch (e) { window.scrollTo(0, 0); }
    const t = setTimeout(() => {
      try { window.scrollTo({ top: 0, behavior: "smooth" }); }
      catch (e) { window.scrollTo(0, 0); }
    }, 120);
    return () => clearTimeout(t);
  }, []);

  const makeId = (f) => `${f.name}-${f.size}-${f.lastModified}`;

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;

    setFiles((prev) => {
      const map = new Map(prev.map((p) => [makeId(p.file), p]));
      for (const f of picked) {
        const id = makeId(f);
        if (map.has(id)) continue;
        if (map.size >= 6) break;
        const url = URL.createObjectURL(f);
        map.set(id, { id, file: f, url });
      }
      return Array.from(map.values());
    });

    e.target.value = "";
  };

  const removeFileAt = (idx) => {
    setFiles((prev) => {
      const next = [...prev];
      const removed = next.splice(idx, 1)[0];
      if (removed && removed.url) URL.revokeObjectURL(removed.url);
      return next;
    });
  };

  useEffect(() => {
    return () => {
      files.forEach((f) => { if (f?.url) URL.revokeObjectURL(f.url); });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (ev) => {
    ev.preventDefault();
    if (!name.trim() || !email.includes("@")) {
      addToast({ type: "error", message: "Please provide name and a valid email" });
      return;
    }
    if (!description.trim()) {
      addToast({ type: "error", message: "Add some details about your design requirements" });
      return;
    }

    setSending(true);
    try {
      const form = new FormData();
      form.append("subject", "Custom design request");
      form.append("name", name.trim());
      form.append("email", email.trim());
      form.append("phone", phone.trim());
      form.append("message", description.trim());
      form.append("fabric", fabric.trim());
      form.append("budget", budget.trim());
      form.append("timeline", timeline.trim());
      files.forEach((entry) => form.append("files", entry.file, entry.file.name));

      const res = await fetch(backendUrl+"/api/user/custom-design", {
        method: "POST",
        // public route: do not send custom headers to avoid preflight/CORS unless needed
        body: form,
      });

      // If network-level failure, fetch would have thrown before here.
      // Now safely inspect response before parsing JSON.
      const contentType = res.headers.get("content-type") || "";
      let body = null;
      if (contentType.includes("application/json")) {
        // try parsing JSON but guard against empty body
        try {
          body = await res.json();
        } catch (parseErr) {
          console.error("Failed to parse JSON body:", parseErr);
          body = null;
        }
      } else {
        // non-json: try text (useful for HTML error pages)
        try {
          body = await res.text();
        } catch (txtErr) {
          console.error("Failed to read response text:", txtErr);
          body = null;
        }
      }

      if (res.ok) {
        // prefer server message from JSON if present
        const msg = body && body.message ? body.message : "Request submitted — we will contact you soon.";
        addToast({ type: "success", message: msg });
        // reset form
        setName(""); setEmail(""); setPhone(""); setDescription(""); setFabric(""); setBudget(""); setTimeline(""); setFiles([]);
      } else {
        // helpful debugging info in toast and console
        console.error("Server error response", res.status, body);
        const serverMsg = body && body.message ? body.message : (typeof body === "string" && body.length ? body : `Server returned ${res.status}`);
        addToast({ type: "error", message: serverMsg });
      }
    } catch (err) {
      // network / CORS / fetch-level error
      console.error("submit custom design error", err);
      addToast({ type: "error", message: "Network error — please try again" });
    } finally {
      setSending(false);
    }
  };


  return (
    <main className="min-h-[70vh] py-16 px-4 max-w-5xl mx-auto text-gray-800">
      <div className='text-2xl'><Title text1="CUSTOM" text2="DESIGN REQUEST" /></div>
      
      <p className="text-sm text-gray-600 mb-6">
        Tell us what you'd like — veil, kurta set, indo-western dress, lehenga blouse or any made-to-measure piece.
        Attach images (mood or sketches), share fabric preference, approximate budget and timeline.
      </p>

      <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-xl border">
        {/* form fields (same as you had) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm block mb-1">Full name*</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="border px-3 py-2 rounded-xl w-full" required />
          </div>

          <div>
            <label className="text-sm block mb-1">Email*</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="border px-3 py-2 rounded-xl w-full" required />
          </div>

          <div>
            <label className="text-sm block mb-1">Phone*</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="border px-3 py-2 rounded-xl w-full" required/>
          </div>

          <div>
            <label className="text-sm block mb-1">Fabric / preference*</label>
            <input value={fabric} onChange={(e) => setFabric(e.target.value)} className="border px-3 py-2 rounded-xl w-full" required/>
          </div>
        </div>

        <div>
          <label className="text-sm block mb-1">Describe your requirements*</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="border px-3 py-2 rounded-xl w-full" placeholder="Occasion, silhouette, measurements (if available), colours, references..." required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm block mb-1">Approx. budget*</label>
            <input value={budget} onChange={(e) => setBudget(e.target.value)} className="border px-3 py-2 rounded-xl w-full" placeholder="₹" required/>
          </div>

          <div>
            <label className="text-sm block mb-1">Desired timeline*</label>
            <input value={timeline} onChange={(e) => setTimeline(e.target.value)} className="border px-3 py-2 rounded-xl w-full" placeholder="e.g. 3 weeks" required/>
          </div>

          <div>
            <label className="text-sm block mb-1">Attach references (up to 6)*</label>
            <input type="file" accept="image/*" multiple onChange={handleFiles} className="border rounded-xl px-3 py-2 w-full" />
          </div>
        </div>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {files.map((entry, i) => (
              <div key={entry.id} className="w-20 h-20 border rounded overflow-hidden relative">
                <img src={entry.url} alt={entry.file.name} className="object-cover w-full h-full" />
                <button type="button" onClick={() => removeFileAt(i)} className="absolute top-0 right-0 bg-black/60 text-white w-6 h-6 flex items-center justify-center text-xs">×</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-3">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-[#e5e5e5] border rounded-xl">Cancel</button>

          <button type="submit" disabled={sending} className="px-5 py-2 bg-black text-white rounded-xl">
            {sending ? "Submitting..." : "Send request"}
          </button>
        </div>
      </form>
    </main>
  );
}