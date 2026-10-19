# Recovery and lifecycle behavior

Radio calls only the public HTTPS catalog, omits credentials and bypasses the device HTTP cache on refresh. Requests time out after 12 seconds and are canceled on unmount. A failed refresh retains any previously loaded list, shows a retry action and explains that bundled reading/games remain available. Radio audio needs network access; offline streaming is not promised. Failed artwork has a fallback and explicit retry.

Audio pauses when leaving its screen and on every app-state transition. Expo Audio's Android module automatically resumes some tracks on foreground; the app explicitly pauses again on foreground so returning requires a user Play action. The native audio session requests exclusive focus, permits silent-mode listening, and enables neither recording nor background playback. No background service or lock-screen controls are required by this MVP. Headset/call interruptions still need physical-device checks.

While Radio stays focused and active, a completed track advances to the next public track. Repeated ±15-second seeks use the native current position rather than an older UI status sample. Name That Tune pauses on answer/round change/navigation/background and exposes clip/replay errors with retry.

Unknown routes and invalid reading links have recovery screens. The root error boundary offers a retry without exposing internal stacks or server data to users.

Native Android build verification caught a missing `splashscreen_logo` resource when no image was supplied to the splash plugin. The manifest now supplies the original logo explicitly. The next debug APK compiled successfully.

Android debug-connection troubleshooting: use `npx expo start --lan --port 8081` and, for USB, `adb reverse tcp:8081 tcp:8081`. On this Mac, `--localhost` listened only on IPv6 `::1`, which the emulator's IPv4 `10.0.2.2` route could not reach. This is a development-server issue; an embedded-bundle test APK does not require Metro.
