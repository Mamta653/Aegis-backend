# Aegis AI — Backend

> **Production REST API** · NestJS · PostgreSQL · JWT Auth · Email · Video Calls


[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql)](https://supabase.com)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3-FE0902?style=for-the-badge)](https://typeorm.io)

---

##  Live API

**Base URL:** https://aegis-backend-7kf1.onrender.com

**Frontend:** https://aegis-frontend-gilt.vercel.app

---

##  Overview

This is the backend API for **Aegis AI**, a telehealth platform built with NestJS. It handles user authentication with JWT, doctor consultation management, Daily.co video call room generation, and transactional email delivery via Resend.

---

##  Features

- **JWT Authentication** — Secure signup, signin, token-based sessions
- **Password Reset Flow** — Cryptographic token generation + email delivery
- **Doctor Management** — Consultation listing, filtering, and booking system
- **Video Call Rooms** — Dynamic Daily.co room creation per consultation
- **Email Service** — Transactional emails via Resend API
- **Database ORM** — TypeORM with auto-migration on startup
- **Cloud Database** — PostgreSQL hosted on Supabase

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 10 |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | TypeORM |
| Auth | JWT + bcrypt |
| Email | Resend API |
| Video | Daily.co REST API |
| Deployment | Render |

---

##  API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/auth/signup` | Register new user |  
| POST | `/auth/signin` | Login, returns JWT | 
| POST | `/auth/forgot-password` | Send password reset email | 
| POST | `/auth/reset-password` | Reset password with token | 

### Consultation

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/consultation/doctors` | List all doctors | 
| POST | `/consultation/book` | Book a consultation | 
| GET | `/consultation/my` | Get user's consultations | 
| GET | `/consultation/room/:id` | Get Daily.co video room | 
| POST | `/consultation/seed-doctors` | Seed sample doctors | 

---

## Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts       # Auth route handlers
│   ├── auth.service.ts          # Business logic, JWT, email
│   ├── auth.module.ts
│   ├── user.entity.ts           # User database model
│   ├── password-reset.entity.ts # Reset token model
│   └── jwt.strategy.ts          # Passport JWT strategy
├── consultation/
│   ├── consultation.controller.ts
│   ├── consultation.service.ts  # Doctor & booking logic
│   ├── consultation.module.ts
│   └── entities/                # Doctor, Consultation models
├── app.module.ts                # Root module, DB config
└── main.ts                      # Bootstrap, CORS config
```

---

##  Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL (local or cloud)
- Resend account (for emails)
- Daily.co account (for video)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mamta653/Aegis-backend.git
cd Aegis-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run start:dev
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/aegis_db
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=aegis_db

# Auth
JWT_SECRET=your_super_secret_key

# Email (Resend)
RESEND_API_KEY=re_your_api_key

# Video (Daily.co)
DAILY_API_KEY=your_daily_api_key

# App
FRONTEND_URL=http://localhost:5173
PORT=3000
```

### Available Scripts

```bash
npm run start:dev    # Development with hot reload
npm run build        # Compile TypeScript
npm run start:prod   # Run compiled production build
npm run test         # Run unit tests
```

---

##  Architecture

```
Client (React)
     │
     ▼ HTTPS REST
NestJS API (Render)
     │         │           │
     ▼         ▼           ▼
Supabase    Resend      Daily.co
(PostgreSQL) (Email)   (Video Rooms)
```

---

## Security

- Passwords hashed with **bcrypt** (salt rounds: 10)
- JWT tokens signed with secret key, expire in 24h
- Password reset tokens are **cryptographically random** (32 bytes), single-use, expire in 30 minutes
- CORS restricted to frontend domain only
- Environment variables never committed to Git

---

##  Deployment

This API is deployed on **Render** (free tier) with automatic deployments on push to `main`.

```bash
# Build command (on Render)
npm install && npm run build

# Start command (on Render)
npm run start:prod
```

>  Free tier spins down after 15 mins of inactivity. First request may take ~50 seconds to wake up.

---

##  Frontend Repository

 https://github.com/Mamta653/Aegis-frontend

---

##  Author

**Mamta** — Full Stack Developer
- GitHub: [@Mamta653](https://github.com/Mamta653)

---

##  License

This project is for portfolio and learning purposes.
