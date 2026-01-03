import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";

// keep palette consistent
const COLORS = {
  bg: "#EFECE3",
  accent: "#8FABD4",
  primary: "#4A70A9",
  text: "#000000",
};

const Wishlist = () => {
  const { products, currency, wishlistItems, toggleWishlist, navigate } = useContext(ShopContext);
  const [wishlistData, setWishlistData] = useState([]);

  useEffect(() => {
    const list = Object.keys(wishlistItems || {});
    const temp = list
      .map((id) => products.find((prod) => prod._id === id))
      .filter(Boolean);
    setWishlistData(temp);
  }, [wishlistItems, products]);

  const formatPrice = (p) => (p == null ? "—" : `${currency}${p}`);

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-2xl mb-6">
          <Title text1={"YOUR"} text2={"WISHLIST"} />
        </div>

        {wishlistData.length === 0 ? (
          <div
            className="rounded-lg p-8 text-center mx-auto"
            style={{ color: COLORS.text, maxWidth: 760 }}
          >
            <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.primary }}>
              Your wishlist is empty
            </h3>
            <p className="text-sm text-gray-700 mb-6">
              Save pieces you love and we’ll keep them here for you. Browse the collection and add items to your wishlist for later.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => navigate("/collection")}
                className="px-5 py-3 rounded-xl text-sm font-medium shadow"
                style={{ backgroundColor: COLORS.text, color: "#fff" }}
              >
                Browse collection
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-5 py-3 rounded-xl text-sm font-medium "
                style={{ color: COLORS.primary, backgroundColor: "transparent" }}
              >
                Back to home
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {wishlistData.map((product) => (
              <article
                key={product._id}
                className="w-full rounded-lg border overflow-hidden shadow-sm flex flex-col sm:flex-row items-stretch"
                style={{ borderColor: "#e6e6e6" }}
              >
                {/* Image block - fixed square for stability */}
                {/* Image block - fixed square for stability */}
<div className="w-full sm:w-48 flex-shrink-0 bg-white">
  {/* use relative + pb trick for a responsive square on mobile, fixed height on sm+ */}
  <div className="relative w-full pb-[100%] sm:pb-0 sm:h-48 overflow-hidden bg-white">
    <img
      src={product.image?.[0] || "/images/placeholder-3.jpg"}
      alt={product.name}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ display: "block" }}
    />
  </div>
</div>


                {/* Details */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold" style={{ color: COLORS.text }}>
                      {product.name}
                    </h4>

                    <p className="mt-2 text-xs sm:text-sm text-gray-600">
                      {product.description ? product.description.slice(0, 120) + (product.description.length > 120 ? "…" : "") : "—"}
                    </p>

                    <div className="mt-3 flex items-center gap-4">
                      <div className="text-base font-medium" style={{ color: COLORS.primary }}>
                        {formatPrice(product.price)}
                      </div>
                      {product.mrp && product.mrp > product.price && (
                        <div className="text-xs text-gray-400 line-through">
                          {formatPrice(product.mrp)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile actions: show under details */}
                  <div className="mt-4 flex gap-3 sm:hidden">
                    <button
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="flex-1 px-4 py-2 rounded-md text-sm font-medium"
                      style={{ backgroundColor: COLORS.primary, color: "#fff" }}
                    >
                      View details
                    </button>

                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className="flex-1 px-4 py-2 rounded-md border text-sm font-medium"
                      style={{ borderColor: COLORS.accent, color: COLORS.primary, backgroundColor: "transparent" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Desktop / tablet actions column */}
                <div className="hidden sm:flex sm:flex-col sm:justify-center sm:items-center sm:w-40 sm:gap-3 p-4 border-l" style={{ borderColor: "#f0f0f0" }}>
                  <button
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="w-full px-4 py-2 rounded-md text-sm font-medium"
                    style={{ backgroundColor: COLORS.primary, color: "#fff" }}
                    aria-label={`View details for ${product.name}`}
                  >
                    View details
                  </button>

                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="w-full px-4 py-2 rounded-md border text-sm font-medium"
                    style={{ borderColor: COLORS.accent, color: COLORS.primary, backgroundColor: "transparent" }}
                    aria-label={`Remove ${product.name} from wishlist`}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
