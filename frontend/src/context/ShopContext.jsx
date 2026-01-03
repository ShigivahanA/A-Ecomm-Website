import { createContext, useEffect, useState } from "react";
import useNavigateWithLoader from '../hooks/useNavigateWithLoader';
import axios from 'axios'
import { useToast } from "../components/ToastProvider";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const { addToast } = useToast();

    const currency = '₹';
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [wishlistItems, setWishlistItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(null);
    const navigate = useNavigateWithLoader();
    const [user, setUser] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [homeBanner, setHomeBanner] = useState(null);
    const [appliedCoupon, setAppliedCoupon] = useState(null);


    const addToCart = async (itemId, size) => {

        if (!size) {
            addToast({ type: "error", message: "Select Product Size" });
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else {
                cartData[itemId][size] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } })

            } catch (error) {
                console.log(error)
                addToast({ type: "error", message: error?.message || "Failed to add to cart" });
            }
        }

    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {

        let cartData = structuredClone(cartItems);

        cartData[itemId][size] = quantity;

        setCartItems(cartData)

        if (token) {
            try {

                await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } })

            } catch (error) {
                console.log(error)
                addToast({ type: "error", message: error?.message || "Failed to update cart" });
            }
        }

    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalAmount;
    }

    const getShippingFee = () => {
        const total = getCartAmount();

        if (total >= 1000) return 0;
        if (total === 0) return 0;
        if (total <= 300) return 100;
        if (total <= 700) return 120;
        return 135; // 701–999
    };

    const getProductsData = async () => {
        try {

            const response = await axios.get(backendUrl + '/api/product/list')
            if (response.data.success) {
                setProducts(response.data.products.reverse())
            } else {
                addToast({ type: "error", message: response.data.message || "Failed to load products" });
            }

        } catch (error) {
            console.log(error)
            addToast({ type: "error", message: error?.message || "Failed to load products" });
        }
    }

    const fetchHomeBanner = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/banner/public`);
            if (res.data?.success) {
            setHomeBanner(res.data.banner);
            return { success: true, banner: res.data.banner };
            }
            return { success: false };
        } catch (err) {
            console.error("fetchHomeBanner:", err);
            return { success: false, message: err.message };
        }
        };


    const getUserCart = async ( token ) => {
        try {
            
            const response = await axios.post(backendUrl + '/api/cart/get',{},{headers:{token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
        } catch (error) {
            console.log(error)
            addToast({ type: "error", message: error?.message || "Failed to load cart" });
        }
    }

    const sendContact = async (payload) => {
      try {
        const res = await axios.post(`${backendUrl}/api/contact/send`, payload);
        return res.data; 
      } catch (err) {
        console.error("sendContact error:", err);
        return { success: false, message: err?.response?.data?.message || err.message || 'Network error' };
      }
    }

    const sendNewsletter = async (payload) => {
        try {
            const res = await axios.post(`${backendUrl}/api/newsletter/subscribe`, payload);
            return res.data; // { success: true/false, message }
        } catch (err) {
            console.error('sendNewsletter error', err);
            return { success: false, message: err?.response?.data?.message || err.message || 'Network error' };
        }
    };

    const fetchUserProfile = async (tokenToUse = token) => {
    if (!tokenToUse) return { success: false, message: "No token" };
    try {
        const res = await axios.get(backendUrl + "/api/user/profile", {
        headers: { token: tokenToUse },
        });
        if (res.data.success && res.data.user) {
            setUser(res.data.user);
            setAddresses(res.data.user.addresses || []);
        } else {
            setUser(null);
        }
        return res.data;
    } catch (err) {
        console.error("fetchUserProfile:", err);
        return { success: false, message: err?.response?.data?.message || err.message };
    }
    };

    const updateUserProfile = async (payload) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
        const res = await axios.put(backendUrl + "/api/user/update", payload, {
        headers: { token },
        });
        if (res.data.success) {
        await fetchUserProfile(); 
        }
        return res.data;
    } catch (err) {
        console.error("updateUserProfile:", err);
        return { success: false, message: err?.response?.data?.message || err.message };
    }
    };

    const addUserAddress = async (address) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
        const res = await axios.post(backendUrl + "/api/user/address/add", address, {
        headers: { token },
        });
        if (res.data.success) {
        setAddresses((prev) => [res.data.address, ...prev]);
        }
        return res.data;
    } catch (err) {
        console.error("addUserAddress:", err);
        return { success: false, message: err?.response?.data?.message || err.message };
    }
    };

    const updateUserAddress = async (address) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
        const res = await axios.put(backendUrl + "/api/user/address/update", address, {
        headers: { token },
        });
        if (res.data.success) {
        setAddresses((prev) => prev.map((a) => (a.id === address.id ? address : a)));
        }
        return res.data;
    } catch (err) {
        console.error("updateUserAddress:", err);
        return { success: false, message: err?.response?.data?.message || err.message };
    }
    };

    const deleteUserAddress = async (addressId) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
        const res = await axios.post(
        backendUrl + "/api/user/address/delete",
        { addressId },
        { headers: { token } }
        );
        if (res.data.success) {
        setAddresses((prev) => prev.filter((a) => a.id !== addressId));
        }
        return res.data;
    } catch (err) {
        console.error("deleteUserAddress:", err);
        return { success: false, message: err?.response?.data?.message || err.message };
    }
    };

    const deleteUserAccount = async () => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
        const res = await axios.delete(backendUrl + "/api/user/delete", {
        headers: { token },
        });
        if (res.data.success) {
        setToken(null);
        localStorage.removeItem("token");
        setUser(null);
        setAddresses([]);
        setWishlistItems({});
        navigate("/");
        }
        return res.data;
    } catch (err) {
        console.error("deleteUserAccount:", err);
        return { success: false, message: err?.response?.data?.message || err.message };
    }
    };

      // centralized logout helper — call this from UI to perform a safe logout
    const logout = (opts = { replaceHistory: true }) => {
        try {
        // clear token & storage
        setToken(null);
        localStorage.removeItem("token");

        // clear in-memory sensitive data
        setCartItems({});
        setWishlistItems({});
        setUser(null);
        setAddresses([]);
        setOrders([]);

        // navigate to login (replace so Back won't return to protected pages)
        if (opts.replaceHistory) {
            navigate("/login", { replace: true });
            try { window.history.replaceState({}, document.title, "/login"); } catch (e) {}
        } else {
            navigate("/login");
        }
        } catch (err) {
        console.error("logout error:", err);
        }
    };

    const fetchUserOrders = async (tokenToUse = token) => {
    if (!tokenToUse) return { success: false, message: "Not authenticated" };
    try {
        const res = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token: tokenToUse } }
        );
        if (res.data.success) {
        setOrders(res.data.orders || []);
        }
        return res.data;
    } catch (err) {
        console.error("fetchUserOrders:", err);
        return { success: false, message: err?.response?.data?.message || err.message };
    }
    };

    const unsubscribeNewsletter = async ({ email }) => {
        if (!email || typeof email !== 'string') {
            return { success: false, message: 'Invalid email' };
        }
        try {
            const res = await axios.post(`${backendUrl}/api/newsletter/unsubscribe`, { email });
            return res.data; // { success: true/false, message }
        } catch (err) {
            console.error('unsubscribeNewsletter error', err);
            return { success: false, message: err?.response?.data?.message || err.message || 'Network error' };
        }
    };

    // ---------- Password reset helpers (replace existing implementations) ----------
    const changePasswordRequest = async ({ email }) => {
        if (!email) return { success: false, message: "Email required" };
        try {
            const res = await axios.post(`${backendUrl}/api/user/send-password-otp`, { email });
            return res.data;
        } catch (err) {
            console.error("changePasswordRequest:", err);
            const message = err?.response?.data?.message || err.message || "Network error";
            return { success: false, message };
        }
    };

    const changePasswordConfirm = async ({ email, otp, newPassword }) => {
        if (!email || !otp || !newPassword) return { success: false, message: "Missing fields" };
        try {
            const res = await axios.post(`${backendUrl}/api/user/change-password`, { email, otp, newPassword });
            return res.data;
        } catch (err) {
            console.error("changePasswordConfirm:", err);
            const message = err?.response?.data?.message || err.message || "Network error";
            
            return { success: false, message };
        }
    };

    // export user data (downloads a file returned by the backend)
    const exportUserData = async () => {
        if (!token) return { success: false, message: "Not authenticated" };
        try {
            const res = await axios.get(`${backendUrl}/api/user/export`, {
            headers: { token },
            responseType: "blob",
            });

            const disposition = res.headers["content-disposition"] || "";
            const match = disposition.match(/filename="?(.+?)"?($|;)/);
            const filename = match?.[1] || `user-data-${new Date().toISOString().slice(0,10)}.pdf`;

            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            addToast({ type: "success", message: "Export downloaded", duration: 4000 });
            return { success: true };
        } catch (err) {
            console.error("exportUserData:", err);
            const message = err?.response?.data?.message || err.message || "Export failed";
            addToast({ type: "error", message, duration: 5000 });
            return { success: false, message };
        }
    };

    // ----------------- Wishlist helpers -----------------
    const getWishlistCount = () => {
        return Object.keys(wishlistItems || {}).length;
    };

    // toggle wishlist (optimistic local update + best-effort server sync)
    const toggleWishlist = async (itemId) => {
        if (!itemId) return { success: false, message: "Invalid item" };

        // capture whether item was present and apply optimistic update
        let wasPresent = false;
        setWishlistItems((prev = {}) => {
            const next = { ...prev };
            if (next[itemId]) {
            wasPresent = true;
            delete next[itemId];
            } else {
            wasPresent = false;
            next[itemId] = true;
            }
            return next;
        });

        // try to sync with backend if token exists (best-effort; don't block UX)
        if (token) {
            try {
            if (wasPresent) {
                await axios.post(`${backendUrl}/api/wishlist/remove`, { itemId }, { headers: { token } });
            } else {
                await axios.post(`${backendUrl}/api/wishlist/add`, { itemId }, { headers: { token } });
            }
            } catch (err) {
            // sync failed — log it. Optionally you could rollback or schedule a retry.
            console.error("toggleWishlist sync failed:", err);
            }
        }

        return { success: true };
        };

    // ------------------ Compatibility helpers ------------------
// quickAddToCart: used by grid/productItem quick-add buttons when no size selected.
// Behavior: if product requires a size, redirect user to product page to pick size.
// If product has no sizes or you want to allow anonymous quantity, it will add with a fallback size.
const quickAddToCart = async (itemId, opts = {}) => {
  // opts: { quantity = 1, fallbackSize }
  const { quantity = 1, fallbackSize } = opts;

  // Try to find product to see if sizes exist
  const product = products.find((p) => p._id === itemId);
  // If product exists and has sizes (array) and no fallback provided, send user to product page
  const hasSizes = Array.isArray(product?.sizes) && product.sizes.length > 0;
  if (hasSizes && !fallbackSize) {
    // let UI handle this navigation; using navigate from context
    addToast({ type: "info", message: "Please select a size on the product page." });
    navigate(`/product/${itemId}`);
    return { success: false, message: "Size required" };
  }

  // Use fallback size if provided, else use 'ONE_SIZE' or 'default'
  const sizeToUse = fallbackSize || (hasSizes ? product.sizes[0] : "default");

  // reuse existing addToCart function
  await addToCart(itemId, sizeToUse);
  addToast({ type: "success", message: "Added to cart" });
  return { success: true };
};

// ------------------ Require-login wishlist toggle (optional safer behavior) ------------------
// This variant will require login for server persistence and prompt otherwise.
// It keeps optimistic UI only when token exists.
const toggleWishlistSafe = async (itemId) => {
  if (!itemId) return { success: false, message: "Invalid item" };

  // if no token, prompt login
  if (!token) {
    addToast({ type: "error", message: "Please login to save wishlist items" });
    navigate("/login");
    return { success: false, message: "Not authenticated" };
  }

  // proceed with optimistic update and server sync
  let wasPresent = false;
  setWishlistItems((prev = {}) => {
    const next = { ...prev };
    if (next[itemId]) {
      wasPresent = true;
      delete next[itemId];
    } else {
      wasPresent = false;
      next[itemId] = true;
    }
    return next;
  });

  try {
    if (wasPresent) {
      await axios.post(`${backendUrl}/api/wishlist/remove`, { itemId }, { headers: { token } });
    } else {
      await axios.post(`${backendUrl}/api/wishlist/add`, { itemId }, { headers: { token } });
    }
    return { success: true };
  } catch (err) {
    // rollback on failure
    setWishlistItems((prev = {}) => {
      const next = { ...prev };
      if (wasPresent) next[itemId] = true; // restore
      else delete next[itemId];
      return next;
    });
    addToast({ type: "error", message: "Wishlist update failed" });
    console.error("toggleWishlistSafe failed:", err);
    return { success: false, message: err?.message || "Server error" };
  }
};


    const clearWishlist = () => {
    setWishlistItems({});
    };

    // optional: fetch wishlist from server if you implement /api/wishlist/get
    const fetchWishlist = async (tokenToUse = token) => {
    if (!tokenToUse) return;
    try {
        const res = await axios.post(`${backendUrl}/api/wishlist/get`, {}, { headers: { token: tokenToUse } });
        if (res.data?.success && Array.isArray(res.data.items)) {
        const map = {};
        res.data.items.forEach((id) => { map[id] = true; });
        setWishlistItems(map);
        }
    } catch (err) {
        console.error("fetchWishlist failed:", err);
    }
    };

// fetchJobs - call public list
const fetchJobs = async (opts = {}) => {
  try {
    const res = await axios.get(`${backendUrl}/api/job/public`, { params: opts });
    return res.data; // { success, jobs }
  } catch (err) {
    console.error("fetchJobs:", err);
    return { success: false, message: err?.response?.data?.message || err.message };
  }
};

// applyJob - POST multipart to /api/job/apply and include token header expected by authUser
const applyJob = async (jobId, formData) => {
  if (!jobId) return { success: false, message: "Missing jobId" };
  try {
    const url = `${backendUrl}/api/job/apply`;
    const headers = { "Content-Type": "multipart/form-data" };
    if (token) headers.token = token;     // <-- authUser expects req.headers.token
    const res = await axios.post(url, formData, { headers });
    return res.data;
  } catch (err) {
    console.error("applyJob:", err);
    return { success: false, message: err?.response?.data?.message || err.message };
  }
};

const addReview = async ({ productId, orderId, rating, comment }) => {
  const res = await axios.post(
    backendUrl + "/api/review/add",
    { productId, orderId, rating, comment },
    { headers: { token } }
  );
  return res.data;
};

const getProductReviews = async (productId) => {
  const res = await axios.get(
    backendUrl + `/api/review/product/${productId}`
  );
  return res.data;
};


    useEffect(() => {
        getProductsData()
    }, [])

    useEffect(() => {
        const initWithToken = async (t) => {
            if (!t) return;

            await getUserCart(t);        
            await fetchUserProfile(t);   
            await fetchUserOrders(t);   
            await fetchWishlist(t); 
        };

        const saved = localStorage.getItem("token");

        if (!token && saved) {
            setToken(saved);
            initWithToken(saved);
        } 
        else if (token) {
            initWithToken(token);
        }
        }, [token]);
    
    useEffect(() => {
  // 1️⃣ must be logged in
  if (!token) return;

  // 2️⃣ do not override a manually applied coupon
  if (appliedCoupon) return;

  // 3️⃣ cart must have value
  const cartAmount = getCartAmount();
  if (cartAmount <= 0) return;

  // 4️⃣ auto-apply FIRST20
  axios
    .post(
      `${backendUrl}/api/coupon/apply`,
      {
        code: "FIRST20",
        cartAmount,
        paymentMethod: "COD" // safe default
      },
      { headers: { token } }
    )
    .then(res => {
      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
      }
    })
    .catch(() => {
      /* silent fail — never block checkout */
    });

}, [cartItems, token]);




    const value = {
        products, currency,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart,setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token , sendContact , sendNewsletter , user , 
        fetchUserProfile , updateUserProfile ,
        addresses , addUserAddress , updateUserAddress ,
        deleteUserAddress , deleteUserAccount ,
        orders , fetchUserOrders , unsubscribeNewsletter , changePasswordRequest , 
        changePasswordConfirm , exportUserData , wishlistItems , setWishlistItems,
        getWishlistCount , toggleWishlist , clearWishlist , fetchWishlist , logout ,
        quickAddToCart , toggleWishlistSafe , fetchJobs , applyJob , addReview ,
        getProductReviews , getShippingFee , homeBanner, fetchHomeBanner, appliedCoupon,
setAppliedCoupon,


    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;