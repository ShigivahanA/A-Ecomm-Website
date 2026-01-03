import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
      },
      name: String,
      price: Number,
      image: Array,
      quantity: Number,
      size: String
    }
  ],

  amount: { type: Number, required: true },
  address: { type: Object, required: true },

  status: {
    type: String,
    default: 'Order Placed'
  }, 
  cancelRequest: {
    requested: { type: Boolean, default: false },
    reason: { type: String },
    requestedAt: { type: Date }
  },

  refund: {
    required: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Not Required", "Pending", "Processed"],
      default: "Not Required"
    },
    processedAt: Date,
    refundId: String
  },
  returnRequest: {
  requested: { type: Boolean, default: false },
  type: {
    type: String,
    enum: ["Return", "Exchange"]
  },
  reason: String,

  // Exchange only
  exchangeSize: String,

  requestedAt: Date,
  approved: {
    type: Boolean,
    default: null // null = pending, true = approved, false = rejected
  },
  processedAt: Date
},
coupon: {
  code: { type: String },
  discount: { type: Number },
  type: { type: String }
},
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false },
  date: { type: Number, required: true }
});

const orderModel =
  mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;
