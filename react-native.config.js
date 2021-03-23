/**
 * React Native CLI configuration
 * https:​//github.com/react-native-community/cli/blob/master/docs/configuration.md
 
 */
 const fs = require('fs');
 const path = require('path');
  
 module.exports = {
   reactNativePath: fs.realpathSync(
     path.resolve(require.resolve('@youi/react-native-youi/package.json'), '..')
   )
 };
 