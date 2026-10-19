// Frani Polls — unit tests (plain node).
import assert from 'node:assert/strict';
import { createPoll, vote, closePoll, tally } from '../src/polls.js';

const A = '0x000000000000000000000000000000000000000a';
const B = '0x000000000000000000000000000000000000000b';
const C = '0x000000000000000000000000000000000000000c';

const poll = createPoll({ question: 'Best chain?', options: ['Unicity', 'Other'], createdBy: A });

// create
assert.equal(poll.options.length, 2);
assert.equal(poll.open, true);

// vote
vote(poll, A, 0);
vote(poll, B, 1);
vote(poll, C, 0);
assert.deepEqual(tally(poll), [2, 1]);

// double vote rejected
assert.throws(() => vote(poll, A, 1), /already voted/);

// invalid option rejected
assert.throws(() => vote(poll, '0xdead', 5), /invalid option/);

// close stops voting
closePoll(poll);
assert.equal(poll.open, false);
assert.throws(() => vote(poll, '0xdead', 0), /closed/);

console.log('polls.test.js — all passed');
