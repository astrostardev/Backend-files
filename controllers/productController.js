const catchAsyncError = require("../middlewares/catchAsyncError");
const Product = require("../models/productModel");

exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];
  let BASE_URL = process.env.BACKEND_URL;

  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }
 
  if (req.files.length > 0) {
    req.files.forEach((file) => {
      let url = `${BASE_URL}/uploads/ProductImages/${file.originalname}`;
      images.push({ image: url });
    });
  }
  req.body.images = images;

  const { productname } = req.body;
  console.log('hi', productname);

  const existingProduct = await Product.findOne({ productname: { $regex: new RegExp(productname, 'i') } });

  if (existingProduct) {
    // Product already exists
    return res.status(409).json({
        success: false,
        message: 'Product already registered',
    });
}
  req.body.images = images;
  console.log(req.body);
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

exports.showProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();

  // Set Content-Type to application/json
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  res.status(200).json({
    success: true,
    products,
  });
});
exports.getProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  // Set Content-Type to application/json
  res.setHeader("Content-Type", "application/json; charset=utf-8");

  res.status(200).json({
    success: true,
    product,
  });
});
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  let images = [];
  if (req.body.imagesCleared === 'false') {
    images = product.images;
  }

  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === 'production') {
    BASE_URL = `${req.protocol}://${req.get('host')}`;
  }

  if (req.files.length > 0) {
    req.files.forEach((file) => {
      let url = `${BASE_URL}/uploads/ProductImages/${file.originalname}`;
      images.push({ image: url });
    });
  }

  req.body.images = images;

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
    });
  }

  const { productname } = req.body;

  console.log('hi', productname);

  if (productname !== product.productname) {
    // Product name has been modified, check for existence
    const existingProduct = await Product.findOne({
      productname: { $regex: new RegExp(productname, 'i') },
    });

    if (existingProduct) {
      // Product with the new name already exists
      return res.status(409).json({
        success: false,
        message: 'Product already registered',
      });
    }
  }

  // Update the product details
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});


exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  await product.deleteOne();
  res.status(200).json({
    sucess: true,
  });
});
