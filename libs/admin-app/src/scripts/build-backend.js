/* eslint-disable no-console */
/* eslint-disable unicorn/no-process-exit */
/* eslint-disable promise/always-return */
const path = require("path");
const { build } = require("esbuild");
const { pnpPlugin } = require("@yarnpkg/esbuild-plugin-pnp");

const root = path.resolve(__dirname, "..", "..");
const src = path.resolve(root, "src");
const config = path.resolve(root, "app-config");
const dist = path.resolve(root, "dist");

const inFile = path.resolve(src, "backend", "index.ts");
const outfile = path.resolve(dist, "bundles", "backend", "index.js");

build({
  entryPoints: [inFile],
  outfile,
  platform: "node",
  bundle: true,
  tsconfig: path.resolve(config, "tsconfig.backend.json"),
  sourcemap: true,
  plugins: [pnpPlugin()],
})
  .then(() => {
    console.log("Successfully built backend");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
