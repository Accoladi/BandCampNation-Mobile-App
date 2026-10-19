# Native content snapshot

The native library contains all 15 catalog articles and both books from website commit `c6dbfad28d2bf0bdeb2e133fbf262ef589aecc06`. The books contain 33 frontmatter/chapter/backmatter sections; the articles contain 31 complete-reading/chapter sections. Covers and text are bundled for offline use.

The build-time importer reads the website's data-only article/book metadata and HTML fragments, then emits JSON text blocks and a Metro-compatible static cover manifest. Paragraphs, headings, ordered/unordered list text and entities are preserved. Inline bold/italic styling becomes plain text except whole bold paragraphs become headings. No HTML is executed. Website ads, analytics and server-only readers are omitted from the native reading experience.

To update from an authorized web checkout, use Node.js 24 and Python 3.9+:

```sh
python3 scripts/import-content.py /path/to/BandCampNation
npm run check
```

Review the content diff and source revision. Do not copy `.env*`, AWS/Google modules, admin code or source secrets. Radio uses the live public HTTPS API and is separate from the bundled reading snapshot.

Demo: Articles → first story; Books → either title → section. Search the libraries, navigate next/previous sections, try a bad reader link, and disable networking after the app is installed to verify bundled reading still works.
