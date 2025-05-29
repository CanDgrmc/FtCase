'use strict';

const pubsub = require('..');
const assert = require('assert').strict;

assert.strictEqual(pubsub(), 'Hello from pubsub');
console.info('pubsub tests passed');
