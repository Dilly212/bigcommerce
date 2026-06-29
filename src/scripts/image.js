const axios = require("axios");
const FormData = require("form-data");
const { makeRequest } = require("../api/request");
const { getImageCredentials } = require("../api/credentials");

const imagesPath = (productId) => `/v3/catalog/products/${productId}/images`;

exports.getList = async (site, productId) => {
  return makeRequest(site, "GET", imagesPath(productId));
};

exports.remove = async (site, productId, imageId) => {
  return makeRequest(site, "DELETE", `${imagesPath(productId)}/${imageId}`);
};

// BC fetches the image from the URL and stores it on the BC CDN.
exports.uploadFromUrl = async (
  site,
  productId,
  { image_url, description = "", is_thumbnail = false, sort_order = 0 }
) => {
  return makeRequest(site, "POST", imagesPath(productId), {
    data: { image_url, description, is_thumbnail, sort_order },
  });
};

// Downloads the image as a buffer then POSTs it as multipart form data.
// Use when source URLs may expire or be access-restricted.
exports.uploadFromBuffer = async (
  site,
  productId,
  sourceUrl,
  { description = "", is_thumbnail = false, sort_order = 0 } = {}
) => {
  const imageRes = await axios.get(sourceUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(imageRes.data);
  const ext = sourceUrl.split("?")[0].split(".").pop().toLowerCase() || "jpg";
  const filename = `product_${productId}_${sort_order}.${ext}`;
  const { base_url, defaultHeaders } = getImageCredentials(site);

  const form = new FormData();
  form.append("image_file", buffer, {
    filename,
    contentType: imageRes.headers["content-type"] || "image/jpeg",
  });
  form.append("description", description);
  form.append("is_thumbnail", String(is_thumbnail));
  form.append("sort_order", String(sort_order));

  const res = await axios.post(`${base_url}${imagesPath(productId)}`, form, {
    headers: { ...defaultHeaders, ...form.getHeaders() },
  });
  return res.data;
};
