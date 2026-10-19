#!/usr/bin/env node
// Frani Polls — CLI + daemon entrypoint.
// Made by CRYPTFRANI. Owner / creator: Itachi. Unicity testnet2 only.

import process from 'node:process';
import { config } from '../src/config.js';
import { Store } from '../src/store.js';
import { createPoll, vote, closePoll, tally, renderPoll } from '../src/polls.js';

export const HELP = `Frani Polls — on-network voting on Unicity testnet2

Usage:
  frani-polls new --question "Which?" --options "A,B,C" [--by <address>]
  frani-polls vote <pollId> <optionIndex> --by <address>
  frani-polls results <pollId>
  frani-polls close <pollId>
  frani-polls list
  frani-polls about
  frani-polls help
`;

export const aboutText = `Frani Polls — signed ballots, tamper-proof tally on Unicity testnet2.
Made by CRYPTFRANI. Owner / creator: Itachi.
`;

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) out[a.slice(2, eq)] = a.slice(eq + 1);
      else if (argv[i + 1] && !argv[i + 1].startsWith('--')) out[a.slice(2)] = argv[++i];
      else out[a.slice(2)] = true;
    } else out._.push(a);
  }
  return out;
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const args = parseArgs(rest);
  const store = new Store(config.dataDir);

  switch (cmd) {
    case 'new': {
      const poll = createPoll({
        question: args.question,
        options: (args.options || '').split(','),
        createdBy: args.by || 'anon',
      });
      await store.save(poll);
      console.log(`Created poll ${poll.id}`);
      console.log(renderPoll(poll));
      break;
    }
    case 'vote': {
      const poll = await store.get(rest[0]);
      vote(poll, args.by || 'anon', rest[1]);
      await store.save(poll);
      console.log(`Recorded vote by ${args.by || 'anon'} on ${poll.id}`);
      break;
    }
    case 'results': {
      const poll = await store.get(rest[0]);
      console.log(renderPoll(poll));
      break;
    }
    case 'close': {
      const poll = await store.get(rest[0]);
      closePoll(poll);
      await store.save(poll);
      console.log(`Closed ${poll.id}`);
      console.log(renderPoll(poll));
      break;
    }
    case 'list': {
      const polls = await store.list();
      if (polls.length === 0) console.log('No polls yet.');
      for (const p of polls) console.log(`${p.id}  ${p.question} [${p.open ? 'open' : 'closed'}]`);
      break;
    }
    case 'about':
      console.log(aboutText);
      break;
    case 'help':
    case undefined:
      console.log(HELP);
      break;
    default:
      console.error(`Unknown command: ${cmd}`);
      console.log(HELP);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
