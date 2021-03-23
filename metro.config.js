/**
 * Metro bundler configuration
 * https:​//facebook.github.io/metro/docs/configuration/
 
 */
 const blacklist = require('metro-config/src/defaults/blacklist');
 const path = require('path');
 const fs = require('fs');
  
 const reactNativeYouiPath = fs.realpathSync(
   path.resolve(require.resolve('@youi/react-native-youi/package.json'), '..')
 );
  
 module.exports = {
   resolver: {
     platforms: ['youi'],
     blacklistRE: blacklist([
       /\/youi\/build\/.*/,
       /node_modules\/react-native\/.*/
     ]),
     extraNodeModules: {
       // Redirect react-native to react-native-youi
       'react-native': reactNativeYouiPath,
       '@youi/react-native-youi': reactNativeYouiPath
     }
   },
   transformer: {
     getTransformOptions: async () => ({
       transform: {
         experimentalImportSupport: false,
         inlineRequires: false
       }
     })
   }
 };
 