
# VibeRoll Backend

The backend API for **VibeRoll**, a next-gen content-sharing platform. Built with **Node.js**, **Express**, **PostgreSQL**, **Redis**, and **JWT authentication**, this service powers video uploads, user authentication, role-based access, AI captioning, and audit logging.

---

## Features

- JWT Authentication (Access + Refresh Tokens)
- Role-based access control (Admin/User)
- AI Caption Generation (OpenAI)
- Swagger API Docs
- Redis Caching
- Video Metadata Handling
- Audit Log System (Admin actions)
- Soft-delete + Restore Users
- Docker & CI/CD Ready

---

## Tech Stack

| Layer       | Tech                             |
|-------------|----------------------------------|
| Language    | Node.js + Express                |
| Database    | PostgreSQL                       |
| Caching     | Redis                            |
| Auth        | JWT + Bcrypt                     |
| Docs        | Swagger (OpenAPI 3.0)            |
| Infra       | PM2 or systemd                   |

---

## 📂 Project Structure

```
viberoll-backend/
├── controllers/       # API logic
├── routes/            # Route definitions
├── models/            # DB queries (pg)
├── configs/           # Redis + DB config
├── middleware/        # Auth, error, rate limit
├── swagger.js         # Swagger config
├── server.js          # App entry point
├── .env               # Environment variables


azureuser@viberoll-nodejs-app:~/viberoll-backend$ tree -I 'node_modules' -L 3
├── __tests__
│   ├── ethersWallet.test.js
│   ├── logger.test.js
│   ├── test-db.test.js
│   └── test-redis.test.js
├── configs
│   ├── db.js
│   ├── redis.js
│   └── upload.js
├── constants.js
├── controllers
│   ├── admin
│   │   └── userAdminController.js
│   ├── commentController.js
│   ├── logoutController.js
│   ├── tokenController.js
│   ├── userController.js
│   └── videoController.js
├── docs
│   └── swagger.json
├── logs
│   └── error.log
├── middleware
│   ├── adminMiddleware.js
│   ├── asyncHandler.js
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── validateMiddleware.js
├── models
│   ├── commentModel.js
│   ├── userModel.js
│   └── videoModel.js
├── package-lock.json
├── package.json
├── routes
│   ├── admin
│   │   └── adminRoutes.js
│   ├── authRoutes.js
│   ├── commentRoutes.js
│   ├── userRoutes.js
│   └── videoRoutes.js
├── server.js
├── services
│   ├── ffmpegService.js
│   ├── nftService.js
│   └── openaiService.js
├── swagger.js
├── uploads
│   └── 1739856246617-649175844.mp4
└── utils
    └── logger.js

14 directories, 39 files
azureuser@viberoll-nodejs-app:~/viberoll-backend$

```

---

## API Documentation

Once the server is running:

```
http://<your-server-ip>:4001/api-docs
```

Powered by Swagger UI.

---

## Environment Variables

Create a `.env` file in the root:

```env
# Server
PORT=4001
NODE_ENV=production

# Database
DATABASE_URL=postgres://viberoll_service:admin@localhost:5432/viberoll

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_ACCESS_TOKEN_EXPIRATION=24h
JWT_REFRESH_TOKEN_EXPIRATION=7d
SALT_ROUNDS=10

# AI Integration
OPENAI_API_KEY=your_openai_key
OPENAI_API_ENDPOINT=https://api.openai.com/v1/engines/davinci/completions

# Blockchain
NFT_CONTRACT_ADDRESS=0x123...
RPC_URL=https://polygon-rpc.com
WALLET_PRIVATE_KEY=0x...
```

> Never commit `.env` to version control.

---

## Running Locally

```bash
git clone https://github.com/celestn1/viberoll-backend.git
cd viberoll-backend
npm install
cp .env.example .env  # Then fill it in
npm start
```

---

## PostgreSQL Setup

```sql
CREATE USER viberoll_service WITH PASSWORD 'admin';
CREATE DATABASE viberoll OWNER viberoll_service;
```

Restore your backup if needed:

```bash
psql -U postgres -d viberoll -f viberoll_backup.sql
```

---

## Production Deployment

Use PM2 or systemd for process management:

```bash
pm2 start server.js --name viberoll-backend
pm2 save
```

Or follow full deployment instructions in `DEPLOYMENT.md`.

---

## API Routes Overview

| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| POST   | `/auth/login`         | Login a user                    |
| POST   | `/auth/register`      | Register a new user             |
| PUT    | `/user/update`        | Update user info                |
| GET    | `/videos`             | List all videos                 |
| POST   | `/videos/upload`      | Upload video metadata           |
| PUT    | `/admin/soft-delete`  | Soft-delete user (admin only)   |
| PUT    | `/admin/restore`      | Restore soft-deleted user       |

> All protected routes require an `Authorization: Bearer <accessToken>` header.

---

## Security

- Rate-limited via `express-rate-limit`
- Helmet headers
- Encrypted passwords with `bcrypt`
- Signed tokens with JWT

---

## Audit Logging

Admin actions (soft delete, restore) are tracked in `audit_logs` with metadata including:
- admin ID
- affected user ID/email
- action
- timestamp
- reason

---

## ✅ License

MIT

---


