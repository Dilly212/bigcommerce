const { makeRequest } = require("../api/request");

const optBase = (productId) => `/v3/catalog/products/${productId}/options`;
const modBase = (productId) => `/v3/catalog/products/${productId}/modifiers`;

// Options
exports.getOptions = async (site, productId, params = {}) => {
  return makeRequest(site, "GET", optBase(productId), { params });
};

exports.getOption = async (site, productId, optionId) => {
  return makeRequest(site, "GET", `${optBase(productId)}/${optionId}`);
};

exports.createOption = async (site, productId, data) => {
  return makeRequest(site, "POST", optBase(productId), { data });
};

exports.updateOption = async (site, productId, optionId, data) => {
  return makeRequest(site, "PUT", `${optBase(productId)}/${optionId}`, { data });
};

exports.removeOption = async (site, productId, optionId) => {
  return makeRequest(site, "DELETE", `${optBase(productId)}/${optionId}`);
};

// Option values
exports.getOptionValues = async (site, productId, optionId) => {
  return makeRequest(site, "GET", `${optBase(productId)}/${optionId}/values`);
};

exports.createOptionValue = async (site, productId, optionId, data) => {
  return makeRequest(site, "POST", `${optBase(productId)}/${optionId}/values`, { data });
};

exports.updateOptionValue = async (site, productId, optionId, valueId, data) => {
  return makeRequest(site, "PUT", `${optBase(productId)}/${optionId}/values/${valueId}`, { data });
};

exports.removeOptionValue = async (site, productId, optionId, valueId) => {
  return makeRequest(site, "DELETE", `${optBase(productId)}/${optionId}/values/${valueId}`);
};

// Modifiers (input-driven options that don't create variants — text fields, file uploads, etc.)
exports.getModifiers = async (site, productId, params = {}) => {
  return makeRequest(site, "GET", modBase(productId), { params });
};

exports.getModifier = async (site, productId, modifierId) => {
  return makeRequest(site, "GET", `${modBase(productId)}/${modifierId}`);
};

exports.createModifier = async (site, productId, data) => {
  return makeRequest(site, "POST", modBase(productId), { data });
};

exports.updateModifier = async (site, productId, modifierId, data) => {
  return makeRequest(site, "PUT", `${modBase(productId)}/${modifierId}`, { data });
};

exports.removeModifier = async (site, productId, modifierId) => {
  return makeRequest(site, "DELETE", `${modBase(productId)}/${modifierId}`);
};
