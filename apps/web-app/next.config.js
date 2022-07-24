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

const GenerateAwsLambda = require('next-aws-lambda-webpack-plugin');
const withImages = require('next-images');

module.exports = withVanillaExtract(
  withNx(
    withImages({
      env: {
        COGNITO_POOL_ID: process.env.NX_USER_POOL_ID,
      },
      pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
      generateBuildId: async () => {
        return 'tnm-web-build';
      },
      ...nextConfig,
      target: 'serverless',
      i18n: {
        locales: ['en'],
        defaultLocale: 'en',
      },

      typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
      productionBrowserSourceMaps: true,
      webpack: (config, nextConfig) => {
        // eslint-disable-next-line fp/no-mutating-methods
        config.plugins.push(new GenerateAwsLambda(nextConfig));
        if (!nextConfig.isServer) {
          // eslint-disable-next-line fp/no-mutation
          config.resolve.fallback.fs = false;
        }
        return config;
      },
      images: {
        disableStaticImages: true,
        loader: 'custom',
      },
    })
  )
);
