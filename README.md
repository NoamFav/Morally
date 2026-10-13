# Morally

A revision site for the French *terminale* philosophy programme: 19 lessons, each with margin definitions, a summary, flashcards, a quiz, dissertation subjects, readings and personal notes. It also has a lexicon, author pages, philosophical currents, method sheets and a spaced-repetition review page.

Everything is static HTML built by [Astro](https://astro.build). Progress and notes live in the reader's browser (`localStorage`). There is no backend.

## Running it

```sh
pnpm install
pnpm dev        # http://localhost:4321, reloads on save
pnpm build      # static site in dist/
pnpm preview    # serve dist/ locally
```

## How Astro works here

- **Pages** live in `src/pages/`. Each file is a route: `src/pages/lexique.astro` becomes `/lexique`. A file named with brackets, like `src/pages/notions/[id].astro`, is a template that generates one page per lesson.
- **Content** lives in `src/content/` as Markdown/MDX files. `src/content.config.ts` describes their fields, so a typo in a lesson (a missing quiz answer, an unknown author) fails the build instead of shipping broken.
- **`.astro` components** are HTML templates with a small script block (`---`) at the top that runs at build time. `<script>` tags inside them are the only JavaScript sent to the browser.

## Content

| Folder | What it holds |
| --- | --- |
| `src/content/notions/*.mdx` | The 19 lessons. Frontmatter holds the summary, cards, quiz, subjects and readings; the body is the lesson. |
| `src/content/lexique.yaml` | Every definition. Lessons reference them with `<Def t="id">word</Def>`. |
| `src/content/auteurs/*.md` | One file per philosopher. |
| `src/content/courants/*.md` | Philosophical currents. |
| `src/content/methode/*.mdx` | Method sheets (dissertation, explication de texte…). |

Components available inside lesson bodies, with no import needed:

```mdx
<Def t="cogito">cogito</Def>                     margin definition from the lexicon
<Note>A side remark.</Note>                    numbered margin note
<Citation auteur="kant" source="…">…</Citation> quote; links to the author page when the id exists
<Retenir>…</Retenir>                           "À retenir" box
<Exemple titre="…">…</Exemple>                 example box
```

`##` headings are numbered I, II, III automatically and `###` headings a, b, c; a `## Conclusion` heading stays unnumbered.

**Quote every text value in frontmatter** (`recto: "…"`). French typography puts a space before `:`, and an unquoted ` : ` breaks YAML.

French spacing (non-breaking spaces inside « » and before : ; ? !) is applied automatically by `src/lib/typo.mjs`.

## Design

The palette and type live in `src/styles/global.css` (light and dark tokens) and `src/styles/lecon.css` (lesson prose, margin notes, boxes). Fonts are EB Garamond (text) and Cormorant Garamond (titles), loaded through Astro's font API in `astro.config.mjs`.
