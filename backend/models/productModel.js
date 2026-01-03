import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    stock: {
      type: Map,
      of: Number,
      default: {}
    },
    bestseller: { type: Boolean },
    date: { type: Number, required: true },
    ratingAverage: { type: Number, default: 0},
    ratingCount: { type: Number, default: 0},
    fabric: { type: String },
fabricDetails: { type: String },

fit: { type: String },
silhouette: { type: String },

care: { type: [String] },

occasion: { type: [String] },
styleNotes: { type: String },

modelInfo: {
  height: String,
  sizeWorn: String
},

madeIn: { type: String },

})

const productModel  = mongoose.models.product || mongoose.model("product",productSchema);

export default productModel


