# OAuth 2.0 + Email SignUp with Supabase Starter Package

A modern starter template for building full-stack applications with authentication (email/password & OAuth: Google, Facebook, GitHub, LinkedIn) using Supabase. Use this as a foundation to quickly launch your next project!

## 🌐 Live Demo

Check out the live project: **[https://o-auth-sign-up-with-supabase.vercel.app/](https://o-auth-sign-up-with-supabase.vercel.app/)**

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
  - @nestjs-modules/mailer: 2.0.2 (Email functionality)
- **Auth:** Supabase Auth (OAuth + Email/Password)
- **ORM:** Prisma 6.12.0
- **Package Manager:** pnpm 10.11.0 (monorepo)

---

## ✨ Features

- **🔐 Authentication:**
  - Email/password authentication
  - OAuth with Google, Facebook, GitHub, LinkedIn
  - Secure password reset functionality
  - JWT token management
- **📧 Email System:**
  - Password reset emails with secure tokens
  - Professional HTML email templates
  - Configurable SMTP settings
- **🛡️ Security:**
  - Password hashing with bcrypt
  - Secure token generation
  - Token expiration (1 hour)
  - Single-use reset tokens
- **🎨 UI/UX:**
  - Modern, responsive design with Mantine UI
  - Centered layout for better user experience
  - Loading states and error handling
  - Form validation with real-time feedback
- **🏗️ Architecture:**
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

#### Backend Environment (`apps/backend/.local.env`)
```env
# Database connection string for Prisma
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# JWT secret for authentication
JWT_SECRET="your_jwt_secret"

# Supabase credentials (if used in backend)
SUPABASE_URL="https://your-supabase-url.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# SMTP Configuration for Email (Password Reset)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Frontend URL (for password reset links)
FRONTEND_URL="http://localhost:3000"
```

#### Frontend Environment (`apps/frontend/.env`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> **Tip:** Never commit your `.env` files to version control.

### 2. Email Configuration (Password Reset)

#### Gmail Setup (Recommended)
1. **Enable 2-Step Verification** on your Google account
2. **Generate App Password:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate a password
   - Use this generated password as `SMTP_PASS`

#### Alternative Email Providers
**Outlook/Hotmail:**
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-regular-password"
```

**Yahoo:**
```env
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"
SMTP_USER="your-email@yahoo.com"
SMTP_PASS="your-app-password"
```

### 3. Obtaining OAuth Credentials
- **Google:** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
- **Facebook:** [Facebook Developers](https://developers.facebook.com/)
- **GitHub:** [GitHub Developer Settings](https://github.com/settings/developers)
- **LinkedIn:** [LinkedIn Developers](https://www.linkedin.com/developers/)

Set the redirect URIs to point to your frontend (e.g., `http://localhost:3000/api/auth/callback/{provider}` or as required by your setup).

### 4. Supabase Setup
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

## 🔐 Password Reset Flow

The application includes a complete password reset system:

### How It Works
1. **User requests password reset** by clicking "Forgot password?" on the login form
2. **System validates email** and generates a secure reset token
3. **Email is sent** with a professional HTML template containing the reset link
4. **User clicks the link** and is taken to the reset password page
5. **User enters new password** with confirmation
6. **System validates token** and updates the password
7. **Token is marked as used** and cannot be reused

### Security Features
- **Secure token generation** using crypto.randomBytes()
- **1-hour token expiration** for security
- **Single-use tokens** (marked as used after reset)
- **Password hashing** with bcrypt
- **Email validation** before sending reset link

### API Endpoints
```http
POST /auth/forgot-password
Content-Type: application/json
{
  "email": "user@example.com"
}

POST /auth/reset-password
Content-Type: application/json
{
  "token": "reset-token-from-email",
  "newPassword": "new-password-123"
}
```

---

## 🗄️ Prisma & Database Setup

This project uses Prisma as the ORM for the backend. You can manage your database schema and migrations easily.

### 1. Set your Supabase Postgres connection string in `apps/backend/.local.env`:
```env
DATABASE_URL=your_supabase_postgres_connection_string
```
You can find this in your Supabase project under **Settings > Database**.

### 2. Generate Prisma Client
From the root of the monorepo:
```bash
cd apps/backend
pnpm prisma:generate
```

### 3. Create and Push Migrations
To create a new migration and push it to your Supabase database:
```bash
pnpm prisma:push
```

### 4. Database Schema
The project includes these models:
- **User** - Regular email/password users
- **OAuthUser** - OAuth provider users
- **PasswordResetToken** - Password reset tokens with expiration

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
    backend/    # NestJS backend (API, Auth, Prisma, Email)
      src/
        auth/    # Authentication logic
          templates/  # Email templates
        prisma/  # Database schema and migrations
    frontend/   # Next.js frontend (UI, Auth, Supabase client)
      src/
        app/
          reset-password/  # Password reset page
        components/
          Auth/           # Authentication components
        lib/
          api/           # API client
          auth/          # Auth utilities
  package.json  # Workspace config
  pnpm-workspace.yaml
  README.md
```

---

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Render/Heroku)
1. Set up your backend environment variables
2. Configure SMTP settings for email functionality
3. Deploy using your preferred platform

---

## 🤝 Contributing

Feel free to fork, open issues, or submit PRs! This project is open for improvements and new features.

---

## 🪪 License

MIT (or specify your license here)

---

**Happy hacking! 🚀**
