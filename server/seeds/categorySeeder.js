const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("../models/Category");

dotenv.config();

const categories = [
  { name: "Electronics",  slug: "electronics" },
  { name: "Vehicles",     slug: "vehicles" },
  { name: "Clothing",     slug: "clothing" },
  { name: "Books",        slug: "books" },
  { name: "Home & Kitchen", slug: "home-kitchen" },
  { name: "Sports",       slug: "sports" },
];

const seedCategories = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Category.deleteMany();
  await Category.insertMany(categories);
  console.log("Categories seeded ✅");
  await mongoose.disconnect();
};

seedCategories();