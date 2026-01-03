import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useToast } from "../components/ToastProvider";

const AdminNewsletter = ({ token }) => {
  const { addToast } = useToast();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("active");
  const [sending, setSending] = useState(false);

  const sendNewsletter = async () => {
    if (!subject || !content) {
      addToast({ type: "error", message: "Subject and content required" });
      return;
    }

    try {
      setSending(true);

      const res = await axios.post(
        `${backendUrl}/api/newsletter/send`,
        {
          subject,
          html: content,
          audience,
        },
        {
          headers: { token },
        }
      );

      if (res.data.success) {
        addToast({ type: "success", message: res.data.message });
        setSubject("");
        setContent("");
      } else {
        addToast({ type: "error", message: res.data.message });
      }
    } catch (err) {
      console.error(err);
      addToast({ type: "error", message: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-6">
        Send Newsletter
      </h2>

      <div className="space-y-4">
        {/* Subject */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email Subject
          </label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border px-3 py-2 rounded-xl"
            placeholder="New Collection Drop ✨"
          />
        </div>

        {/* Audience */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Audience
          </label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="border px-3 py-2 rounded-xl"
          >
            <option value="active">All Active Subscribers</option>
            <option value="verified">Only Verified Subscribers</option>
          </select>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email Content (HTML preferred)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full border px-3 py-2 rounded-xl"
            placeholder="<h1>New Drop</h1><p>Exclusive preview inside…</p>"
          />
        </div>

        {/* Action */}
        <button
          onClick={sendNewsletter}
          disabled={sending}
          className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send Newsletter"}
        </button>
      </div>
    </div>
  );
};

export default AdminNewsletter;
