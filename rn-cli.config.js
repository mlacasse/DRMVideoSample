/* eslint-disable import/no-commonjs */
/* eslint-disable import/no-extraneous-dependencies */
const blacklist = require('metro-config/src/defaults/blacklist')

module.exports = {
  resolver: {
    blacklistRE: blacklist([/youi\/build\/.*/]),
  },
};
