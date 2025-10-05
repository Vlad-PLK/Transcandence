# 🎮 Transcendence - Next-Gen 3D Pong Experience

<div align="center">

![Game Banner](https://img.shields.io/badge/Game-Pong%203D-blueviolet?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A modern reimagining of the classic Pong game featuring stunning 3D graphics, real-time local and multiplayer games, and tournament systems.**

[Features](#-key-features) •
[Architecture](#-architecture) •
[Installation](#-installation) •
[Tech Stack](#-tech-stack) •
[Team](#-team)

---

### 🌐 Live Demo (Coming Soon)
*Hosted on personal VPS - Link will be updated upon deployment*

</div>

## 📋 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Development](#-development)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Game Mechanics](#-game-mechanics)
- [Security](#-security)
- [Team](#-team)
- [Roadmap](#-roadmap)
- [License](#-license)

## 🎯 About

**Transcendence** is a collaborative full-stack web application developed as part of the 42 School curriculum. This project takes the classic Pong game and elevates it into a modern, immersive 3D experience with multiplayer capabilities, social features, and a comprehensive tournament system.

Built with modern web technologies and containerized using Docker, Transcendence demonstrates proficiency in full-stack development, real-time communication, 3D graphics programming, and DevOps practices.

### 🎓 Academic Context

This project was developed at **42 Nice School** as a final web development project, focusing on:
- Full-stack architecture and design patterns
- Real-time bidirectional communication (WebSockets)
- 3D graphics programming and physics simulation
- Containerization and microservices
- Authentication and security best practices
- Internationalization and accessibility

## ✨ Key Features

### 🎮 Game Features

- **3D Graphics Engine**: Custom-built game engine using Three.js with realistic physics
- **Celestial Themes**: Customizable space environments featuring:
  - Stars (Sun, Red Giant, White Dwarf)
  - Black Holes with gravitational lens effects
  - Custom celestial body creation with size, color, and intensity controls
- **Dynamic Physics**:
  - Real-time collision detection and response
  - Speed boost mechanics with visual effects
  - Power-up system with paddle enhancements
  - Adjustable game parameters (duration, boost factors)
- **Multiple Game Modes**:
  - Local multiplayer (same device)
  - Online multiplayer (real-time via WebSockets)
  - Tournament mode with bracket system

### 👥 Social Features

- **User Profiles**:
  - Custom avatars with image upload
  - Comprehensive statistics tracking (wins, losses, draws, goals)
  - Match history with detailed game records
- **Friend System**:
  - Send and receive friend requests
  - View friends' profiles and statistics
  - Real-time online status indicators
- **Tournament System**:
  - Create and manage tournaments
  - Automatic bracket generation (4 players minimum)
  - Round progression with winner tracking
  - Individual tournament statistics

### 🔐 Authentication & Security

- **Multiple Authentication Methods**:
  - Traditional username/password authentication
  - OAuth 2.0 integration (42 School API)
  - Two-Factor Authentication (2FA) via email using TOTP
- **Secure Token Management**:
  - JWT-based authentication with refresh tokens
  - 30-minute access token lifetime
  - HTTP-only cookie support
- **HTTPS/TLS Encryption**:
  - SSL/TLS 1.2+ enforced
  - Secure WebSocket connections (WSS)

### 🌍 Internationalization

- Multi-language support: English, French, Russian
- Dynamic language switching without page reload
- Browser language detection with fallback

## 🏗 Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React SPA (Vite + React Router)                     │   │
│  │  - Three.js Game Engine                              │   │
│  │  - Context API State Management                      │   │
│  │  - Axios HTTP Client                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS (443) / WSS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Nginx Reverse Proxy                      │
│  - SSL/TLS Termination                                       │
│  - Route: / → Frontend (React)                              │
│  - Route: /api/* → Backend (Django)                         │
│  - Route: /wss/* → WebSocket (Django Channels)              │
│  - Route: /media/* → Static Files                           │
└─────────────────────────────────────────────────────────────┘
                            │
           ┌────────────────┼────────────────┐
           ▼                ▼                ▼
    ┌───────────┐   ┌─────────────┐   ┌──────────┐
    │  Frontend │   │   Backend   │   │  Redis   │
    │  (React)  │   │  (Django)   │   │  Server  │
    │           │   │             │   │          │
    │ Port 3000 │   │  Port 8000  │   │ Port 6379│
    │           │   │             │   │          │
    │  - Vite   │   │  - Daphne   │   │ - Channels│
    │  - Dev    │   │  - ASGI     │   │ - Cache  │
    │  Server   │   │  - REST API │   │          │
    └───────────┘   └─────────────┘   └──────────┘
                            │
                            ▼
                    ┌─────────────┐
                    │  PostgreSQL │
                    │  Database   │
                    │             │
                    │  Port 5432  │
                    └─────────────┘
```

### Container Architecture (Docker Compose)

```
Docker Network: transcendance
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────┐
│        nginx (Container)            │
│  Ports: 1080:80, 1443:443          │
│  - SSL certificates                 │
│  - Reverse proxy configuration      │
└─────────────────────────────────────┘
           │
           ├──────────────┬───────────────┐
           ▼              ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────┐
│   frontend   │  │   backend    │  │  redis   │
│  (Node 18)   │  │  (Python 3.10)│  │  (Alpine)│
│              │  │              │  │          │
│ Volume:      │  │ Volume:      │  │ Port:    │
│ - frontend   │  │ - backend    │  │  7777:6379│
└──────────────┘  └──────────────┘  └──────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   postgres   │
                  │  (Latest)    │
                  │              │
                  │ Volume:      │
                  │ - postgres_  │
                  │   data       │
                  └──────────────┘
```

### Backend Application Structure

```
backend/
├── backend/                    # Django project configuration
│   ├── asgi.py                # ASGI application (WebSocket support)
│   ├── settings.py            # Django settings
│   ├── urls.py                # Root URL configuration
│   ├── routing.py             # WebSocket routing
│   ├── consumers.py           # WebSocket consumers
│   └── middleware.py          # Custom middleware
│
├── users/                     # User management app
│   ├── models.py             # CustomUser model with 2FA, game settings
│   ├── views.py              # Auth views (login, register, OAuth, 2FA)
│   ├── serializers.py        # DRF serializers
│   └── urls.py               # User-related endpoints
│
├── gameinfo/                  # Match history and statistics
│   ├── models.py             # Match, PlayerStats models
│   └── views.py              # Stats retrieval and updates
│
├── friends/                   # Social features
│   ├── models.py             # FriendRequest, Friendship models
│   └── views.py              # Friend operations
│
└── tournaments/               # Tournament system
    ├── models.py             # Tournament, Participant, TournamentMatch
    ├── views.py              # Tournament CRUD, bracket management
    └── utils.py              # Match statistics updates
```

### Frontend Application Structure

```
front-react/src/
├── main.jsx                   # Application entry point
├── Routing.jsx                # React Router configuration
├── i18n.jsx                   # i18next configuration
│
├── Context Providers/         # Global state management
│   ├── UserDataContext.jsx   # Authenticated user data
│   ├── GameContext.jsx       # Game settings and state
│   ├── WebSocketContext.jsx  # WebSocket connection
│   ├── UserStatsContext.jsx  # User statistics
│   ├── TwoFaContext.jsx      # 2FA state
│   └── CurrentTournamentContext.jsx
│
├── Pages/
│   ├── WelcomePage.jsx       # Landing page
│   ├── UserHomePage.jsx      # Main dashboard
│   ├── UserSettings.jsx      # User profile management
│   ├── UserFriends.jsx       # Friends list
│   ├── UserGameSetup.jsx     # Game configuration
│   └── UserFriendPage.jsx    # Friend profile view
│
├── Components/
│   ├── ProtectedRoute.jsx    # Route authentication guard
│   ├── *Modal.jsx            # Various modal components
│   └── TranslationSelect.jsx # Language switcher
│
└── game_jsx/                  # Game engine (Three.js)
    ├── UserGame.jsx          # Main game loop and logic
    ├── UserGameWindow.jsx    # Game container
    ├── checkCollision.jsx    # Collision detection
    ├── vectors_functions.jsx # Vector mathematics
    ├── setRenderer.jsx       # Three.js renderer setup
    ├── setCamera.jsx         # Camera configuration
    ├── setPaddles.jsx        # Paddle creation
    ├── setBoosts.jsx         # Boost mechanics
    ├── setSolarySystem.jsx   # Celestial body creation
    ├── setWalls.jsx          # Game boundaries
    └── shockWave.jsx         # Visual effects
```

### Data Flow Architecture

#### Authentication Flow

```
┌──────────┐         ┌─────────┐         ┌──────────┐
│  Client  │         │  Nginx  │         │  Django  │
└────┬─────┘         └────┬────┘         └────┬─────┘
     │                    │                    │
     │ POST /api/token    │                    │
     ├───────────────────>│                    │
     │                    │ Forward request    │
     │                    ├───────────────────>│
     │                    │                    │
     │                    │    Validate        │
     │                    │    credentials     │
     │                    │                    │
     │                    │  Generate JWT      │
     │                    │  (access/refresh)  │
     │                    │<───────────────────┤
     │   JWT tokens       │                    │
     │<───────────────────┤                    │
     │                    │                    │
     │ Store in          │                    │
     │ localStorage       │                    │
     │                    │                    │
     │ GET /api/endpoint  │                    │
     │ Authorization:     │                    │
     │ Bearer <token>     │                    │
     ├───────────────────>│                    │
     │                    │ Verify JWT         │
     │                    ├───────────────────>│
     │                    │                    │
     │                    │ Return data        │
     │<──────────────────────────────────────>│
```

#### WebSocket Connection Flow

```
┌──────────┐         ┌─────────┐         ┌──────────┐         ┌────────┐
│  Client  │         │  Nginx  │         │ Channels │         │  Redis │
└────┬─────┘         └────┬────┘         └────┬─────┘         └────┬───┘
     │                    │                    │                    │
     │ WSS /wss/online/   │                    │                    │
     ├───────────────────>│                    │                    │
     │                    │ Upgrade to WS      │                    │
     │                    ├───────────────────>│                    │
     │                    │                    │                    │
     │                    │   Accept & Join    │                    │
     │                    │   "user" group     │                    │
     │                    │                    ├───────────────────>│
     │<──────────────────────────────────────>│   Store channel    │
     │                    │                    │                    │
     │ Send status update │                    │                    │
     ├───────────────────────────────────────>│                    │
     │ {username, type}   │                    │                    │
     │                    │                    │ Update DB          │
     │                    │                    │ (online_status)    │
     │                    │                    │                    │
     │                    │                    │ Broadcast to       │
     │                    │                    │ group via Redis    │
     │                    │                    ├───────────────────>│
     │<──────────────────────────────────────>│<───────────────────┤
     │ Receive status     │                    │                    │
```

#### Tournament Bracket System

```
Tournament Creation:
1. Creator creates tournament → Tournament instance
2. Add participants (4 minimum) → Participant instances
3. Shuffle participants → Create Round 1 matches

Round Progression:
Round 1 (4 participants):
┌─────────────┐
│ Player 1    │───┐
└─────────────┘   │  Match 1
                  ├────────> Winner 1
┌─────────────┐   │
│ Player 2    │───┘
└─────────────┘

┌─────────────┐
│ Player 3    │───┐
└─────────────┘   │  Match 2
                  ├────────> Winner 2
┌─────────────┐   │
│ Player 4    │───┘
└─────────────┘

Round 2 (Semi-Finals):
┌─────────────┐
│  Winner 1   │───┐
└─────────────┘   │  Match 3
                  ├────────> Finalist 1
┌─────────────┐   │
│  Winner 2   │───┘
└─────────────┘

Round 3 (Final):
┌─────────────┐
│ Finalist 1  │───┐
└─────────────┘   │  Match 4
                  ├────────> Champion
┌─────────────┐   │
│ Finalist 2  │───┘
└─────────────┘
```

## 🛠 Tech Stack

### Frontend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Framework | 18.3.1 |
| **Vite** | Build Tool & Dev Server | 5.3.1 |
| **Three.js** | 3D Graphics Engine | 0.166.1 |
| **React Router** | Client-side Routing | 6.24.0 |
| **Axios** | HTTP Client | 1.7.2 |
| **React Bootstrap** | UI Components | 2.10.4 |
| **i18next** | Internationalization | 23.11.5 |
| **Sass** | CSS Preprocessor | 9.0.0 |

### Backend
| Technology | Purpose | Version |
|-----------|---------|---------|
| **Django** | Web Framework | 5.1.1 |
| **Django REST Framework** | API Development | 3.15.2 |
| **Django Channels** | WebSocket Support | 4.1.0 |
| **Daphne** | ASGI Server | 4.1.2 |
| **djangorestframework-simplejwt** | JWT Authentication | 5.3.1 |
| **PostgreSQL** | Primary Database | Latest |
| **Redis** | Cache & Channel Layer | 5.0.8 |
| **pyotp** | TOTP 2FA | 2.9.0 |
| **Pillow** | Image Processing | 10.4.0 |

### DevOps & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container Orchestration |
| **Nginx** | Reverse Proxy & Load Balancer |
| **SSL/TLS** | Encryption (Let's Encrypt ready) |

## 🚀 Installation

### Prerequisites

- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Make** (optional, for convenience)
- **Git**

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/Vlad-PLK/Transcendence.git
cd Transcendence
```

2. **Configure environment variables**
```bash
# Create .env file in project root
touch .env
```

Add the following to `.env`:
```env
# Domain Configuration
DOMAIN=localhost

# OAuth Configuration (42 School API)
OAUTH_UID=your_42_oauth_client_id
OAUTH_SECRET=your_42_oauth_secret
OAUTH_CALLBACK=https://localhost:1443/oauth_callback/

# Database Configuration
DBNAME=transcendence_db
DBUSER=transcendence_user
DBPASSWORD=your_secure_password

# Volume Path (adjust to your system)
VOLUME_PATH=/home/yourusername/volumes
```

3. **Build and start services**

Using Make (recommended):
```bash
make
```

Or using Docker Compose directly:
```bash
docker-compose --env-file ./.env up --build
```

4. **Access the application**
- **Frontend**: https://localhost:1443
- **Backend API**: https://localhost:1443/api/
- **Admin Panel**: https://localhost:1443/admin/

### Initial Setup

Create a Django superuser to access the admin panel:
```bash
docker exec -it backend sh
python manage.py createsuperuser
```

## 💻 Development

### Available Make Commands

```bash
make           # Build and start all containers
make start     # Start existing containers
make clean     # Stop all containers
make fclean    # Stop containers, remove images and volumes
make re        # Full rebuild (fclean + make)
```

### Frontend Development

```bash
# Access frontend container
docker exec -it frontend sh

# Install new dependencies
npm install package-name

# Run linter
npm run lint

# Build for production
npm run build
```

### Backend Development

```bash
# Access backend container
docker exec -it backend sh

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Django shell
python manage.py shell
```

### Database Management

```bash
# Access PostgreSQL
docker exec -it postgres psql -U transcendence_user -d transcendence_db

# Backup database
docker exec postgres pg_dump -U transcendence_user transcendence_db > backup.sql

# Restore database
docker exec -i postgres psql -U transcendence_user transcendence_db < backup.sql
```

### Redis Management

```bash
# Access Redis CLI
docker exec -it redis redis-cli

# Monitor real-time commands
docker exec -it redis redis-cli MONITOR

# Flush all data (use with caution!)
docker exec -it redis redis-cli FLUSHALL
```

## 📁 Project Structure

```
Transcendence/
├── backend/                    # Django backend
│   ├── backend/               # Project configuration
│   ├── users/                 # User management app
│   ├── gameinfo/              # Game statistics app
│   ├── friends/               # Social features app
│   ├── tournaments/           # Tournament system app
│   ├── media/                 # User-uploaded files
│   ├── requirements.txt       # Python dependencies
│   ├── manage.py              # Django management script
│   └── Dockerfile             # Backend container config
│
├── front-react/               # React frontend
│   ├── src/
│   │   ├── game_jsx/         # Three.js game engine
│   │   ├── translations/     # i18n translation files
│   │   ├── *.jsx             # React components
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   ├── package.json          # Node dependencies
│   ├── vite.config.js        # Vite configuration
│   └── Dockerfile            # Frontend container config
│
├── nginx/                     # Nginx reverse proxy
│   ├── nginx.conf            # Nginx configuration
│   ├── Dockerfile            # Nginx container config
│   └── ssl/                  # SSL certificates (to be generated)
│
├── docker-compose.yml         # Multi-container orchestration
├── Makefile                   # Development commands
├── .env                       # Environment variables (not in repo)
├── CLAUDE.md                  # AI assistant context
└── README.md                  # This file
```

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/register/
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response: 201 Created
{
  "username": "string",
  "email": "string"
}
```

#### Login (JWT)
```http
POST /api/token/
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "otp_code": "string" (optional, if 2FA enabled)
}

Response: 200 OK
{
  "access": "jwt_access_token",
  "refresh": "jwt_refresh_token"
}
```

#### OAuth 42 Callback
```http
GET /api/oauth_callback/?code=<authorization_code>

Response: 200 OK
{
  "username": "string",
  "email": "string",
  "access_token": "jwt_token",
  "refresh_token": "jwt_token"
}
```

#### Enable 2FA
```http
POST /api/enable-2fa/
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "2FA is now enabled"
}
```

### User Management Endpoints

#### Get User Profile
```http
GET /api/player-info/
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "number",
  "username": "string",
  "email": "string",
  "avatar": "url",
  "is_2fa_enabled": "boolean",
  "online_status": "boolean",
  "startFlag": "number",
  "gargantuaSize": "number",
  "customStarSize": "number",
  ...
}
```

#### Update Username
```http
PATCH /api/update-username/
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_username"
}

Response: 200 OK
```

#### Upload Avatar
```http
POST /api/upload-avatar/
Authorization: Bearer <token>
Content-Type: multipart/form-data

avatar: <file>

Response: 200 OK
```

### Game Statistics Endpoints

#### Get Player Statistics
```http
GET /api/player-stats/
Authorization: Bearer <token>

Response: 200 OK
{
  "wins": "number",
  "losses": "number",
  "draws": "number",
  "goals": "number"
}
```

#### Get Match History
```http
GET /api/match-history/
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "number",
    "player1": "username",
    "player2": "username",
    "player1_score": "number",
    "player2_score": "number",
    "match_winner": "username",
    "match_date": "date"
  }
]
```

### Tournament Endpoints

#### Create Tournament
```http
POST /api/create-tournament/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Tournament Name"
}

Response: 200 OK
{
  "id": "number",
  "name": "string",
  "creator": "username",
  "winner": null
}
```

#### Add Participant
```http
POST /api/add-participant/
Authorization: Bearer <token>
Content-Type: application/json

{
  "tournament": "tournament_id",
  "nickname": "username"
}

Response: 201 Created
```

#### Shuffle and Create Matches
```http
POST /api/shuffle-participants/<tournament_id>/
Authorization: Bearer <token>

Response: 200 OK
{
  "status": "Participants shuffled and matches created"
}
```

#### Submit Match Result
```http
POST /api/match-result/<match_id>/
Authorization: Bearer <token>
Content-Type: application/json

{
  "player1_goals": "number",
  "player2_goals": "number"
}

Response: 200 OK
```

#### Get Tournament Matches
```http
GET /api/tournament-matches/<tournament_id>/
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "number",
    "player1": "username",
    "player2": "username",
    "winner": "username",
    "player1_goals": "number",
    "player2_goals": "number",
    "round": "number"
  }
]
```

### Friends Endpoints

#### Send Friend Request
```http
POST /api/friend-request/
Authorization: Bearer <token>
Content-Type: application/json

{
  "to_user": "user_id"
}

Response: 201 Created
```

#### Accept Friend Request
```http
POST /api/accept-friend-request/<request_id>/
Authorization: Bearer <token>

Response: 200 OK
```

#### Get Friends List
```http
GET /api/friends-list/
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "number",
    "username": "string",
    "avatar": "url",
    "online_status": "boolean"
  }
]
```

### WebSocket API

#### Online Status WebSocket
```javascript
// Connection
const ws = new WebSocket('wss://localhost:1443/wss/online/');

// Send status update
ws.send(JSON.stringify({
  username: 'username',
  type: 'open' // or 'close'
}));

// Receive status updates
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // { username: 'string', online_status: boolean }
};
```

## 🎮 Game Mechanics

### Physics Engine

The game features a custom-built physics engine using Three.js with the following components:

#### Ball Physics
- **Velocity**: 3D vector (`x`, `y`, `z`) representing ball speed and direction
- **Collision Response**: Reflection vector calculation based on surface normals
- **Speed Boost**: Multiplier applied to velocity when ball passes through boost zones
- **Paddle Interaction**: Adds horizontal velocity component based on paddle movement direction

#### Collision Detection
```javascript
// Collision normal calculation
function calculateCollisionNormal(sphere, paddle, planeGeometry) {
  // Check sphere-paddle intersection
  // Calculate contact point
  // Compute reflection normal
  // Apply velocity adjustment for paddle movement
}
```

#### Scoring System
- Goal detection when ball crosses plane boundaries (`z >= height/2` or `z <= -height/2`)
- Visual effects (shockwave) on goal
- Automatic ball reset to center

### Customization Options

Users can customize their game experience through the settings panel:

| Setting | Options | Effect |
|---------|---------|--------|
| **Celestial Body** | Sun, Red Giant, White Dwarf, Black Hole, Gargantua, Custom | Changes the central 3D object |
| **Star Size** | 0-10 | Adjusts celestial body dimensions |
| **Star Color** | Color picker | Changes body color |
| **Star Intensity** | 0-10 | Adjusts light emission |
| **Corona Type** | 0-3 | Changes outer glow effect |
| **Boosts Enabled** | On/Off | Enables speed boost zones |
| **Boost Factor** | 1-5 | Speed multiplier intensity |
| **Power Enabled** | On/Off | Enables paddle power-ups |
| **Game Duration** | 5-30 minutes | Match time limit |

### Controls

#### Local Multiplayer
- **Player 1 (Top Paddle)**:
  - `W` / `↑` - Move left
  - `E` / `→` - Move right

- **Player 2 (Bottom Paddle)**:
  - `A` - Move left
  - `D` - Move right

#### Camera Controls
- `C` - Toggle camera view (fixed/follow ball/player perspective)

#### Special Abilities (when enabled)
- `SPACE` - Activate streak power (requires 3+ consecutive hits)

## 🔒 Security

### Implemented Security Measures

#### 1. Authentication & Authorization
- **JWT Tokens**: Short-lived access tokens (30 min) with refresh capability
- **Password Hashing**: Django's PBKDF2 algorithm with SHA256
- **2FA Support**: Time-based One-Time Passwords (TOTP) via PyOTP
- **OAuth 2.0**: Integration with 42 School API for SSO

#### 2. Transport Security
- **HTTPS Enforcement**: HTTP automatically redirected to HTTPS (301)
- **TLS 1.2+**: Modern encryption protocols only
- **Secure WebSockets**: WSS protocol for real-time communication
- **HSTS Ready**: HTTP Strict Transport Security headers (to be enabled in production)

#### 3. Application Security
- **CSRF Protection**: Django CSRF tokens on state-changing operations
- **CORS Configuration**: Restricted origins in production
- **SQL Injection Protection**: Django ORM with parameterized queries
- **XSS Prevention**: React's built-in escaping and Content Security Policy ready

#### 4. Data Protection
- **Environment Variables**: Sensitive data in `.env` file (not in version control)
- **Secure Cookie Flags**: HttpOnly, Secure, SameSite attributes
- **Password Validation**: Django validators for password strength
- **Avatar Upload Validation**: File type and size restrictions

### Security Best Practices for Deployment

When deploying to production, ensure:

1. **Generate strong secrets**:
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

2. **Update Django settings**:
```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
```

3. **Use SSL certificates** (Let's Encrypt):
```bash
certbot certonly --webroot -w /var/www/html -d yourdomain.com
```

4. **Configure firewall**:
```bash
ufw allow 443/tcp
ufw allow 80/tcp  # For Let's Encrypt renewal
ufw enable
```

## 👥 Team

This project was collaboratively developed by three students at **42 Nice School**:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Vlad-PLK">
        <img src="https://github.com/Vlad-PLK.png" width="100px;" alt="Vlad-PLK"/><br />
        <sub><b>Vlad-PLK (vpolojie)</b></sub>
      </a><br />
      <sub>Full-Stack Development</sub><br />
      <sub>Frontend, API Integration, Docker, Database, DevOps</sub>
    </td>
    <td align="center">
      <a href="https://github.com/gendelize">
        <img src="https://github.com/gendelize.png" width="100px;" alt="gendelize"/><br />
        <sub><b>gendelize</b></sub>
      </a><br />
      <sub>Backend Development</sub><br />
      <sub>Django, REST API, Authentication, Database Models</sub>
    </td>
    <td align="center">
      <a href="https://github.com/TVincil">
        <img src="https://github.com/TVincil.png" width="100px;" alt="TVincil"/><br />
        <sub><b>TVincil</b></sub>
      </a><br />
      <sub>Game Development & Graphics</sub><br />
      <sub>Three.js, Game Engine, Physics, Visual Effects</sub>
    </td>
  </tr>
</table>

### Contribution Breakdown

```
┌─────────────────────────────────────────────────────┐
│  Component Ownership & Responsibilities             │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🎨 Frontend (React)                    Vlad-PLK   │
│     ├── UI/UX Components                           │
│     ├── State Management (Context API)             │
│     ├── Routing & Navigation                       │
│     ├── Modals & Forms                             │
│     └── Internationalization (i18n)                │
│                                                     │
│  🎮 Game Engine (Three.js)              TVincil    │
│     ├── 3D Graphics Rendering                      │
│     ├── Physics Simulation                         │
│     ├── Collision Detection                        │
│     ├── Celestial Bodies System                    │
│     └── Visual Effects                             │
│                                                     │
│  ⚙️  Backend (Django)                   gendelize  │
│     ├── REST API Endpoints                         │
│     ├── Database Models & Relations                │
│     ├── Authentication & Authorization             │
│     ├── WebSocket Consumers                        │
│     └── Business Logic                             │
│                                                     │
│  🔌 API Integration                     Vlad-PLK   │
│     ├── Axios Configuration                        │
│     ├── API Call Implementation                    │
│     ├── Error Handling                             │
│     └── Token Management                           │
│                                                     │
│  🗄️  Database Design                    Vlad-PLK   │
│     ├── Schema Planning                            │
│     ├── Migrations Management                      │
│     ├── Data Relationships                         │
│     └── Query Optimization                         │
│                                                     │
│  🐳 DevOps & Infrastructure             Vlad-PLK   │
│     ├── Docker Configuration                       │
│     ├── Docker Compose Orchestration               │
│     ├── Nginx Reverse Proxy Setup                  │
│     ├── Environment Management                     │
│     └── Deployment Strategy                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 🗺 Roadmap

### Current Features ✅
- [x] 3D Pong game with Three.js
- [x] Local multiplayer
- [x] Tournament system with brackets
- [x] User authentication (traditional + OAuth + 2FA)
- [x] Friend system with online status
- [x] Match history and statistics
- [x] Customizable game settings
- [x] Multi-language support (EN/FR/RU)
- [x] Docker containerization

### Planned Enhancements 🚧

#### Phase 1: Infrastructure
- [ ] Deploy to VPS with SSL certificates
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Implement automated testing (Jest + Pytest)
- [ ] Add monitoring and logging (Prometheus + Grafana)
- [ ] Database backup automation

## 📊 Project Statistics

```
Languages Used:
JavaScript (React/Three.js)  ████████████████████░░░  68.4%
Python (Django)              ████████░░░░░░░░░░░░░░░  24.2%
CSS/SCSS                     ██░░░░░░░░░░░░░░░░░░░░░   4.8%
HTML                         █░░░░░░░░░░░░░░░░░░░░░░   1.9%
Dockerfile/Config            ░░░░░░░░░░░░░░░░░░░░░░░   0.7%

Project Metrics:
├── Total Lines of Code:     ~15,000+
├── React Components:        35+
├── Django Models:          8
├── API Endpoints:          40+
├── Docker Services:        5
├── Development Time:       4 months
└── Team Members:           3
```

## 🤝 Contributing

While this is primarily an academic project, contributions, suggestions, and feedback are welcome!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Code Style Guidelines

**Frontend (JavaScript/React)**:
- Use ESLint configuration provided
- Follow React Hooks best practices
- Use functional components with hooks
- Maintain component modularity

**Backend (Python/Django)**:
- Follow PEP 8 style guide
- Use Django best practices
- Write docstrings for complex functions
- Keep views lean, logic in models/utils

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Vlad-PLK, gendelize, TVincil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- **42 School** for the project subject and educational framework
- **42 Nice** for providing the learning environment and resources
- **Three.js Community** for excellent documentation and examples
- **Django Community** for comprehensive guides and best practices
- **Open Source Contributors** for the amazing libraries used in this project

## 📞 Contact & Links

- **Project Repository**: [github.com/Vlad-PLK/Transcendence](https://github.com/Vlad-PLK/Transcendence)
- **Live Demo**: Coming soon on personal VPS
- **Issues & Bug Reports**: [GitHub Issues](https://github.com/Vlad-PLK/Transcendence/issues)
- **42 School**: [42.fr](https://42.fr/)

---

<div align="center">

**Made with ❤️ at 42 Nice School**

*Transforming classic games into modern experiences*

[![42 School](https://img.shields.io/badge/42-Nice-000000?style=for-the-badge&logo=42&logoColor=white)](https://42nice.fr/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-5.1.1-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.166.1-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

⭐ **Star this repo if you found it interesting!** ⭐

</div>
