import { datadogRum } from '@datadog/browser-rum';
import { ReactNode, useContext, useEffect } from 'react';
import { AuthenticationServiceContext } from '@tnmw/components';
import { ConfigContext } from './config-provider';

interface DatadogProviderProps {
  children: ReactNode;
}

const datadogAppId = process.env['NX_DATADOG_APP_ID'];
const datadogClientToken = process.env['NX_DATADOG_CLIENT_TOKEN'];

export const DatadogProvider = (props: DatadogProviderProps) => {
  const { user } = useContext(AuthenticationServiceContext);
  const { config } = useContext(ConfigContext);
  useEffect(() => {
    if (datadogAppId && config) {
      const { ApiDomainName: domainName } = config;
      datadogRum.init({
        applicationId: datadogAppId,
        clientToken: datadogClientToken ?? '',
        site: 'datadoghq.eu',
        service: 'tnm-web',
        env: process.env['NX_APP_ENV'],
        version: process.env['APP_VERSION'],
        sampleRate: 100,
        allowedTracingOrigins: [`https://${domainName}`],
        premiumSampleRate: 100,
        trackInteractions: true,
        trackFrustrations: true,
        defaultPrivacyLevel: 'mask-user-input',
      });

      if (user) {
        const {
          signInUserSession: {
            idToken: {
              payload: {
                given_name,
                family_name,
                email,
                'cognito:username': username,
              },
            },
          },
        } = user;
        datadogRum.setUser({
          id: username,
          email: email,
          name: `${given_name} ${family_name}`,
        });
      }

      datadogRum.startSessionReplayRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);
  return <>{props.children}</>;
};
