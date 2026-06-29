const { registerStore } = require("./api/credentials");
const products = require("./scripts/products");
const brands = require("./scripts/brands");
const categories = require("./scripts/category");
const customers = require("./scripts/customer");
const customerGroups = require("./scripts/customer-group");
const images = require("./scripts/image");
const inventory = require("./scripts/inventory");

module.exports = {
  registerStore,
  products,
  brands,
  categories,
  customers,
  customerGroups,
  images,
  inventory,
};
