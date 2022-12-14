import { HTTP } from '@tnmw/constants';

export const allowHeaders = [
  HTTP.headerNames.XDatadogOrigin,
  HTTP.headerNames.XDatadogTraceId,
  HTTP.headerNames.XDatadogParentId,
  HTTP.headerNames.XDatadogSamplingPriority,
  HTTP.headerNames.ContentType,
  HTTP.headerNames.XAmxDate,
  HTTP.headerNames.Authorization,
  HTTP.headerNames.XApiKey,
];
