'use strict';

module.exports = function xor(a, b) {
  a = new Buffer(a.length%2 ? '0'+a : a, 'hex');
  b = new Buffer(b.length%2 ? '0'+b : b, 'hex');
//  console.log('a: ', a, ', b: ', b);

  var length = a.length > b.length ? a.length : b.length;
  var aBuf = new Buffer(length).fill(0);
  var bBuf = new Buffer(length).fill(0);
  a.copy(aBuf, length-a.length);
  b.copy(bBuf, length-b.length);

//  console.log('xor a: ', aBuf);
//  console.log('xor b: ', bBuf);

  var res = [];
  for (var i = 0; i < length; i++) {
    res.push(aBuf[i] ^ bBuf[i]);
  }
//  console.log('xor result: ', res);

  return new Buffer(res);
};
