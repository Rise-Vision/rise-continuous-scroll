var context = require.context('.', true, /.+\.jsx?$/);
context.keys().forEach(context);
module.exports = context;
