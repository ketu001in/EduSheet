// Real, sandboxed JavaScript execution for Coding Lab's Block Coding
// Studio. Runs as a dedicated Web Worker: no DOM, no cookies, no access
// to the parent page's storage -- genuinely isolated from the rest of the
// app. A runaway loop can only be stopped by the main thread calling
// worker.terminate() after a wall-clock timeout (there is no way to
// interrupt synchronous JS from inside the same thread), so this worker
// is always disposable -- the caller creates a fresh one per run.
self.onmessage = (event) => {
  const { code } = event.data;
  const output = [];
  const log = (...args) => {
    output.push(args.map((a) => {
      if (typeof a === 'object') { try { return JSON.stringify(a); } catch { return String(a); } }
      return String(a);
    }).join(' '));
  };
  const sandboxConsole = { log, error: log, warn: log, info: log };

  try {
    // eslint-disable-next-line no-new-func
    const runner = new Function('console', code);
    runner(sandboxConsole);
    self.postMessage({ ok: true, output: output.join('\n') });
  } catch (err) {
    self.postMessage({ ok: false, output: output.join('\n'), error: err && err.message ? err.message : String(err) });
  }
};
