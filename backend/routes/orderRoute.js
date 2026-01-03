import express from 'express'
import {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay, downloadInvoice, requestOrderCancel, handleCancelRequest, processRefund,requestReturnExchange,shipExchange,handleReturnRequest} from '../controllers/orderController.js'
import adminAuth  from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)
orderRouter.post("/cancel-action",adminAuth,handleCancelRequest);
orderRouter.post("/process-refund",adminAuth,processRefund);
orderRouter.post("/return-request", authUser, requestReturnExchange);
orderRouter.post("/return-action", adminAuth, handleReturnRequest);
orderRouter.post("/exchange-ship", adminAuth, shipExchange);

// Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

// User Feature 
orderRouter.post('/userorders',authUser,userOrders)

// verify payment
orderRouter.post('/verifyStripe',authUser, verifyStripe)
orderRouter.post('/verifyRazorpay',authUser, verifyRazorpay)

orderRouter.get('/invoice/:orderId',authUser,downloadInvoice);
orderRouter.post("/cancel-request",authUser,requestOrderCancel);


export default orderRouter