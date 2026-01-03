import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../App";

const Banner = ({ token }) => {
  const [data, setData] = useState(null);
  const [text, setText] = useState("");

  const fetchData = async () => {
    const res = await axios.get(`${backendUrl}/api/banner/banner`, {
      headers: { token },
    });
    if (res.data.success) {
      setData(res.data.banner);
      setText((res.data.banner.announcementTexts || []).join("\n"));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateText = async () => {
    const texts = text
      .split("\n")
      .map(t => t.trim())
      .filter(Boolean);
    await axios.post(
      `${backendUrl}/api/banner/announcement-texts`,
      { texts },
      { headers: { token } }
    );
    fetchData();
  };

  const toggle = async (type) => {
    await axios.post(
      `${backendUrl}/api/banner/toggle-${type}`,
      {},
      { headers: { token } }
    );
    fetchData();
  };

  if (!data) return null;

  return (
    <div className="w-full max-w-5xl p-4 sm:p-6 space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Home Page Banner
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage announcement text and homepage banner visibility
        </p>
      </div>

      {/* ================= ANNOUNCEMENT ================= */}
      <div className="border rounded-xl bg-[#e5e5e5] p-4 space-y-3">
        <p className="font-medium text-gray-700">Announcement Text</p>

        <textarea
          className="border p-2 w-full mb-3"
          rows={4}
          placeholder={`One message per line\nExample:\n50% off\nFree shipping`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex flex-wrap gap-3">
          <button
            onClick={updateText}
            className="px-4 py-2 rounded-xl bg-black text-white text-sm hover:bg-gray-900"
          >
            Save Text
          </button>

          <button
            onClick={() => toggle("announcement")}
            className="px-4 py-2 rounded-xl border text-sm bg-white text-black"
          >
            {data.announcementActive ? "Hide Announcement" : "Show Announcement"}
          </button>
        </div>
      </div>

      {/* ================= BANNER IMAGE ================= */}
      <div className="border rounded-xl bg-[#e5e5e5] p-4 space-y-4">
        <p className="font-medium text-gray-700">Main Banner Image</p>

        {/* Image Preview */}
        {data.bannerImage ? (
          <div className="w-full overflow-hidden rounded-lg border bg-gray-50">
            <img
              src={data.bannerImage}
              alt="Banner preview"
              className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-xl"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-500">No banner uploaded yet.</p>
        )}

        {/* Upload */}
        <label className="inline-block">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              if (!e.target.files[0]) return;
              const fd = new FormData();
              fd.append("image", e.target.files[0]);
              await axios.post(`${backendUrl}/api/banner/banner-image`, fd, {
                headers: { token },
              });
              fetchData();
            }}
          />
          <span className="inline-flex items-center px-4 py-2  rounded-xl text-sm cursor-pointer bg-black text-white">
            Upload New Image
          </span>
        </label>

        {/* Toggle */}
        <button
          onClick={() => toggle("banner")}
          className="block px-4 py-2 rounded-xl border text-sm bg-white text-black"
        >
          {data.bannerActive ? "Hide Banner" : "Show Banner"}
        </button>
      </div>
    </div>
  );
};

export default Banner;
