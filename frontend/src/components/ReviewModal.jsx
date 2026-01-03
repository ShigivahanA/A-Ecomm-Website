import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { useToast } from "../components/ToastProvider";


export default function ReviewModal({ item, onClose, onSuccess }) {
  const { addReview } = useContext(ShopContext);
  const { addToast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

const submitReview = async () => {
  try {
    setLoading(true);

    const res = await addReview({
      productId: item.productId,
      orderId: item.orderId,
      rating,
      comment
    });

    if (res.success) {
        addToast({
    type: "success",
    message: "Review submitted successfully"
  });
      onSuccess();
      onClose();
    } else {
      addToast({
        type: "error",
        message: res.message
      });
    }

  } catch (err) {
    addToast({
  type: "error",
  message: err.response?.data?.message || "Review failed"
});
  } finally {
    setLoading(false);
  }
};


  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          Rate this product
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Rating */}
      <div className="mb-4 flex items-center gap-2">
        {[1,2,3,4,5].map(i => (
          <button
            key={i}
            onClick={() => setRating(i)}
            className={`text-2xl transition ${
              i <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-500">
          {rating} / 5
        </span>
      </div>

      {/* Comment */}
      <textarea
        placeholder="Share your thoughts (optional)"
        value={comment}
        onChange={e => setComment(e.target.value)}
        rows={4}
        className="w-full resize-none rounded-md border border-gray-300 p-3 text-sm focus:border-black focus:outline-none"
      />

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-md px-4 py-2 text-sm text-gray-600 hover:text-black"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          onClick={submitReview}
          className="rounded-xl bg-black px-5 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  </div>
);

}
