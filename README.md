# M. Karthik, full stack developer

Portfolio site: **https://karthik9360.github.io**

A realistic 3D Earth fills the page behind the content. Moving between sections flies the camera around the planet, data arcs run out from Chennai, and the pointer lights up the surface under it.

Built with Next.js, TypeScript, React Three Fiber, Drei, Tailwind CSS and Zustand.

## How it works

- **Two layers.** A fixed full-screen WebGL canvas sits behind a normal HTML layout. They only talk through one Zustand store, `src/store/usePortfolioStore.ts`, so a button press moves the camera without re-rendering any 3D component.
- **No wasted GPU.** The canvas runs continuously only while a visitor is active. After 12 seconds without input, or when the tab is hidden, the scene eases to rest and stops rendering.
- **Light on the machine.** The globe is six draw calls with custom GLSL shaders, and holds 60 FPS on integrated graphics (Intel UHD 630).
- **Works for everyone.** `prefers-reduced-motion` is respected, all text is in the HTML, and the page stays fully usable if WebGL is unavailable.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. Every push to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`.

## Where things are

| Path | What's there |
| --- | --- |
| `src/data/profile.ts` | All the text on the site |
| `src/config/sections.ts` | Each section's camera pose, sun direction and accent colour |
| `src/components/canvas/` | The 3D scene |
| `src/components/overlay/` | The HTML layer |

## Credits

Earth imagery comes from NASA's Blue Marble and Black Marble collections, by way of the MIT-licensed [three-globe](https://github.com/vasturiano/three-globe) package.
