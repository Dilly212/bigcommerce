const { makeRequest } = require("../api/request");

const ZONES = "/v2/shipping/zones";

// Zones
exports.getZones = async (site) => {
  return makeRequest(site, "GET", ZONES);
};

exports.getZone = async (site, zoneId) => {
  return makeRequest(site, "GET", `${ZONES}/${zoneId}`);
};

exports.createZone = async (site, data) => {
  return makeRequest(site, "POST", ZONES, { data });
};

exports.updateZone = async (site, zoneId, data) => {
  return makeRequest(site, "PUT", `${ZONES}/${zoneId}`, { data });
};

exports.removeZone = async (site, zoneId) => {
  return makeRequest(site, "DELETE", `${ZONES}/${zoneId}`);
};

// Methods per zone
exports.getMethods = async (site, zoneId) => {
  return makeRequest(site, "GET", `${ZONES}/${zoneId}/methods`);
};

exports.getMethod = async (site, zoneId, methodId) => {
  return makeRequest(site, "GET", `${ZONES}/${zoneId}/methods/${methodId}`);
};

exports.createMethod = async (site, zoneId, data) => {
  return makeRequest(site, "POST", `${ZONES}/${zoneId}/methods`, { data });
};

exports.updateMethod = async (site, zoneId, methodId, data) => {
  return makeRequest(site, "PUT", `${ZONES}/${zoneId}/methods/${methodId}`, { data });
};

exports.removeMethod = async (site, zoneId, methodId) => {
  return makeRequest(site, "DELETE", `${ZONES}/${zoneId}/methods/${methodId}`);
};
