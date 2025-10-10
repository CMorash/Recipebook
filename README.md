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

- React 20 with TypeScript
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

- Node.js 20+ LTS
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

# Create .env file and add your MongoDB URI and JWT secret
```

3. **Set up Frontend**

```bash
cd ../frontend
npm install

# Create .env file as detailed below
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

## Development Roadmap

### Phase 1: MVP (Current)

- [X] User authentication
- [X] Manual recipe creation
- [X] Recipe CRUD operations
- [X] 5-star rating system
- [X] Responsive UI

### Phase 2: Deployment ✅ COMPLETED

- [X] Docker configuration
- [X] Fly.io setup (zero SSH!)
- [X] GitHub Actions CI/CD
- [X] Production deployment
- [X] Toast notifications
- [X] Enhanced form validation
- [X] Mobile responsiveness

### Phase 3: Recipe Scraping

- [X] URL-based recipe import
- [X] Recipe parsing and normalization
- [ ] Preview before saving

### Phase 4: Advanced Features (Future)

- [X] Recipe search and filtering
- [X] Recipe tags and categories
- [ ] Image upload
- [ ] Recipe sharing
- [ ] Shopping list generation
- [ ] Meal planning
- [ ] LLM integration
- [ ] AWS Secrets Manager for JWT rotation (if migrating to AWS)
- [ ] AWS EC2 deployment option (alternative to Fly.io)

## Contributing

This is a personal project, but suggestions and bug reports are welcome!

## License

MIT License - feel free to use this project as a template for your own cookbook application.

## Support

For issues or questions, please open a GitHub issue.

---

**Built with ❤️ for home cooks everywhere**
