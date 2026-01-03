import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { useToast } from "../components/ToastProvider";

const Add = ({ token }) => {
  const { addToast } = useToast();

  // Images
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  // Core fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Women");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // ✨ New fashion fields
  const [fabric, setFabric] = useState("");
  const [fabricDetails, setFabricDetails] = useState("");
  const [fit, setFit] = useState("");
  const [silhouette, setSilhouette] = useState("");
  const [care, setCare] = useState([]);
  const [occasion, setOccasion] = useState([]);
  const [styleNotes, setStyleNotes] = useState("");
  const [modelHeight, setModelHeight] = useState("");
  const [modelSizeWorn, setModelSizeWorn] = useState("");
  const [madeIn, setMadeIn] = useState("");
  const [stock, setStock] = useState({});

  const labelCls = "text-sm font-medium mb-1 text-gray-700";
  const inputCls = "border px-3 py-2 rounded-xl w-full";

  const toggleMulti = (value, setFn) => {
    setFn((prev) =>
      prev.includes(value)
        ? prev.filter((i) => i !== value)
        : [...prev, value]
    );
  };

  const resetForm = () => {
  // Images
  setImage1(false);
  setImage2(false);
  setImage3(false);
  setImage4(false);

  // Core
  setName("");
  setDescription("");
  setPrice("");
  setCategory("Women");
  setSubCategory("Topwear");
  setBestseller(false);
  setSizes([]);

  // Fashion details
  setFabric("");
  setFabricDetails("");
  setFit("");
  setSilhouette("");
  setCare([]);
  setOccasion([]);
  setStyleNotes("");
  setModelHeight("");
  setModelSizeWorn("");
  setMadeIn("");
};


  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Core
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      // ✨ New fields
      formData.append("fabric", fabric);
      formData.append("fabricDetails", fabricDetails);
      formData.append("fit", fit);
      formData.append("silhouette", silhouette);
      formData.append("care", JSON.stringify(care));
      formData.append("occasion", JSON.stringify(occasion));
      formData.append("styleNotes", styleNotes);
      formData.append("modelHeight", modelHeight);
      formData.append("modelSizeWorn", modelSizeWorn);
      formData.append("madeIn", madeIn);
      formData.append("stock", JSON.stringify(stock));


      // Images
      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(
        backendUrl + "/api/product/add",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        addToast({ type: "success", message: "Product added successfully" });
        resetForm();
      } else {
        addToast({ type: "error", message: response.data.message });
      }
    } catch (err) {
      console.error(err);
      addToast({ type: "error", message: err.message });
    }
  };

  return (
<form
  onSubmit={onSubmitHandler}
  className="flex flex-col gap-6 max-w-5xl p-6"
>
  {/* ================= Images ================= */}
  <section>
    <h3 className="text-lg font-semibold mb-3">Product Images</h3>
    <div className="flex gap-3">
      {[image1, image2, image3, image4].map((img, i) => (
        <label key={i} className="cursor-pointer">
          <img
            className="w-24 h-24 object-cover border rounded-xl"
            src={!img ? assets.upload_area : URL.createObjectURL(img)}
            alt="Upload"
          />
          <input
            hidden
            type="file"
            onChange={(e) =>
              [setImage1, setImage2, setImage3, setImage4][i](
                e.target.files[0]
              )
            }
          />
        </label>
      ))}
    </div>
  </section>

  {/* ================= Basic Info ================= */}
  <section>
    <h3 className="text-lg font-semibold mb-3">Basic Information</h3>

    <div className="flex flex-col gap-4">
      <div>
        <label className={labelCls}>Product Name</label>
        <input
          className={inputCls}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea
          className={inputCls}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
    </div>
  </section>

  {/* ================= Pricing & Category ================= */}
  <section>
    <h3 className="text-lg font-semibold mb-3">Pricing & Category</h3>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className={labelCls}>Price</label>
        <input
          type="number"
          className={inputCls}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Category</label>
        <select
          className={inputCls}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Women</option>
          <option>Kids</option>
        </select>
      </div>

      <div>
        <label className={labelCls}>Sub Category</label>
        <select
          className={inputCls}
          onChange={(e) => setSubCategory(e.target.value)}
        >
          <option>Topwear</option>
          <option>Bottomwear</option>
          <option>Winterwear</option>
        </select>
      </div>
    </div>
  </section>

  {/* ================= Sizes ================= */}
  <section>
    <h3 className="text-lg font-semibold mb-2">Available Sizes</h3>
    <div className="flex gap-2 flex-wrap">
      {["S", "M", "L", "XL", "XXL"].map((s) => (
        <button
          type="button"
          key={s}
          onClick={() => toggleMulti(s, setSizes)}
          className={`px-4 py-1 border rounded-xl ${
            sizes.includes(s)
              ? "bg-black text-white"
              : "bg-gray-100"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  </section>

  <h3 className="text-lg font-semibold mt-4 mb-2">Stock Per Size</h3>

<div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
  {sizes.map((s) => (
    <div key={s}>
      <label className="text-xs text-gray-600">{s}</label>
      <input
        type="number"
        min="0"
        className="border px-2 py-1 rounded-xl w-full"
        value={stock[s] ?? ""}
        onChange={(e) =>
          setStock((prev) => ({
            ...prev,
            [s]: Number(e.target.value),
          }))
        }
      />
    </div>
  ))}
</div>


  {/* ================= Fashion Details ================= */}
  <section>
    <h3 className="text-lg font-semibold mb-3">Fashion Details</h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>Fabric</label>
        <input
          className={inputCls}
          value={fabric}
          onChange={(e) => setFabric(e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Fit</label>
        <select
          className={inputCls}
          value={fit}
          onChange={(e) => setFit(e.target.value)}
        >
          <option value="">Select fit</option>
          <option>Regular</option>
          <option>Slim</option>
          <option>Relaxed</option>
        </select>
      </div>

      <div>
        <label className={labelCls}>Silhouette</label>
        <input
          className={inputCls}
          value={silhouette}
          onChange={(e) => setSilhouette(e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Made In</label>
        <input
          className={inputCls}
          value={madeIn}
          onChange={(e) => setMadeIn(e.target.value)}
        />
      </div>
    </div>

    <div className="mt-4">
      <label className={labelCls}>Fabric Details</label>
      <textarea
        className={inputCls}
        rows={3}
        value={fabricDetails}
        onChange={(e) => setFabricDetails(e.target.value)}
      />
    </div>

    <div className="mt-4">
      <label className={labelCls}>Style Notes</label>
      <textarea
        className={inputCls}
        rows={3}
        value={styleNotes}
        onChange={(e) => setStyleNotes(e.target.value)}
      />
    </div>
  </section>

  {/* ================= Care & Occasion ================= */}
  <section>
    <h3 className="text-lg font-semibold mb-2">Care Instructions</h3>
    <div className="flex gap-2 flex-wrap">
      {["Machine wash", "Hand wash", "Dry clean"].map((c) => (
        <button
          type="button"
          key={c}
          onClick={() => toggleMulti(c, setCare)}
          className={`px-3 py-1 border rounded-xl ${
            care.includes(c) ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          {c}
        </button>
      ))}
    </div>

    <h3 className="text-lg font-semibold mt-4 mb-2">Occasion</h3>
    <div className="flex gap-2 flex-wrap">
      {["Casual", "Festive", "Work", "Party"].map((o) => (
        <button
          type="button"
          key={o}
          onClick={() => toggleMulti(o, setOccasion)}
          className={`px-3 py-1 border rounded-xl ${
            occasion.includes(o)
              ? "bg-black text-white"
              : "bg-gray-100"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  </section>

  {/* ================= Model Info ================= */}
  <section>
    <h3 className="text-lg font-semibold mb-3">Model Information</h3>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelCls}>Model Height</label>
        <input
          className={inputCls}
          value={modelHeight}
          onChange={(e) => setModelHeight(e.target.value)}
        />
      </div>

      <div>
        <label className={labelCls}>Size Worn</label>
        <input
          className={inputCls}
          value={modelSizeWorn}
          onChange={(e) => setModelSizeWorn(e.target.value)}
        />
      </div>
    </div>
  </section>

  {/* ================= Bestseller ================= */}
  <label className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={bestseller}
      onChange={() => setBestseller((p) => !p)}
    />
    Mark as Bestseller
  </label>

  {/* ================= Submit ================= */}
  <button className="bg-black text-white py-3 w-40 rounded-xl hover:opacity-90">
    ADD PRODUCT
  </button>
</form>
  );
};

export default Add;
