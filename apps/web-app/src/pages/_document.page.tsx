import { Html, Head, Main, NextScript } from 'next/document';
import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';

const datadogAppId = process.env['NX_DATADOG_APP_ID'];
const datadogClientToken = process.env['NX_DATADOG_CLIENT_TOKEN'];

const Document = () => {
  useEffect(() => {
    if (datadogAppId) {
      datadogRum.init({
        applicationId: datadogAppId,
        clientToken: datadogClientToken,
        site: 'datadoghq.eu',
        service: 'tnm-web',
        env: process.env['NX_APP_ENV'],

        // Specify a version number to identify the deployed version of your application in Datadog
        // version: '1.0.0',
        sampleRate: 100,
        premiumSampleRate: 100,
        trackInteractions: true,
        defaultPrivacyLevel: 'mask-user-input',
      });

      datadogRum.startSessionReplayRecording();
    }
  }, []);
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
        <meta
          name="viewport"
          content="width=device-width,
              initial-scale=1,
              maximum-scale=1"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div
          dangerouslySetInnerHTML={{
            __html: `<!-- version: ${process.env['APP_VERSION']} -->`,
          }}
        />
      </body>
    </Html>
  );
};

export default Document;
