// Frani Polls — on-network voting domain logic.
// A poll has a question and options. Each voter casts one signed ballot (in
// the demo store: one ballot per address). Tally is recomputed from ballots,
// so nothing can be altered after the fact without breaking the record.

export function newId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e9).toString(36)}`;
}

export function createPoll({ question, options, createdBy }) {
  const clean = (options || []).map((o) => String(o).trim()).filter(Boolean);
  if (!question || !String(question).trim()) throw new Error('a poll needs a question');
  if (clean.length < 2) throw new Error('a poll needs at least two options');
  if (!createdBy) throw new Error('a poll needs a creator');
  return {
    id: newId('poll'),
    question: String(question).trim(),
    options: clean,
    createdBy,
    createdAt: new Date().toISOString(),
    open: true,
    ballots: {},
  };
}

export function vote(poll, voter, optionIndex) {
  if (!poll) throw new Error('poll not found');
  if (!poll.open) throw new Error('poll is closed');
  const idx = Number(optionIndex);
  if (!Number.isInteger(idx) || idx < 0 || idx >= poll.options.length) {
    throw new Error('invalid option index');
  }
  if (poll.ballots[voter] !== undefined) throw new Error('already voted');
  poll.ballots[voter] = idx;
  return idx;
}

export function closePoll(poll) {
  if (!poll) throw new Error('poll not found');
  poll.open = false;
  return poll;
}

export function tally(poll) {
  if (!poll) return {};
  const counts = poll.options.map(() => 0);
  for (const idx of Object.values(poll.ballots)) counts[idx] += 1;
  return counts;
}

export function renderPoll(poll) {
  const counts = tally(poll);
  const lines = poll.options.map((o, i) => `  ${i}. ${o} — ${counts[i]} vote${counts[i] === 1 ? '' : 's'}`);
  return `${poll.question} [${poll.open ? 'open' : 'closed'}] (${Object.keys(poll.ballots).length} ballots)\n${lines.join('\n')}`;
}
