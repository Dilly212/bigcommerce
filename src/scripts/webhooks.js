const { makeRequest } = require("../api/request");

const BASE = "/v3/hooks";

exports.getList = async (site, params = {}) => {
  return makeRequest(site, "GET", BASE, { params });
};

exports.getOne = async (site, hookId) => {
  return makeRequest(site, "GET", `${BASE}/${hookId}`);
};

exports.create = async (site, data) => {
  return makeRequest(site, "POST", BASE, { data });
};

exports.update = async (site, hookId, data) => {
  return makeRequest(site, "PUT", `${BASE}/${hookId}`, { data });
};

exports.remove = async (site, hookId) => {
  return makeRequest(site, "DELETE", `${BASE}/${hookId}`);
};
