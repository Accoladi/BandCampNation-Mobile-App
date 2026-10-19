# ACC-294 ten-task delivery plan

Original schedule: October 5–18, 2026; implementation October 5–9 and 12–16. Work is being performed from October 19; never backdate acceptance evidence.

Complete tasks in order. Use the exact task title below as the commit message, without date/day prefixes. Give the owner a heads-up before each push to `Accoladi/BandCampNation-Mobile-App`. Each task records implemented scope, runnable checks, demo instructions and unresolved acceptance gates in PROGRESS.md. A blocked native/account check remains open even if independent implementation can continue.

| Planned date | Task / commit title | Acceptance evidence |
| --- | --- | --- |
| Oct 5 | Audit BetweenBands mobile app and map BandCampNation MVP | Source revisions, reuse/API/security map, priority games and blockers. |
| Oct 6 | Bootstrap BandCampNation Expo app and test Android/iOS launch | Lockfile install, Expo config, Android/iOS bundles; actual native launches or explicit blockers. |
| Oct 7 | Build native navigation, Home, theme and accessibility | Branded Home, all destinations, safe areas, labels, scalable text, touch targets. |
| Oct 8 | Connect content services and migrate articles/books reader | Original article/book inventory, native contents/sections, missing-content states, offline reading. |
| Oct 9 | Implement BandCamp Radio playback and track browsing | Real public API, published/unrestricted filtering, play/pause, selection, seek, next/previous, retry. |
| Oct 12 | Build entertainment hub and migrate Trivia/Tic-Tac-Toe | Two playable native games with tested win/tie/scoring/restart; hub destinations. |
| Oct 13 | Adapt audio games and audit remaining mobile game parity | Native audio game; remaining game-by-game gaps and mentor review queue. |
| Oct 14 | Add network recovery, lifecycle handling and app polish | Retry/timeouts, offline copy, audio focus/background/navigation, image fallbacks. |
| Oct 15 | Run Android/iOS device QA and fix MVP defects | Automated journeys and actual native evidence where available; unresolved device/accessibility gates. |
| Oct 16 | Produce test builds and complete intern release handoff | Repeatable dev/test build commands, build results, setup, release responsibilities, signing blockers. |

Definition of done requires an Android and iOS demo, loading/error/offline handling, device smoke-test evidence, repeatable development/test builds and handoff. Internal distribution depends on developer accounts/signing. Public store approval is excluded. Tasks with unverified required acceptance criteria cannot be reported as fully complete.
