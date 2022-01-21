export const getOutputs = async () => {
  const outputs = await fetch('/app-config.json');
  return outputs.json();
};
