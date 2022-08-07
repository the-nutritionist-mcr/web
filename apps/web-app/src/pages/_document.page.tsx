import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
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
