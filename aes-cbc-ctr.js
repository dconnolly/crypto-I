#!/usr/bin/env node

var stream = require('stream');
var crypto = require('crypto');

function xor(a, b) {
  if (!Buffer.isBuffer(a)) a = new Buffer(a);
  if (!Buffer.isBuffer(b)) b = new Buffer(b);
  var res = [];
  if (a.length > b.length) {
    for (var i = 0; i < b.length; i++) {
      res.push(a[i] ^ b[i]);
    }
  } else {
    for (var i = 0; i < a.length; i++) {
      res.push(a[i] ^ b[i]);
    }
  }
  return new Buffer(res);
}

var cbcIvDecrypt = function (key, ivCiphertext) {
  var key = new Buffer(key, 'hex');
  var iv = new Buffer(ivCiphertext.slice(0, 32), 'hex');
  var ciphertext = new Buffer(ivCiphertext.slice(32), 'hex');

  var plaintext = "";
  for (var i = 0, block = ciphertext.slice(0, 16); block.length > 0; i+=16, block = ciphertext.slice(i, i+16)) {
    var decrypt = crypto.createDecipheriv('aes128', key, new Buffer(Array(16)));
    decrypt.setAutoPadding(false);
    var out = decrypt.update(block, 'hex');
    var plainBlock = xor(iv, out);
    iv = block;
    plaintext += plainBlock.toString('ascii');
  }
  console.log("CBC OUT:", plaintext);
};

var ctrIvDecrypt = function (key, ivCiphertext) {
  var key = new Buffer(key, 'hex');
  var iv = new Buffer(ivCiphertext.slice(0, 32), 'hex');
  var ciphertext = new Buffer(ivCiphertext.slice(32), 'hex');

  var plaintext = "";
  for (var i = 0, block = ciphertext.slice(0, 16); block.length > 0; i+=16, block = ciphertext.slice(i, i+16)) {
    var decrypt = crypto.createDecipheriv('aes128', key, new Buffer(Array(16)));
    decrypt.setAutoPadding(false);
    var out = decrypt.update(iv, 'hex');
    console.log(out);
    var plainBlock = xor(block, out);
    console.log(plainBlock);
    iv[3] = iv[3] + 1;
    console.log(iv);
    plaintext += plainBlock.toString('ascii');
    console.log(plaintext);
  }

  console.log("CTR OUT:", plaintext);
};

cbcIvDecrypt(
  "140b41b22a29beb4061bda66b6747e14",
  "4ca00ff4c898d61e1edbf1800618fb2828a226d160dad07883d04e008a7897ee2e4b7465d5290d0c0e6c6822236e1daafb94ffe0c5da05d9476be028ad7c1d81"
);

cbcIvDecrypt(
  "140b41b22a29beb4061bda66b6747e14",
  "5b68629feb8606f9a6667670b75b38a5b4832d0f26e1ab7da33249de7d4afc48e713ac646ace36e872ad5fb8a512428a6e21364b0c374df45503473c5242a253"
);

ctrIvDecrypt(
  "36f18357be4dbd77f050515c73fcf9f2",
  "69dda8455c7dd4254bf353b773304eec0ec7702330098ce7f7520d1cbbb20fc388d1b0adb5054dbd7370849dbf0b88d393f252e764f1f5f7ad97ef79d59ce29f5f51eeca32eabedd9afa9329"
);

ctrIvDecrypt(
  "36f18357be4dbd77f050515c73fcf9f2",
  "770b80259ec33beb2561358a9f2dc617e46218c0a53cbeca695ae45faa8952aa0e311bde9d4e01726d3184c34451"
);
