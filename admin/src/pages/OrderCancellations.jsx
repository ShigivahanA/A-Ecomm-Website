import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useToast } from "../components/ToastProvider";

const OrderCancellations = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const { addToast } = useToast();

  const fetchOrders = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        const relevant = res.data.orders.filter(
          o => o.cancelRequest?.requested || o.status === "Cancelled"
        );
        setOrders(relevant);
      }
    } catch (err) {
      console.error(err);
      addToast({ type: "error", message: "Failed to load orders" });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= ACTIONS ================= */

  const handleAction = async (orderId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this cancellation?`))
      return;

    const res = await axios.post(
      `${backendUrl}/api/order/cancel-action`,
      { orderId, action },
      { headers: { token } }
    );

    if (res.data.success) {
      addToast({ type: "success", message: res.data.message });
      fetchOrders();
    } else {
      addToast({ type: "error", message: res.data.message });
    }
  };

  const handleRefund = async (orderId) => {
    if (!window.confirm("Process refund for this order?")) return;

    const res = await axios.post(
      `${backendUrl}/api/order/process-refund`,
      { orderId },
      { headers: { token } }
    );

    if (res.data.success) {
      addToast({ type: "success", message: "Refund processed successfully" });
      fetchOrders();
    } else {
      addToast({ type: "error", message: res.data.message });
    }
  };

  /* ================= FILTERS ================= */

  const pendingOrders = orders.filter(o => o.cancelRequest?.requested);
  const cancelledOrders = orders.filter(o => o.status === "Cancelled");

  /* ================= RENDER ================= */

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-8">
        Order Cancellations & Refunds
      </h1>

      {/* ================= PENDING REQUESTS ================= */}
      <section>
        <h2 className="font-medium mb-4">
          Pending Cancellation Requests
        </h2>

        {pendingOrders.length === 0 && (
          <p className="text-sm text-gray-500 mb-6">
            No pending cancellation requests
          </p>
        )}

        {pendingOrders.map(order => (
          <OrderCard
            key={order._id}
            order={order}
            onApprove={() => handleAction(order._id, "approve")}
            onReject={() => handleAction(order._id, "reject")}
            onRefund={() => handleRefund(order._id)}
            showActions
          />
        ))}
      </section>

      {/* ================= CANCELLED ORDERS ================= */}
      <section className="mt-12">
        <h2 className="font-medium mb-4">
          Cancelled Orders
        </h2>

        {cancelledOrders.length === 0 && (
          <p className="text-sm text-gray-500">
            No cancelled orders yet
          </p>
        )}

        {cancelledOrders.map(order => (
          <OrderCard
            key={order._id}
            order={order}
            onRefund={() => handleRefund(order._id)}
            readOnly
          />
        ))}
      </section>
    </div>
  );
};

/* ================= ORDER CARD ================= */

const OrderCard = ({
  order,
  onApprove,
  onReject,
  onRefund,
  showActions,
  readOnly
}) => {
  const refundStatus = order.refund?.status || "Not Required";

  return (
    <div className="border rounded-xl p-5 mb-4 bg-white">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="font-medium">
            Order ID: {order._id}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            Reason: {order.cancelRequest?.reason || "—"}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Payment: {order.paymentMethod} · Paid:{" "}
            {order.payment ? "Yes" : "No"}
          </p>

          <p className="text-xs text-gray-500">
            Status: {order.status}
          </p>
        </div>

        {/* STATUS PILL */}
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            refundStatus === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : refundStatus === "Processed"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Refund: {refundStatus}
        </span>
      </div>

      {/* ACTIONS */}
      {!readOnly && showActions && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={onApprove}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm"
          >
            Approve Cancel
          </button>

          <button
            onClick={onReject}
            className="px-4 py-2 rounded-lg border text-sm"
          >
            Reject
          </button>

          {order.refund?.required &&
            order.refund?.status === "Pending" && (
              <button
                onClick={onRefund}
                className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm"
              >
                Process Refund
              </button>
            )}
        </div>
      )}

      {/* READ ONLY REFUND */}
      {readOnly &&
        order.refund?.required &&
        order.refund?.status === "Pending" && (
          <div className="mt-4">
            <button
              onClick={onRefund}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm"
            >
              Process Refund
            </button>
          </div>
        )}
    </div>
  );
};

export default OrderCancellations;
