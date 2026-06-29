const { registerStore } = require("./api/credentials");
const { makeRequest } = require("./api/request");
const products = require("./scripts/products");
const brands = require("./scripts/brands");
const categories = require("./scripts/category");
const customers = require("./scripts/customer");
const customerGroups = require("./scripts/customer-group");
const images = require("./scripts/image");
const inventory = require("./scripts/inventory");
const orders = require("./scripts/orders");
const shipments = require("./scripts/shipments");
const priceLists = require("./scripts/price-lists");
const variants = require("./scripts/variants");
const metafields = require("./scripts/metafields");
const productOptions = require("./scripts/product-options");
const webhooks = require("./scripts/webhooks");
const shipping = require("./scripts/shipping");

module.exports = {
  registerStore,
  makeRequest,
  products,
  brands,
  categories,
  customers,
  customerGroups,
  images,
  inventory,
  orders,
  shipments,
  priceLists,
  variants,
  metafields,
  productOptions,
  webhooks,
  shipping,
};
