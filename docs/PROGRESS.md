# Acceptance evidence

## Audit BetweenBands mobile app and map BandCampNation MVP

Performed October 19, 2026. Status: **complete**.

- Audited the existing Expo reference and the actual BandCampNation Next.js source.
- Verified source/destination repositories, public radio API response, reusable content/game structure and credential boundary.
- Recorded the sequential task plan and native/signing gates in AUDIT.md and SPRINT_PLAN.md.
- Demo/review: read AUDIT.md against the listed source files. No application code or credentials were copied in this task.
- Existing commit history uses plain task descriptions (for example `Add native trivia and crossword games`); new commit messages follow the user's exact task titles without date/day prefixes.
- GitHub push evidence is the remote commit matching this task title.

## Bootstrap BandCampNation Expo app and test Android/iOS launch

Performed October 19, 2026. Status: **native Android/iOS launches verified; physical-device acceptance pending**.

- Created the standalone Expo/TypeScript project using the reference lockfile and original BandCampNation logo. Proposed identifiers are `com.bandcampnation.mobile`; owner confirmation is needed before signing.
- `npm ci` passed. `npm run check` passed on isolated Node 24.21.0: lint, strict TypeScript and manifest/security checks.
- Android and iOS Hermes bundle exports passed. These are not signed binary builds.
- Created a temporary API 36 ARM64 Android emulator, installed Expo Go SDK 57, and launched the app through Metro on port 8082. Native UI text assertions passed; screenshot: [Android bootstrap](evidence/android-bootstrap.png).
- Local iOS launch was initially blocked because full Xcode and `simctl` are absent. Hosted native iOS launch was subsequently verified in the final QA task below.
- Setup commands and environment/credential boundaries are in SETUP.md. The installed Homebrew Node 24 has a missing simdjson dylib; verification used an isolated official Node 24 runtime rather than changing system software.
- Review/demo: `npm ci && npm start`, then open on Android with Expo Go. GitHub push evidence is the remote commit matching this task title.

## Build native navigation, Home, theme and accessibility

Performed October 19, 2026. Status: **native Android/iOS navigation verified; assistive-technology acceptance pending**.

- Added branded native Home, shared header/menu, and Home/Radio/Articles/Books/Entertainment destinations using Expo Router.
- Adapted original BandCampNation hero/logo/copy and palette. Reused the reference shell and 48-point controls, scalable text, semantic labels/headings and modal isolation; made the menu scrollable for large text.
- Fixed a real native compatibility issue found during testing: Expo Router's Slot requires flattened styles on Link children. Primary navigation now uses flattened styles; brand styles are plain objects.
- `npm run check` passed (lint, TypeScript, manifest and route checks).
- API 36 ARM64 Expo Go UI-tree journey passed Radio, Articles, Books, Entertainment, return Home and menu open/close. Screenshots: [Home](evidence/android-home.png), [menu](evidence/android-navigation.png).
- Destination bodies were completed in the following tasks. Native iOS navigation was subsequently verified in final QA; human VoiceOver/TalkBack checks remain open (ACCESSIBILITY.md).

## Connect content services and migrate articles/books reader

Performed October 19, 2026. Status: **native Android/iOS reader checks passed; physical-device acceptance pending**.

- Migrated all 15 original articles and both complete books: 64 native reading sections total, including 33 book sections. Bundled the original covers and decoded text; no server modules/credentials or HTML runtime enter Metro.
- Added searchable native libraries, article/chapter reading, book contents, previous/next sections, scalable/selectable text and missing-document/section handling. Navigating sections resets scroll position.
- Added a repeatable Node/Python build-time importer with a source revision, parser self-check and catalog checks. Text and covers work offline; inline web formatting simplifications are documented in CONTENT.md.
- `npm run check` passed. Parser, inventory and section-data tests passed.
- API 36 ARM64 Expo Go journey passed the 15-article catalog, article opening, book contents and a book section opened while emulator Wi-Fi/data were disabled. Networking was restored afterward.
- Screenshots: [native article](evidence/android-reader.png), [offline book](evidence/android-book-offline.png).
- Public radio API shape was verified separately: 81 published, unrestricted HTTPS-playable tracks returned; radio playback is the next task.

## Implement BandCamp Radio playback and track browsing

Performed October 19, 2026. Status: **native Android/iOS playback checks passed; physical-device acceptance pending**.

