import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);

  /* ---------------- State ---------------- */
  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [bestsellerOnly, setBestsellerOnly] = useState(false);

  const [sortType, setSortType] = useState("relevant");

  /* ---------------- Toggle helpers ---------------- */
  const toggleValue = (value, setter) => {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  /* ---------------- Apply Filters ---------------- */
  const applyFilters = () => {
    let result = [...products];

    // Search
    if (showSearch && search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category
    if (category.length > 0) {
      result = result.filter((p) => category.includes(p.category));
    }

    // Sub-category
    if (subCategory.length > 0) {
      result = result.filter((p) =>
        subCategory.includes(p.subCategory)
      );
    }

    // Sizes
    if (sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes?.some((s) => sizes.includes(s))
      );
    }

    // Price
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Bestseller
    if (bestsellerOnly) {
      result = result.filter((p) => p.bestseller);
    }

    setFilteredProducts(result);
  };

  /* ---------------- Sort ---------------- */
  const sortProducts = () => {
    let sorted = [...filteredProducts];

    if (sortType === "low-high") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-low") {
      sorted.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(sorted);
  };

  /* ---------------- Effects ---------------- */
  // Initial load + filters
  useEffect(() => {
    applyFilters();
  }, [
    products,
    search,
    showSearch,
    category,
    subCategory,
    sizes,
    priceRange,
    bestsellerOnly,
  ]);

  // Sorting only
  useEffect(() => {
    sortProducts();
  }, [sortType]);

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 pt-10 border-t">
      {/* ================= FILTERS ================= */}
      <aside className="min-w-[250px]">
        <p
          onClick={() => setShowFilter((p) => !p)}
          className="text-xl flex items-center gap-2 cursor-pointer sm:cursor-default"
        >
          FILTERS
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden transition-transform ${
              showFilter ? "rotate-90" : ""
            }`}
            alt=""
          />
        </p>

        {/* CATEGORY */}
        <div className={`border bg-[#e5e5e5] rounded-xl p-4 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
          <p className="mb-3 text-sm font-medium">COLLECTION</p>
          {["Women", "Kids"].map((c) => (
            <label key={c} className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={category.includes(c)}
                onChange={() => toggleValue(c, setCategory)}
              />
              {c}
            </label>
          ))}
        </div>

        {/* TYPE */}
        <div className={`border bg-[#e5e5e5] rounded-xl p-4 mt-5 ${showFilter ? "" : "hidden"} sm:block`}>
          <p className="mb-3 text-sm font-medium">TYPE</p>
          {["Topwear", "Bottomwear", "Winterwear"].map((t) => (
            <label key={t} className="flex gap-2 text-sm">
              <input
                type="checkbox"
                checked={subCategory.includes(t)}
                onChange={() => toggleValue(t, setSubCategory)}
              />
              {t}
            </label>
          ))}
        </div>

        {/* SIZE */}
        <div className={`border bg-[#e5e5e5] rounded-xl p-4 mt-5 ${showFilter ? "" : "hidden"} sm:block`}>
          <p className="mb-3 text-sm font-medium">SIZE</p>
          <div className="flex flex-wrap gap-2">
            {["S", "M", "L", "XL", "XXL"].map((s) => (
              <button
                key={s}
                onClick={() => toggleValue(s, setSizes)}
                className={`px-3 py-1 border rounded-xl text-sm ${
                  sizes.includes(s)
                    ? "bg-black text-white"
                    : "bg-gray-100"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* PRICE */}
        <div className={`border bg-[#e5e5e5] rounded-xl p-4 mt-5 ${showFilter ? "" : "hidden"} sm:block`}>
          <p className="mb-3 text-sm font-medium">PRICE</p>
          <div className="flex gap-2 text-sm">
            <input
              type="number"
              placeholder="Min"
              className="rounded-xl px-2 py-1 w-20 appearance-none
             [&::-webkit-inner-spin-button]:appearance-none
             [&::-webkit-outer-spin-button]:appearance-none
             [-moz-appearance:textfield]"
              onChange={(e) =>
                setPriceRange([Number(e.target.value || 0), priceRange[1]])
              }
            /> - 
            <input
              type="number"
              placeholder="Max"
              className="rounded-xl px-2 py-1 w-20 appearance-none
             [&::-webkit-inner-spin-button]:appearance-none
             [&::-webkit-outer-spin-button]:appearance-none
             [-moz-appearance:textfield]"
              onChange={(e) =>
                setPriceRange([
                  priceRange[0],
                  Number(e.target.value || Infinity),
                ])
              }
            />
          </div>
        </div>

        {/* BESTSELLER */}
        <div className={`border bg-[#e5e5e5] rounded-xl p-4 mt-5 ${showFilter ? "" : "hidden"} sm:block`}>
          <label className="flex gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={bestsellerOnly}
              onChange={() => setBestsellerOnly((p) => !p)}
            />
            Bestseller only
          </label>
        </div>
      </aside>

      {/* ================= PRODUCTS ================= */}
      <section className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border rounded-xl px-2 py-1 text-sm"
          >
            <option value="relevant">Sort: Relevant</option>
            <option value="low-high">Price: Low → High</option>
            <option value="high-low">Price: High → Low</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-sm text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filteredProducts.map((item) => (
              <ProductItem
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Collection;
