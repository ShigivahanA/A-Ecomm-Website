import { useNavigate } from "react-router-dom";

export default function AddToCartModal({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">

        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Added to cart
        </h3>

        <p className="text-sm text-gray-600 mb-6">
          Would you like to add more items or go to your cart?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Add More
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          >
            Go to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
