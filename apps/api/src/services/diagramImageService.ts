import { supabaseAdmin } from '../lib/supabase';

// Pollinations.ai's classic /prompt/ endpoint works fully anonymously (no
// signup, no API key, no cost) -- verified directly against the live service.
// An optional POLLINATIONS_API_KEY (free at enter.pollinations.ai) raises the
// rate limit if the app starts hitting it, but nothing here requires one.
const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt';

// Real diagram-image generation is comparatively slow (10-30s) and this is a
// third-party best-effort service with no uptime guarantee -- give up well
// before the caller's own request would time out, so a slow/dead image
// provider degrades to "no image" rather than hanging the whole worksheet
// generation request.
const FETCH_TIMEOUT_MS = 25_000;

// Pollinations' free anonymous tier is rate-limited to roughly one request
// per ~15s per IP -- empirically, even 13s spacing still drew an occasional
// 429, so this pads past the documented figure. Enforced here (not just by
// callers serializing calls) because a real test worksheet with several image
// questions fired them all concurrently and lost 100% of its images to 429s
// -- this makes every caller safe by construction, not just the ones that
// remember to serialize.
const MIN_REQUEST_SPACING_MS = 17_000;
let lastRequestAt = 0;

async function waitForRateLimitSlot(): Promise<void> {
  const elapsed = Date.now() - lastRequestAt;
  const wait = MIN_REQUEST_SPACING_MS - elapsed;
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastRequestAt = Date.now();
}

async function requestOnce(prompt: string, seed: number): Promise<{ buffer: Buffer | null; rateLimited: boolean }> {
  await waitForRateLimitSlot();

  const url = `${POLLINATIONS_BASE}/${encodeURIComponent(prompt)}?width=500&height=350&nologo=true&seed=${seed}`;
  const apiKey = process.env.POLLINATIONS_API_KEY;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
    });
    if (!res.ok) {
      console.error(`Diagram image generation failed (${res.status}) for prompt: ${prompt}`);
      return { buffer: null, rateLimited: res.status === 429 };
    }
    const arrayBuffer = await res.arrayBuffer();
    return { buffer: Buffer.from(arrayBuffer), rateLimited: false };
  } catch (err) {
    console.error('Diagram image generation error:', err);
    return { buffer: null, rateLimited: false };
  } finally {
    clearTimeout(timeout);
  }
}

// Fetches a single generated image for the given prompt. Returns null (never
// throws) if the request fails or times out -- diagram images are always a
// best-effort enhancement, never something that should fail worksheet
// generation or PDF rendering. A 429 specifically gets one retry after an
// extra backoff, since it's a transient/self-inflicted condition (not a real
// failure) that a longer wait reliably clears.
async function fetchGeneratedImage(prompt: string, seed: number): Promise<Buffer | null> {
  const first = await requestOnce(prompt, seed);
  if (first.buffer) return first.buffer;
  if (!first.rateLimited) return null;

  await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_SPACING_MS));
  const retry = await requestOnce(prompt, seed);
  return retry.buffer;
}

// Generates a real illustrative image for a diagram question and uploads it
// to the public `diagram-images` bucket, returning its public URL. Persisting
// our own copy (rather than referencing the Pollinations URL directly) means
// PDF regeneration and the web preview never depend on that third-party
// service staying up or reproducing the same image for the same URL later.
export async function generateAndStoreDiagramImage(
  worksheetId: string,
  questionIndex: number | string,
  imagePrompt: string
): Promise<string | null> {
  const seed = Math.floor(Math.random() * 1_000_000);
  const buffer = await fetchGeneratedImage(imagePrompt, seed);
  if (!buffer) return null;

  const path = `${worksheetId}/${questionIndex}-${seed}.jpg`;
  const { error } = await supabaseAdmin.storage
    .from('diagram-images')
    .upload(path, buffer, { contentType: 'image/jpeg', upsert: true });

  if (error) {
    console.error('Failed to upload diagram image:', error.message);
    return null;
  }

  const { data } = supabaseAdmin.storage.from('diagram-images').getPublicUrl(path);
  return data.publicUrl;
}
