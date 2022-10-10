import { Html, Head, Main, NextScript } from 'next/document';

const Document = () => {
  return (
    <Html>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://use.typekit.net/xqv5xkh.css?ver=6.0.2"
          type="text/css"
          media="all"
        />
        <link rel="manifest" href="/manifest.json" />

        <meta name="application-name" content="The Nutritionist Mancheser" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta
          name="apple-mobile-web-app-title"
          content="The Nutritionist Manchester"
        />
        <meta
          name="description"
          content="Freshly prepared meals carefully hand-delivered"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/TNM-N-152.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/TNM-N-152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/TNM-N-180.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />

        <meta
          name="twitter:card"
          content="Freshly prepared meals carefully hand delivered"
        />
        <meta name="twitter:url" content="https://thenutritionistmcr.com" />
        <meta name="twitter:title" content="The Nutritionist Manchester" />
        <meta
          name="twitter:description"
          content="Freshly prepared meals carefully hand delivered"
        />
        {/*
        <meta
          name="twitter:image"
          content="https://yourdomain.com/icons/android-chrome-192x192.png"
        />
        <meta name="twitter:creator" content="@DavidWShadow" />
        */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Nutritionist Mancheser" />
        <meta
          property="og:description"
          content="Freshly prepared meals carefully hand delivered"
        />
        <meta property="og:site_name" content="The Nutritionist Manchester" />
        <meta property="og:url" content="https://thenutritionistmcr.com" />
        {/*
        <meta
          property="og:image"
          content="https://yourdomain.com/icons/apple-touch-icon.png"
        />
        */}

        {/*
        <!-- apple splash screen images -->
        <!--
        <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' />
        -->
        */}
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
