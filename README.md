# OAuth + Email SignUp with Supabase Starter Package

A modern starter template for building full-stack applications with authentication (email/password & OAuth: Google, Facebook, GitHub, LinkedIn) using Supabase. Use this as a foundation to quickly launch your next project!

---

## 🚀 Tech Stack

- **Frontend:**
  - Next.js: 15.4.2
  - React: 19.1.0
  - Mantine UI: 8.1.3
  - @supabase/supabase-js: 2.52.0
- **Backend:**
  - NestJS: 11.0.1
  - Prisma: 6.12.0
  - @supabase/supabase-js: 2.52.0
- **Auth:** Supabase Auth (OAuth + Email/Password)
- **ORM:** Prisma 6.12.0
- **Package Manager:** pnpm 10.11.0 (monorepo)

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
JWT_SECRET=your_jwt_secret
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

## 🔑 OAuth Provider Setup

Follow these step-by-step guides to set up each OAuth provider:

### Google
1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and create a new project (or select an existing one).
2. Navigate to **APIs & Services > Credentials** and click **Create Credentials > OAuth client ID**.
3. Choose **Web application**. Set the authorized redirect URI to:
   - **Copy the callback URL from Supabase** (e.g., `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`).
   - Or for local dev: `http://localhost:3000/auth/v1/callback` (if needed).
4. After creation, copy the **Client ID** and **Client Secret**.
5. In your Supabase dashboard, go to **Authentication > Providers > Google**. Paste the Client ID and Secret, and enable Google login.

### Facebook
1. Go to the [Facebook Developers](https://developers.facebook.com/) portal and create a new app.
2. In your app dashboard, go to **Settings > Basic**. Copy the **App ID** and **App Secret**.
3. In Supabase, go to **Authentication > Providers > Facebook**. Paste the App ID and App Secret, and enable Facebook login.
4. Copy the callback URL from Supabase (e.g., `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`).
5. In Facebook Developers, navigate to **Use Cases > Facebook Login > Settings**. Under **Valid OAuth Redirect URIs**, paste the callback URL.
6. Save changes and make sure Facebook Login is enabled.

### GitHub
1. Go to [GitHub Developer Settings](https://github.com/settings/developers) and click **New OAuth App**.
2. Set the application name and homepage URL.
3. Set the **Authorization callback URL** to **the callback URL copied from Supabase** (e.g., `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`).
4. After creation, copy the **Client ID** and **Client Secret**.
5. In Supabase, go to **Authentication > Providers > GitHub**. Paste the Client ID and Secret, and enable GitHub login.

### LinkedIn
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/) and create a new app.
2. In your app dashboard, go to **Auth > OAuth 2.0 settings**.
3. Set the **Redirect URL** to **the callback URL copied from Supabase** (e.g., `https://<your-supabase-project-ref>.supabase.co/auth/v1/callback`).
4. Copy the **Client ID** and **Client Secret** from the app settings.
5. In Supabase, go to **Authentication > Providers > LinkedIn**. Paste the Client ID and Secret, and enable LinkedIn login.

> **Note:** Always use the correct callback/redirect URL as shown in your Supabase Auth provider settings. For local development, you may need to add `http://localhost:3000/auth/v1/callback` as well.

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
pnpm prisma:generate
```

### 3. Create and Push Migrations
To create a new migration and push it to your Supabase database:
```bash
pnpm --filter backend prisma migrate dev --name init
# or to push existing schema (no migration prompt):
pnpm prisma:push
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
pnpm dev:backend
```

### 3. Run Frontend
```bash
pnpm dev:frontend
```

Or, in separate terminals, you can run both at once from the root:
```bash
pnpm dev:frontend
pnpm dev:backend
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
