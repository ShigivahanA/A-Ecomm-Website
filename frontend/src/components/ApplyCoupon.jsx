import { useContext, useState } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { useToast } from "../components/ToastProvider";

const ApplyCoupon = ({ cartAmount, paymentMethod }) => {
  const [code, setCode] = useState("");
  const { backendUrl, token, appliedCoupon, setAppliedCoupon } =
    useContext(ShopContext);
  const { addToast } = useToast();

  const apply = async () => {
    if (!code) return;

    const res = await axios.post(
      `${backendUrl}/api/coupon/apply`,
      { code, cartAmount, paymentMethod },
      { headers: { token } }
    );

    if (res.data.success) {
      setAppliedCoupon(res.data.coupon);
      addToast({ type: "success", message: "Coupon applied" });
    } else {
      addToast({ type: "error", message: res.data.message });
    }
  };

  const remove = () => {
    setAppliedCoupon(null);
    setCode("");
    addToast({ type: "info", message: "Coupon removed" });
  };

  return (
    <div className="border rounded-xl p-4 mt-4 mb-4">
      <p className="font-medium mb-2">Have a coupon?</p>

      {appliedCoupon ? (
        <div className="flex justify-between items-center text-sm">
          <span className="text-green-600">
            Applied: {appliedCoupon.code}
          </span>
          <button
            type="button"
            onClick={remove}
            className="text-red-600 text-xs underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon"
            className="flex-1 border px-3 py-2 rounded-xl"
          />
          <button
            onClick={apply}
            type="button"
            className="px-4 py-2 bg-black text-white rounded-xl"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplyCoupon;
