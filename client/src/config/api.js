// API Configuration
// Set isDev to true for development
// Set isDev to false for production

const isDev = true;

const API_CONFIG = {
  development: "http://localhost:5500",
  production: "https://ccms.brri.gov.bd",
};

export const API_BASE_URL = isDev ? API_CONFIG.development : API_CONFIG.production;

export default API_BASE_URL;
