# OAuth SignUp Starter with Supabase

A modern starter template for building full-stack applications with authentication (email/password & OAuth: Google, Facebook, GitHub, LinkedIn) using Supabase. Use this as a foundation to quickly launch your next project!

---

## 🚀 Tech Stack

- **Frontend:** Next.js, React
- **Backend:** NestJS, Prisma
- **Auth:** Supabase Auth (OAuth + Email/Password)
- **ORM:** Prisma
- **Package Manager:** pnpm (monorepo)

---

## ✨ Features

- Email/password authentication
- OAuth with Google, Facebook, GitHub, LinkedIn
- Supabase integration for authentication & database
- Modular, extensible codebase (frontend & backend)
- Easy environment configuration
- **Monorepo:** Manage frontend and backend from a single root

---

## 🛠️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/)
- [Supabase account](https://supabase.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/OAuth-SignUp-with-Supabase.git
cd OAuth-SignUp-with-Supabase
```

---

## ⚙️ Configuration

### 1. Environment Variables

You need to set up environment variables for both frontend and backend. Create `.env` files in the respective folders:

#### Example: `apps/backend/.env`
```
DATABASE_URL=your_postgres_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

#### Example: `apps/frontend/.env`
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Tip:** Never commit your `.env` files to version control.

### 2. Obtaining OAuth Credentials
- **Google:** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **Facebook:** [Facebook Developers](https://developers.facebook.com/)
- **GitHub:** [GitHub Developer Settings](https://github.com/settings/developers)
- **LinkedIn:** [LinkedIn Developers](https://www.linkedin.com/developers/)

Set the redirect URIs to point to your frontend (e.g., `http://localhost:3000/api/auth/callback/{provider}` or as required by your setup).

### 3. Supabase Setup
1. Create a new project at [Supabase](https://app.supabase.com/).
2. Go to **Project Settings > API** to get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
3. Go to **Project Settings > Auth > Providers** to enable and configure OAuth providers. Paste your client IDs and secrets.
4. Set up redirect URLs in Supabase Auth settings (e.g., `http://localhost:3000` for local dev).
5. (Optional) Set up database tables using Prisma migrations (see below).

---

## 🗄️ Prisma & Database Setup

This project uses Prisma as the ORM for the backend. You can manage your database schema and migrations easily.

### 1. Set your Supabase Postgres connection string in `apps/backend/.env`:
```
DATABASE_URL=your_supabase_postgres_connection_string
```
You can find this in your Supabase project under **Settings > Database**.

### 2. Generate Prisma Client
From the root of the monorepo:
```bash
pnpm --filter backend prisma generate
```

### 3. Create and Push Migrations
To create a new migration and push it to your Supabase database:
```bash
pnpm --filter backend prisma migrate dev --name init
# or to just push existing schema (no migration prompt):
pnpm --filter backend prisma db push
```

---

## 📦 Installation & Running (Monorepo)

All commands can be run from the root folder using pnpm workspaces.

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Backend
```bash
pnpm --filter backend run start:dev
```

### 3. Run Frontend
```bash
pnpm --filter frontend run dev
```

Or, in separate terminals, you can run both at once from the root:
```bash
pnpm --filter backend run start:dev
pnpm --filter frontend run dev
```

---

## 📁 Folder Structure

```
OAuth-SignUp-with-Supabase/
  apps/
    backend/    # NestJS backend (API, Auth, Prisma)
    frontend/   # Next.js frontend (UI, Auth, Supabase client)
  package.json  # Workspace config
  pnpm-workspace.yaml
  README.md
```

---

## 🤝 Contributing

Feel free to fork, open issues, or submit PRs! This project is open for improvements and new features.

---

## 🪪 License

MIT (or specify your license here)

---

**Happy hacking! 🚀**
