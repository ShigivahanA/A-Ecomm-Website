import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { useToast } from "../components/ToastProvider";


const JobDetails = () => {
  const { jobId } = useParams();
  const { addToast } = useToast();
  const { fetchJobs, applyJob } = useContext(ShopContext);

  const [job, setJob] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs().then(res => {
      if (res?.success) {
        const found = res.jobs.find(j => j._id === jobId);
        if (found) setJob(found);
        else addToast({ message: "Job not found", type: "error" });
      }
    });
  }, [jobId]);

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      addToast({ message: "Name and email are required", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("jobId", jobId);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v || ""));
      if (resume) fd.append("resume", resume);

      const res = await applyJob(jobId, fd);

      if (res?.success) {
        addToast({ message: res.message || "Application submitted", type: "success" });
        setForm({ name: "", email: "", phone: "", message: "" });
        setResume(null);
      } else {
        addToast({ message: res?.message || "Submission failed", type: "error" });
      }
    } catch {
      addToast({ message: "Submission failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <div className="border-t pt-16 max-w-4xl mx-auto px-4">
      <div className="text-2xl mb-6">
        <Title
  text1={job.title.split(" ")[0]}
  text2={job.title.split(" ").slice(1).join(" ")}
/>

      </div>

      {/* Job Info */}
      <div className="border p-6 mb-10 text-gray-700">
        <p className="text-sm text-gray-500 mb-1">
          {job.company} • {job.location || "Remote"}
        </p>

        <p className="mt-4 whitespace-pre-line text-sm">
          {job.description}
        </p>

        <div className="mt-4 text-sm text-gray-500 flex flex-wrap gap-4">
          <span>{job.salary || "Salary not disclosed"}</span>
          <span>
            {job.deadline
              ? `Deadline: ${new Date(job.deadline).toDateString()}`
              : "No deadline"}
          </span>
        </div>
      </div>

      {/* Apply Form */}
      <div className="border p-6">
        <p className="font-medium mb-4">Apply for this position</p>

        <form onSubmit={submitApplication} className="flex flex-col gap-3">
          <input
            required
            placeholder="Your name"
            className="border px-3 py-2 text-sm"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            required
            type="email"
            placeholder="Email address"
            className="border px-3 py-2 text-sm"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <input
            placeholder="Phone (optional)"
            className="border px-3 py-2 text-sm"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />

          <textarea
            rows={4}
            placeholder="Cover note (optional)"
            className="border px-3 py-2 text-sm resize-none"
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
          />

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={e => setResume(e.target.files?.[0] || null)}
            className="text-sm"
          />

          <div className="flex justify-end mt-4">
            <button
              disabled={loading}
              className="bg-black text-white px-6 py-2 text-sm disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobDetails;
