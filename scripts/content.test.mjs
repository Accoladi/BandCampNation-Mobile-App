import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';

test('HTML migration preserves entities, headings, line breaks and nested list text', () => {
  execFileSync('python3', [new URL('./import-content.py', import.meta.url).pathname, '--self-test']);
});

test('the original catalog contains readable offline text for every article and book section', () => {
  const { documents, sourceRevision } = JSON.parse(readFileSync(new URL('../src/features/content/library.json', import.meta.url)));
  assert.match(sourceRevision, /^[a-f0-9]{40}$/);
  assert.equal(documents.filter(item => item.kind === 'article').length, 15);
  assert.equal(documents.filter(item => item.kind === 'book').length, 2);
  assert.equal(new Set(documents.map(item => item.id)).size, documents.length);
  for (const item of documents) {
    assert.ok(item.sections.length > 0, item.title);
    assert.equal(new Set(item.sections.map(section => section.slug)).size, item.sections.length);
    for (const section of item.sections) {
      assert.ok(section.blocks.length > 0, `${item.title}/${section.slug}`);
      assert.ok(section.blocks.every(block => block.text.trim() && ['heading', 'paragraph'].includes(block.kind)));
    }
  }
  assert.equal(documents.filter(item => item.kind === 'book').reduce((count, item) => count + item.sections.length, 0), 33);
});
