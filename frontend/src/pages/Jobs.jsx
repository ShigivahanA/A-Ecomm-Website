// src/pages/Jobs.jsx
import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { useToast } from "../components/ToastProvider";

const JobsPage = () => {
  const { fetchJobs, token } = useContext(ShopContext);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs().then(res => {
      if (res?.success) setJobs(res.jobs || []);
      else addToast({ type: "error", message: res?.message || "Failed to load jobs" });
    });
  }, []);

  return (
    <div className="border-t pt-16 max-w-5xl mx-auto px-4">

      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between mb-10">
        <div className="text-2xl">
          <Title text1={"CAREERS"} text2={"AT MAYILÉ"} />
        </div>

        {token && (
          <button
            onClick={() => navigate("/my-applications")}
            className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-black hover:text-white transition"
          >
            My Applications
          </button>
        )}
      </div>

      {/* ===== WHY MAYILÉ ===== */}
      <section className="mb-14">
        <h3 className="text-lg font-semibold mb-3">Why MAYILÉ?</h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
          MAYILÉ is more than a fashion label — it’s a space where creativity,
          craftsmanship, and individuality come together. We believe in
          building timeless designs while empowering the people behind them.
          If you value originality, ownership, and meaningful work, you’ll
          feel at home here.
        </p>
      </section>

      {/* ===== VALUES ===== */}
      <section className="mb-14">
        <h3 className="text-lg font-semibold mb-5">Our Values</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="border rounded p-5">
            <p className="font-medium mb-2">Craft over trends</p>
            <p className="text-sm text-gray-600">
              We focus on quality, detail, and longevity — not fast fashion.
            </p>
          </div>

          <div className="border rounded p-5">
            <p className="font-medium mb-2">Ownership & accountability</p>
            <p className="text-sm text-gray-600">
              You own your work. We trust people, not micromanagement.
            </p>
          </div>

          <div className="border rounded p-5">
            <p className="font-medium mb-2">Respect & inclusivity</p>
            <p className="text-sm text-gray-600">
              Diverse voices, mutual respect, and safe creative expression.
            </p>
          </div>
        </div>
      </section>

      {/* ===== WORK CULTURE ===== */}
      <section className="mb-20">
        <h3 className="text-lg font-semibold mb-4">Work Culture</h3>
        <ul className="text-sm text-gray-600 space-y-2 max-w-3xl">
          <li>• Collaborative, design-first environment</li>
          <li>• Space to experiment and grow</li>
          <li>• Clear communication and realistic timelines</li>
          <li>• Flexible, modern workflows</li>
        </ul>
      </section>

      {/* ===== OPEN OPPORTUNITIES ===== */}
      <section>
        <h3 className="text-xl font-semibold mb-6">Open Opportunities</h3>

        {jobs.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">
            No open positions at the moment.
          </div>
        ) : (
          jobs.map(job => (
            <div
              key={job._id}
              className="py-6 border-t border-b text-gray-700 flex flex-col md:flex-row md:justify-between gap-6"
            >
              {/* Left */}
              <div className="flex-1">
                <p className="text-base font-medium">{job.title}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {job.company} • {job.location || "Remote"}
                </p>

                <p className="mt-3 text-sm text-gray-600 max-w-3xl">
                  {job.description?.slice(0, 220)}
                  {job.description?.length > 220 && "..."}
                </p>

                <div className="mt-3 text-xs text-gray-400 flex gap-4">
                  <span>
                    {job.deadline
                      ? `Deadline: ${new Date(job.deadline).toDateString()}`
                      : "No deadline"}
                  </span>
                  <span>
                    Applications: {job.applications?.length || 0}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div className="flex md:flex-col justify-between md:items-end gap-4">
                <p className="text-sm text-gray-600">
                  {job.salary || "Salary: Not disclosed"}
                </p>

                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="border px-5 py-2 text-sm font-medium rounded-sm hover:bg-black hover:text-white transition"
                >
                  View Job
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default JobsPage;
