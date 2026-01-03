import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import ReviewModal from "../components/ReviewModal";
import OrderTimeline from "../components/OrderTimeline";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);
  const [reviewItem, setReviewItem] = useState(null);

  /* ================= LOAD ORDERS ================= */
  const loadOrders = async () => {
    if (!token) return;

    const res = await axios.post(
      `${backendUrl}/api/order/userorders`,
      {},
      { headers: { token } }
    );

    if (res.data.success) {
      setOrders(res.data.orders.reverse());
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  /* ================= CANCEL ================= */
  const requestCancel = async (orderId) => {
    const reason = prompt("Why do you want to cancel this order?");
    if (!reason) return;

    const res = await axios.post(
      `${backendUrl}/api/order/cancel-request`,
      { orderId, reason },
      { headers: { token } }
    );

    alert(res.data.message);
    loadOrders();
  };

  /* ================= RETURN / EXCHANGE ================= */
  const requestReturnExchange = async (orderId, type) => {
    const reason = prompt(`Reason for ${type.toLowerCase()}?`);
    if (!reason) return;

    let exchangeSize = null;
    if (type === "Exchange") {
      exchangeSize = prompt("Enter new size");
      if (!exchangeSize) return;
    }

    const res = await axios.post(
      `${backendUrl}/api/order/return-request`,
      { orderId, type, reason, exchangeSize },
      { headers: { token } }
    );

    alert(res.data.message);
    loadOrders();
  };

  /* ================= INVOICE ================= */
  const downloadInvoice = async (orderId) => {
    const res = await axios.get(
      `${backendUrl}/api/order/invoice/${orderId}`,
      { headers: { token }, responseType: "blob" }
    );

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${orderId}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
  };

  /* ================= STATUS BADGE ================= */
  const renderStatusBadge = (order) => {
    if (order.status === "Cancelled") {
      return (
        <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
          Order Cancelled
        </span>
      );
    }

    if (order.returnRequest?.requested) {
      return (
        <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
          {order.returnRequest.type} Requested
        </span>
      );
    }

    if (order.cancelRequest?.requested) {
      return (
        <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
          Cancellation Requested
        </span>
      );
    }

    if (order.status === "Delivered") {
      return (
        <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
          Delivered
        </span>
      );
    }

    return (
      <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
        {order.status}
      </span>
    );
  };

  /* ================= RENDER ================= */
  return (
    <div className="border-t pt-16 max-w-5xl mx-auto px-4">
      <div className="text-2xl mb-6">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {orders.map((order) => {
        const canCancel =
          !order.cancelRequest?.requested &&
          !order.returnRequest?.requested &&
          order.status !== "Cancelled" &&
          ["Order Placed", "Processing"].includes(order.status);

        const canReturnOrExchange =
          order.status === "Delivered" &&
          !order.returnRequest?.requested;

        return (
          <div
            key={order._id}
            className="bg-white border rounded-xl p-5 mb-6"
          >
            {/* HEADER */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="text-sm font-medium">
                  Order ID: {order._id}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(order.date).toDateString()} · {order.paymentMethod}
                </p>
              </div>

              {renderStatusBadge(order)}
            </div>

            {/* ITEMS */}
            <div className="mt-4 space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 text-sm">
                  <img
                    src={item.image[0]}
                    alt={item.name}
                    className="w-16 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600 text-xs">
                      {currency}
                      {item.price} · Qty {item.quantity} · Size {item.size}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* TIMELINE */}
            <div className="mt-6">
              <OrderTimeline status={order.status} />
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => downloadInvoice(order._id)}
                className="px-4 py-2 text-sm rounded-xl bg-black text-white"
              >
                Download Invoice
              </button>

              {canCancel && (
                <button
                  onClick={() => requestCancel(order._id)}
                  className="px-4 py-2 text-sm rounded-xl border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  Cancel Order
                </button>
              )}

              {canReturnOrExchange && (
                <>
                  <button
                    onClick={() =>
                      requestReturnExchange(order._id, "Return")
                    }
                    className="px-4 py-2 text-sm rounded-xl border"
                  >
                    Return
                  </button>

                  <button
                    onClick={() =>
                      requestReturnExchange(order._id, "Exchange")
                    }
                    className="px-4 py-2 text-sm rounded-xl border"
                  >
                    Exchange Size
                  </button>
                </>
              )}

              {order.refund?.required && (
                <span className="px-4 py-2 text-sm rounded-xl bg-blue-100 text-blue-700">
                  Refund: {order.refund.status}
                </span>
              )}

              {order.status === "Delivered" && (
                <button
                  onClick={() =>
                    setReviewItem({
                      ...order.items[0],
                      orderId: order._id,
                      productId: order.items[0].productId
                    })
                  }
                  className="px-4 py-2 text-sm rounded-xl border"
                >
                  Write Review
                </button>
              )}
            </div>
          </div>
        );
      })}

      {reviewItem && (
        <ReviewModal
          item={reviewItem}
          onClose={() => setReviewItem(null)}
          onSuccess={loadOrders}
        />
      )}
    </div>
  );
};

export default Orders;
