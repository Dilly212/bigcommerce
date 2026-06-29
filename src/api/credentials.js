require("dotenv").config();

const registry = {};

// Auto-load stores from env vars at startup.
// Pattern: <CODE>_BIGCOMMERCE_STORE_HASH + <CODE>_BIGCOMMERCE_CLIENT_ACCESS_TOKEN
const KNOWN_SITES = ["B2B", "B2C", "VAP", "PCH"];
for (const code of KNOWN_SITES) {
  const storeHash = process.env[`${code}_BIGCOMMERCE_STORE_HASH`];
  const accessToken = process.env[`${code}_BIGCOMMERCE_CLIENT_ACCESS_TOKEN`];
  if (storeHash && accessToken) {
    registry[code] = { storeHash, accessToken };
  }
}

exports.registerStore = (code, { storeHash, accessToken }) => {
  if (!code || !storeHash || !accessToken) {
    throw new Error("registerStore requires code, storeHash, and accessToken");
  }
  registry[code.toUpperCase()] = { storeHash, accessToken };
};

const resolve = (site) => {
  const key = site?.toUpperCase();
  const creds = registry[key];
  if (!creds) {
    throw new Error(
      `Unknown store "${site}". Register it with registerStore() or set ${site}_BIGCOMMERCE_STORE_HASH in env.`
    );
  }
  return creds;
};

exports.getCredentials = (site) => {
  const { storeHash, accessToken } = resolve(site);
  return {
    base_url: `https://api.bigcommerce.com/stores/${storeHash}`,
    defaultHeaders: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Auth-Token": accessToken,
    },
  };
};

exports.getImageCredentials = (site) => {
  const { storeHash, accessToken } = resolve(site);
  return {
    base_url: `https://api.bigcommerce.com/stores/${storeHash}`,
    defaultHeaders: {
      Accept: "application/json",
      "X-Auth-Token": accessToken,
    },
  };
};
