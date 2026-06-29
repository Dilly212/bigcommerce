const { makeRequest } = require("../api/request");

const BASE = "/v3/pricelists";

exports.getList = async (site, params = {}) => {
  return makeRequest(site, "GET", BASE, { params });
};

exports.getOne = async (site, priceListId) => {
  return makeRequest(site, "GET", `${BASE}/${priceListId}`);
};

exports.create = async (site, data) => {
  return makeRequest(site, "POST", BASE, { data });
};

exports.update = async (site, priceListId, data) => {
  return makeRequest(site, "PUT", `${BASE}/${priceListId}`, { data });
};

exports.remove = async (site, priceListId) => {
  return makeRequest(site, "DELETE", `${BASE}/${priceListId}`);
};

// Records — the actual price overrides within a price list
exports.getRecords = async (site, priceListId, params = {}) => {
  return makeRequest(site, "GET", `${BASE}/${priceListId}/records`, { params });
};

// PUT replaces all records matching the filter
exports.upsertRecords = async (site, priceListId, records) => {
  return makeRequest(site, "PUT", `${BASE}/${priceListId}/records`, { data: records });
};

exports.deleteRecords = async (site, priceListId, params = {}) => {
  return makeRequest(site, "DELETE", `${BASE}/${priceListId}/records`, { params });
};

// Assignments — link a price list to a customer group or channel
exports.getAssignments = async (site, params = {}) => {
  return makeRequest(site, "GET", `${BASE}/assignments`, { params });
};

exports.upsertAssignments = async (site, assignments) => {
  return makeRequest(site, "PUT", `${BASE}/assignments`, { data: assignments });
};

exports.deleteAssignments = async (site, params = {}) => {
  return makeRequest(site, "DELETE", `${BASE}/assignments`, { params });
};
