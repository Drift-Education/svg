# Exact OS icons (optional)

Drop SVG files here to replace the vendored shell glyphs with the real ones from
your own installation:

```
public/os-icons/windows/wifi.svg
public/os-icons/chromeos/battery.svg
public/os-icons/macos/search.svg
```

Accepted names: `wifi`, `volume`, `battery`, `search`, `grid`, `add`,
`minimize`, `maximize`, `close`.

Anything missing keeps the bundled glyph — Fluent UI System Icons (MIT) on
Windows, Material Symbols (Apache-2.0) on ChromeOS, hand-drawn marks on macOS.
These files are not shipped with the repository; vendor icons and wallpapers
remain the copyright of their owners, so keep them to a personal build.
