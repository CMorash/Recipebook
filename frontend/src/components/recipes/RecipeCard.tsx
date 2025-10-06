import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Rating,
  Box,
  Chip,
} from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { Recipe } from '@/types/recipe.types'
import { useState } from 'react'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { recipeService } from '@/services/recipeService'

interface RecipeCardProps {
  recipe: Recipe
  onClick: () => void
  onDeleted: () => void
}

export default function RecipeCard({ recipe, onClick, onDeleted }: RecipeCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleting(true)
    try {
      await recipeService.deleteRecipe(recipe._id)
      onDeleted()
    } catch (error) {
      console.error('Failed to delete recipe:', error)
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const openDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteDialogOpen(true)
  }

  return (
    <>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          },
        }}
        onClick={onClick}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
            {recipe.title}
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            {recipe.rating && <Rating value={recipe.rating} size="small" readOnly />}
          </Box>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {recipe.ingredients.length} ingredients • {recipe.steps.length} steps
          </Typography>
          <Chip
            label={recipe.source.type === 'manual' ? 'Manual' : 'Scraped'}
            size="small"
            variant="outlined"
          />
        </CardContent>
        <CardActions>
          <IconButton
            size="small"
            color="error"
            onClick={openDeleteDialog}
            disabled={deleting}
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Recipe"
        message={`Are you sure you want to delete "${recipe.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  )
}

