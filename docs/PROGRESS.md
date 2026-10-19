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
