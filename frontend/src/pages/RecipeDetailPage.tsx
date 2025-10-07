import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
  Divider,
  Rating,
  Chip,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { recipeService } from '@/services/recipeService'
import { Recipe } from '@/types/recipe.types'
import RecipeDialog from '@/components/recipes/RecipeDialog'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { showToast } from '@/utils/toast'

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await recipeService.getRecipe(id)
        setRecipe(data)
        setError('')
      } catch (err: any) {
        setError('Failed to load recipe')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecipe()
  }, [id])

  const handleDelete = async () => {
    if (!id) return
    try {
      await recipeService.deleteRecipe(id)
      showToast.success('Recipe deleted successfully')
      navigate('/dashboard')
    } catch (err: any) {
      const errorMessage = 'Failed to delete recipe'
      setError(errorMessage)
      showToast.error(errorMessage)
      console.error(err)
    }
  }

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    setRecipe(updatedRecipe)
    setEditDialogOpen(false)
    // Toast is shown by RecipeDialog component
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !recipe) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Recipe not found'}</Alert>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Recipe Details
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
        <Paper sx={{ p: { xs: 2, sm: 4 } }}>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="flex-start" 
            mb={3}
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={{ xs: 2, sm: 0 }}
          >
            <Box flex={1}>
              <Typography 
                variant="h4"
                component="h1" 
                gutterBottom 
                fontWeight="bold"
                sx={{ 
                  fontSize: { xs: '1.5rem', sm: '2.125rem' }
                }}
              >
                {recipe.title}
              </Typography>
              {recipe.rating && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Rating value={recipe.rating} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    ({recipe.rating}/5)
                  </Typography>
                </Box>
              )}
              <Chip
                label={recipe.source.type === 'manual' ? 'Manual Entry' : 'Scraped'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
            <Box display="flex" gap={1}>
              <IconButton 
                onClick={() => setEditDialogOpen(true)} 
                color="primary"
              >
                <EditIcon />
              </IconButton>
              <IconButton 
                onClick={() => setDeleteDialogOpen(true)} 
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom fontWeight="bold">
            Ingredients
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 3 }}>
            {recipe.ingredients.map((ingredient, index) => (
              <Typography component="li" key={index} sx={{ mb: 0.5 }}>
                {ingredient.amount} {ingredient.unit} {ingredient.name}
              </Typography>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom fontWeight="bold">
            Instructions
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            {recipe.steps.map((step, index) => (
              <Typography component="li" key={index} sx={{ mb: 1.5 }}>
                {step}
              </Typography>
            ))}
          </Box>
        </Paper>
      </Container>

      {recipe && (
        <RecipeDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onRecipeUpdated={handleRecipeUpdated}
          recipe={recipe}
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  )
}

