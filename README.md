<p align="center">
  <img src="https://img.shields.io/badge/last%20commit-today-brightgreen" alt="last commit" />
  <img src="https://img.shields.io/badge/typescript-98.2%25-blue" alt="typescript" />
  <img src="https://img.shields.io/badge/languages-4-blue" alt="languages" />
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/yourusername/logo.png" alt="MediCare Logo" width="120" style="border-radius:16px;"/>
</p>

<h1 align="center">MEDS-BUDDY-CHECK-CHIRAG</h1>
<p align="center"><i>Empowering Health, Simplifying Care, Inspiring Lives</i></p>

<p align="center">
  <b>Built With:</b><br>
  <img src="https://img.shields.io/badge/-JSON-black?logo=json" />
  <img src="https://img.shields.io/badge/-Markdown-black?logo=markdown" />
  <img src="https://img.shields.io/badge/-npm-red?logo=npm" />
  <img src="https://img.shields.io/badge/-Autoprefixer-ef4444?logo=autoprefixer" />
  <img src="https://img.shields.io/badge/-PostCSS-dd6a00?logo=postcss" />
  <img src="https://img.shields.io/badge/-JavaScript-f7df1e?logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/-Vitest-94c947?logo=vitest" />
  <img src="https://img.shields.io/badge/-React-61dafb?logo=react" />
  <img src="https://img.shields.io/badge/-TypeScript-3178c6?logo=typescript" />
  <img src="https://img.shields.io/badge/-Zod-4f46e5" />
  <img src="https://img.shields.io/badge/-Vite-646cff?logo=vite" />
  <img src="https://img.shields.io/badge/-ESLint-4b32c3?logo=eslint" />
  <img src="https://img.shields.io/badge/-dateFns-e11d48?logo=date-fns" />
  <img src="https://img.shields.io/badge/-React%20Hook%20Form-ec4899" />
</p>

<hr/>

<div align="center">

## 🧠 Overview

**MediCare** is your all-in-one medication management platform—tailored for **Patients** and **Caretakers**. Track, remind, and celebrate medication adherence in real time. Built on a modern, secure, and scalable stack.

</div>

---

<div align="center">

## ✨ Features

<table>
<tr>
<td valign="top"><b>✅ Core</b></td>
<td valign="top"><b>🚀 Enhancements</b></td>
<td valign="top"><b>🔄 Bonus</b></td>
</tr>
<tr>
<td>

- Secure Supabase Auth  
- Personalized Dashboards  
- Add/Delete Meds  
- Mark as Taken  
- Adherence Tracking  
- Optimistic UI

</td>
<td>

- Real-Time Monitoring  
- Visual Analytics  
- Easy Role Switch

</td>
<td>

- Upload Med Proof  
- Deploy: Vercel/Netlify

</td>
</tr>
</table>

</div>

---

<div align="center">

## 🛠️ Tech Stack

| Frontend      | Backend | State | Forms | Testing    | Date      | Styling      |
| ------------- | ------- | ----- | ----- | ---------- | --------- | ------------ |
| React 18, TS  | Supabase| TanStack Query | RHF + Zod | Vitest + TL| date-fns | Tailwind, Radix UI |

</div>

---

<div align="center">

## 🚀 Quickstart

```bash
git clone https://github.com/yourusername/medicare-app.git
cd medicare-app
npm install
```

</div>

---

<div align="center">

## 🔧 Supabase Database Setup

1. Get your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` and put them in `.env`.
2. Set up your schema in the SQL Editor (see below):

</div>

<details>
  <summary><b>Sample SQL Schema</b></summary>

```sql
-- profiles, medications, medication_logs
-- enable RLS and create policies accordingly
-- trigger: handle_new_user()
```
</details>

---

<div align="center">

## 📁 Project Structure

</div>

```
src/
 ├── components/
 │    ├── auth/
 │    ├── dashboard/
 │    ├── medications/
 │    └── ui/
 ├── hooks/
 │    ├── useAuth.ts
 │    └── useMedications.ts
 ├── lib/
 │    ├── supabase.ts
 │    └── utils.ts
 ├── types/
 │    ├── auth.ts
 │    ├── database.ts
 │    └── medication.ts
 └── test/
```

---

<div align="center">

## 🧪 Testing

```bash
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage
```

</div>

---

<div align="center">

## 🚀 Deployment

### Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```
Add your `.env` in Vercel dashboard.

### Netlify

```bash
npm run build
# Connect repo in Netlify UI
# Build: npm run build
# Publish: dist
```

</div>

---

<div align="center">

## 🔒 Security First

- Row Level Security (RLS) everywhere 🚦
- Auth checks for every action 👤
- Zod-powered input validation 🛡️

</div>

---

<div align="center">

## 📈 Performance

- Fast React Query caching ⚡
- Optimistic UI updates 🤩
- Lazy loading & efficient renders 🚦

</div>

---

<div align="center">

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch
3. Commit changes + tests
4. Open PR—let's collaborate!

</div>

---

<div align="center">

## 📄 License

MIT License

</div>

---

<div align="center">

## 🆘 Support

Raise an issue or contact the dev team.  
<i>We're here to help!</i>

</div>

---

<p align="center">
  <b>Made with ❤️ by Chirag</b>
</p>
