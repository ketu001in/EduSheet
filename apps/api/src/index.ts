// Local-dev entrypoint only -- calls app.listen(). The Vercel deployment
// uses api/index.ts instead, which imports the same app.ts but never calls
// listen (Vercel's runtime handles the actual request lifecycle).
import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`[Server]: Bosket's EDStudio API is running at http://localhost:${PORT}`);
});
