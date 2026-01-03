import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const {
    currency,
    getCartAmount,
    getShippingFee,
    appliedCoupon
  } = useContext(ShopContext);

  const originalSubtotal = getCartAmount();

  const discount = appliedCoupon?.discount || 0;
  const discountedSubtotal = Math.max(originalSubtotal - discount, 0);

  // IMPORTANT RULE: shipping based on ORIGINAL subtotal
  const shipping =
    originalSubtotal >= 1000 ? 0 : getShippingFee();

  const total = discountedSubtotal + shipping;

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-4 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>{currency} {originalSubtotal}.00</p>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <p>Coupon ({appliedCoupon.code})</p>
            <p>- {currency} {discount}.00</p>
          </div>
        )}

        <hr />

        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {shipping === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              `${currency} ${shipping}.00`
            )}
          </p>
        </div>

        <hr />

        <div className="flex justify-between text-base font-semibold">
          <p>Total</p>
          <p>{currency} {total}.00</p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
