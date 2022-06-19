module.exports = {
  '*.{ts,tsx,js,jsx,md,html,css,scss,json,yaml,yml}': (filenames) =>
    `yarn nx format:write --files=${filenames.join(',')}`,
};
