# Native QA

Evidence is dated October 19, 2026, not the original sprint dates. Screenshots in `docs/evidence` identify the observed runtime in PROGRESS.md. A bundle export is not a native launch, and an emulator/simulator is not a physical device.

## Repeatable checks

```sh
npm ci
npm run check
npx expo-doctor
npm run export:android
npm run export:ios
```

For full Android smoke testing, install the embedded-bundle ARM64 demo APK, select one device with `ANDROID_SERIAL` if necessary, and run:

```sh
ANDROID_HOME=/path/to/Android/sdk python3 scripts/android-smoke.py
```

The standard-library-only driver uses fresh native accessibility trees, avoids clipped controls and system gestures, captures screenshots/report in `artifacts/qa-android`, and restores Wi-Fi/data/font settings. It tests offline article/book reading, streaming play/pause/next, background pause, complete Trivia/replay, a full-board tie, offline bundled audio and 200% text navigation. It must run against a standalone embedded-bundle APK for offline acceptance.

The `Native mobile QA` GitHub workflow builds an unsigned **iOS simulator** Release app with embedded JavaScript/media and runs XCTest UI journeys for Home, article/book reading, live radio/background pause, Trivia, a Tic Tap Tone win and bundled Name That Tune. It retains screenshots, `.xcresult`, build logs and a simulator `.app` archive. No Apple signing account is needed for that simulator target. Pushes changing its workflow/test source start it; later app changes can be tested with manual workflow dispatch.

The Android Release APK passed all nine stages. The final hosted iOS run passed the complete native XCTest journey. Reports, run links and selected screenshots are linked in PROGRESS.md. The iOS simulator archive cannot install on a physical iPhone; physical-device and human accessibility acceptance remains open.

## Defects found during implementation

- Native Expo Router Link children required flattened styles; lint/export alone did not detect this runtime error.
- A background-only splash configuration generated references to a missing Android drawable. Supplying the brand image fixed native resource linking.
- Localhost Metro bound IPv6 only on this host; a LAN binding allowed the Android native debug APK to connect over IPv4.
- Expo Audio automatically resumed Android audio on foreground. The app now pauses on both app-state transitions and requires explicit playback.
- Debug-only Expo connection-warning overlays interfered with some UI taps. Final offline/full-game QA uses an embedded-bundle Release APK.
- Expo Doctor identified six SDK 57 patch mismatches; aligned them within SDK 57 rather than changing framework generation.
- Hosted Xcode rejected an unnamed generated UI-test product; the target now sets its product name explicitly.
- iOS grouped a mode button's icon/title/description into one accessibility label; the test now also locates grouped buttons by contained label text.
- Screenshot review found clipped condensed iOS display text and a tight brand line height. The app now uses the iOS system display font, adequate brand line height and headers that grow with text.

## Manual acceptance still required

Physical Android and iOS devices; VoiceOver/TalkBack reading and modal focus return; headset/call interruptions; lowest supported OS/device performance; final brand artwork/store metadata; mentor approval of GAME_PARITY.md; signing/account access and internal-install receipts. Public store approval is outside the sprint.
