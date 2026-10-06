# Project notes (for Devpost, not final)

## Setup
- Platform: Nebius Token Factory (OpenAI-compatible API)
- Model: nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B
- Other Nemotron models seen in catalog, not yet tested: Ultra-550B, 3.5-Lightning, Nano-Omni
- Pricing seen: $0.06 / 1M input, $0.24 / 1M output tokens

## Findings so far
- First test call returned empty content: it is a reasoning model and max_tokens=300 was used up on thinking. Fixed by raising max_tokens to 6000.
- Thinking on vs off (simple question): 1.4s / 73 tokens vs 0.9s / 31 tokens. Both gave good answers. Not yet compared on the full assessment.
- Full assessment: ~484 input + ~2,014 output tokens (about $0.0005 per run).
- Problem: when the model chose the risk level itself, it was inconsistent (High for a mostly strong organisation, weak answers listed as strengths).
- Fix: risk score now computed in code from answer positions; the model only explains. Tests after the change: mostly-good = Low (2/24), mostly-weak = Critical (16/24).
- Minor drift: model sometimes adds details not in the answers (e.g. "patient care", "data loss").
- Intermittent "Failed to fetch": likely the dev server restarting mid-request (node --watch).

## Limits to mention
- All 8 questions weighted equally; thresholds (5/10/16) are my own first guess.
- Only tested on fictional organisations.
- Not a security audit.

## Still to do
- Test 2-3 more organisations, and thinking on vs off on the full assessment
- Redeem the $25 hackathon credit (form on the Devpost Resources tab) + Builders Program
- Deploy, README, demo video, Devpost form, feedback section

## October 6 -  Results so far (model: nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B on Nebius Token Factory)

| Test | Thinking | Level | Score | Seconds | Completion tokens |
|---|---|---|---|---|---|
| Charity | on | Medium | 8/24 | 5.7 | 1119 |
| Start-up | on | High | 12/24 | 7.9 | 1739 |
| School (all best) | on | Low | 0/24 | 2.2 | 551 |
| Start-up | off | High | 12/24 | 3.5 | 720 |

- Risk levels matched the expected scores in every run.
- Thinking off: about 55% faster and about 59% fewer output tokens on identical answers (one run each, so treat as indicative).
- Total cost of all testing so far: under $0.01 (Billing > Usage).
- Quality comparison thinking on vs off: [fill in]
- Larger model (Ultra) comparison: [fill in if tested]

## Problems found and how I fixed them
1. Empty answer on first call: reasoning model used all 300 max_tokens on thinking. Fixed by raising max_tokens.
2. Model-chosen risk level was inconsistent (High for a mostly strong organisation; weak answers listed as strengths). Fixed by computing the score in code and letting the model only explain it.
3. Intermittent "Failed to fetch": the dev server restarted mid-request (node --watch). Use npm start while testing.
4. Cost protection before going public: rate limit, daily cap, CORS allow-list, input validation.

## Known limitations
- All 8 questions are weighted equally; thresholds (5 / 10 / 16) are my own first guess.
- The model sometimes adds details not in the answers (e.g. "patient care", "data loss").
- Tested only on fictional organisations. Not a security audit or compliance check.

## Feedback for Nebius (required by the hackathon)
- Credit redemption was unclear: the form says a promo code is emailed, and it was not obvious where to redeem it.
- Billing: a card is required to activate the account, and there is no warning when free credits run out.
- The model catalog and price list use different capitalisation for the same model.
- Reasoning output appears in a separate field, and the empty-content failure was not obvious at first.

## Still to do
- Quality comparison, deployment, README, demo video, Devpost form, feedback section
