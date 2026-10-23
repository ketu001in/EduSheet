// Vercel serverless entry. Vercel finds functions in api/ BEFORE running the
// build, so this file must exist in git; the real app is the esbuild bundle
// written to build/app.mjs by the "vercel-build" script (see package.json).
export { default } from '../build/app.mjs';
