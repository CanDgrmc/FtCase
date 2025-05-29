'use strict';

const socketClient = require('..');
const assert = require('assert').strict;

assert.strictEqual(socketClient(), 'Hello from socketClient');
console.info('socketClient tests passed');
