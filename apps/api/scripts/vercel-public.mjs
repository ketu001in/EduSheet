// Vercel treats this framework-less project as having a static output
// directory and fails the build if "public" is missing or empty. The API
// serves no static files, so just emit a robots.txt keeping it unindexed.
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('public', { recursive: true });
writeFileSync('public/robots.txt', 'User-agent: *\nDisallow: /\n');
