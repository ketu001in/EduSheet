# Self-Hosted Font Credits

All files below are static `.woff2` instances fetched directly from Google
Fonts' own `fonts.googleapis.com/css2` API (the same bytes `next/font/google`
would download at build time) and vendored here so `next build` no longer
depends on reaching Google Fonts over the network. Every font is licensed
under the SIL Open Font License (OFL) 1.1, which permits bundling and
redistribution.

| Font | Files | Source | License |
|---|---|---|---|
| DM Sans | `dm-sans-{400,500,600,700}.woff2` | [Google Fonts: DM Sans](https://fonts.google.com/specimen/DM+Sans) | OFL 1.1 |
| Poppins | `poppins-{400,500,600,700}.woff2` | [Google Fonts: Poppins](https://fonts.google.com/specimen/Poppins) | OFL 1.1 |
| Nunito | `nunito-{400,500,600,700}.woff2` | [Google Fonts: Nunito](https://fonts.google.com/specimen/Nunito) | OFL 1.1 |
| Lexend | `lexend-{400,500,600,700}.woff2` | [Google Fonts: Lexend](https://fonts.google.com/specimen/Lexend) | OFL 1.1 |
| Atkinson Hyperlegible | `atkinson-{400,700}.woff2` | [Google Fonts: Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible) | OFL 1.1 |
| Merriweather | `merriweather-{400,700}.woff2` | [Google Fonts: Merriweather](https://fonts.google.com/specimen/Merriweather) | OFL 1.1 |
| Fredoka | `fredoka-{500,600,700}.woff2` | [Google Fonts: Fredoka](https://fonts.google.com/specimen/Fredoka) | OFL 1.1 |
| JetBrains Mono | `jetbrains-mono-{500,600}.woff2` | [Google Fonts: JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | OFL 1.1 |

DM Sans, Nunito, Lexend, Fredoka, and JetBrains Mono are variable fonts on
Google Fonts -- their per-weight files here are byte-identical copies of the
same variable file (this is exactly what Google's own CSS API serves for
each weight too, via single-value `font-weight` `@font-face` rules; it is
not a self-hosting shortcut). Poppins and Atkinson Hyperlegible ship as
genuinely distinct static files per weight.

Loaded in `apps/web/src/app/layout.tsx` via `next/font/local`. See that
file's comment for why these are self-hosted instead of loaded live via
`next/font/google`.
