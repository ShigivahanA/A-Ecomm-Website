// src/components/ApplyForm.jsx
import React, { useState } from 'react';
import { useToast } from '../components/ToastProvider'

export default function ApplyForm({ jobId, applyJob }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', coverLetter: '' });
  const [resume, setResume] = useState(null);
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  const handleFile = (e) => setResume(e.target.files[0]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !resume) {
      addToast({
        type: "error",
        message: "Please provide name, email and attach resume."
      })
      return;
    }
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('email', form.email);
    fd.append('phone', form.phone);
    fd.append('coverLetter', form.coverLetter);
    fd.append('resume', resume);

    setLoading(true);
    const resp = await applyJob(jobId, fd);
    setLoading(false);

    if (resp?.success) {
      addToast({
        type: "success",
        message: resp.message || "Application submitted — we will contact you."
      })
      setForm({ name: '', email: '', phone: '', coverLetter: '' });
      setResume(null);
    } else {
      addToast({
        type: "error",
        message: resp?.message || "Failed to submit application."
      })
    }
  };

  return (
    <form onSubmit={submit} className="border p-4 rounded-md bg-white/80">
      <h4 className="font-semibold mb-2">Apply for this role</h4>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full border px-3 py-2 rounded mb-2" required />
      <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border px-3 py-2 rounded mb-2" required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone (optional)" className="w-full border px-3 py-2 rounded mb-2" />
      <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} placeholder="Cover letter (optional)" className="w-full border px-3 py-2 rounded mb-2" rows={5} />
      <div className="mb-3">
        <label className="block text-sm mb-1">Resume (PDF / DOC / DOCX) *</label>
        <input type="file" accept=".pdf,.doc,.docx,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFile} />
      </div>
      <button type="submit" disabled={loading} className="px-4 py-2 bg-black text-white rounded-2xl">
        {loading ? 'Applying...' : 'Submit Application'}
      </button>
    </form>
  );
}
