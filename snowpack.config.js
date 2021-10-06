// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: "/dist",
    public: "/",
  },
  plugins: ["@snowpack/plugin-typescript"],
  buildOptions: {
    // Github Pages ignores _ prefixed folders
    metaUrlPath: "snowpack",
  },
  alias: {
    "@": "./src",
  },
  routes: [
    {
      match: "routes",
      src: ".*",
      dest: "/index.html",
    },
  ],
};
