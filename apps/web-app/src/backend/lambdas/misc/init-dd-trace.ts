import tracer from 'dd-trace';
if (process.env['DD_TRACE_ENABLED']) {
  tracer.init();
}
