# ThreadTheory — Premium Women's Boutique

A full-stack women's boutique e-commerce website built with React + Vite (frontend) and Node.js + Express (backend), powered by Supabase (PostgreSQL + Auth + Storage).

---

## 🚀 Quick Setup

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** and paste the entire contents of `supabase_schema.sql`
4. Click **Run** — this creates all tables, RLS policies, and seed categories

### Step 2: Get your Supabase Keys

From your Supabase dashboard → **Settings → API**:
- `Project URL` → your `SUPABASE_URL`
- `anon / public` key → your `VITE_SUPABASE_ANON_KEY`
- `service_role` key → your `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Step 3: Create Storage Bucket

In Supabase dashboard → **Storage**:
1. Create a bucket named `product-images`
2. Make it **public**

### Step 4: Configure .env Files

**Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`backend/.env`):
```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:5173
```

### Step 5: Install Dependencies (already done)

```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### Step 6: Run the App

Open **two terminals**:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Visit: **http://localhost:5173**

---

## 📁 Project Structure

```
ThreadTheory/
├── frontend/          # React + Vite
├── backend/           # Node.js + Express API
├── supabase_schema.sql   # Full DB schema
└── README.md
```

---

## 🛠️ Making Yourself an Admin

After signing up on the site, run this in Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
```

Then visit `/admin` to access the admin panel.

---

## 🌟 Features

- ✅ Dark luxury design (charcoal + gold)
- ✅ Women's multi-category boutique
- ✅ Supabase Auth (email + Google OAuth)
- ✅ Full product catalog with images, sizes, colors
- ✅ Cart (server-synced per user)
- ✅ Wishlist
- ✅ Multi-step checkout
- ✅ Order history
- ✅ Admin panel (products + orders)
- ✅ Customer reviews
- ✅ Responsive (mobile-first)
- ✅ Framer Motion animations
