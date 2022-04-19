module.exports = {
  entry: `${__dirname}/src/scripts/main.js`,
  output: {
    path: `${__dirname}/dist/scripts/`,
    filename: 'bundle.js'
  },
  cache: true
};

