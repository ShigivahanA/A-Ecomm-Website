import userModel from "../models/userModel.js";

// add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    if (!itemId) return res.json({ success: false, message: "Missing itemId" });

    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    if (!user.wishlist) user.wishlist = [];

    // avoid duplicates
    if (!user.wishlist.includes(itemId)) {
      user.wishlist.push(itemId);
      await user.save();
    }

    res.json({ success: true, message: "Added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    console.error("addToWishlist:", err);
    res.json({ success: false, message: err.message });
  }
};

// remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    if (!itemId) return res.json({ success: false, message: "Missing itemId" });

    await userModel.findByIdAndUpdate(userId, { $pull: { wishlist: itemId } });
    const user = await userModel.findById(userId);
    res.json({ success: true, message: "Removed from wishlist", wishlist: user?.wishlist || [] });
  } catch (err) {
    console.error("removeFromWishlist:", err);
    res.json({ success: false, message: err.message });
  }
};

// get user's wishlist (returns array of itemIds)
const getWishlist = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId).select("wishlist");
    res.json({ success: true, items: user?.wishlist || [] });
  } catch (err) {
    console.error("getWishlist:", err);
    res.json({ success: false, message: err.message });
  }
};

export { addToWishlist, removeFromWishlist, getWishlist };
