# BandCampNation Mobile

Android/iOS MVP for ACC-294, using the BetweenBands Expo/React Native and TypeScript approach with BandCampNation content and services.

All implementation belongs in this repository. BetweenBands is a reference only. The web source is [Accoladi/BandCampNation](https://github.com/Accoladi/BandCampNation); the public service origin is `https://bandcampnation.com`.

See [the source audit](docs/AUDIT.md), [the ten-task plan](docs/SPRINT_PLAN.md), and [acceptance evidence](docs/PROGRESS.md).

Use Node.js 24, then `npm ci && npm start`. Run `npm run check` and `npx expo-doctor` for validation. `npm run android` / `npm run ios` builds native Debug apps; `npm run build:android:demo` / `npm run build:ios:demo` builds standalone demos with the platform toolchain.

Setup, demo installation, account blockers and internal-test builds: [intern handoff](docs/HANDOFF.md). Remaining games: [mentor parity review](docs/GAME_PARITY.md).

Public app-store approval is outside the MVP commitment. Internal distribution requires developer accounts and signing access. AWS credentials and server-only code must never enter the mobile bundle.
