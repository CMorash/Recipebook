# Digital Cookbook 🍳

A modern, full-stack digital cookbook application for managing and organizing your favorite recipes.

## Features

- 🔐 **User Authentication** - Secure JWT-based authentication
- 📝 **Recipe Management** - Create, edit, delete, and view recipes
- ⭐ **5-Star Rating System** - Rate your recipes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful Material-UI design
- 🐳 **Docker Support** - Easy deployment with Docker containers
- 🚀 **CI/CD Pipeline** - Automated deployment with GitHub Actions

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

### DevOps
- Docker & Docker Compose
- GitHub Actions for CI/CD
- Fly.io deployment (zero-config, fully automated)
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

### AWS EC2 Deployment

1. **Set up EC2 instance**
   - Launch Ubuntu 22.04 t2.micro instance
   - Configure security groups (ports 22, 80, 443)
   - Install Docker and Docker Compose

2. **Configure GitHub Secrets**

Add the following secrets to your GitHub repository:

- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password
- `EC2_HOST` - EC2 public IP address
- `EC2_USERNAME` - EC2 username (usually `ubuntu`)
- `EC2_SSH_KEY` - Private SSH key for EC2 access

3. **Deploy**

Push to the `main` branch to trigger automatic deployment:

```bash
git push origin main
```

### Manual Deployment

SSH into your EC2 instance and run:

```bash
cd /home/ubuntu/digital-cookbook
git pull origin main
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Development Roadmap

### Phase 1: MVP (Current)
- [x] User authentication
- [x] Manual recipe creation
- [x] Recipe CRUD operations
- [x] 5-star rating system
- [x] Responsive UI

### Phase 2: Deployment (NEXT - In Progress)
- [x] Docker configuration
- [ ] Fly.io setup (zero SSH!)
- [ ] GitHub Actions CI/CD
- [ ] Production testing

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
- [ ] AWS Secrets Manager for JWT rotation (optional)

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

