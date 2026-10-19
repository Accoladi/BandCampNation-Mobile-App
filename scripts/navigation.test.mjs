import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { primaryNavigation } from '../src/features/navigation/routes.ts';

test('every primary destination resolves to a native route', () => {
  assert.equal(new Set(primaryNavigation.map(route => route.href)).size, 5);
  for (const { href } of primaryNavigation) {
    const file = href === '/' ? 'index' : href.slice(1);
    assert.ok(existsSync(new URL(`../src/app/${file}.tsx`, import.meta.url)), href);
  }
});
