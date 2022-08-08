export const HTTP = {
  statusCodes: {
    BadRequest: 400,
    Forbidden: 403,
    Ok: 200,
    InternalServerError: 500,
  },
  headerNames: {
    XDatadogTraceId: 'x-datadog-trace-id',
    XDatadogParentId: 'x-datadog-parent-id',
    XDatadogOrigin: 'x-datadog-origin',
    XDatadogSamplingPriority: 'x-datadog-sampling-priority',
    AccessControlAllowOrigin: 'access-control-allow-origin',
    AccessControlAllowHeaders: 'access-control-allow-headers',
    ContentType: 'Content-Type',
    XAmxDate: 'X-Amz-Date',
    Authorization: 'Authorization',
    XApiKey: 'X-Api-Key',
  },
  verbs: {
    Post: 'POST',
    Get: 'GET',
    Put: 'PUT',
    Options: 'OPTIONS',
    Patch: 'PATCH',
    Delete: 'DELETE',
  },
} as const;
