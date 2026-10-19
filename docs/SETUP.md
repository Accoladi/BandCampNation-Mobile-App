# Development setup

Use Node.js 24 and npm. The project reuses the BetweenBands Expo SDK 57 lockfile; do not run an unreviewed SDK upgrade.

```sh
git clone https://github.com/Accoladi/BandCampNation-Mobile-App.git
cd BandCampNation-Mobile-App
git switch codex/acc-294-mobile-mvp
cp .env.example .env
npm ci
npm start
```

Install the compatible Expo Go version on a phone and scan the QR code on the same network. `npm run android` / `npm run ios` builds and opens the native Debug app on a configured emulator/simulator. iOS simulation requires full Xcode selected with `xcode-select`, not just Command Line Tools. Android requires JDK 21, SDK 36 and a running AVD or a USB-debugging device.

```sh
npm run check
npm run export:android
npm run export:ios
npm run web
```

Exports write JavaScript/Hermes bundles and media to ignored `artifacts/` directories. They prove bundling, not installation or native compilation. Keep screenshots/logs with the QA evidence when testing on real native runtimes.

Only `EXPO_PUBLIC_SITE_URL` is needed for development. It is public and defaults to `https://bandcampnation.com`; all Expo public values are visible in shipped code. Do not copy the website's environment files, AWS/Google credentials, admin token, AWS SDKs or server-only modules.

`com.bandcampnation.mobile` is a proposed new native application identifier. Confirm ownership before creating signed distribution builds; never reuse BetweenBands signing identities.
