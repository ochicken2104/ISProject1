# ISProject1

A secure Node.js web app: bcrypt-hashed passwords, validated forms, HTTPS-ready, private notes dashboard.

## Run locally
```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # http://127.0.0.1:3000
```

## Where to edit
| What | File |
|---|---|
| Page layout / text | `views/*.ejs` |
| Nav bar, footer | `views/partials/` |
| Colours, styling | `public/css/style.css` (colours at the top) |
| Browser behaviour | `public/js/app.js` |
| Login / register logic | `routes/auth.js` |
| Notes logic | `routes/notes.js` |
| Database tables | `db.js` |

## Deploy (Ubuntu + Nginx + pm2)
```bash
git pull && npm install --omit=dev && pm2 restart isproject1
```
