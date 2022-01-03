
// Require next-aws-lambda layer
const compat = require("next-aws-lambda");
const page = require("./_error.js");
                
module.exports.render = async (event, context, callback) => {
  const responsePromise = compat(page)(event, context); // don't pass the callback parameter
  return responsePromise;
};
                