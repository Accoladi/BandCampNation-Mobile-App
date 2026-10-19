# Source audit and MVP map

Audit performed October 19, 2026. The October 5–16 task dates are the original plan, not dates of completed work.

## Sources

- Mobile reference: `/Users/cricky/Desktop/BetweenBands-APP`, commit `37f420b7`. Its existing uncommitted release work is untouched.
- Website: `Accoladi/BandCampNation`, main commit `c6dbfad`, downloaded into `/private/tmp/bandcampnation-source-acc294` for read-only reference.
- Destination: `Accoladi/BandCampNation-Mobile-App`, initially empty.
- Website package: Next.js **16.2.9**, React **19.2.4**, TypeScript, Tailwind. Its AGENTS.md requires reading installed Next.js guides before web changes. No web changes are needed for the mobile implementation.
- Reference mobile package: Expo **57.0.26**, React Native **0.86.3**, React **19.2.3**, Expo Router **57.0.24**, Expo Audio **57.0.5**, TypeScript **6.0.3**. Reuse the lockfile and installed dependency choices; do not copy unrelated release or AWS work.

## Reuse decisions

| Feature | Evidence in source | Native treatment |
| --- | --- | --- |
| Home / brand | `app/page.tsx`, `HeroSlideshow.tsx`, `public/images`, `app/icon.svg` | Adapt copy, imagery, blue/navy/gold palette to native controls and safe-area layout. |
| Articles | `src/lib/articles.ts`, `articles/*.html` | Generate a bundled native catalog and text blocks. Preserve headings and reading order; no HTML execution or filesystem calls on device. |
| Books | `src/lib/books.ts`, `books/*.html` | Bundle both books; table of contents and per-section native reading. |
| Radio | `app/api/radio/songs/route.ts`, `src/lib/radio/types.ts` | Fetch public `GET https://bandcampnation.com/api/radio/songs`; Expo Audio plays returned public HTTPS audio URLs. Search/browse tracks; loading, errors, retry, pause/resume, next/previous. |
| Trivia | `entertainment/trivia/Trivia.jsx`; BetweenBands native trivia | Reuse native screen and source question data; keep scoring, answer feedback and restart. |
| Tic-Tac-Toe | `entertainment/tictactoe`; BetweenBands `tic-tap-tone.tsx` | Reuse native single/two-player board, win/tie detection, reset. |
| Audio game | `entertainment/ntt/nameThatTuneData.js`, bundled snippets; BetweenBands native screen | Adapt Name That Tune using bundled clips; pause on leaving/backgrounding. |
| Remaining games | `src/lib/entertainment.ts`, crossword, YouTube player, DOM/canvas activities | Record parity gaps for mentor review; label browser handoffs explicitly. No silent claim of native parity. |

Radio metadata currently includes published/restricted status, public media URLs, lyrics, tags and sort order. Only public published, unrestricted playable tracks should appear. The mobile client must not import `src/lib/radio/aws.ts`, import/admin endpoints, Google APIs, filesystem readers, server environment files, or AWS SDKs. The existing Next.js service owns credentials and AWS access.

## Verification and blockers

- GitHub repository access works when network access is enabled.
- Public radio endpoint returned HTTP **200** on October 19, 2026.
- Android SDK and ARM64 system images are installed; no AVD is configured. Native smoke tests require an emulator/device and an app installation.
- Only Apple Command Line Tools are installed. `xcrun simctl` is unavailable and full Xcode is absent. iOS simulator/device launch cannot currently be verified here.
- Expo project ownership, developer-account memberships, application identifiers and signing access have not been verified. Record build/distribution results separately from JS bundle export.
- No physical-device, VoiceOver or TalkBack evidence exists yet. Do not substitute browser testing for native device QA.

## MVP acceptance boundary

Prioritize radio, native reading, Trivia and Tic-Tac-Toe. Name That Tune is the next native adaptation. Remaining parity needs mentor review after a concrete demo. No account system, AWS infrastructure migration, admin imports, advertisements or public app-store approval is required by this sprint.
