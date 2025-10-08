import { useState, useEffect, useMemo } from 'react'
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
  Paper,
  Chip,
  Stack,
  Divider,
  Rating,
} from '@mui/material'
import { Add as AddIcon, Logout as LogoutIcon, CloudDownload as ImportIcon, FilterList as FilterIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { recipeService } from '@/services/recipeService'
import { Recipe, RECIPE_TAGS } from '@/types/recipe.types'
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
  
  // Filter states
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [selectedSource, setSelectedSource] = useState<'all' | 'manual' | 'scraped'>('all')
  const [filtersExpanded, setFiltersExpanded] = useState(true)

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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSelectedTags([])
    setSelectedRating(null)
    setSelectedSource('all')
  }

  // Apply filters to recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Filter by tags
      if (selectedTags.length > 0) {
        if (!recipe.tags || !selectedTags.some(tag => recipe.tags?.includes(tag))) {
          return false
        }
      }
      
      // Filter by rating
      if (selectedRating !== null) {
        if (!recipe.rating || recipe.rating < selectedRating) {
          return false
        }
      }
      
      // Filter by source
      if (selectedSource !== 'all') {
        if (recipe.source.type !== selectedSource) {
          return false
        }
      }
      
      return true
    })
  }, [recipes, selectedTags, selectedRating, selectedSource])

  const hasActiveFilters = selectedTags.length > 0 || selectedRating !== null || selectedSource !== 'all'

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
                variant="contained"
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

        {/* Filters Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Box display="flex" alignItems="center" gap={1} mb={filtersExpanded ? 2 : 0}>
            <FilterIcon />
            <Typography variant="h6" fontWeight="bold">
              Filters
            </Typography>
            {hasActiveFilters && filtersExpanded && (
              <Button 
                size="small"
                color="secondary"
                sx={{ ml: 1 }}
                onClick={clearFilters}
              >
                Clear All
              </Button>
            )}
            <IconButton 
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              sx={{ ml: 'auto' }}
              size="small"
            >
              {filtersExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>

          {filtersExpanded && (
            <>
              {/* Tags Filter */}
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Categories
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {RECIPE_TAGS.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag.charAt(0).toUpperCase() + tag.slice(1)}
                      onClick={() => toggleTag(tag)}
                      color={selectedTags.includes(tag) ? 'primary' : 'default'}
                      variant={selectedTags.includes(tag) ? 'filled' : 'outlined'}
                      size="small"
                    />
                  ))}
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Rating Filter */}
              <Box mb={2}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Minimum Rating
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating
                    value={selectedRating}
                    onChange={(_, newValue) => setSelectedRating(newValue)}
                    size="medium"
                  />
                  {selectedRating !== null && (
                    <Typography variant="body2" color="text.secondary">
                      ({selectedRating} stars or higher)
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Source Filter */}
              <Box>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Recipe Source
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label="All"
                    onClick={() => setSelectedSource('all')}
                    color={selectedSource === 'all' ? 'primary' : 'default'}
                    variant={selectedSource === 'all' ? 'filled' : 'outlined'}
                    size="small"
                  />
                  <Chip
                    label="Manual"
                    onClick={() => setSelectedSource('manual')}
                    color={selectedSource === 'manual' ? 'primary' : 'default'}
                    variant={selectedSource === 'manual' ? 'filled' : 'outlined'}
                    size="small"
                  />
                  <Chip
                    label="Scraped"
                    onClick={() => setSelectedSource('scraped')}
                    color={selectedSource === 'scraped' ? 'primary' : 'default'}
                    variant={selectedSource === 'scraped' ? 'filled' : 'outlined'}
                    size="small"
                  />
                </Stack>
              </Box>
            </>
          )}
        </Paper>

        {/* Recipe Count */}
        {!loading && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            Showing {filteredRecipes.length} of {recipes.length} recipes
          </Typography>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : filteredRecipes.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {hasActiveFilters ? 'No recipes match your filters' : 'No recipes yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {hasActiveFilters ? 'Try adjusting your filters' : 'Add your first recipe to get started!'}
            </Typography>
          </Box>
        ) : (
          <RecipeList
            recipes={filteredRecipes}
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

