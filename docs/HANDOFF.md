# Intern build and release handoff

## Delivered scope

BandCampNation Home/navigation, all 15 articles, both complete books, live BandCamp Radio with browsing/playback/recovery, native Trivia/Tic Tap Tone and offline Name That Tune. GAME_PARITY.md is the mentor's review list. PROGRESS.md and QA.md distinguish actual native results from pending acceptance gates.

All work lives in `Accoladi/BandCampNation-Mobile-App`, branch `codex/acc-294-mobile-mvp`. The BetweenBands repos and BandCampNation website source are unchanged. Commit messages use the supplied task names without date/day prefixes.

## Run and test

Use Node.js 24. The verified local native build used JDK 21, Android SDK 36, Gradle 9.3.1 and an API 36 ARM64 emulator. Full Xcode/CocoaPods and an available simulator are needed for local iOS builds.

```sh
npm ci
npm run check
npx expo-doctor
npm start
```

Expo Go is the quick QR-code demo. `npm run android` / `npm run ios` creates and runs native Debug builds with the platform toolchain. For a standalone build with embedded content:

```sh
npm run build:android:demo
npm run build:ios:demo
```

The iOS demo command builds a generic simulator app into `artifacts/ios-simulator`; it requires full Xcode and does not install on a physical iPhone. Native folders are generated and ignored. If changing app.json after generation, rerun `npx expo prebuild --platform android` or `--platform ios` before rebuilding.

The verified Android Release build can also be reproduced directly:

```sh
npx expo prebuild --platform android --no-install
NODE_ENV=production ./android/gradlew -p android :app:assembleRelease --max-workers=2 -PreactNativeArchitectures=arm64-v8a
```

The local ARM64 APK is `artifacts/BandCampNation-Android-Demo.apk`; the generated source output is `android/app/build/outputs/apk/release/app-release.apk`. It embeds JavaScript, reading covers/text and 40 MP3 snippets, so it can launch and use bundled content without Metro. Radio still requires internet. The local demo uses the generated **debug signing key**; it is not a store-signing artifact. Do not commit keystores, native folders, credentials or binary builds.

Install and rerun the native Android acceptance journey:

```sh
adb install -r artifacts/BandCampNation-Android-Demo.apk
ANDROID_HOME=/path/to/Android/sdk python3 scripts/android-smoke.py
```

The local `artifacts/Android-Demo-Receipt.json` records the APK hash, source revision, toolchain and nine passed native smoke stages. `artifacts/Android-build.log` preserves the successful native build output. Selected screenshots and the smoke report are checked into `docs/evidence`; binary builds stay outside Git.

The hosted `Native mobile QA` workflow builds a Release iOS simulator app, runs XCTest journeys, and retains the simulator archive/screenshots/results for 14 days. Download the successful run's `ios-simulator-demo-and-qa` artifact. A simulator `.app` cannot install on a physical iPhone. See the actual run status in PROGRESS.md; queued/failed runs are not build evidence.

On a Mac with full Xcode and a booted iOS simulator, install the downloaded demo:

```sh
unzip artifacts/BandCampNation-iOS-Simulator.zip -d artifacts/ios-demo
xcrun simctl install booted artifacts/ios-demo/BandCampNation.app
xcrun simctl launch booted com.bandcampnation.mobile
```

## Internal distribution

Owner actions required: sign into Expo, confirm the organization/project, confirm proposed `com.bandcampnation.mobile` identifiers, and supply developer-account/signing access through the platform tools. No credentials should be pasted into code or chat.

```sh
npm run eas -- login
npm run eas -- whoami
npm run eas -- init
npm run eas -- build --platform android --profile preview
npm run eas -- build --platform ios --profile preview
```

Choose the owner-confirmed Expo organization during initialization. EAS will add its public project ID/owner metadata; review those fields before committing. The preview profile produces an Android APK and an iOS device build using the appropriate signing setup. For a cloud simulator build, use `--platform ios --profile simulator` instead. EAS account access is required even though a simulator build does not need Apple device signing.

At this handoff, Expo `whoami` returned `Not logged in`; project ownership, Apple membership/provisioning and Google Play access remain unverified. No cloud EAS build, device distribution upload or store submission is claimed.

## Acceptance and release responsibilities

- Mentor reviews radio/reading/two priority games, then the audio game and deferred parity list.
- Intern records physical Android/iOS installs, VoiceOver/TalkBack, large text, headset/call interruptions, network loss/retry and cold relaunch. Preserve device/OS/build IDs and screenshots; report failures explicitly.
- Owner confirms branding, content/media rights, privacy/support/store metadata, identifiers and signing ownership. Existing website policy pages are `/privacy` and `/terms`; have the owner review the mobile app's data disclosures.
- Review DEPENDENCY_REVIEW.md before public release. The lockfile has no critical audit entry but retains SDK advisories requiring upstream/security review.
- For defects, return to the previous verified build/commit and record the affected build ID. Do not rotate signing identities or delete store records as a rollback.

Public app-store approval is outside this sprint. Production submission automation is deferred until the account and release gates are satisfied.
