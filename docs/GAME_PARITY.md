# Game parity and mentor review

Audit of BandCampNation website commit `c6dbfad`, performed October 19, 2026. Mentor review has **not** occurred; the items below are the proposed follow-up scope.

| Experience | Mobile MVP | Remaining parity / review decision |
| --- | --- | --- |
| Marching Band Trivia | Native, offline. Ten original questions, score, feedback, progression, results/replay. | Source timed bonus points, sound effect and its level-two gate are omitted. The web source supplies only these ten questions; no second level was invented. |
| Tic Tap Tone | Native, offline. Two players plus optional computer opponent, win/tie, reset/change mode. | Original SVG instrument drawings are represented by accessible emoji and text labels. |
| Name That Tune | Native, offline. All 40 original snippets and clue sets, ten shuffled rounds, four answers, three clues per game, play/pause/replay/progress/retry, score/results. | Web timed bonus scoring and category/tempo filtering are deferred. Score counts correct answers. |
| Name That College / College Fight Songs | Explicit browser handoff, internet required. | Source depends on YouTube iframe playback, logos, clue/timed-score flow. Mentor chooses a licensed native audio source or approves a web-based experience. No YouTube audio is extracted. |
| Marching Band Crossword | Explicit browser handoff, internet required. | Native grid, easy/medium puzzle parity, accessible cell/clue input and validation remain follow-up. |
| Coloring Book | Explicit browser handoff, internet required. | DOM/SVG fill interactions, template selection and export need a native adaptation. |
| Scavenger Hunt | Explicit browser handoff, internet required. | Source DOM zoom/hotspots need touch hit-testing, scaling and accessible item discovery. |
| Halftime Hustle | Not promoted in the mobile hub; commented out of the source site's game catalog. | Browser canvas/3D runner remains outside prioritized MVP. Mentor must confirm whether to revive it before a port. |

Demo radio, reading and the two priority native games first, then Name That Tune. Ask the mentor to decide the deferred experiences and scoring differences before promising full game parity. No mentor approval or remaining-game completion is implied by this audit.
