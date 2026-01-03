import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useToast } from "../components/ToastProvider";

export default function AddJob({ token }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    location: "",
    salary: "",
    deadline: "",
    tags: ""
  });
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.description) {
      addToast({ message: "Title, company and description are required", type: "error" });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        tags: form.tags // keep as string if backend expects it
      };

      const res = await axios.post(
        backendUrl + "/api/job/add",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        addToast({ message: "Job added successfully", type: "success" });
        setForm({
          title: "",
          company: "",
          description: "",
          location: "",
          salary: "",
          deadline: "",
          tags: ""
        });
      } else {
        addToast({ message: res.data.message || "Failed to add job", type: "error" });
      }
    } catch (error) {
      console.error(error);
      addToast({ message: error.response?.data?.message || "Something went wrong", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-1">Add New Job</h2>
        <p className="text-sm text-gray-500 mb-6">
          Fill in the details below to publish a new job opening.
        </p>

        <form onSubmit={submit} className="space-y-5">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Job Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Frontend Developer"
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Company
            </label>
            <input
              name="company"
              value={form.company}
              onChange={onChange}
              placeholder="Company name"
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Describe responsibilities, requirements, etc."
              rows={6}
              className="w-full border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Grid row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={onChange}
                placeholder="Remote / City"
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Salary
              </label>
              <input
                name="salary"
                value={form.salary}
                onChange={onChange}
                placeholder="e.g. ₹6–10 LPA"
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={onChange}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tags
            </label>
            <input
              name="tags"
              value={form.tags}
              onChange={onChange}
              placeholder="React, Node, Remote"
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              Comma separated keywords for search & filtering
            </p>
          </div>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 text-sm font-medium rounded-xl text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900"
              }`}
            >
              {loading ? "Creating..." : "Create Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
