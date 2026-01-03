import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link, useNavigate } from "react-router-dom";
import {assets} from "../assets/assets"
import SizeSelectModal from "./SizeSelectModal";


const ProductItem = ({ id, image = [], name, price }) => {
  const { currency, toggleWishlist, wishlistItems, addToCart,products } = useContext(ShopContext);
  const isWishlisted = Boolean(wishlistItems && wishlistItems[id]);

  const [wishBusy, setWishBusy] = useState(false);
  const [cartBusy, setCartBusy] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const product = products.find(p => p._id === id);

  const navigate = useNavigate();

  // --- Handlers ---
  const onToggleWishlist = async (e) => {
    e.preventDefault();
    if (wishBusy) return;
    setWishBusy(true);
    try {
      await toggleWishlist(id);
      setTimeout(() => navigate("/wishlist"), 200);
    } finally {
      setWishBusy(false);
    }
  };

const onAddToCart = async (e) => {
  e.preventDefault();

  if (product?.sizes?.length === 1) {
    await addToCart(id, product.sizes[0]);
    navigate("/cart");
  } else {
    setShowSizeModal(true);
  }
};



  return (
    <>
    <Link
      to={`/product/${id}`}
      onClick={() => window.scrollTo(0, 0)}
      className="group block text-gray-700 relative"
    >
      <div className="relative overflow-hidden rounded-lg bg-white shadow-sm">

        {/* Product Image */}
        <div className="w-full aspect-[4/5] bg-gray-100 flex items-center justify-center">
          <img
            src={image[0]}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* --- TOP RIGHT BUTTON STACK --- */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

          {/* Wishlist Button */}
          <button
            onClick={onToggleWishlist}
            disabled={wishBusy}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:scale-105 transition border"
          >
            <img
              src={
                isWishlisted
                  ? assets.wishlistfilled
                  : assets.wishlist
              }
              alt="Wishlist"
              className="w-5 h-5 object-contain"
              draggable="false"
            />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={onAddToCart}
            disabled={cartBusy}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black shadow hover:scale-105 transition"
          >
            <img
              src={assets.cart_icon}
              alt="Add to cart"
              className="w-5 h-5 object-contain invert"
              draggable="false"
            />
          </button>
        </div>
      </div>

      {/* Text */}
      <div className="mt-3">
        <p className="text-sm font-medium line-clamp-2">{name}</p>
        <p className="text-sm font-semibold mt-1">{currency}{price}</p>
      </div>
    </Link>
    {showSizeModal && product?.sizes?.length > 0 && (
  <SizeSelectModal
    sizes={product.sizes}
    onClose={() => setShowSizeModal(false)}
    onConfirm={async (size) => {
      await addToCart(id, size);
      setShowSizeModal(false);
      navigate("/cart");
    }}
  />
)}

    </>
  );
};

export default ProductItem;
