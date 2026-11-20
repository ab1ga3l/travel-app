// Extends app.json. When EXPO_WEB_BASE is set (e.g. "/app"), the web export is built to live
// under that path on the website, so the app can be previewed in any phone's browser.
module.exports = ({ config }) => ({
  ...config,
  experiments: { ...config.experiments, ...(process.env.EXPO_WEB_BASE ? { baseUrl: process.env.EXPO_WEB_BASE } : {}) },
});
