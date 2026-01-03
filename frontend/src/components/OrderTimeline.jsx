// src/components/OrderTimeline.jsx
import React from "react";

const STEPS = [
  "Order Placed",
  "Packing",
  "Shipped",
  "Out for delivery",
  "Delivered",
];

const OrderTimeline = ({ status }) => {
  const currentStepIndex = STEPS.indexOf(status);

  return (
    <div className="w-full">
      {/* MOBILE — VERTICAL */}
      <div className="md:hidden flex flex-col gap-4">
        {STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step} className="flex items-start gap-3">
              {/* Left rail */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isCompleted ? "bg-black" : "bg-gray-300"
                  }`}
                />
                {index !== STEPS.length - 1 && (
                  <div
                    className={`w-[2px] h-6 mt-1 ${
                      isCompleted ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>

              {/* Label */}
              <p
                className={`text-sm ${
                  isCurrent
                    ? "font-semibold text-black"
                    : isCompleted
                    ? "text-gray-700"
                    : "text-gray-400"
                }`}
              >
                {step}
              </p>
            </div>
          );
        })}
      </div>

      {/* DESKTOP / TABLET — HORIZONTAL */}
      <div className="hidden md:flex items-start">
        {STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;

          return (
            <React.Fragment key={step}>
              {/* STEP */}
              <div className="flex flex-col items-center min-w-[90px]">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isCompleted ? "bg-black" : "bg-gray-300"
                  }`}
                />
                <p
                  className={`mt-2 text-[11px] text-center ${
                    isCompleted
                      ? "text-black font-medium"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </p>
              </div>

              {/* LINE */}
              {index !== STEPS.length - 1 && (
                <div className="flex-1 mt-[5px] h-[2px] bg-gray-300">
                  <div
                    className={`h-full ${
                      isCompleted ? "bg-black" : "bg-gray-300"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
