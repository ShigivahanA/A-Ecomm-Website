import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import contactRouter from './routes/contactRoute.js'
import letterRouter from './routes/newsletterRoute.js';
import wishlistRouter from './routes/wishlistRoute.js';
import jobRouter from './routes/jobRoute.js';
import ReviewRouter from './routes/reviewRouter.js'
import bannerRouter from './routes/bannerRouter.js'
import couponRouter from "./routes/couponRoutes.js";


// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/contact', contactRouter)
app.use('/api/newsletter', letterRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/job', jobRouter);
app.use('/api/review', ReviewRouter);
app.use('/api/banner',bannerRouter);
app.use('/uploads', express.static('uploads'));
app.use("/api/coupon", couponRouter);


app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port, ()=> console.log('Server started on PORT : '+ port))