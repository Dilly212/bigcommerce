const { makeRequest } = require("../api/request");

const BASE = "/v3/customers";

exports.getList = async (site, params = {}) => {
  return makeRequest(site, "GET", BASE, { params });
};

exports.getOne = async (site, customerId) => {
  return makeRequest(site, "GET", BASE, { params: { "id:in": customerId } });
};

exports.create = async (site, customerData) => {
  return makeRequest(site, "POST", BASE, { data: [customerData] });
};

exports.update = async (site, customerId, customerData) => {
  return makeRequest(site, "PUT", BASE, { data: [{ id: customerId, ...customerData }] });
};

exports.remove = async (site, customerId) => {
  return makeRequest(site, "DELETE", BASE, { params: { "id:in": customerId } });
};
