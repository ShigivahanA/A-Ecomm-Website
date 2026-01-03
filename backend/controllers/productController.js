import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller,stock,fabric, fabricDetails, fit, silhouette, care, occasion, styleNotes, modelHeight, modelSizeWorn, madeIn } = req.body
        const parsedCare = req.body.care
        ? JSON.parse(req.body.care)
        : [];

        const parsedStock = req.body.stock
        ? JSON.parse(req.body.stock)
        : {};

        const parsedOccasion = req.body.occasion
        ? JSON.parse(req.body.occasion)
        : [];
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            stock: parsedStock,
            image: imagesUrl,
            date: Date.now(),
            fabric: req.body.fabric || "",
            fabricDetails: req.body.fabricDetails || "",
            fit: req.body.fit || "",
            silhouette: req.body.silhouette || "",
            care: parsedCare,
            occasion: parsedOccasion,
            styleNotes: req.body.styleNotes || "",
            modelInfo: {
                height: req.body.modelHeight || "",
                sizeWorn: req.body.modelSizeWorn || "",
            },
            madeIn: req.body.madeIn || "",
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// productController.js
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    const parsedCare = req.body.care ? JSON.parse(req.body.care) : [];
    const parsedOccasion = req.body.occasion ? JSON.parse(req.body.occasion) : [];
    const parsedSizes = req.body.sizes ? JSON.parse(req.body.sizes) : [];
    const parsedStock = req.body.stock
      ? JSON.parse(req.body.stock)
      : {};

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success:false, message:"Product not found" });
    }

    // images (optional)
    const images = [];
    for (let i = 1; i <= 4; i++) {
      if (req.files[`image${i}`]) {
        const uploaded = await cloudinary.uploader.upload(
          req.files[`image${i}`][0].path,
          { resource_type:'image' }
        );
        images.push(uploaded.secure_url);
      }
    }

    // update fields
    Object.assign(product, {
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      subCategory: req.body.subCategory,
      bestseller: req.body.bestseller === "true",
      sizes: parsedSizes,
      stock: parsedStock,
      fabric: req.body.fabric,
      fabricDetails: req.body.fabricDetails,
      fit: req.body.fit,
      silhouette: req.body.silhouette,
      care: parsedCare,
      occasion: parsedOccasion,
      styleNotes: req.body.styleNotes,
      madeIn: req.body.madeIn,
      modelInfo: {
        height: req.body.modelHeight,
        sizeWorn: req.body.modelSizeWorn,
      }
    });

    if (images.length > 0) {
      product.image = images;
    }

    await product.save();
    res.json({ success:true, message:"Product updated" });

  } catch (err) {
    console.error(err);
    res.json({ success:false, message: err.message });
  }
};


export { listProducts, addProduct, removeProduct, singleProduct, updateProduct }