- Connected the existing public `/api/radio/songs` service without AWS credentials or SDKs. Verified 81 published, unrestricted HTTPS tracks in the live response.
- Added boundary validation, duplicate/private/draft/unsafe-URL exclusion, sorting, local title/artist/tag search, incremental browsing and selected-track feedback.
- Implemented native Expo Audio play/pause, track selection, previous/next, replay after completion, ±15-second seek, native duration/progress, loading/buffering, connection timeout and retry states. Radio is explicitly online; reading remains bundled.
- `npm run check` passed (six checks including malformed payload, security boundaries, public endpoint behavior and HTTP failure).
- Actual API 36 ARM64 Expo Go playback passed play → pause → next → playing → pause. Native playback progress advanced (observed 0:25 / 2:44 on a streamed track). [Playback screenshot](evidence/android-radio-playing.png).
- The Android UI driver now avoids stale XML after UIAutomator idle failures. Playback status updates use a two-second interval to reduce screen re-renders; media playback itself remains native.
- Expo account check returned `Not logged in`. EAS cloud/signing/distribution remains blocked until account setup. App-background/navigation and interrupted-network recovery checks are covered in the recovery task.

## Build entertainment hub and migrate Trivia/Tic-Tac-Toe

Performed October 19, 2026. Status: **native Android/iOS game checks passed; physical-device acceptance pending**.

- Added native entertainment cards with original BandCampNation artwork and two offline playable games.
- Reused the BetweenBands native Trivia screen and ten source-matched questions with scoring, answer feedback, next/results and replay. Reused native Tic Tap Tone with single/two-player modes, win/tie, reset and computer win/block moves.
- Other game/activity buttons explicitly open the BandCampNation website and require internet; URL opening has an error state. No remaining web experience is represented as native parity.
- `npm run check` passed (eight checks, including every Tic-Tac-Toe winning line, tie, computer win/block/center and trivia answer data).
- Actual API 36 ARM64 Expo Go checks passed Trivia correct-answer feedback/score/progression, a two-player Trombone win/reset, and a single-player Drummer center response.
- Screenshots: [Trivia](evidence/android-trivia.png), [Tic Tap Tone win](evidence/android-tic-win.png).
- Generated an ignored native Android project and started local debug compilation to prepare app-identity QA. Generated native folders and signing material are not committed.

## Adapt audio games and audit remaining mobile game parity

Performed October 19, 2026. Status: **native Android/iOS audio-game checks passed; mentor parity review and physical-device acceptance pending**.

- Added native Name That Tune using all 40 original BandCampNation ten-second snippets and three-clue sets, bundled for offline use.
- Reused tested shuffle/unique-round/choice generation and the reference native audio screen. Added three clues per game, listen-before-answer, score/results/replay, loading/error/retry and native progress/play/pause.
- Entertainment now links to the native audio game. Name That College and remaining DOM/canvas games retain explicit online browser handoffs.
- `npm run check` passed (nine checks including real clip existence, clues, unique rounds and four valid options).
- Actual API 36 ARM64 Expo Go test passed bundled audio playback → clue → answer reveal → next round. [Audio game evidence](evidence/android-name-that-tune.png).
- GAME_PARITY.md records every source experience, remaining timed scoring/visual differences and the proposed follow-up decisions. Mentor review has not occurred; no full game-parity claim is made.

## Add network recovery, lifecycle handling and app polish

Performed October 19, 2026. Status: **Android recovery and Android/iOS background-pause checks passed; physical interruption checks pending**.

- Added shared audio lifecycle handling, exclusive focus/no recording, explicit pause on screen blur and both background/foreground transitions. Native testing exposed Expo Audio's automatic foreground resume; pausing again on foreground fixes it.
- Added active/focused radio completion advancement, native-position seeking, catalog refresh retaining prior data on error, uncached public fetches, artwork retry/fallback, clip exception handling, unknown-route recovery and a root retry boundary.
- Fixed the native splash plugin's missing drawable by explicitly configuring the original image. The Android debug APK compiled successfully with JDK 21/SDK 36 and installed under `com.bandcampnation.mobile`.
- Debug launch exposed a local IPv6-only Metro binding; LAN binding resolved it. The installed APK then cold-launched in 3.1 seconds. RECOVERY.md records the repeatable connection fix.
- `npm run check` passed; current iOS and Android Hermes exports passed.
- Standalone API 36 ARM64 APK checks passed background → foreground → paused, forced Wi-Fi/data loss → radio error, network restoration → retry → playback → pause. Native audio-state inspection after navigating to Articles showed the app's players paused.
- Evidence: [background paused](evidence/android-background-paused.png), [offline radio](evidence/android-radio-offline.png), [restored playback](evidence/android-radio-recovered.png).
- Physical headset/call interruptions and human screen-reader testing remain open. Local full Xcode remains unavailable; hosted iOS simulator QA subsequently passed in the following task.

