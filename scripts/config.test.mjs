import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('mobile manifest uses BandCampNation identity without recording or server dependencies', () => {
  const { expo } = JSON.parse(readFileSync(new URL('../app.json', import.meta.url)));
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
  assert.equal(expo.name, 'BandCampNation');
  assert.equal(expo.ios.bundleIdentifier, expo.android.package);
  assert.ok(expo.android.blockedPermissions.includes('android.permission.RECORD_AUDIO'));
  const splash = expo.plugins.find(plugin => Array.isArray(plugin) && plugin[0] === 'expo-splash-screen');
  assert.ok(splash[1].image, 'Native splash resource must have an image to link successfully');
  assert.ok(!Object.keys(pkg.dependencies).some(name => /aws-sdk|next$|server-only|googleapis/.test(name)));
});
