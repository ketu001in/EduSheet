// Real Python execution for Coding Lab's Block Coding Studio, via
// Pyodide -- an actual CPython interpreter compiled to WebAssembly, not a
// simulation or a subset reimplementation. Loaded lazily from jsDelivr's
// CDN only when a visitor actually runs Python (this file is otherwise
// never fetched), and runs as a dedicated Worker so a runaway loop in
// student code can be killed by the main thread calling
// worker.terminate() without ever freezing the page.
const PYODIDE_VERSION = 'v314.0.5';
importScripts(`https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/pyodide.js`);

let pyodideReadyPromise = null;
function getPyodide() {
  if (!pyodideReadyPromise) {
    pyodideReadyPromise = loadPyodide({
      indexURL: `https://cdn.jsdelivr.net/pyodide/${PYODIDE_VERSION}/full/`,
    });
  }
  return pyodideReadyPromise;
}

self.onmessage = async (event) => {
  const { code } = event.data;
  const output = [];
  try {
    const pyodide = await getPyodide();
    pyodide.setStdout({ batched: (msg) => output.push(msg) });
    pyodide.setStderr({ batched: (msg) => output.push(msg) });
    await pyodide.runPythonAsync(code);
    self.postMessage({ ok: true, output: output.join('\n') });
  } catch (err) {
    self.postMessage({ ok: false, output: output.join('\n'), error: err && err.message ? err.message : String(err) });
  }
};
