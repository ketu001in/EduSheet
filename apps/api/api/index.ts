// Vercel serverless entrypoint. Every file under /api becomes its own
// function; vercel.json's catch-all rewrite sends ALL incoming paths
// (/health, /api/worksheets, etc.) to this single function, and Express's
// own router does the real path matching from there -- the standard
// "Express app on Vercel" pattern, so none of the route files needed to
// change.
import app from '../src/app';

export default app;
