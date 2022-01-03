// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

const GenerateAwsLambda = require("next-aws-lambda-webpack-plugin");
const withImages = require("next-images");

module.exports = withNx(
  withImages({
    pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
    generateBuildId: async () => {
      return 'tnm-web-build'
    },
    ...nextConfig,
    target: "serverless",
    productionBrowserSourceMaps: true,
    webpack: (config, nextConfig) => {
      config.plugins.push(new GenerateAwsLambda(nextConfig));
      if (!nextConfig.isServer) {
        config.resolve.fallback.fs = false;
      }
      return config;
    },
    images: {
      disableStaticImages: true,
      loader: "custom",
    },
  })
);
