import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useToast } from "../components/ToastProvider";


/* ---------- Status Pill ---------- */
const StatusPill = ({ value }) => {
  const styles = {
    Open: "bg-green-100 text-green-700",
    Closed: "bg-red-100 text-red-700",
    Applied: "bg-gray-100 text-gray-700",
    "Under review": "bg-yellow-100 text-yellow-700",
    Accepted: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
        styles[value] || "bg-gray-100 text-gray-700"
      }`}
    >
      {value}
    </span>
  );
};

/* ---------- MAIN ---------- */
const ListJobs = ({ token }) => {
  const [jobs, setJobs] = useState([]);
  const { addToast } = useToast();
  const [activeJob, setActiveJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  /* Fetch jobs */
  const fetchJobs = async () => {
    if (!token) return;
    try {
      const res = await axios.post(
        backendUrl + "/api/job/list",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) setJobs(res.data.jobs);
      else addToast({ message: res.data.message, type: "error" }); 
    } catch (err) {
      addToast({ message: err.response?.data?.message || err.message, type: "error" });
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [token]);

  /* Change job status */
  const changeJobStatus = async (jobId, status) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/job/status",
        { jobId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        addToast({ message: "Job status updated", type: "success" });
        fetchJobs();
      }
    } catch (err) {
      addToast({ message: err.response?.data?.message || err.message, type: "error" });
    }
  };

  /* View applications (switch mode) */
  const openApplications = async (job) => {
    try {
      setLoadingApps(true);
      setActiveJob(job);

      const res = await axios.post(
        backendUrl + "/api/job/applications",
        { jobId: job._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setApplications(res.data.applications);
      } else {
        addToast({ message: res.data.message, type: "error" });
      }
    } catch (err) {
      addToast({ message: err.response?.data?.message || err.message, type: "error" });
    } finally {
      setLoadingApps(false);
    }
  };

  /* Update application status */
  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/job/application/status",
        {
          jobId: activeJob._id,
          applicationId,
          status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        addToast({ message: "Application updated", type: "success" });
        openApplications(activeJob); // refresh list
      }
    } catch (err) {
      addToast({ message: err.response?.data?.message || err.message, type: "error" });
    }
  };

  /* ---------------- RENDER ---------------- */

  /* ===== APPLICATION VIEW ===== */
  if (activeJob) {
    return (
      <div className="max-w-5xl mx-auto pt-8 px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => {
              setActiveJob(null);
              setApplications([]);
            }}
            className="text-sm text-gray-600 hover:text-black mb-3"
          >
            ← Back to Jobs
          </button>

          <h2 className="text-xl font-semibold">{activeJob.title}</h2>
          <p className="text-sm text-gray-500">
            {activeJob.company} • {activeJob.location}
          </p>
        </div>

        {/* Applications */}
        <div className="border rounded-lg bg-white">
          {loadingApps ? (
            <p className="p-6 text-sm text-gray-500">
              Loading applications…
            </p>
          ) : applications.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">
              No applications yet.
            </p>
          ) : (
            applications.map((app) => (
              <div
                key={app._id}
                className="p-5 border-b last:border-b-0"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-gray-500">
                      {app.email} • {app.phone}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(app.date).toLocaleString()}
                    </p>

                    {app.message && (
                      <p className="mt-3 text-sm text-gray-700">
                        {app.message}
                      </p>
                    )}

                    {app.resumeUrl && (
                      <a
                        href={`${backendUrl}/${app.resumeUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 text-sm underline text-blue-600"
                      >
                        View Resume
                      </a>
                    )}
                  </div>

                  <div className="text-right min-w-[140px]">
                    <StatusPill value={app.status} />
                    <select
                      value={app.status}
                      onChange={(e) =>
                        updateApplicationStatus(
                          app._id,
                          e.target.value
                        )
                      }
                      className="mt-2 w-full border rounded px-2 py-1 text-sm"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under review">Under review</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  /* ===== JOB LIST VIEW ===== */
  return (
    <div className="max-w-5xl mx-auto pt-8 px-4">
      <h2 className="text-xl font-semibold mb-6">Job Listings</h2>

      {jobs.length === 0 && (
        <div className="border rounded p-6 text-sm text-gray-500 bg-gray-50">
          No jobs posted yet.
        </div>
      )}

      {jobs.map((job) => (
        <div
          key={job._id}
          className="border rounded-lg p-6 mb-4 bg-[#e5e5e5] hover:shadow-sm transition"
        >
          <div className="flex justify-between gap-6">
            <div className="flex-1">
              <h3 className="font-medium text-lg">{job.title}</h3>
              <p className="text-sm text-gray-500">
                {job.company} • {job.location}
              </p>

              <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                {job.description}
              </p>

              <div className="mt-4 flex gap-4 text-xs text-gray-500">
                <span>
                  Applications: {job.applications.length}
                </span>
              </div>
            </div>

            <div className="text-right min-w-[160px]">
              <select
                value={job.status}
                onChange={(e) =>
                  changeJobStatus(job._id, e.target.value)
                }
                className="w-full border rounded-xl px-2 py-1 text-sm"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>

              <button
                onClick={() => openApplications(job)}
                className="mt-3 w-full border px-4 py-2 text-sm bg-black text-white rounded-xl"
              >
                View Applications
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListJobs;
