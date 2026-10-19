"""Build native reading data from a trusted BandCampNation web checkout.

Usage: python3 scripts/import-content.py /path/to/BandCampNation
Only public text and cover assets are copied; no web/server code is imported by Metro.
"""
import json
import re
import shutil
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path


class Blocks(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.blocks = []
        self.active = None
        self.parts = []
        self.strong = 0
        self.has_strong = False
        self.has_plain = False
        self.lists = []
        self.prefix = ''

    def handle_starttag(self, tag, attrs):
        if tag in ('ul', 'ol'):
            self.lists.append([tag, 0])
        if tag in ('strong', 'b'):
            self.strong += 1
            self.has_strong = True
        if tag in ('p', 'li', 'h1', 'h2', 'h3', 'h4') and self.active is None:
            self.active, self.parts = tag, []
            self.has_strong = self.has_plain = False
            self.prefix = ''
            if tag == 'li':
                if self.lists:
                    self.lists[-1][1] += 1
                    self.prefix = f'{self.lists[-1][1]}. ' if self.lists[-1][0] == 'ol' else '• '
                else:
                    self.prefix = '• '
        if tag == 'br' and self.active:
            self.parts.append(' ')

    def handle_data(self, data):
        if self.active:
            self.parts.append(data)
            if data.strip() and not self.strong:
                self.has_plain = True

    def handle_endtag(self, tag):
        if tag == self.active:
            text = re.sub(r'\s+', ' ', ''.join(self.parts)).strip()
            if text:
                heading = tag.startswith('h') or (self.has_strong and not self.has_plain)
                self.blocks.append({'kind': 'heading' if heading else 'paragraph', 'text': self.prefix + text})
            self.active = None
        if tag in ('strong', 'b'):
            self.strong = max(0, self.strong - 1)
        if tag in ('ul', 'ol') and self.lists:
            self.lists.pop()


def blocks(html):
    parser = Blocks()
    parser.feed(html)
    return parser.blocks


def main():
    source = Path(sys.argv[1]).resolve()
    root = Path(__file__).resolve().parents[1]
    # Metadata modules are data-only. This build-time process never runs on a device.
    program = """
      const root = process.argv[1];
      const {articles} = await import(root + '/src/lib/articles.ts');
      const {books} = await import(root + '/src/lib/books.ts');
      console.log(JSON.stringify({articles, books}));
    """
    metadata = json.loads(subprocess.check_output([
        'node', '--experimental-strip-types', '--disable-warning=MODULE_TYPELESS_PACKAGE_JSON',
        '--input-type=module', '-e', program, source.as_uri(),
    ], text=True))
    documents, images = [], {}
    for kind, entries in [('article', metadata['articles']), ('book', metadata['books'])]:
        for entry in entries:
            slug = entry['slug']
            html = (source / f'{kind}s' / f'{slug}.html').read_text(encoding='utf-8-sig')
            sections = entry.get('sections') or entry.get('chapters')
            if sections:
                content = []
                for section in sections:
                    match = re.search(r'<section id="' + re.escape(section['slug']) + r'"[^>]*>([\s\S]*?)</section>', html)
                    if not match:
                        raise ValueError(f'Missing section: {slug}/{section["slug"]}')
                    content.append({'slug': section['slug'], 'title': section['title'], 'blocks': blocks(match[1])})
            else:
                content = [{'slug': 'full', 'title': entry['title'], 'blocks': blocks(html)}]
            if not all(section['blocks'] for section in content):
                raise ValueError(f'Empty native text: {slug}')
            image = entry.get('coverImageUrl') or entry['imageUrl']
            src = (source / 'public' / image.lstrip('/')).resolve()
            if not src.is_relative_to(source / 'public'):
                raise ValueError('Cover asset outside public directory')
            dest = root / 'assets/content' / image.lstrip('/')
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src, dest)
            key = f'{kind}:{slug}'
            images[key] = './' + dest.relative_to(root).as_posix()
            documents.append({
                'id': key, 'kind': kind, 'slug': slug, 'title': entry['title'],
                'excerpt': entry['excerpt'], 'author': entry.get('author'), 'sections': content,
            })
    out = root / 'src/features/content'
    out.mkdir(parents=True, exist_ok=True)
    revision = subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD'], text=True).strip()
    (out / 'library.json').write_text(json.dumps({'sourceRevision': revision, 'documents': documents}, ensure_ascii=False, indent=2) + '\n')
    manifest = '/* Generated by scripts/import-content.py. */\nexport const covers: Record<string, number> = {\n'
    for key, asset in images.items():
        manifest += f'  {json.dumps(key)}: require({json.dumps("../../../" + asset[2:])}),\n'
    (out / 'covers.ts').write_text(manifest + '};\n')
    print(f'Imported {len(documents)} documents, {sum(len(d["sections"]) for d in documents)} sections.')


if __name__ == '__main__':
    if sys.argv[1:] == ['--self-test']:
        assert blocks('<p>A &amp; B</p><h2>Title<br>Two</h2><ul><li><p>Nested item</p></li></ul>') == [
            {'kind': 'paragraph', 'text': 'A & B'},
            {'kind': 'heading', 'text': 'Title Two'},
            {'kind': 'paragraph', 'text': '• Nested item'},
        ]
        assert blocks('<p><strong>Heading</strong></p><p>A <strong>word</strong>.</p>')[1]['kind'] == 'paragraph'
        print('HTML to native text checks passed.')
    else:
        main()
