# Divine Healthcare Services — Setup Guide

## Quick Start (3 Steps)

### Step 1: Run the Database Migration
1. Go to your Supabase Dashboard → **SQL Editor**
2. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and click **Run** — this creates all tables, indexes, RLS policies, and seeds 8 default job listings

### Step 2: Create a Storage Bucket
1. Go to Supabase Dashboard → **Storage**
2. Click **New Bucket**, name it `documents`
3. Set it to **Public** (or Private with signed URLs — the admin uses signed URLs)
4. Under bucket policies, add a policy to allow anonymous uploads:
   - Policy name: `allow_uploads`
   - Allowed operation: INSERT
   - Target roles: `anon`
   - Policy: `true`

### Step 3: Create an Admin User
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter your admin email and password
4. Confirm the user (toggle "Auto Confirm" in Auth settings, or confirm via email)
5. Log in at: `https://YOUR-SITE.azurestaticapps.net/admin/login`

---

## Configuration

### Switching to a New Supabase Project
Edit `.env` and change these 2 values:
```
VITE_SUPABASE_URL=https://YOUR_NEW_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_new_anon_key_here
```

Get these from: Supabase Dashboard → **Settings** → **API**

Then re-run the database migration on the new project (Step 1 above).

### Environment Variables
| Variable | Where to find it |
|----------|-----------------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon/public key |

---

## Architecture

### Database Tables
| Table | Purpose |
|-------|---------|
| `jobs` | Job listings (admin CRUD, public read) |
| `applications` | Full 9-step job applications |
| `documents` | File upload records linked to applications |
| `referrals` | Patient/client referral submissions |
| `contact_submissions` | Contact form messages |

### Admin Panel Routes
| Route | Page |
|-------|------|
| `/admin/login` | Admin login |
| `/admin` | Dashboard with stats |
| `/admin/jobs` | Job listing CRUD |
| `/admin/applications` | Application review & management |
| `/admin/referrals` | Referral management |
| `/admin/messages` | Contact form submissions |

### Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State**: Zustand (application form), React Context (auth)
- **Forms**: React Hook Form + Zod validation
- **Hosting**: Azure Static Web Apps (via GitHub Actions)
