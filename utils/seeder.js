const Client = require("../models/clientModel.js");
const Course = require("../models/courseModel.js");
const Product = require("../models/productModel.js");
const Packages = require("../models/packages.js");
const CourseCategory = require("../models/courseCategoryModel.js");
const Category = require("../models/categoryModel.js");
const Astrologer = require("../models/astrologerModel.js");
const Language = require("../models/languageModel.js");
const Methods = require("../models/methodologyModel.js");
const Bonus = require("../models/BonusModel.js");

const dotenv = require("dotenv");
require('dotenv').config();

const path = require("path");
const connectDatabase = require("../config/database.js");
const Message = require("../models/messageModel.js");
const { Channel } = require("diagnostics_channel");
 const Chat = require("../models/chatModel.js");

// dotenv.config({ path: path.join(__dirname, "../") });
connectDatabase();

const seedProducts = async () => {
  try {
    await Client.deleteMany();
    console.log("All user deleted");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};
seedProducts();
