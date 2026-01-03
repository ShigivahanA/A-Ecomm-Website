import React, { useState } from "react";

const SizeSelectModal = ({ sizes = [], onClose, onConfirm }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl animate-[fadeIn_0.25s_ease-out]">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Choose your size
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Select one size to continue
          </p>
        </div>

        {/* Sizes */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-3 gap-3">
            {sizes.map((size) => {
              const active = selected === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelected(size)}
                  className={`py-2 text-sm rounded-lg border transition-all
                    ${
                      active
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-700 hover:border-black"
                    }
                  `}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm rounded-lg border border-gray-300 text-gray-700 hover:border-black transition"
          >
            Cancel
          </button>

          <button
            disabled={!selected}
            onClick={() => onConfirm(selected)}
            className="flex-1 py-2.5 text-sm rounded-lg bg-black text-white disabled:opacity-40 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* subtle animation */}
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(12px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SizeSelectModal;
