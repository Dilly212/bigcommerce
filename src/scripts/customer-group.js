const { makeRequest } = require("../api/request");

const BASE = "/v2/customer_groups";

exports.getList = async (site, params = {}) => {
  return makeRequest(site, "GET", BASE, { params });
};

exports.getOne = async (site, groupId) => {
  return makeRequest(site, "GET", `${BASE}/${groupId}`);
};

exports.create = async (site, groupData) => {
  return makeRequest(site, "POST", BASE, { data: groupData });
};

exports.update = async (site, groupId, groupData) => {
  return makeRequest(site, "PUT", `${BASE}/${groupId}`, { data: groupData });
};

exports.remove = async (site, groupId) => {
  return makeRequest(site, "DELETE", `${BASE}/${groupId}`);
};
