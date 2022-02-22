export const HTTP = {
  statusCodes: {
    Forbidden: 403,
    Ok: 200,
    InternalServerError: 500,
  },
  headerNames: {
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

