const { makeRequest } = require("../api/request");

const BASE = "/v3/catalog/brands";

exports.getList = async (site, params = {}) => {
  return makeRequest(site, "GET", BASE, { params });
};

exports.getOne = async (site, brandId) => {
  return makeRequest(site, "GET", `${BASE}/${brandId}`);
};

exports.create = async (site, brandData) => {
  return makeRequest(site, "POST", BASE, { data: brandData });
};

exports.update = async (site, brandId, brandData) => {
  return makeRequest(site, "PUT", `${BASE}/${brandId}`, { data: brandData });
};

exports.remove = async (site, brandId) => {
  return makeRequest(site, "DELETE", `${BASE}/${brandId}`);
};
