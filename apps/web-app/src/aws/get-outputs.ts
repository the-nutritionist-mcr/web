export const getOutputs = async () => {
  const outputs = await fetch("/backend-config.json");
  return outputs.json();
};
