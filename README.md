# VibeRoll Backend

## Overview

VibeRoll is a fluid-scrolling video application inspired by TikTok and Pinterest. This repository contains the backend services powering authentication, video uploads, AI features (captioning, tagging), and payment integration.

## Features

- 🔐 User authentication and session management (JWT)
- 📹 Video upload and storage via cloud provider
- 🧠 AI-powered captions using ChatGPT
- 🏷️ Smart tagging using Google Vision API
- 💳 Stripe payments and NFT support
- 🐳 Docker-ready for seamless deployment
- 📈 API for video feed, profiles, and metadata

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT
- **AI Services:** OpenAI GPT, Google Vision
- **Payments:** Stripe, NFT support
- **DevOps:** Docker, dotenv, CORS, Helmet, Morgan

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB instance (local or Atlas)
- API keys for:
  - OpenAI
  - Google Cloud Vision
  - Stripe

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/celestn1/viberoll-backend.git
   cd viberoll-backend
...
