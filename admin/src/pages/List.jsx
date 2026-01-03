import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { useToast } from "../components/ToastProvider";
import EditProduct from "./EditProduct";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const LOW_STOCK_THRESHOLD = 5;

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const { addToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchList = async () => {
    const res = await axios.get(backendUrl + "/api/product/list");
    if (res.data.success) setList(res.data.products.reverse());
  };

  const confirmRemove = async () => {
    if (!deleteTarget) return;

    const res = await axios.post(
      backendUrl + "/api/product/remove",
      { id: deleteTarget._id },
      { headers: { token } }
    );

    if (res.data.success) {
      addToast({ type: "success", message: "Product removed" });
      setDeleteTarget(null);
      fetchList();
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  /* ---------- EDIT MODE ---------- */
  if (editingProduct) {
    return (
      <EditProduct
        product={editingProduct}
        token={token}
        onCancel={() => setEditingProduct(null)}
        onUpdated={() => {
          setEditingProduct(null);
          fetchList();
        }}
      />
    );
  }

  /* ---------- Stock pill renderer ---------- */
  const renderStockPills = (item) => {
    if (!item.stock || typeof item.stock !== "object") return null;

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(item.stock).map(([size, qty]) => {
          if (qty === 0) {
            return (
              <span
                key={size}
                className="text-xs px-2 py-[2px] rounded-full bg-red-100 text-red-700 border border-red-300"
                title="Out of stock"
              >
                {size}
              </span>
            );
          }

          if (qty > 0 && qty <= LOW_STOCK_THRESHOLD) {
            return (
              <span
                key={size}
                className="text-xs px-2 py-[2px] rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300"
                title="Low stock"
              >
                {size}
              </span>
            );
          }

          return null;
        })}
      </div>
    );
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Products List
        </h1>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        {/* Header */}
        <div className="grid grid-cols-[80px_3fr_1fr_1fr_180px] gap-4 px-4 py-3 bg-[#e5e5e5] border rounded-t-lg text-sm font-medium text-gray-600">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        <div className="border border-t-0 rounded-b-lg divide-y bg-white">
          {list.length === 0 && (
            <div className="px-4 py-6 text-center text-gray-500 text-sm">
              No products found.
            </div>
          )}

          {list.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-[80px_3fr_1fr_1fr_180px] gap-4 px-4 py-3 items-center hover:bg-gray-50 transition"
            >
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-14 h-16 object-cover rounded-xl border"
              />

              <div>
                <p className="font-medium text-gray-800">{item.name}</p>

                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {item.bestseller && (
                    <span className="text-xs px-2 py-[2px] rounded-full bg-[#e5e5e5] text-black">
                      Bestseller
                    </span>
                  )}

                  {/* 🔥 Stock pills */}
                  {renderStockPills(item)}
                </div>
              </div>

              <p className="text-sm text-gray-600">{item.category}</p>

              <p className="font-medium">
                {currency}
                {item.price}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingProduct(item)}
                  className="flex-1 py-2 text-sm font-medium rounded-lg bg-black text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="flex-1 py-2 text-sm font-medium rounded-lg bg-red-600 text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">
        {list.map((item) => (
          <div
            key={item._id}
            className="bg-[#e5e5e5] border rounded-xl p-4"
          >
            <div className="flex gap-4">
              <img
                src={item.image[0]}
                alt={item.name}
                className="w-20 h-24 object-cover rounded-md border"
              />

              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {currency}{item.price}
                </p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {item.bestseller && (
                    <span className="text-xs px-2 py-[2px] rounded-full bg-white">
                      Bestseller
                    </span>
                  )}

                  {renderStockPills(item)}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setEditingProduct(item)}
                className="flex-1 py-2 text-sm bg-black text-white rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteTarget(item)}
                className="flex-1 py-2 text-sm bg-red-600 text-white rounded-lg"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          title="Remove product?"
          message={`Are you sure you want to remove "${deleteTarget.name}"? This action cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmRemove}
        />
      )}
    </>
  );
};

export default List;
