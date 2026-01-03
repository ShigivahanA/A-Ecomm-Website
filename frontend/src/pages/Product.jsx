import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import AddToCartModal from "../components/AddToCartModal";
import { useToast } from "../components/ToastProvider";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, getProductReviews } =
    useContext(ShopContext);
  const LOW_STOCK_THRESHOLD = 5;

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);

  const stockForSize =
    size && productData?.stock
      ? productData.stock[size] ?? 0
      : null;

  const isOutOfStock = stockForSize === 0;
  const isLowStock =
    stockForSize !== null &&
    stockForSize > 0 &&
    stockForSize <= LOW_STOCK_THRESHOLD;


  const { addToast } = useToast();

  /* ---------------- Fetch product ---------------- */
  useEffect(() => {
    const found = products.find((p) => p._id === productId);
    if (found) {
      setProductData(found);
      setImage(found.image[0]);
    }
  }, [productId, products]);

  /* ---------------- Fetch reviews ---------------- */
  useEffect(() => {
    if (!productId) return;
    getProductReviews(productId).then((res) => {
      if (res.success) setReviews(res.reviews);
    });
  }, [productId]);

  if (!productData) return <div className="opacity-0" />;

  return (
    <div className="border-t-2 pt-10">

      {/* ================= PRODUCT MAIN ================= */}
      <div className="flex flex-col sm:flex-row gap-12">

        {/* ---------- Images ---------- */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">
          <div className="flex sm:flex-col gap-3 sm:w-[18%] overflow-x-auto sm:overflow-y-auto">
            {productData.image.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setImage(img)}
                className="w-[24%] sm:w-full cursor-pointer border"
                alt=""
              />
            ))}
          </div>

          <div className="sm:w-[80%]">
            <img src={image} alt="" className="w-full h-auto" />
          </div>
        </div>

        {/* ---------- Info ---------- */}
        <div className="flex-1">
          <h1 className="text-2xl font-medium">{productData.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className={`${
                  i <= Math.round(productData.ratingAverage)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
            <span className="text-sm text-gray-600 ml-2">
              ({productData.ratingCount})
            </span>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {currency}
            {productData.price}
          </p>

          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          {/* Sizes */}
<div className="my-8">
            <p className="mb-2 font-medium">Select Size</p>

            <div className="flex gap-2">
              {productData.sizes.map((s) => {
                const stock = productData.stock?.[s] ?? 0;
                const disabled = stock === 0;

                return (
                  <button
                    key={s}
                    disabled={disabled}
                    onClick={() => !disabled && setSize(s)}
                    className={`border px-4 py-2 transition
                      ${
                        disabled
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : size === s
                          ? "border-orange-500"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* ---- Fixed-height stock indicator (prevents layout jump) ---- */}
            <div className="mt-2 h-5 text-sm">
              {size && (
                <>
                  {isOutOfStock && (
                    <p className="text-red-600 font-medium">
                      Out of stock
                    </p>
                  )}

                  {isLowStock && (
                    <p className="text-orange-600 font-medium">
                      Hurry! Only {stockForSize} left
                    </p>
                  )}

                  {!isOutOfStock && !isLowStock && stockForSize !== null && (
                    <p className="text-green-600">
                      In stock
                    </p>
                  )}
                </>
              )}
            </div>
          </div>


          {/* Add to cart */}
          <button
            disabled={!size || isOutOfStock}
            onClick={() => {
              if (!size) {
                addToast({ type: "warn", message: "Please select a size" });
                return;
              }
              addToCart(productData._id, size);
              setShowCartModal(true);
            }}
            className={`px-8 py-3 text-sm text-white transition
              ${
                !size || isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-gray-900"
              }`}
          >
            {isOutOfStock ? "OUT OF STOCK" : "ADD TO CART"}
          </button>

          <hr className="mt-8 sm:w-4/5" />

          {/* ================= SIDE DETAILS (KEEP HERE) ================= */}
          <div className="mt-6 text-sm text-gray-700 space-y-2">
            {productData.fabric && (
              <p>
                <span className="font-medium">Fabric:</span>{" "}
                {productData.fabric}
              </p>
            )}
            {productData.fit && (
              <p>
                <span className="font-medium">Fit:</span> {productData.fit}
              </p>
            )}
            {productData.silhouette && (
              <p>
                <span className="font-medium">Silhouette:</span>{" "}
                {productData.silhouette}
              </p>
            )}
            {productData.madeIn && (
              <p>
                <span className="font-medium">Made in:</span>{" "}
                {productData.madeIn}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= FULL-WIDTH DETAILS ================= */}
      <div className="mt-16 max-w-4xl mx-auto text-sm text-gray-700 space-y-10">

        {/* Care Instructions */}
        {productData.care?.length > 0 && (
          <div>
            <p className="font-medium mb-3">Care Instructions</p>
            <div className="flex flex-wrap gap-2">
              {productData.care.map((c, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border rounded-full text-xs"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Occasion */}
        {productData.occasion?.length > 0 && (
          <div>
            <p className="font-medium mb-3">Occasion</p>
            <div className="flex flex-wrap gap-2">
              {productData.occasion.map((o, i) => (
                <span
                  key={i}
                  className="px-3 py-1 border rounded-full text-xs"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Style Notes */}
        {productData.styleNotes && (
          <div>
            <p className="font-medium mb-2">Style Notes</p>
            <p className="text-gray-600 leading-relaxed max-w-3xl">
              {productData.styleNotes}
            </p>
          </div>
        )}

        {/* Model Info */}
        {(productData.modelInfo?.height ||
          productData.modelInfo?.sizeWorn) && (
          <div>
            <p className="font-medium mb-2">Model Info</p>
            <div className="text-gray-600 space-y-1">
              {productData.modelInfo.height && (
                <p>Height: {productData.modelInfo.height}</p>
              )}
              {productData.modelInfo.sizeWorn && (
                <p>Wearing size: {productData.modelInfo.sizeWorn}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================= DESCRIPTION & REVIEWS ================= */}
      <div className="mt-20">
        <div className="flex">
          <p className="border px-5 py-3 text-sm">
            Reviews ({productData.ratingCount})
          </p>
        </div>

        <div className="border px-6 py-6 text-sm space-y-4">
          {reviews.length === 0 && (
            <p className="text-gray-500">No reviews yet.</p>
          )}

          {reviews.map((r, i) => (
            <div key={i} className="border-b pb-4">
              <p className="font-medium">{r.user.name}</p>
              <div className="flex gap-1 my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src={
                      star <= r.rating
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    className="w-3"
                    alt=""
                  />
                ))}
              </div>
              {r.comment && (
                <p className="text-gray-600">{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= RELATED ================= */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />

      {showCartModal && (
        <AddToCartModal onClose={() => setShowCartModal(false)} />
      )}
    </div>
  );
};

export default Product;
