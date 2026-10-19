import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchTracks, parseTracks, siteOrigin } from '../src/features/radio/service.ts';

const song = { id: 'one', title: 'Band Forever', artist: 'Randall Bayne', audioUrl: 'https://daioi4xdbqyhz.cloudfront.net/radio/audio/band-forever.mp3', status: 'published', isRestricted: false, sortOrder: 1 };

test('radio rejects untrusted payloads and excludes restricted, draft, duplicate or unsafe media', () => {
  assert.throws(() => parseTracks({ songs: 'invalid' }));
  assert.throws(() => parseTracks({ songs: Array(501).fill(song) }));
  const tracks = parseTracks({ songs: [song, song, { ...song, id: 'private', isRestricted: true }, { ...song, id: 'draft', status: 'draft' }, { ...song, id: 'unsafe', audioUrl: 'javascript:alert(1)' }, { ...song, id: 'credentials', audioUrl: 'https://user:password@example.com/track.mp3' }] });
  assert.equal(tracks.length, 1);
  assert.equal(tracks[0].title, song.title);
  assert.equal(siteOrigin('https://bandcampnation.com/api/'), 'https://bandcampnation.com');
  assert.equal(siteOrigin('http://example.com'), 'https://bandcampnation.com');
});

test('radio uses the existing public endpoint and handles HTTP failure', async () => {
  const tracks = await fetchTracks(undefined, async (url, options) => {
    assert.equal(new URL(url).pathname, '/api/radio/songs');
    assert.equal(options.credentials, 'omit');
    return new Response(JSON.stringify({ songs: [song] }));
  });
  assert.equal(tracks.length, 1);
  await assert.rejects(fetchTracks(undefined, async () => new Response('', { status: 503 })), /503/);
});
