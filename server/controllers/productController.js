const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const createProduct = async (req,res) =>{
            try {
                    const {name,price,description,category} = req.body || {};

                    
                    if (!name || !price || !description) {
                                                 res.status(400);
                                                 throw new Error("All fields are required");
                                                         }
                    
                    const product = await Product.create({
                        name,
                        price:Number(price),
                        description,
                        category: category || null,
                        image: req.file ? req.file.path : "",
                        user:req.user._id
                    });
                    
                    res.status(201).json(product);

            } catch (error) {
                console.log(error);
                    res.status(500).json({message:error.message});
            }    
};

const getProducts = async (req,res) =>{
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || 1000000;

    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const keyword = req.query.keyword
        ? {name:{$regex : req.query.keyword, $options:"i"}}
        : {};

        const categoryFilter = req.query.category
  ? { category: req.query.category } 
  : {};
       
        let sortOption = {};

        if(req.query.sort === "low"){
            sortOption = {price: 1};
        }
        else if(req.query.sort === "high"){
            sortOption = {price:-1};
        }
        else{
            sortOption = {createdAt:-1};
        }

        const filterPrice = {
            price :{$gte:minPrice ,$lte:maxPrice},
        }

        const finalFilter = {...keyword, ...filterPrice,...categoryFilter};

        const count = await Product.countDocuments(finalFilter);

        const products = await Product.find(finalFilter)
          .populate("category", "name slug") 
        .sort(sortOption)
        .limit(limit)
        .skip(limit *(page -1));

         const totalPages = count > 0 ? Math.ceil(count / limit) : 0;

        res.json({
            products,
            page,
           pages: totalPages,
           totalProducts: count
        });

    } catch (error) {
        console.log(error);
        
        res.status(500).json({message:error.message});
    }
}

//get single product
const getProductById = async (req,res) =>{
    try {
        const product = await Product.findById(req.params.id);

        if(product){
            res.json(product);
        }
        else{
           return res.status(404).json({message:"Product not found"});
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

//update product
const updateProduct = async(req,res) =>{
try {
    const product = await Product.findById(req.params.id);

    if(!product){
       return res.status(404).json({message:"Product not found"});
    }

        product.name = req.body.name || product.name;
        product.price = req.body.price? Number(req.body.price) : product.price;
        product.description = req.body.description || product.description;
        product.category = req.body.category ?? product.category;

        if(req.file){
            if(product.image){
                const publicId = product.image.split("/").slice(-2).join("/").split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
            product.image = req.file.path;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);

  
} catch (error) {
     res.status(500).json({message:error.message})
}
};

//delete product
const deleteProduct = async(req,res) =>{
    try {
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({message:"Product not found"});
            
        }
        if(product.image){
            const publicId = product.image
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
            
            await cloudinary.uploader.destroy(publicId);
        }
        await product.deleteOne();
            res.json({message:"Product removed Succesfully"});
        
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};


module.exports = {createProduct,getProducts,getProductById,updateProduct,deleteProduct};