const { makeRequest } = require("../api/request");

exports.getLocations = async (site, params = {}) => {
  return makeRequest(site, "GET", "/v3/inventory/locations", { params });
};

exports.getItems = async (site, params = {}) => {
  return makeRequest(site, "GET", "/v3/inventory/items", { params });
};

// items: [{ sku, location_id, quantity }] — overwrites current level
exports.setAbsolute = async (site, items) => {
  return makeRequest(site, "PUT", "/v3/inventory/adjustments/absolute", {
    data: { items },
  });
};

// items: [{ sku, location_id, quantity }] — positive = add, negative = subtract
exports.adjustRelative = async (site, items) => {
  return makeRequest(site, "POST", "/v3/inventory/adjustments/relative", {
    data: { items },
  });
};
