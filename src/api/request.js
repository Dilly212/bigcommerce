const axios = require("axios");
require("dotenv").config();
const {getCredentials} = require("./credentials");

exports.makeRequest = async (site, method, path, { params, data } = {}) => {
  try {
    const { base_url, defaultHeaders } = await getCredentials(site);
    const res = await axios({
      method,
      url: `${base_url}${path}`,
      headers: defaultHeaders,
      params,
      data,
    });
    return res.data;
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.title || error.message;
    const errors = error.response?.data?.errors;
    const detail = errors ? ` — ${JSON.stringify(errors)}` : "";
    throw new Error(`BigCommerce API error [${status}]: ${message}${detail}`);
  }
};
