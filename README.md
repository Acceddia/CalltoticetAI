
# NovaFlow AI — Landing (Next.js + Tailwind)

A single‑page site built with Next.js (App Router), Tailwind, framer‑motion and lucide‑react.
Your component is in `app/page.tsx`.

## 1) Run locally
```bash
npm i
npm run dev
```
Open http://localhost:3000

## 2) Optional: enable the form to POST instead of mailto
- In `app/page.tsx`, set `CONTACT_ENDPOINT` to `"/api/contact"`.
- The demo API at `app/api/contact/route.ts` simply echoes the JSON. Replace with your own logic (send email, push to CRM, etc).

## 3) Push to GitHub
```bash
git init
git add .
git commit -m "NovaFlow AI landing"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

## 4) Deploy on Vercel
- Import the GitHub repo at https://vercel.com/new
- Root directory: the repo root (where `package.json` is)
- Build command: `next build` (default)
- Output: `.vercel/output` (handled automatically)
- Node version: 18+ (Vercel default is fine)

## Notes
- Tailwind is preconfigured in `tailwind.config.ts` and `app/globals.css`.
- If you want analytics, add any script to `app/layout.tsx`.
- If you prefer a static export, you can keep using the mailto fallback.
