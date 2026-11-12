# Gecko engine bundle

Drift's fourth proxy engine is Firefox compiled to WebAssembly, drawn into a tab's
canvas. Its runtime files live here so they ship with Drift the way the other proxy
runtimes do: anything in `public/` is served at the site root in `pnpm dev`, copied to
`dist/gecko/` by `pnpm build`, and copied to `dist/svg/gecko/` by the preview script.

This directory is empty except for this file until someone builds a bundle.

## Building one

The bundle comes from an upstream [`heyputer/firefox-wasm`](https://github.com/heyputer/firefox-wasm)
compile (MPL-2.0), never from a private bundle:

```sh
node scripts/build-gecko-bundle.mjs path/to/firefox-wasm/dist
```

That writes into `public/gecko/` by default, compressing each payload with zstd and
recording SHA-256 for the stored and decoded bytes in `gecko-bundle.json`. Then:

```sh
pnpm build
```

`dist/gecko/` now holds what the loader expects, and selecting Gecko in
Settings → Connection renders pages instead of reporting a missing engine.

## What the folder holds

| File | Purpose |
| --- | --- |
| `gecko-bundle.json` | manifest: file names, sizes, both hashes, provenance from `build.json` |
| `gecko.js` | Emscripten glue (must stay uncompressed so it can be patched) |
| `gecko.wasm` | the engine |
| `gecko.data` | preloaded filesystem image |
| `chrome-assets.tar` | the browser chrome, indexed rather than unpacked |
| `ublock.tar`, `branding.tar` | optional payloads, copied when present |
| `gecko-drift-host.js` | the adapter exporting `createGecko()`, deployed by hand |

`gecko-drift-host.js` is not produced by the bundle script: it is the page-side host
that assembles the engine and drives it, and it is expected beside the payloads.

## Why the payloads are gitignored

They are 353 MB of engine files (62 MiB compressed) rebuilt in hours and never edited
as source. `.gitignore` keeps everything here except this README out of version
control, and keeps the copies under `dist/` out too.
