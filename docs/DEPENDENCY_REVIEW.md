# Dependency review

October 19, 2026. Expo Doctor requested six SDK 57 patch updates; those were applied while preserving Expo 57, React Native 0.86 and the BetweenBands approach. Compatible lockfile updates addressed the reported critical `shell-quote` advisory and the patchable `brace-expansion` advisory.

The resulting lockfile audit reports **0 critical, 18 high and 11 moderate** entries, including inherited SDK/build-tool dependency chains. This is not a claim that every entry is independently exploitable in the app. Public release needs an upstream/dependency review; no `npm audit fix --force` framework downgrade was applied.

Known outstanding upstream constraints:

- `braces` and `node-forge` advisories currently have no patched version listed. These are used in the SDK/build-tool chains. [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [node-forge advisory](https://github.com/advisories/GHSA-86w9-cpqp-85rv).
- The Router's `decode-uri-component` chain has a malformed-input denial-of-service advisory. The patch is 0.5.0, which changes the package to ESM; blindly overriding the old CommonJS dependency would break its consumer contract. This needs a compatible upstream Router change and deep-link validation before public release. [URI decoder advisory](https://github.com/advisories/GHSA-vcc3-ghjq-m6fr).
- The older `uuid` chain has buffer-boundary advisories with newer-major patches. Assess the actual consumers before a major override; no unverified module replacement was added. [uuid advisory](https://github.com/advisories/GHSA-w5hq-g745-h8pq).

Recheck with `npm audit --package-lock-only`. Native exports were also checked for server SDK/credential markers; none of the AWS/Google/admin modules or environment files from the website were copied into the mobile source.
