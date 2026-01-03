import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useToast } from "../components/ToastProvider";

const AdminCoupons = ({ token }) => {
  const { addToast } = useToast();

  /* ================= STATE ================= */
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENT",
    value: "",
    minCartAmount: 0,
    maxDiscount: "",
    usageLimit: "",
    perUserLimit: 1,
    firstOrderOnly: false,
    expiry: ""
  });

  /* ================= LOAD COUPONS ================= */
  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${backendUrl}/api/coupon/list`,
        { headers: { token } }
      );

      if (res.data.success) {
        setCoupons(res.data.coupons);
      } else {
        addToast({ type: "error", message: res.data.message });
      }
    } catch (err) {
      console.error(err);
      addToast({ type: "error", message: "Failed to load coupons" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  /* ================= FORM HANDLERS ================= */
  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  /* ================= CREATE COUPON ================= */
  const createCoupon = async () => {
    if (!form.code || !form.value) {
      addToast({ type: "error", message: "Coupon code and value are required" });
      return;
    }

    try {
      const res = await axios.post(
        `${backendUrl}/api/coupon/create`,
        {
          code: form.code.toUpperCase(),
          type: form.type,
          value: Number(form.value),
          minCartAmount: Number(form.minCartAmount || 0),
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
          usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
          perUserLimit: Number(form.perUserLimit || 1),
          firstOrderOnly: form.firstOrderOnly,
          expiry: form.expiry ? new Date(form.expiry) : undefined
        },
        { headers: { token } }
      );

      if (res.data.success) {
        addToast({ type: "success", message: "Coupon created successfully" });
        loadCoupons();
        setForm({
          code: "",
          type: "PERCENT",
          value: "",
          minCartAmount: 0,
          maxDiscount: "",
          usageLimit: "",
          perUserLimit: 1,
          firstOrderOnly: false,
          expiry: ""
        });
      } else {
        addToast({ type: "error", message: res.data.message });
      }
    } catch (err) {
      console.error(err);
      addToast({ type: "error", message: err.message });
    }
  };

  /* ================= TOGGLE COUPON ================= */
  const toggleCoupon = async (id) => {
    if (!window.confirm("Change coupon status?")) return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/coupon/toggle`,
        { id },
        { headers: { token } }
      );

      addToast({
        type: res.data.success ? "success" : "error",
        message: res.data.message
      });

      loadCoupons();
    } catch (err) {
      console.error(err);
      addToast({ type: "error", message: "Action failed" });
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-6">Coupon Management</h1>

      {/* ================= CREATE FORM ================= */}
      <div className="border rounded-xl p-5 mb-10 bg-white">
        <h2 className="font-semibold mb-4">Create Coupon</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <input
            name="code"
            value={form.code}
            onChange={onChange}
            placeholder="Coupon Code (e.g. FIRST20)"
            className="border px-3 py-2 rounded-xl"
          />

          <select
            name="type"
            value={form.type}
            onChange={onChange}
            className="border px-3 py-2 rounded-xl"
          >
            <option value="PERCENT">Percent</option>
            <option value="FLAT">Flat</option>
          </select>

          <input
            name="value"
            value={form.value}
            onChange={onChange}
            placeholder={form.type === "PERCENT" ? "Discount %" : "Flat ₹"}
            className="border px-3 py-2 rounded-xl"
          />

          <input
            name="minCartAmount"
            value={form.minCartAmount}
            onChange={onChange}
            placeholder="Min cart amount"
            className="border px-3 py-2 rounded-xl"
          />

          <input
            name="maxDiscount"
            value={form.maxDiscount}
            onChange={onChange}
            placeholder="Max discount (optional)"
            className="border px-3 py-2 rounded-xl"
          />

          <input
            name="usageLimit"
            value={form.usageLimit}
            onChange={onChange}
            placeholder="Usage limit (optional)"
            className="border px-3 py-2 rounded-xl"
          />

          <input
            type="date"
            name="expiry"
            value={form.expiry}
            onChange={onChange}
            className="border px-3 py-2 rounded-xl"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="firstOrderOnly"
              checked={form.firstOrderOnly}
              onChange={onChange}
            />
            First order only
          </label>
        </div>

        <button
          onClick={createCoupon}
          className="mt-5 px-5 py-2 bg-black text-white rounded-xl"
        >
          Create Coupon
        </button>
      </div>

      {/* ================= COUPON LIST ================= */}
      {loading && (
        <p className="text-sm text-gray-500">Loading coupons...</p>
      )}

      {!loading && coupons.length === 0 && (
        <p className="text-sm text-gray-500">No coupons created yet</p>
      )}

      <div className="space-y-4">
        {coupons.map(coupon => (
          <div
            key={coupon._id}
            className="border rounded-xl p-4 bg-white flex flex-col sm:flex-row justify-between gap-4"
          >
            <div className="space-y-1">
              <p className="font-medium text-sm">
                {coupon.code}
                {!coupon.active && (
                  <span className="ml-2 text-xs text-red-500">(Disabled)</span>
                )}
              </p>

              <p className="text-xs text-gray-600">
                {coupon.type === "PERCENT"
                  ? `${coupon.value}% OFF`
                  : `₹${coupon.value} OFF`}
                {coupon.minCartAmount > 0 && ` · Min ₹${coupon.minCartAmount}`}
                {coupon.maxDiscount && ` · Max ₹${coupon.maxDiscount}`}
              </p>

              <p className="text-xs text-gray-500">
                Used {coupon.usedCount}
                {coupon.usageLimit && ` / ${coupon.usageLimit}`}
              </p>

              {coupon.firstOrderOnly && (
                <p className="text-xs text-blue-600">First order only</p>
              )}

              {coupon.expiry && (
                <p className="text-xs text-gray-500">
                  Expires {new Date(coupon.expiry).toDateString()}
                </p>
              )}
            </div>

            <div className="flex items-center">
              <button
                onClick={() => toggleCoupon(coupon._id)}
                className={`px-4 py-2 rounded-xl text-sm ${
                  coupon.active
                    ? "bg-red-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {coupon.active ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCoupons;
