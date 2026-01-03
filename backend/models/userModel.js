import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  id: { type: String, required: true }, 
  label: { type: String, default: "Address" }, 
  line1: { type: String, default: "" },
  line2: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  zip: { type: String, default: "" },
  country: { type: String, default: "" },
  phone: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
}, { _id: false }); // prevent nested _id for each address

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    wishlist: { type: [String], default: [] },
    phone: { type: String, default: "" },
    addresses: { type: [AddressSchema], default: [] },
    passwordResetOtpHash: { type: String, default: null },
    passwordResetOtpExpires: { type: Date, default: null },
    passwordResetOtpAttempts: { type: Number, default: 0 },
    passwordResetOtpLastAttempt: { type: Date, default: null },
}, { minimize: false, timestamps: true })

const userModel = mongoose.models.user || mongoose.model('user',userSchema);

export default userModel;
