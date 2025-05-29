'use strict';

const socketServer = require('..');
const assert = require('assert').strict;

assert.strictEqual(socketServer(), 'Hello from socketServer');
console.info('socketServer tests passed');
