const { makeRequest } = require("../api/request");

const BASE = "/v3/catalog/products";

exports.getList = async (site, params = {}) => {
  return makeRequest(site, "GET", BASE, { params });
};

exports.getOne = async (site, productId) => {
  return makeRequest(site, "GET", `${BASE}/${productId}`);
};

exports.create = async (site, productData) => {
  return makeRequest(site, "POST", BASE, { data: productData });
};

exports.update = async (site, productId, productData) => {
  return makeRequest(site, "PUT", `${BASE}/${productId}`, { data: productData });
};

exports.remove = async (site, productId) => {
  return makeRequest(site, "DELETE", `${BASE}/${productId}`);
};
