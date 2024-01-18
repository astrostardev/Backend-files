const catchAsyncError = require("../middlewares/catchAsyncError");
const Product = require("../models/productModel");

exports.createProduct = catchAsyncError(async (req, res, next) => {
  let images = [];
  let BASE_URL = process.env.BACKEND_URL;

  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }
  const reqfiles = req.files;
  console.log("files", reqfiles);
  req.files.forEach((file) => {
    let url = `${BASE_URL}/uploads/ProductImages/${file.originalname}`;
    images.push({ image: url });
  });
  const { productname } = req.body.productname;
  const existingProduct = await Product.findOne({ productname: productname });

  if (existingProduct) {
    // Clientis already registered
    return res.status(409).json({
      success: false,
      message: "Product already created",
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
  const newProductData = ({
    productname,
    price,
    description,
    category,
    isActive,
  } = req.body);
  let images = [];
  let BASE_URL = process.env.BACKEND_URL;

  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }
  const reqfiles = req.files;
  console.log("files", reqfiles);
  req.files.forEach((file) => {
    let url = `${BASE_URL}/uploads/ProductImages/${file.originalname}`;
    images.push({ image: url });
  });
  req.body.images = images;
  const upproduct = await Product.findByIdAndUpdate(
    req.params.id,
    newProductData,
    {
      new: true,
      runValidators: true,
    }
  );


  res.status(200).json({
    success: true,
    upproduct,
  });
});

exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  await product.deleteOne();
  res.status(200).json({
    sucess: true,
  });
});
