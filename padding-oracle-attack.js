#!/usr/bin/env node

var request = require('sync-request');
var xor = require('./xor');

var target = "http://crypto-class.appspot.com/po?er=";
// AES-CBC w/ random IV
var victimCiphertext = "f20bdba6ff29eed7b046d1df9fb7000058b1ffb4210a580f748b4ac714c001bd4a61044426fb515dad3f21f18aa577c0bdf302936266926ff37dbf7035d5eeb4";
var ciphertextBlocks = victimCiphertext.match(/.{1,32}/g); // First one is the IV.
var plaintextBlocks = Array(4).fill('');

console.log(ciphertextBlocks);

var octet = function (decimal) {
  var hex = Number(decimal).toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

var blockSize = 16; // octets


var attackBlock = function attackBlock(block) {
  for (var padding = 1; padding < blockSize; padding++) {
    for (var guess = 0; guess < 256; guess++) {
      var primedBytes;

      if (padding === 0) {
        primedBytes = octet(0).repeat(blockSize-1).concat(octet(guess));
      } else {
        var maskHex = octet(0).repeat(blockSize-padding);
        var guessHex = maskHex + octet(guess) + plaintextBlocks[block+1];
        console.log('guess:   ', guessHex);
        var paddingHex = maskHex + octet(padding).repeat(padding);
        console.log('padding: ', paddingHex);
        primedBytes = xor(guessHex, paddingHex);
      }

      var attackBlock = xor(ciphertextBlocks[block], primedBytes);
      var test = attackBlock.toString('hex') + ciphertextBlocks[block+1];

      if (test.length === 64) {

        console.log('attack cipherblocks:   ', test);
        console.log('original cipherblocks: ', ciphertextBlocks[block] + ciphertextBlocks[block+1]);

        var res = request('GET', target.concat(test));

        if (res.statusCode === 404) {
          console.log('404: URL NOT FOUND; valid pad, malformed message');
          console.log('padding: 0d' + padding);
          console.log('guess:   0d' + guess);
          plaintextBlocks[block+1] = octet(guess) + plaintextBlocks[block+1];
          console.log('0x' + plaintextBlocks[block+1]);
          plaintextBlocks.forEach(function(plainBlock) {
            console.log('"' + new Buffer(plainBlock, 'hex').toString('ascii') + '"');
          });
          break;
        }
      }
    }
  }
};

for (var block = 0; block < ciphertextBlocks.length - 1; block++) {
  attackBlock(block);
}
