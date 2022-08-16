// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNx = require('@nrwl/next/plugins/with-nx');
const { createVanillaExtractPlugin } = require('@vanilla-extract/next-plugin');
const withVanillaExtract = createVanillaExtractPlugin();

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

const withImages = require('next-images');

module.exports = withVanillaExtract(
  withNx(
    withImages({
      outputFileTracing: false,
      env: {
        COGNITO_POOL_ID: process.env.NX_USER_POOL_ID,
        APP_VERSION: process.env.NX_APP_VERSION,
      },
      trailingSlash: true,
      pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
      generateBuildId: async () => {
        return process.env.NX_APP_VERSION;
      },
      ...nextConfig,

      typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
      productionBrowserSourceMaps: true,
      // webpack: (config, nextConfig) => {
      //   // eslint-disable-next-line fp/no-mutating-methods
      //   config.plugins.push(new GenerateAwsLambda(nextConfig));
      //   if (!nextConfig.isServer) {
      //     // eslint-disable-next-line fp/no-mutation
      //     config.resolve.fallback.fs = false;
      //   }
      //   return config;
      // },
      images: {
        disableStaticImages: true,
        loader: 'custom',
      },
    })
  )
);
