const { makeRequest } = require("../api/request");

const BASE = (productId) => `/v3/catalog/products/${productId}/variants`;

exports.getList = async (site, productId, params = {}) => {
  return makeRequest(site, "GET", BASE(productId), { params });
};

exports.getOne = async (site, productId, variantId) => {
  return makeRequest(site, "GET", `${BASE(productId)}/${variantId}`);
};

exports.create = async (site, productId, data) => {
  return makeRequest(site, "POST", BASE(productId), { data });
};

exports.update = async (site, productId, variantId, data) => {
  return makeRequest(site, "PUT", `${BASE(productId)}/${variantId}`, { data });
};

exports.remove = async (site, productId, variantId) => {
  return makeRequest(site, "DELETE", `${BASE(productId)}/${variantId}`);
};

// List all variants across all products — useful for bulk catalog/inventory sync
exports.listAll = async (site, params = {}) => {
  return makeRequest(site, "GET", "/v3/catalog/variants", { params });
};
