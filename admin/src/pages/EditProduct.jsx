import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useToast } from "../components/ToastProvider";

const Label = ({ children }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

const EditProduct = ({ product, token, onCancel, onUpdated }) => {
  const { addToast } = useToast();

  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    price: product.price || "",
    category: product.category || "Women",
    subCategory: product.subCategory || "Topwear",
    sizes: product.sizes || [],
    bestseller: product.bestseller || false,

    fabric: product.fabric || "",
    fabricDetails: product.fabricDetails || "",
    fit: product.fit || "",
    silhouette: product.silhouette || "",
    care: product.care || [],
    occasion: product.occasion || [],
    styleNotes: product.styleNotes || "",
    modelHeight: product.modelInfo?.height || "",
    modelSizeWorn: product.modelInfo?.sizeWorn || "",
    madeIn: product.madeIn || "",
    stock: product.stock || {},
  });

  const toggleMulti = (value, field) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const submit = async () => {
    try {
      const fd = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value) || typeof value === "object") {
          fd.append(key, JSON.stringify(value));
        } else {
          fd.append(key, value);
        }
      });


      fd.append("productId", product._id);

      const res = await axios.post(
        backendUrl + "/api/product/update",
        fd,
        { headers: { token } }
      );

      if (res.data.success) {
        addToast({ type: "success", message: "Product updated successfully" });
        onUpdated();
      } else {
        addToast({ type: "error", message: res.data.message });
      }
    } catch (err) {
      console.error(err);
      addToast({ type: "error", message: err.message });
    }
  };

  return (
    <div className="max-w-5xl p-6">
      <h2 className="text-xl font-semibold mb-6">Edit Product</h2>

      {/* BASIC */}
      <Label>Product Name</Label>
      <input
        className="border p-2 w-full mb-4 rounded-xl"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Label>Description</Label>
      <textarea
        className="border p-2 w-full mb-4 rounded-xl"
        rows={4}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <Label>Price</Label>
      <input
        type="number"
        className="border p-2 w-full mb-4 rounded-xl"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      {/* CATEGORY */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Category</Label>
          <select
            className="border p-2 w-full rounded-xl"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option>Women</option>
            <option>Kids</option>
          </select>
        </div>

        <div>
          <Label>Sub Category</Label>
          <select
            className="border p-2 w-full rounded-xl"
            value={form.subCategory}
            onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
          >
            <option>Topwear</option>
            <option>Bottomwear</option>
            <option>Winterwear</option>
          </select>
        </div>
      </div>

      {/* SIZES */}
      <Label>Available Sizes</Label>
      <div className="flex gap-2 mb-4">
        {["S", "M", "L", "XL", "XXL"].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => toggleMulti(s, "sizes")}
            className={`px-3 py-1 rounded-xl ${
              form.sizes.includes(s) ? "bg-black text-white" : ""
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <Label>Stock Per Size</Label>
<div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
  {form.sizes.map((s) => (
    <div key={s}>
      <label className="text-xs text-gray-500">{s}</label>
      <input
        type="number"
        min="0"
        className="border px-2 py-1 rounded-xl w-full"
        value={form.stock?.[s] ?? ""}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            stock: {
              ...prev.stock,
              [s]: Number(e.target.value),
            },
          }))
        }
      />
    </div>
  ))}
</div>


      {/* FASHION */}
      <Label>Fabric</Label>
      <input
        className="border p-2 w-full mb-4 rounded-xl"
        value={form.fabric}
        onChange={(e) => setForm({ ...form, fabric: e.target.value })}
      />

      <Label>Fabric Details</Label>
      <textarea
        className="border p-2 w-full mb-4 rounded-xl"
        value={form.fabricDetails}
        onChange={(e) => setForm({ ...form, fabricDetails: e.target.value })}
      />

      <Label>Fit</Label>
      <input
        className="border p-2 w-full mb-4 rounded-xl"
        value={form.fit}
        onChange={(e) => setForm({ ...form, fit: e.target.value })}
      />

      <Label>Silhouette</Label>
      <input
        className="border p-2 w-full mb-4 rounded-xl"
        value={form.silhouette}
        onChange={(e) => setForm({ ...form, silhouette: e.target.value })}
      />

      {/* CARE */}
      <Label>Care Instructions</Label>
      <div className="flex gap-2 mb-4">
        {["Machine wash", "Hand wash", "Dry clean"].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => toggleMulti(c, "care")}
            className={`px-3 py-1 rounded-xl ${
              form.care.includes(c) ? "bg-black text-white" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* OCCASION */}
      <Label>Occasion</Label>
      <div className="flex gap-2 mb-4">
        {["Casual", "Work", "Party", "Festive"].map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => toggleMulti(o, "occasion")}
            className={`px-3 py-1 rounded-xl ${
              form.occasion.includes(o) ? "bg-black text-white" : ""
            }`}
          >
            {o}
          </button>
        ))}
      </div>

      <Label>Style Notes</Label>
      <textarea
        className="border p-2 w-full mb-4 rounded-xl"
        value={form.styleNotes}
        onChange={(e) => setForm({ ...form, styleNotes: e.target.value })}
      />

      {/* MODEL */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label>Model Height</Label>
          <input
            className="border p-2 w-full rounded-xl"
            value={form.modelHeight}
            onChange={(e) => setForm({ ...form, modelHeight: e.target.value })}
          />
        </div>
        <div>
          <Label>Model Size Worn</Label>
          <input
            className="border p-2 w-full rounded-xl"
            value={form.modelSizeWorn}
            onChange={(e) => setForm({ ...form, modelSizeWorn: e.target.value })}
          />
        </div>
      </div>

      <Label>Made In</Label>
      <input
        className="border p-2 w-full mb-4 rounded-xl"
        value={form.madeIn}
        onChange={(e) => setForm({ ...form, madeIn: e.target.value })}
      />

      {/* BESTSELLER */}
      <label className="flex items-center gap-2 mb-6">
        <input
          type="checkbox"
          checked={form.bestseller}
          className="rounded-xl"
          onChange={() =>
            setForm({ ...form, bestseller: !form.bestseller })
          }
        />
        Bestseller
      </label>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button onClick={submit} className="bg-black text-white px-6 py-2 rounded-xl">
          Update
        </button>
        <button onClick={onCancel} className="underline px-6 py-2">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
