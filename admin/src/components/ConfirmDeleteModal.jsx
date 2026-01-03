// src/components/ConfirmDeleteModal.jsx
import React from "react";

const ConfirmDeleteModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl w-[90%] max-w-sm p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {title || "Confirm action"}
        </h3>

        <p className="text-sm text-gray-600 mb-6">
          {message || "Are you sure you want to continue?"}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
