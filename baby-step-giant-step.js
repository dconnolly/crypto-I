#!/usr/bin/env node

var e2e = require('./end-to-end.compiled.js').e2e;

var hexStringToByteArray = function hexStringToByteArray(str) {
  var byteArray = [];
  for (var i = str.length-2; i >= 0 ; i-=2) {
    var octet = str.substr(i, 2);
    byteArray.unshift(octet);
  }
  if (str.length % 2) {
    byteArray.unshift('0'.concat(str[0]));
  }
  return byteArray;
};

var p = "10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004b";
var g = "dfbb8f32839690000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
var h = "3dda3976e4cca7e168a1ee0165468e5b7bfd10e96fa76f9fbb9f3198567a8bb1cf2775dc4fb8c3610e104ec46485534d460d1645b15103e13c808e055b60706d";

var P = hexStringToByteArray(p),
    G = hexStringToByteArray(g),
    H = hexStringToByteArray(h);
