const assert=require('node:assert/strict'),c=require('./clearance.js');
assert.equal(c(120,126,0,0,0,460).remaining,6);
assert.ok(Math.abs(c(120.5,124,.2,.2,.5,460).remaining-.534)<.01);
assert.ok(c(120.5,124,1,1,.5,460).remaining<0);
assert.equal(c(120,126,0,0,0,450).vertical,-10);
assert.equal(c(120,126,0,-1,0,460),null);
console.log('5/5 test clearance OK');
