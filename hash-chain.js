#!/usr/bin/env node

var fs = require('fs');
var stream = require('stream');
var crypto = require('crypto');

function computeH0(filename) {
  var blocks = [];
  var s = fs.createReadStream(filename);

  s.on('readable', function() {
    var chunk;
    while (null !== (chunk = s.read(1024))) {
      blocks.push(chunk);
    }
  });

  s.on('end', function() {
    var hash = crypto.createHash('sha256').update(blocks.pop()).digest();
    while (blocks.length > 0) {
      var currentBlock = blocks.pop();
      var shasum = crypto.createHash('sha256');
      shasum.update(Buffer.concat([currentBlock, hash]));
      hash = shasum.digest();
    }
    console.log(hash);
  });
}


console.log("testFile.mp4");
computeH0("testFile.mp4");

console.log("legitFile.mp4");
computeH0("legitFile.mp4");
