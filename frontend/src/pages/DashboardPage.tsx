import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material'
import { Add as AddIcon, Logout as LogoutIcon } from '@mui/icons-material'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { recipeService } from '@/services/recipeService'
import { Recipe } from '@/types/recipe.types'
import RecipeList from '@/components/recipes/RecipeList'
import RecipeDialog from '@/components/recipes/RecipeDialog'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const data = await recipeService.getRecipes()
      setRecipes(data)
      setError('')
    } catch (err: any) {
      setError('Failed to load recipes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleRecipeCreated = (recipe: Recipe) => {
    setRecipes([recipe, ...recipes])
    setDialogOpen(false)
  }

  const handleRecipeDeleted = (id: string) => {
    setRecipes(recipes.filter((r) => r._id !== id))
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Digital Cookbook
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.username}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            My Recipes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add Recipe
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <RecipeList
            recipes={recipes}
            onRecipeClick={(id) => navigate(`/recipes/${id}`)}
            onRecipeDeleted={handleRecipeDeleted}
          />
        )}
      </Container>

      <RecipeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onRecipeCreated={handleRecipeCreated}
      />
    </Box>
  )
}

