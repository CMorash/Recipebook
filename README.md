# Digital Cookbook 🍳

A modern, full-stack digital cookbook application for managing and organizing your favorite recipes.

## Features

- 🔐 **User Authentication** - Secure JWT-based authentication with validation
- 📝 **Recipe Management** - Create, edit, delete, and view recipes
- ⭐ **5-Star Rating System** - Rate your recipes
- 📱 **Responsive Design** - Optimized for mobile, tablet, and desktop
- 🎨 **Modern UI** - Beautiful Material-UI design with smooth animations
- 🔔 **Toast Notifications** - Clear user feedback for all actions
- ✅ **Form Validation** - Comprehensive validation with helpful error messages
- 🐳 **Docker Support** - Containerized deployment
- 🚀 **Automated Deployments** - Zero-downtime deployments via GitHub Actions
- 🌐 **Live on Fly.io** - Free, production-ready hosting

## Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI (MUI) for UI components
- React Router v6 for navigation
- Axios for API calls
- Vite for fast development

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing

### DevOps & Hosting
- **Fly.io** - Main hosting platform (free tier, zero SSH deployment)
- Docker & Docker Compose
- GitHub Actions for CI/CD (automated deployments)
- Nginx as reverse proxy

## Project Structure

```
.
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   └── types/         # TypeScript type definitions
│   ├── Dockerfile
│   └── package.json
│
├── backend/               # Express backend API
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── config/        # Configuration files
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml     # Development Docker setup
├── docker-compose.prod.yml # Production Docker setup
└── .github/workflows/     # CI/CD workflows

```

## Getting Started

### Prerequisites

- Node.js 18+ LTS
- MongoDB Atlas account (free tier)
- Docker & Docker Compose (optional, for containerized development)

### Local Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd Recipes_V1
```

2. **Set up Backend**

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT secret
```

3. **Set up Frontend**

```bash
cd ../frontend
npm install

# The .env file is already configured for local development
```

4. **Start the application**

**Option A: Run locally without Docker**

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

**Option B: Run with Docker Compose**

```bash
# From project root
docker-compose up --build
```

5. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digital-cookbook?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Recipes
- `GET /api/recipes` - Get all user's recipes (protected)
- `GET /api/recipes/:id` - Get single recipe (protected)
- `POST /api/recipes` - Create new recipe (protected)
- `PUT /api/recipes/:id` - Update recipe (protected)
- `DELETE /api/recipes/:id` - Delete recipe (protected)

## Deployment

### 🚀 Fly.io Deployment (Current Method)

This application is deployed on **Fly.io** with fully automated, zero-SSH deployments via GitHub Actions.

**Live App:** Check `fly.toml` for your app URL (e.g., `https://your-app.fly.dev`)

#### Prerequisites
- Fly.io account (free tier available)
- Fly CLI installed (`fly`)
- MongoDB Atlas database

#### Initial Setup

1. **Install Fly CLI**
```bash
# macOS
brew install flyctl

# Windows
pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Linux
curl -L https://fly.io/install.sh | sh
```

2. **Authenticate**
```bash
fly auth login
```

3. **Launch App**
```bash
fly launch
# Follow prompts, select region, etc.
```

4. **Set Secrets**
```bash
fly secrets set MONGODB_URI="your-mongodb-uri"
fly secrets set JWT_SECRET="your-jwt-secret"
fly secrets set NODE_ENV="production"
fly secrets set PORT="8080"
fly secrets set CORS_ORIGIN="https://your-app.fly.dev"
fly secrets set JWT_EXPIRES_IN="7d"
```

5. **Deploy**
```bash
fly deploy
```

#### Automated Deployments (GitHub Actions)

Once set up, every push to `main` automatically deploys to Fly.io!

**Required GitHub Secret:**
- `FLY_API_TOKEN` - Generate with: `fly tokens create deploy`

See `.github/workflows/deploy-fly.yml` for the CI/CD workflow.

#### Monitoring
```bash
# View logs
fly logs

# Check status
fly status

# Open app
fly open
```

For detailed deployment instructions, see [docs/FLY_IO_DEPLOYMENT.md](docs/FLY_IO_DEPLOYMENT.md)

---

### AWS EC2 Deployment (Future Alternative)

AWS EC2 deployment may be implemented as an alternative hosting option in a future iteration. The current Fly.io deployment provides:
- ✅ Zero SSH management
- ✅ Automatic HTTPS/SSL
- ✅ Free tier hosting
- ✅ Simplified deployment pipeline

If AWS hosting is needed in the future, see [docs/DEPLOYMENT_OPTIONS.md](docs/DEPLOYMENT_OPTIONS.md) for comparison and setup instructions.

## Development Roadmap

### Phase 1: MVP (Current)
- [x] User authentication
- [x] Manual recipe creation
- [x] Recipe CRUD operations
- [x] 5-star rating system
- [x] Responsive UI

### Phase 2: Deployment ✅ COMPLETED
- [x] Docker configuration
- [x] Fly.io setup (zero SSH!)
- [x] GitHub Actions CI/CD
- [x] Production deployment
- [x] Toast notifications
- [x] Enhanced form validation
- [x] Mobile responsiveness

### Phase 3: Recipe Scraping (Future)
- [ ] URL-based recipe import
- [ ] Recipe parsing and normalization
- [ ] Preview before saving

### Phase 4: Advanced Features (Future)
- [ ] Recipe search and filtering
- [ ] Recipe tags and categories
- [ ] Image upload
- [ ] Recipe sharing
- [ ] Shopping list generation
- [ ] Meal planning
- [ ] LLM integration
- [ ] AWS Secrets Manager for JWT rotation (if migrating to AWS)
- [ ] AWS EC2 deployment option (alternative to Fly.io)

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Contributing

This is a personal project, but suggestions and bug reports are welcome!

## License

MIT License - feel free to use this project as a template for your own cookbook application.

## Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ for home cooks everywhere**

