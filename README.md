# myfriendpdf

Browser-based PDF tools. Documents are processed locally and are not uploaded.

```bash
npm install
npm run dev
```

Other checks:

```bash
npm test
npm run lint
npm run build
```

The production build copies `index.html` to `404.html` and `200.html` so client-side routes keep working on common static hosts. `public/_redirects` covers Netlify and Cloudflare Pages. `vercel.json` covers Vercel.
