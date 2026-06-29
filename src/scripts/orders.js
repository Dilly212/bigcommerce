const { makeRequest } = require("../api/request");

const BASE = "/v2/orders";

exports.getList = async (site, params = {}) => {
  return makeRequest(site, "GET", BASE, { params });
};

exports.getOne = async (site, orderId) => {
  return makeRequest(site, "GET", `${BASE}/${orderId}`);
};

exports.update = async (site, orderId, data) => {
  return makeRequest(site, "PUT", `${BASE}/${orderId}`, { data });
};

exports.getProducts = async (site, orderId) => {
  return makeRequest(site, "GET", `${BASE}/${orderId}/products`);
};

exports.getShippingAddresses = async (site, orderId) => {
  return makeRequest(site, "GET", `${BASE}/${orderId}/shipping_addresses`);
};

exports.getStatuses = async (site) => {
  return makeRequest(site, "GET", "/v2/order_statuses");
};
