const { makeRequest } = require("../api/request");

const BASE = (orderId) => `/v2/orders/${orderId}/shipments`;

exports.getList = async (site, orderId, params = {}) => {
  return makeRequest(site, "GET", BASE(orderId), { params });
};

exports.getOne = async (site, orderId, shipmentId) => {
  return makeRequest(site, "GET", `${BASE(orderId)}/${shipmentId}`);
};

exports.create = async (site, orderId, data) => {
  return makeRequest(site, "POST", BASE(orderId), { data });
};

exports.update = async (site, orderId, shipmentId, data) => {
  return makeRequest(site, "PUT", `${BASE(orderId)}/${shipmentId}`, { data });
};

exports.remove = async (site, orderId, shipmentId) => {
  return makeRequest(site, "DELETE", `${BASE(orderId)}/${shipmentId}`);
};
