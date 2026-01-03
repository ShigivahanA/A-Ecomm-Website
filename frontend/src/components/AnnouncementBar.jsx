import React, { useEffect, useState } from "react";

const ROTATE_EVERY_MS = 5000;

const AnnouncementBar = ({ texts = [] }) => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // Reset index when texts change
  useEffect(() => {
    setIndex(0);
  }, [texts]);

  // Rotation logic
  useEffect(() => {
    if (!Array.isArray(texts) || texts.length <= 1) return;

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, ROTATE_EVERY_MS);

    return () => clearInterval(id);
  }, [texts]);

  if (!texts.length || !visible) return null;

  return (
    <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#e5e5e5] text-black">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-center relative text-sm">
        <p className="text-center transition-opacity duration-300">
          {texts[index]}
        </p>

        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 text-lg leading-none hover:opacity-70"
          aria-label="Close announcement"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
