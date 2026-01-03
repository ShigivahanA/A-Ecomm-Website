import mongoose from 'mongoose';

const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  lastSubscribedAt: { type: Date, default: Date.now },
  unsubscribed: { type: Boolean, default: false },
  lastUnsubscribedAt: { type: Date, default: null },
  unsubscribeCount: { type: Number, default: 0 },
  resubscribeCount: { type: Number, default: 0 },
  verified: { type: Boolean, default: true },
  firstOrderDiscountUsed: { type: Boolean, default: false },
  note: { type: String, default: '' },
}, { minimize: false });

export default mongoose.model('Subscriber', SubscriberSchema);
