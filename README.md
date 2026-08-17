# 🥗 Calcu: Smart Calorie Tracker & AI Nutrition Assistant

![Calcu App Banner](https://via.placeholder.com/1200x400/0d9488/ffffff?text=Calcu+-+Smart+Calorie+Tracker)

**Calcu** is a modern, AI-powered Progressive Web Application (PWA) designed to make calorie counting and macro tracking effortless. Built with Next.js 16 (App Router), it leverages Google's Gemini 1.5 Flash AI to instantly recognize food from photos and automatically calculate nutritional values.

---

## ✨ Key Features

- 📸 **AI Food Recognition:** Snap a photo of your meal, and the integrated Gemini AI will instantly identify the food, estimating calories, protein, carbs, and fat.
- 📱 **Progressive Web App (PWA):** Installable on both mobile and desktop for a native app-like experience, complete with an App Shell architecture and Bottom Tab navigation.
- 🌍 **Bilingual Support (TH/EN):** Seamlessly switch between Thai and English with zero page reloads.
- 📊 **Interactive Dashboard:** Visualize your daily progress with beautiful, responsive charts (built with Recharts) tracking your calories and macros against your personal goals.
- ⚖️ **Weight Tracking:** Log your weight daily and monitor your progress over time.
- 🔒 **Secure Authentication:** Robust user authentication powered by NextAuth.js.
- 🛡️ **Enterprise-Grade Security:** Comprehensive Zod validation, in-memory rate limiting, and strict security headers.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **Database:** SQLite with [Prisma ORM](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **AI Integration:** [Google Generative AI SDK](https://ai.google.dev/) (Gemini 1.5 Flash)
- **Charts:** [Recharts](https://recharts.org/)
- **PWA:** `@ducanh2912/next-pwa`
- **Deployment:** Docker & Docker Compose Ready

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- npm or yarn
- A Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kktpx/Calcu.git
   cd Calcu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory based on `.env.example` (or configure the following):
   ```env
   DATABASE_URL="file:./dev.db"
   AUTH_SECRET="your_generated_secret_key_here"
   GEMINI_API_KEY="your_google_gemini_api_key_here"
   ```
   *(Generate an AUTH_SECRET using `openssl rand -base64 32`)*

4. **Initialize the Database**
   ```bash
   npx prisma db push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to see the application.

---

## 🐳 Running with Docker

Calcu is fully containerized and optimized for production using Docker. It uses Next.js `standalone` output for a minimal image footprint.

1. **Ensure your `.env` is configured correctly.**
2. **Build and start the container:**
   ```bash
   docker-compose up -d --build
   ```
3. The app will be available at `http://localhost:3000`. 
4. The SQLite database is mounted as a volume (`./prisma`), ensuring your data persists across container restarts.

---

## 📁 Project Structure

```text
├── prisma/             # Database schema and SQLite file
├── public/             # Static assets, PWA manifest, and icons
├── src/
│   ├── app/            # Next.js App Router (Pages, Layouts, API routes)
│   ├── components/     # Reusable UI components (Forms, Charts, Layout)
│   ├── lib/            # Utilities (Prisma client, Gemini API, i18n, Zod)
│   └── actions/        # Next.js Server Actions (Database mutations)
├── Dockerfile          # Multi-stage Docker build configuration
├── docker-compose.yml  # Production deployment configuration
└── next.config.ts      # Next.js configuration (PWA, Security Headers)
```

---

## 🛡️ Security Highlights (Phase 9 Implementation)

- **Strict Validation:** All incoming data through Server Actions is strictly typed and validated using `Zod`.
- **Rate Limiting:** Custom in-memory rate limiter protects authentication routes and AI endpoints against abuse and brute-force attacks.
- **Headers:** Configured `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, and `Referrer-Policy` to mitigate common web vulnerabilities.

---

## 👨‍💻 Developed By

**Kittipop Sanpho (kktpx)**

A demonstration of full-stack modern web development, combining beautiful UI/UX design with practical AI integration and robust backend architecture.
