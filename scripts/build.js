const fs = require('fs');
const Config = require('cordova-config');
var config = new Config('config.xml');
console.log(config._root.attrib['ios-CFBundleVersion']);
config.setIOSBundleVersion(parseInt(config._root.attrib['ios-CFBundleVersion']) + 1);
config.write();
