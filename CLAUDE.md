# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Transcendence is a full-stack web application for a multiplayer Pong game with 3D graphics using Three.js. The project features:
- Online multiplayer gameplay with real-time WebSocket communication
- Tournament system with bracket management
- Social features (friends, user profiles, online status)
- OAuth authentication (42 school) and 2FA support
- i18n support (English, French, Russian)
- 3D game environment with customizable celestial bodies and physics

## Architecture

### Tech Stack
- **Frontend**: React 18 + Vite, Three.js for 3D graphics, React Router, React-Bootstrap
- **Backend**: Django 5.1 + Django REST Framework, Django Channels for WebSockets
- **Database**: PostgreSQL
- **Cache/Message Broker**: Redis (for Django Channels layer and caching)
- **Server**: Daphne (ASGI server)
- **Deployment**: Docker Compose with Nginx reverse proxy

### Service Architecture
The project runs two separate frontends with shared backend infrastructure:
- `nginx`: Reverse proxy routing to both applications (ports 1080:80, 443:443)
  - `vladplk.mysmarttech.fr` → Portfolio (port 3001)
  - `transcendence.mysmarttech.fr` → Transcendence game (port 3000)
- `transcendence`: React development server for Transcendence game (Vite, port 3000)
- `portfolio`: React development server for portfolio site (Vite, port 3001)
- `backend`: Django + Daphne ASGI server (port 8000) - shared by both frontends
- `postgres`: PostgreSQL database - shared
- `redis`: Redis for Channels and caching (port 7777:6379) - shared

### Backend Structure
Django project with app-based organization:
- `users`: Custom user model with 2FA, OAuth, avatar, game settings, online status
- `gameinfo`: Match history and game statistics
- `friends`: Friend relationships and requests
- `tournaments`: Tournament creation, brackets, participant management
- `backend.consumers`: WebSocket consumer for real-time online status (`OnlineStatusConsumer`)

WebSocket routing is configured in `backend/backend/asgi.py` with path `wss/online/`.

Authentication uses JWT tokens (djangorestframework-simplejwt) with 30-minute access tokens and 1-day refresh tokens.

### Frontend Structure
React SPA with:
- Context providers for state management: `UserDataContext`, `GameContext`, `WebSocketContext`, `TwoFaContext`, `UserStatsContext`, `GuestDataContext`, `CurrentTournamentContext`, `TournamentPairDataContext`
- Protected routes using `ProtectedRoute` component
- Modal-based UI components for login, registration, game settings, multiplayer, tournaments
- Game engine in `src/game_jsx/` with modular Three.js setup (renderer, camera, paddles, walls, celestial system, collision detection, boost mechanics)

Key game files:
- `UserGame.jsx`: Main game loop and logic
- `UserGameWindow.jsx`: Game container component
- Utility modules: `setRenderer.jsx`, `setCamera.jsx`, `setPaddles.jsx`, `setBoosts.jsx`, `setSolarySystem.jsx`, `checkCollision.jsx`, `vectors_functions.jsx`

### API Communication
- Frontend uses axios instance (`src/api.jsx`) with JWT token interceptor
- Base URL dynamically set to `window.location.host`
- API endpoints prefixed with `/api/`

### Database Models
Custom user model (`users.CustomUser`) extends AbstractUser with fields for:
- Avatar, 2FA settings, online status
- Game customization: celestial body settings (size, color, intensity), boost settings, game duration

## Development Commands

### Initial Setup
```bash
# Build and start all containers
make

# Or directly with docker-compose
docker-compose --env-file ./.env up --build
```

### Container Management
```bash
# Start existing containers
make start
# or: docker-compose start

# Stop containers
make clean
# or: docker-compose stop

# Stop and remove everything (containers, images, volumes)
make fclean

# Rebuild from scratch
make re
```

### Backend Development
```bash
# Access backend container
docker exec -it backend sh

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server (already runs via docker-compose command)
daphne -b 0.0.0.0 -p 8000 backend.asgi:application
```

### Frontend Development
```bash
# Access frontend container
docker exec -it frontend sh

# Install dependencies
npm install

# Run dev server (already runs via docker-compose)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Environment Variables
Create a `.env` file in the project root with:
```
DOMAIN=your-domain.com
OAUTH_UID=42_oauth_client_id
OAUTH_SECRET=42_oauth_secret
OAUTH_CALLBACK=your_callback_url
DBNAME=database_name
DBUSER=database_user
DBPASSWORD=database_password
TRANSCENDENCE_PATH=/home/vlad-plk/volumes/transcendence
PORTFOLIO_PATH=/home/vlad-plk/volumes/portfolio
```

## Important Implementation Notes

### WebSocket Connection
- Online status WebSocket connects to `wss://<host>/wss/online/`
- Consumer expects messages with format: `{"username": "...", "type": "open|close"}`
- Consumer broadcasts status changes to all clients in the `user` group

### Game Physics
- Game uses Three.js with custom physics engine (not a physics library)
- Ball velocity stored as Three.js Vector3
- Collision detection in `checkCollision.jsx`
- Boost mechanics modify ball velocity multiplier
- Celestial bodies (sun, black hole, etc.) can affect gameplay based on user settings

### Custom User Settings
The `CustomUser` model stores per-user game customization:
- `startFlag`: Starting celestial body selection
- `gargantuaSize`, `gargantuaColor`, `gargantuaIntensity`: Black hole settings
- `customStarSize`, `customStarColor`, `customStarIntensity`, `customCoronaType`: Star settings
- `boostsEnabled`, `boostFactor`: Speed boost settings
- `powerEnabled`: Power-up toggles
- `gameDuration`: Match time limit

### Authentication Flow
1. OAuth callback handled at `/oauth_callback/` (see `OAuth.jsx`)
2. JWT tokens stored in localStorage (key: `ACCESS_TOKEN`)
3. Token included in Authorization header via axios interceptor
4. 2FA verification flow when enabled (uses pyotp library)

### Routing
- All API routes go through Nginx to backend container
- Frontend uses React Router with hash-based routing
- Protected routes wrap authenticated pages with `ProtectedRoute` component

## Testing
No explicit test configuration found. Add tests using:
- Backend: Django test framework (`python manage.py test`)
- Frontend: Add testing library (e.g., Vitest, Jest) to package.json

## Common Pitfalls
- Ensure `.env` file exists before running `make` or `docker-compose up`
- Both frontend volume paths (`TRANSCENDENCE_PATH` and `PORTFOLIO_PATH`) must be set in `.env`
- SSL certificates for both domains must exist before starting nginx
- Redis must be running for WebSocket functionality (online status)
- CORS settings allow all origins in development (`CORS_ALLOW_ALL_ORIGINS = True`)
- Portfolio runs on port 3001, Transcendence on port 3000

## Deployment Guide
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for the dual-site architecture.
