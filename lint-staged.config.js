module.exports = {
  "*.{js,ts,tsx}": ["eslint --cache --fix", "jest --bail --findRelatedTests"],
  "*.{js,ts,tsx,md,html,css,json}": "prettier --write",
};
