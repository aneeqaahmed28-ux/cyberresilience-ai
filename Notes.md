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
