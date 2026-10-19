import bundled from './library.json';

export type ReadingBlock = { kind: string; text: string };
export type ReadingSection = { slug: string; title: string; blocks: ReadingBlock[] };
export type ReadingDocument = {
  id: string;
  kind: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string | null;
  sections: ReadingSection[];
};

export const documents: ReadingDocument[] = bundled.documents;
