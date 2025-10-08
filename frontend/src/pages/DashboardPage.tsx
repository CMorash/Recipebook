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
  Fab,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { Add as AddIcon, Logout as LogoutIcon, CloudDownload as ImportIcon } from '@mui/icons-material'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { recipeService } from '@/services/recipeService'
import { Recipe } from '@/types/recipe.types'
import RecipeList from '@/components/recipes/RecipeList'
import RecipeDialog from '@/components/recipes/RecipeDialog'
import ImportRecipeDialog from '@/components/recipes/ImportRecipeDialog'
import { showToast } from '@/utils/toast'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)

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
    showToast.info('Logged out successfully')
    navigate('/login')
  }

  const handleRecipeCreated = (recipe: Recipe) => {
    setRecipes([recipe, ...recipes])
    setDialogOpen(false)
  }

  const handleRecipeImported = (recipe: Recipe) => {
    setRecipes([recipe, ...recipes])
    setImportDialogOpen(false)
  }

  const handleRecipeDeleted = (id: string) => {
    setRecipes(recipes.filter((r) => r._id !== id))
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography 
            variant="h5"
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            {isMobile ? "Cookbook" : "Digital Cookbook"}
          </Typography>
          {!isMobile && (
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.username}
            </Typography>
          )}
          <IconButton color="inherit" onClick={handleLogout} aria-label="logout">
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, pb: { xs: 10, sm: 4 } }}>
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={{ xs: 3, sm: 4 }}
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={{ xs: 2, sm: 0 }}
        >
          <Typography 
            variant="h4"
            component="h1" 
            fontWeight="bold"
            sx={{
              fontSize: { xs: '1.5rem', sm: '2.125rem' }
            }}
          >
            My Recipes
          </Typography>
          {!isMobile && (
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<ImportIcon />}
                onClick={() => setImportDialogOpen(true)}
                size="large"
              >
                Import from URL
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setDialogOpen(true)}
                size="large"
              >
                Add Recipe
              </Button>
            </Box>
          )}
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

      <ImportRecipeDialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        onRecipeImported={handleRecipeImported}
      />

      {/* Mobile Floating Action Buttons */}
      {isMobile && (
        <>
          <Fab
            color="primary"
            aria-label="add recipe"
            onClick={() => setDialogOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <AddIcon />
          </Fab>
          <Fab
            color="secondary"
            aria-label="import recipe"
            onClick={() => setImportDialogOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 80,
              zIndex: 1000,
            }}
          >
            <ImportIcon />
          </Fab>
        </>
      )}
    </Box>
  )
}

