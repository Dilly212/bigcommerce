const { makeRequest } = require("../api/request");

const RESOURCE_PATHS = {
  products:   "/v3/catalog/products",
  variants:   "/v3/catalog/variants",
  categories: "/v3/catalog/categories",
  brands:     "/v3/catalog/brands",
  customers:  "/v3/customers",
  orders:     "/v3/orders",
  channels:   "/v3/channels",
};

const base = (resourceType, resourceId) => {
  const path = RESOURCE_PATHS[resourceType];
  if (!path) {
    throw new Error(
      `Unknown resource type "${resourceType}". Valid types: ${Object.keys(RESOURCE_PATHS).join(", ")}`
    );
  }
  return `${path}/${resourceId}/metafields`;
};

exports.getList = async (site, resourceType, resourceId, params = {}) => {
  return makeRequest(site, "GET", base(resourceType, resourceId), { params });
};

exports.getOne = async (site, resourceType, resourceId, metafieldId) => {
  return makeRequest(site, "GET", `${base(resourceType, resourceId)}/${metafieldId}`);
};

exports.create = async (site, resourceType, resourceId, data) => {
  return makeRequest(site, "POST", base(resourceType, resourceId), { data });
};

exports.update = async (site, resourceType, resourceId, metafieldId, data) => {
  return makeRequest(site, "PUT", `${base(resourceType, resourceId)}/${metafieldId}`, { data });
};

exports.remove = async (site, resourceType, resourceId, metafieldId) => {
  return makeRequest(site, "DELETE", `${base(resourceType, resourceId)}/${metafieldId}`);
};
