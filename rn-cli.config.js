const blacklist = require('metro-config/src/defaults/blacklist');

module.exports = {
  getBlacklistRE () {
    return blacklist([/\/youi\/build\/.*/])
  },
}

