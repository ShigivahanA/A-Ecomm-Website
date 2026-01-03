import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from 'stripe'
import razorpay from 'razorpay'
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import productModel from "../models/productModel.js";
import couponModel from "../models/couponModel.js";



const normalizeItems = (items) =>
  items.map(item => ({
    productId: item._id || item.productId, // ⭐ critical
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: item.quantity,
    size: item.size
  }));


// global variables
const currency = 'inr'
const deliveryCharge = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
})

// Placing orders using COD Method
const placeOrder = async (req,res) => {
    
    try {
        
        const { userId, items, amount, address,coupon } = req.body;

        const orderData = {
            userId: new mongoose.Types.ObjectId(userId),
            items: normalizeItems(items),
            address,
            amount,
            coupon: coupon || null,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()
        if (coupon?.code) {
  await couponModel.findOneAndUpdate(
    { code: coupon.code },
    { $inc: { usedCount: 1 } }
  );
}


        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {
    try {
        
        const { userId, items, amount, address,coupon } = req.body
        const { origin } = req.headers;

        const orderData = {
            userId: new mongoose.Types.ObjectId(userId),
            items: normalizeItems(items),
            address,
            amount,
            coupon: coupon || null,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items = items.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:  `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true,session_url:session.url});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// Verify Stripe 
const verifyStripe = async (req,res) => {

    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            if (order.coupon?.code) {
        await couponModel.findOneAndUpdate(
          { code: order.coupon.code },
          { $inc: { usedCount: 1 } }
        );
      }
            res.json({success: true});
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {
    try {
        
        const { userId, items, amount, address,coupon } = req.body

        const orderData = {
            userId: new mongoose.Types.ObjectId(userId),
            items: normalizeItems(items),
            address,
            amount,
            coupon: coupon || null,
            paymentMethod:"Razorpay",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt : newOrder._id.toString()
        }

        await razorpayInstance.orders.create(options, (error,order)=>{
            if (error) {
                console.log(error)
                return res.json({success:false, message: error})
            }
            res.json({success:true,order})
        })

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const verifyRazorpay = async (req, res) => {
  try {
    const { userId, razorpay_order_id } = req.body;

    // 1️⃣ Fetch Razorpay order info
    const orderInfo = await razorpayInstance.orders.fetch(
      razorpay_order_id
    );

    if (orderInfo.status !== "paid") {
      return res.json({
        success: false,
        message: "Payment Failed"
      });
    }

    // 2️⃣ Fetch order from DB (THIS WAS MISSING)
    const order = await orderModel.findById(orderInfo.receipt);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found"
      });
    }

    // 3️⃣ Mark payment successful
    order.payment = true;
    await order.save();

    // 4️⃣ Increment coupon usage (if applied)
    if (order.coupon?.code) {
      await couponModel.findOneAndUpdate(
        { code: order.coupon.code },
        { $inc: { usedCount: 1 } }
      );
    }

    // 5️⃣ Clear user cart
    await userModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      { cartData: {} }
    );

    // 6️⃣ Respond success
    res.json({
      success: true,
      message: "Payment Successful"
    });

  } catch (error) {
    console.error("verifyRazorpay error:", error);
    res.json({
      success: false,
      message: error.message
    });
  }
};


const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId: new mongoose.Types.ObjectId(userId) })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.body.userId;

    const order = await orderModel.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const PDFDocument = (await import("pdfkit")).default;
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    // 🔤 Register Unicode fonts (fix ₹ issue)
    doc.registerFont("Inter", "./fonts/Inter_18pt-Regular.ttf");
    doc.registerFont("Inter-Bold", "./fonts/Inter_24pt-Bold.ttf");

    const filename = `invoice-${order._id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    doc.pipe(res);

    /* ======================================================
       BRAND HEADER
    ====================================================== */
    doc
      .font("Inter-Bold")
      .fontSize(22)
      .text("MAYILÉ", { align: "left" });

    doc
      .font("Inter")
      .fontSize(10)
      .text("Fashion & Lifestyle Store")
      .text("contactmayile@gmail.com")
      .text("+91 9123456789");

    doc.moveDown(1);
    doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(1);

    /* ======================================================
       INVOICE META (RIGHT CARD STYLE)
    ====================================================== */
    const metaTop = doc.y;

    doc
      .roundedRect(360, metaTop - 5, 180, 70, 6)
      .stroke("#CCCCCC");

    doc
      .font("Inter-Bold")
      .fontSize(12)
      .text("INVOICE", 380, metaTop + 5);

    doc
      .font("Inter")
      .fontSize(9)
      .text(`Invoice No: ${order._id}`, 380, metaTop + 25)
      .text(`Date: ${new Date(order.date).toDateString()}`, 380, metaTop + 38)
      .text(`Payment: ${order.paymentMethod}`, 380, metaTop + 51);

    /* ======================================================
       BILLING ADDRESS
    ====================================================== */
    doc.moveDown(3);

    doc
      .font("Inter-Bold")
      .fontSize(11)
      .text("BILLING ADDRESS");

    doc
      .moveTo(40, doc.y + 2)
      .lineTo(200, doc.y + 2)
      .stroke("#000000");

    doc.moveDown(0.8);
    doc.font("Inter").fontSize(10);

    const addr = order.address || {};
    [
      addr.name,
      addr.street,
      addr.city,
      addr.state,
      addr.pincode,
      addr.country,
      addr.email,
      addr.phone
    ]
      .filter(Boolean)
      .forEach(line => doc.text(line));

    /* ======================================================
       ITEMS TABLE HEADER
    ====================================================== */
    doc.moveDown(2);

    const tableTop = doc.y;
    const col = {
      item: 40,
      size: 280,
      qty: 340,
      price: 400,
      total: 470
    };

    // Header background
    doc
      .rect(40, tableTop - 5, 515, 20)
      .fill("#F0F0F0")
      .fillColor("black");

    doc
      .font("Inter-Bold")
      .fontSize(10)
      .text("Item", col.item, tableTop)
      .text("Size", col.size, tableTop)
      .text("Qty", col.qty, tableTop)
      .text("Price", col.price, tableTop)
      .text("Total", col.total, tableTop);

    doc.moveTo(40, tableTop + 15).lineTo(555, tableTop + 15).stroke();

    /* ======================================================
       ITEMS TABLE ROWS
    ====================================================== */
    let y = tableTop + 25;
    doc.font("Inter").fontSize(10);

    let calculatedTotal = 0;

    order.items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      calculatedTotal += itemTotal;

      doc
        .text(item.name, col.item, y)
        .text(item.size, col.size, y)
        .text(item.quantity.toString(), col.qty, y)
        .text(`₹${item.price}`, col.price, y)
        .text(`₹${itemTotal}`, col.total, y);

      // subtle row divider
      doc
        .moveTo(40, y + 15)
        .lineTo(555, y + 15)
        .strokeColor("#EEEEEE");

      y += 24;
    });

    /* ======================================================
       TOTAL AMOUNT (HIGHLIGHTED)
    ====================================================== */
    doc.moveDown(2);

    const totalTop = doc.y;

    doc
      .roundedRect(300, totalTop, 255, 40, 6)
      .fillAndStroke("#F5F5F5", "#CCCCCC");

    doc
      .fillColor("black")
      .font("Inter-Bold")
      .fontSize(12)
      .text("TOTAL AMOUNT", 320, totalTop + 12);

    doc
      .fontSize(12)
      .text(`₹${calculatedTotal}`, 470, totalTop + 12);

    /* ======================================================
       COMMENT
    ====================================================== */
    doc.moveDown(3);

    doc
      .font("Inter-Bold")
      .fontSize(10)
      .text("Comment");

    doc
      .moveDown(0.5)
      .font("Inter")
      .fontSize(9)
      .text(
        "Thank you for shopping with MAYILÉ. We hope to see you again.",
        { width: 500 }
      );

    /* ======================================================
       FOOTER
    ====================================================== */
    doc.moveDown(4);

    doc
      .font("Inter")
      .fontSize(9)
      .fillColor("gray")
      .text(
        "This is a system generated invoice and does not require a signature.",
        { align: "center", width: 500 }
      );

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const requestOrderCancel = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    const userId = req.body.userId;

    const order = await orderModel.findOne({
      _id: orderId,
      userId
    });

    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (["Shipped", "Delivered", "Cancelled"].includes(order.status)) {
      return res.json({
        success: false,
        message: "Order cannot be cancelled at this stage"
      });
    }

    order.cancelRequest = {
      requested: true,
      reason,
      requestedAt: new Date()
    };

    // Refund only if payment already done
    if (order.payment) {
      order.refund.required = true;
      order.refund.status = "Pending";
    }

    await order.save();

    res.json({
      success: true,
      message: "Cancellation request submitted"
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

const handleCancelRequest = async (req, res) => {
  try {
    const { orderId, action } = req.body;

    if (!orderId || !action) {
      return res.json({
        success: false,
        message: "orderId and action are required"
      });
    }

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.json({
        success: false,
        message: "Order not found"
      });
    }

    // ensure structures exist (BACKWARD COMPATIBILITY)
    if (!order.cancelRequest) {
      order.cancelRequest = { requested: false };
    }

    if (!order.refund) {
      order.refund = {
        required: false,
        status: "Not Required"
      };
    }

    if (!order.cancelRequest.requested) {
      return res.json({
        success: false,
        message: "No active cancellation request"
      });
    }

    // 🚫 terminal state
    if (order.status === "Cancelled") {
      return res.json({
        success: false,
        message: "Order already cancelled"
      });
    }

    if (action === "approve") {
      order.status = "Cancelled";

      if (order.payment) {
        order.refund.required = true;
        order.refund.status = "Pending";
      }

      order.cancelRequest.requested = false;
    }

    if (action === "reject") {
      order.cancelRequest = {
        requested: false,
        reason: null,
        requestedAt: null
      };

      if (!["Shipped", "Delivered"].includes(order.status)) {
        order.status = "Processing";
      }

      order.refund = {
        required: false,
        status: "Not Required"
      };
    }

    await order.save();

    res.json({
      success: true,
      message: `Cancellation ${action}d successfully`
    });
  } catch (err) {
    console.error("CANCEL ERROR:", err);
    res.json({
      success: false,
      message: err.message
    });
  }
};


const processRefund = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order || !order.refund.required) {
      return res.json({
        success: false,
        message: "Refund not applicable"
      });
    }

    if (order.refund.status === "Processed") {
      return res.json({ success: false, message: "Already refunded" });
    }

    // ⚠️ Integrate Stripe / Razorpay refund APIs here
    // For now we mark it processed

    order.refund.status = "Processed";
    order.refund.processedAt = new Date();

    await order.save();

    res.json({ success: true, message: "Refund processed" });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

const requestReturnExchange = async (req, res) => {
  try {
    const { orderId, type, reason, exchangeSize } = req.body;
    const userId = req.body.userId;

    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }

    if (order.status !== "Delivered") {
      return res.json({
        success: false,
        message: "Return / Exchange allowed only after delivery"
      });
    }

    // 7-day window
    const deliveredAt = order.date;
    const now = Date.now();
    const days = (now - deliveredAt) / (1000 * 60 * 60 * 24);

    if (days > 7) {
      return res.json({
        success: false,
        message: "Return / Exchange window expired"
      });
    }

    if (order.returnRequest?.requested) {
      return res.json({
        success: false,
        message: "Return / Exchange already requested"
      });
    }

    order.returnRequest = {
      requested: true,
      type,
      reason,
      exchangeSize: type === "Exchange" ? exchangeSize : null,
      requestedAt: new Date()
    };

    await order.save();

    res.json({
      success: true,
      message: `${type} request submitted`
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
};

const handleReturnRequest = async (req, res) => {
  try {
    const { orderId, action } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order || !order.returnRequest?.requested) {
      return res.json({ success: false, message: "Invalid return request" });
    }

    // Prevent double processing
    if (order.returnRequest.status === "Approved") {
      return res.json({ success: false, message: "Already approved" });
    }

    /* ================= REJECT ================= */
    if (action === "reject") {
      order.returnRequest = {
        requested: false,
        status: "Rejected"
      };
      await order.save();

      return res.json({ success: true, message: "Return rejected" });
    }

    /* ================= APPROVE ================= */
    if (action === "approve") {
      order.returnRequest.status = "Approved";

      // RETURN → refund after admin approval
      if (order.returnRequest.type === "Return") {
        order.refund.required = true;
        order.refund.status = "Pending";
        order.status = "Returned";
      }

      // EXCHANGE → reserve new size immediately
      if (order.returnRequest.type === "Exchange") {
        const item = order.items[0]; // size-only exchange assumption

        const product = await productModel.findById(item.productId);
        if (!product) {
          return res.json({ success: false, message: "Product not found" });
        }

        const newSize = order.returnRequest.exchangeSize?.trim().toUpperCase();

// ALWAYS use Map APIs
const availableStock = Number(product.stock.get(newSize) || 0);

if (availableStock <= 0) {
  return res.json({
    success: false,
    message: `Requested size ${newSize} out of stock`
  });
}

// Reserve new size
product.stock.set(newSize, availableStock - 1);

// Restore old size
const oldSize = item.size;
const oldStock = product.stock.get(oldSize) || 0;
product.stock.set(oldSize, oldStock + item.quantity);

// Update order item
item.size = newSize;

await product.save();

        order.status = "Exchange Approved";
      }

      order.returnRequest.requested = false;
      await order.save();

      return res.json({
        success: true,
        message: `${order.returnRequest.type} approved successfully`
      });
    }

  } catch (err) {
    console.error("RETURN ACTION ERROR:", err);
    res.json({ success: false, message: err.message });
  }
};


const shipExchange = async (req, res) => {
  const { orderId } = req.body;

  const order = await orderModel.findById(orderId);
  if (!order || order.returnRequest?.type !== "Exchange") {
    return res.json({ success: false, message: "Invalid exchange" });
  }

  order.items[0].size = order.returnRequest.exchangeSize;
  order.status = "Exchange Shipped";

  await order.save();

  res.json({ success: true, message: "Exchange shipped" });
};



export {verifyRazorpay, verifyStripe ,placeOrder, placeOrderStripe, 
  placeOrderRazorpay, allOrders, userOrders, updateStatus, 
  downloadInvoice, requestOrderCancel, handleCancelRequest, processRefund,
  requestReturnExchange, handleReturnRequest, shipExchange};