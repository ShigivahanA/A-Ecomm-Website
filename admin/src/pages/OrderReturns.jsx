import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useToast } from "../components/ToastProvider";

const OrderReturns = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const { addToast } = useToast();

  /* ================= LOAD RETURNS ================= */
  const loadReturns = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        // show active return lifecycle
        const filtered = res.data.orders.filter(
          o =>
            o.returnRequest &&
            (o.returnRequest.requested ||
              ["Approved", "Rejected"].includes(o.returnRequest.status))
        );
        setOrders(filtered.reverse());
      }
    } catch (err) {
      addToast({
        type: "error",
        message: "Failed to load return/exchange requests"
      });
    }
  };

  useEffect(() => {
    loadReturns();
  }, []);

  /* ================= ACTIONS ================= */
  const act = async (orderId, action) => {
    if (!window.confirm(`Confirm ${action}?`)) return;

    const res = await axios.post(
      `${backendUrl}/api/order/return-action`,
      { orderId, action },
      { headers: { token } }
    );

    addToast({
      type: res.data.success ? "success" : "error",
      message: res.data.message
    });

    loadReturns();
  };

  const refund = async (orderId) => {
    if (!window.confirm("Process refund for this order?")) return;

    const res = await axios.post(
      `${backendUrl}/api/order/process-refund`,
      { orderId },
      { headers: { token } }
    );

    addToast({
      type: res.data.success ? "success" : "error",
      message: res.data.message
    });

    loadReturns();
  };

  /* ================= HELPERS ================= */
  const renderStatusBadge = (status = "Pending") => {
    const map = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-700",
      Rejected: "bg-red-100 text-red-700"
    };

    return (
      <span
        className={`px-3 py-1 text-xs rounded-full ${
          map[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  /* ================= RENDER ================= */
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6">
        Return & Exchange Requests
      </h1>

      {orders.length === 0 && (
        <p className="text-sm text-gray-500">
          No active return or exchange requests
        </p>
      )}

      <div className="space-y-4">
        {orders.map(order => {
          const rr = order.returnRequest;
          const status = rr.status || "Pending";
          const isFinal = ["Approved", "Rejected"].includes(status);

          return (
            <div
              key={order._id}
              className="border rounded-xl p-4 sm:p-5 bg-white"
            >
              {/* ================= HEADER ================= */}
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-medium text-sm break-all">
                    Order ID: {order._id}
                  </p>

                  <p className="text-sm text-gray-600">
                    Type:{" "}
                    <span className="font-medium">
                      {rr.type}
                    </span>
                  </p>

                  <p className="text-sm text-gray-600">
                    Reason: {rr.reason}
                  </p>

                  {rr.type === "Exchange" && (
                    <p className="text-sm text-gray-600">
                      Requested Size:{" "}
                      <span className="font-medium">
                        {rr.exchangeSize}
                      </span>
                    </p>
                  )}
                </div>

                <div className="self-start">
                  {renderStatusBadge(status)}
                </div>
              </div>

              {/* ================= ACTIONS ================= */}
              <div className="mt-4 flex flex-wrap gap-3">
                {!isFinal && (
                  <>
                    <button
                      onClick={() => act(order._id, "approve")}
                      className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => act(order._id, "reject")}
                      className="px-4 py-2 border rounded-lg text-sm"
                    >
                      Reject
                    </button>
                  </>
                )}

                {order.refund?.required &&
                  order.refund.status === "Pending" && (
                    <button
                      onClick={() => refund(order._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
                    >
                      Process Refund
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderReturns;