## Run Android/iOS device QA and fix MVP defects

Performed October 19, 2026. Status: **native Android Release and iOS simulator QA passed; physical-device and human accessibility checks pending**.

- Added a repeatable native Android driver and hosted iOS Release-build/XCTest workflow with screenshot/result/demo artifacts. Local Python/Ruby/Swift syntax and workflow YAML checks passed.
- Built and installed the standalone ARM64 Android Release APK with embedded JavaScript, all reading content and 40 MP3 clips. All nine native smoke stages passed: Home, offline article/book, live radio, background pause, complete 10/10 Trivia/replay, Tic Tap Tone tie, offline audio game and 200% text navigation. [Machine-readable result](evidence/android-release-report.json), [radio](evidence/android-release-radio.png), [offline audio](evidence/android-release-audio.png), [large text](evidence/android-release-large-text.png).
- Release permission inspection found no microphone, storage or overlay permission. The demo is debug-key signed, not an internal/store signing artifact. APK SHA-256: `33ea4057e7dc9567365e73662b4e6b0ea340c7eccf057bf30f3eeb0b17eef683` (84,428,076 bytes).
- Applied Expo Doctor's six recommended SDK 57 patch updates. `npm run check` passed afterward. Compatible lockfile security updates removed the reported critical advisory; remaining upstream entries are documented in DEPENDENCY_REVIEW.md.
- Current Android/iOS exports passed a server SDK/credential-marker check. No website/server source was changed.
- Expo Doctor passed 21/21. Hosted checks passed clean install, lint, TypeScript, all nine tests and both exports.
- The [final native iOS run](https://github.com/Accoladi/BandCampNation-Mobile-App/actions/runs/39299528440) passed the complete XCTest journey: Home/navigation, native article/book, live radio/background pause/next/pause, Trivia progression, Tic Tap Tone win and bundled Name That Tune playback/clue. The iPhone 17 Pro simulator app uses the iOS 26.5 SDK with a 16.4 minimum deployment target; it is not an iPhone-device signing artifact.
- Native QA fixed the generated test product name, grouped iOS button-label lookup, clipped iOS typography and fixed-height headers. The final build uses iOS system display text and headers that can grow with larger text. Evidence: [run report](evidence/ios-release-report.json), [Home](evidence/ios-home.png), [reader](evidence/ios-reader.png), [radio](evidence/ios-radio.png), [Tic Tap Tone win](evidence/ios-tic-win.png), [audio game](evidence/ios-audio-game.png). Physical-device and assistive-technology acceptance remains open.

## Produce test builds and complete intern release handoff

Performed October 19, 2026. Status: **Android/iOS simulator demos and handoff ready; signed internal distribution blocked by account access**.

- Produced the installable Android ARM64 demo APK and retained its successful Gradle build log, SHA-256 receipt and native smoke report locally under `artifacts/`. The binary includes JavaScript, all reading content and 40 audio clips and launches without Metro. It uses a generated debug signing key.
- Produced the unsigned iOS simulator demo archive with embedded JavaScript and all 40 audio clips. The successful hosted run retains the app, screenshots and XCTest result bundle; local copies are under `artifacts/`. It cannot install on a physical iPhone.
- Added standard Expo native Debug/Release commands and minimal EAS preview/device and simulator profiles, validated against the pinned EAS 24.10.0 schema. No custom release tooling, production submission workflow or invented account/project identifiers.
- Final clean `npm ci`, lint, strict TypeScript and all nine tests passed; Expo Doctor passed 21/21. Both platform exports also passed in hosted checks.
- HANDOFF.md covers setup, local builds, demo installation, cloud/test builds, mentor review, physical-device/accessibility checks, signing ownership, dependency review and rollback. SETUP.md and README link to the runnable workflow.
- Expo reports `Not logged in`; developer-account/project ownership, Apple signing/provisioning and Play access remain unverified. No signed internal distribution, physical iPhone install or public-store approval is claimed.
