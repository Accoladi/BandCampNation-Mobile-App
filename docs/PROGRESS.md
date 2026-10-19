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

Performed October 19, 2026. Status: **implementation complete; iOS launch acceptance blocked**.

- Created the standalone Expo/TypeScript project using the reference lockfile and original BandCampNation logo. Proposed identifiers are `com.bandcampnation.mobile`; owner confirmation is needed before signing.
- `npm ci` passed. `npm run check` passed on isolated Node 24.21.0: lint, strict TypeScript and manifest/security checks.
- Android and iOS Hermes bundle exports passed. These are not signed binary builds.
- Created a temporary API 36 ARM64 Android emulator, installed Expo Go SDK 57, and launched the app through Metro on port 8082. Native UI text assertions passed; screenshot: [Android bootstrap](evidence/android-bootstrap.png).
- iOS launch remains blocked: full Xcode and `simctl` are absent. No iOS runtime claim is made.
- Setup commands and environment/credential boundaries are in SETUP.md. The installed Homebrew Node 24 has a missing simdjson dylib; verification used an isolated official Node 24 runtime rather than changing system software.
- Review/demo: `npm ci && npm start`, then open on Android with Expo Go. GitHub push evidence is the remote commit matching this task title.

## Build native navigation, Home, theme and accessibility

Performed October 19, 2026. Status: **implementation and Android navigation checks complete; assistive-technology acceptance pending**.

- Added branded native Home, shared header/menu, and Home/Radio/Articles/Books/Entertainment destinations using Expo Router.
- Adapted original BandCampNation hero/logo/copy and palette. Reused the reference shell and 48-point controls, scalable text, semantic labels/headings and modal isolation; made the menu scrollable for large text.
- Fixed a real native compatibility issue found during testing: Expo Router's Slot requires flattened styles on Link children. Primary navigation now uses flattened styles; brand styles are plain objects.
- `npm run check` passed (lint, TypeScript, manifest and route checks).
- API 36 ARM64 Expo Go UI-tree journey passed Radio, Articles, Books, Entertainment, return Home and menu open/close. Screenshots: [Home](evidence/android-home.png), [menu](evidence/android-navigation.png).
- Remaining destination bodies are deliberately implemented in their following tasks. Human VoiceOver/TalkBack and iOS checks remain open; see ACCESSIBILITY.md.

## Connect content services and migrate articles/books reader

Performed October 19, 2026. Status: **implementation and Android reader checks complete; iOS device acceptance pending**.

- Migrated all 15 original articles and both complete books: 64 native reading sections total, including 33 book sections. Bundled the original covers and decoded text; no server modules/credentials or HTML runtime enter Metro.
- Added searchable native libraries, article/chapter reading, book contents, previous/next sections, scalable/selectable text and missing-document/section handling. Navigating sections resets scroll position.
- Added a repeatable Node/Python build-time importer with a source revision, parser self-check and catalog checks. Text and covers work offline; inline web formatting simplifications are documented in CONTENT.md.
- `npm run check` passed. Parser, inventory and section-data tests passed.
- API 36 ARM64 Expo Go journey passed the 15-article catalog, article opening, book contents and a book section opened while emulator Wi-Fi/data were disabled. Networking was restored afterward.
- Screenshots: [native article](evidence/android-reader.png), [offline book](evidence/android-book-offline.png).
- Public radio API shape was verified separately: 81 published, unrestricted HTTPS-playable tracks returned; radio playback is the next task.

## Implement BandCamp Radio playback and track browsing

Performed October 19, 2026. Status: **implementation and Android streaming checks complete; iOS playback acceptance pending**.

- Connected the existing public `/api/radio/songs` service without AWS credentials or SDKs. Verified 81 published, unrestricted HTTPS tracks in the live response.
- Added boundary validation, duplicate/private/draft/unsafe-URL exclusion, sorting, local title/artist/tag search, incremental browsing and selected-track feedback.
- Implemented native Expo Audio play/pause, track selection, previous/next, replay after completion, ±15-second seek, native duration/progress, loading/buffering, connection timeout and retry states. Radio is explicitly online; reading remains bundled.
- `npm run check` passed (six checks including malformed payload, security boundaries, public endpoint behavior and HTTP failure).
- Actual API 36 ARM64 Expo Go playback passed play → pause → next → playing → pause. Native playback progress advanced (observed 0:25 / 2:44 on a streamed track). [Playback screenshot](evidence/android-radio-playing.png).
- The Android UI driver now avoids stale XML after UIAutomator idle failures. Playback status updates use a two-second interval to reduce screen re-renders; media playback itself remains native.
- Expo account check returned `Not logged in`. EAS cloud/signing/distribution remains blocked until account setup. App-background/navigation and interrupted-network recovery checks are covered in the recovery task.
