# 🎯 Setup Guide for BA14 Authentication

## ✅ What's Been Done
- ✅ Installed `@supabase/supabase-js`
- ✅ Created `src/supabase.ts` with Supabase client and database helpers
- ✅ Updated `src/App.tsx` with login/signup form
- ✅ Added logout button to mobile and desktop UI
- ✅ Built successfully

## 📋 Next Steps

### 1. Create Database Tables in Supabase

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/hvtllfouvnycpgkolzbj
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see: "Success. No rows returned"

### 2. Configure Authentication Settings

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://ba1414.github.io/askba14/`
3. Add **Redirect URLs**:
   - `https://ba1414.github.io/askba14/**`
   - `http://localhost:5173/**` (for local testing)
4. Click **Save**

### 3. Enable Email Confirmation (Optional)

By default, Supabase requires email confirmation. To disable for testing:

1. Go to **Authentication** → **Providers** → **Email**
2. Scroll down to **Confirm email**
3. Toggle OFF if you want instant signups (or leave ON for production)
4. Click **Save**

### 4. Deploy to GitHub Pages

```powershell
npm run build
Remove-Item -Recurse -Force .\docs -ErrorAction SilentlyContinue
Copy-Item -Recurse .\dist .\docs
git add .
git commit -m "Add Supabase authentication"
git push
```

### 5. Test the Login System

1. Go to https://ba1414.github.io/askba14/
2. Click **"Don't have an account? Sign up"**
3. Enter email and password (min 6 characters)
4. If email confirmation is ON: Check your email and click the link
5. Sign in with your credentials
6. Your data will now sync across browsers/devices! 🎉

## 🔐 How It Works

- **Sign Up**: Creates a new account in Supabase
- **Sign In**: Authenticates and gets a session token
- **Auto-login**: Checks for existing session on page load
- **Logout**: Clears session and returns to login screen
- **Data Sync**: All your GPA, calendar, flashcards, and projects are stored in Supabase PostgreSQL database
- **Security**: Row Level Security ensures users can only see their own data

## 🌐 Cross-Browser/Device Sync

Once logged in:
- ✅ Access from Chrome, Firefox, Safari, Edge - same data
- ✅ Access from desktop, tablet, mobile - same data
- ✅ Data persists across devices
- ✅ Real-time sync when you make changes

## 🛠️ Local Testing

To test locally before deploying:

```powershell
npm run dev
```

Then open http://localhost:5173 and test the login flow.

---

**Need Help?** 
- Supabase Docs: https://supabase.com/docs
- SQL runs successfully? Check **Table Editor** to see your 4 new tables
