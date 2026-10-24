# Interactive design preview

A landing page with a 3D brain hero, plus an MRI/reference simulation workspace. This is the design prototype with working browser interactions, not a live segmentation backend.

```bash
cd design
npm ci
npm run dev
```

- Landing: http://localhost:3002/
- Simulation: http://localhost:3002/simulasi.html

`npm run build` emits both pages and their bundled assets into `dist/`. `npm run preview` serves that build on port 3002. Vite bundles the referenced files from the repository's `assets/` directory for a standalone static build.

The hero uses an actual GLB surface, slow rotation, pointer orbit, pause/resume, and reduced-motion/visibility settings. The simulation switches MRI modalities and displays reference layers with opacity, zoom and reset controls. It has no upload or inference endpoint. The segmentation model remains unloaded.

See the [design specification](../docs/design.md) for layout, copy, motion, responsive behavior, and mesh provenance.
