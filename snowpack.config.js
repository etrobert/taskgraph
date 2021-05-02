// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    "src/scripts": "/scripts",
    "src/static": { url: "/", static: true, resolve: false },
  },
  plugins: ["@snowpack/plugin-typescript"],
  buildOptions: {
    out: "dist",
    // Github Pages ignores _ prefixed folders
    metaUrlPath: "snowpack",
  },
};
