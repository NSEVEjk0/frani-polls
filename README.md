# Frani Polls

On-network voting on Unicity testnet2. Create a poll with options; each voter
casts one signed ballot; the tally is recomputed from the ballot record, so it
cannot be altered after the fact.

Made by **CRYPTFRANI**. Owner / creator: **Itachi**.

---

## Track

Governance / Social.

## Is it Agentic?

No. Frani Polls records votes against a fixed one-ballot-per-address rule and
computes the tally. No autonomous behaviour, no model in the loop.

## Runs on AstridOS?

No.

## Live on-network

- Network: **testnet2**
- Each deployment holds its own wallet and prints its address at startup.

## SDK features used

| Feature | Where |
|---|---|
| Wallet identity | `src/wallet.js` (Sphere SDK) |
| Signed messages (concept) | ballots are address-scoped records |

## Commands

```bash
npm run new -- --question "Best chain?" --options "Unicity,Other"
npm run vote -- <pollId> 0 --by 0x…
npm run results -- <pollId>
npm run close -- <pollId>
```
