const { makeRequest } = require("../api/request");

const BASE = "/v3/catalog/categories";

exports.getList = async (site, params = {}) => {
  return makeRequest(site, "GET", BASE, { params });
};

exports.getOne = async (site, categoryId) => {
  return makeRequest(site, "GET", `${BASE}/${categoryId}`);
};

exports.create = async (site, categoryData) => {
  return makeRequest(site, "POST", BASE, { data: categoryData });
};

exports.update = async (site, categoryId, categoryData) => {
  return makeRequest(site, "PUT", `${BASE}/${categoryId}`, { data: categoryData });
};

exports.remove = async (site, categoryId) => {
  return makeRequest(site, "DELETE", `${BASE}/${categoryId}`);
};
