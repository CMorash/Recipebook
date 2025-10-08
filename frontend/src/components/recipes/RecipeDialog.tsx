import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Typography,
  Rating,
  Alert,
} from '@mui/material'
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { recipeService } from '@/services/recipeService'
import { Recipe, Ingredient } from '@/types/recipe.types'
import { showToast } from '@/utils/toast'

interface RecipeDialogProps {
  open: boolean
  onClose: () => void
  onRecipeCreated?: (recipe: Recipe) => void
  onRecipeUpdated?: (recipe: Recipe) => void
  recipe?: Recipe
}

export default function RecipeDialog({
  open,
  onClose,
  onRecipeCreated,
  onRecipeUpdated,
  recipe,
}: RecipeDialogProps) {
  const [title, setTitle] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '' },
  ])
  const [steps, setSteps] = useState<string[]>([''])
  const [rating, setRating] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title)
      setIngredients(recipe.ingredients)
      setSteps(recipe.steps)
      setRating(recipe.rating || null)
    } else {
      setTitle('')
      setIngredients([{ name: '', amount: '', unit: '' }])
      setSteps([''])
      setRating(null)
    }
    setError('')
  }, [recipe, open])

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index][field] = value
    setIngredients(newIngredients)
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  const addStep = () => {
    setSteps([...steps, ''])
  }

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async () => {
    setError('')

    // Validation
    if (!title.trim()) {
      const msg = 'Recipe title is required'
      setError(msg)
      showToast.error(msg)
      return
    }

    if (title.trim().length > 200) {
      const msg = 'Recipe title must not exceed 200 characters'
      setError(msg)
      showToast.error(msg)
      return
    }

    const validIngredients = ingredients.filter(
      (ing) => ing.name.trim() && ing.amount.trim()
    )
    if (validIngredients.length === 0) {
      const msg = 'At least one ingredient is required (name and amount)'
      setError(msg)
      showToast.error(msg)
      return
    }

    const validSteps = steps.filter((step) => step.trim())
    if (validSteps.length === 0) {
      const msg = 'At least one instruction step is required'
      setError(msg)
      showToast.error(msg)
      return
    }

    setLoading(true)

    try {
      const recipeData = {
        title: title.trim(),
        ingredients: validIngredients,
        steps: validSteps,
        rating: rating || undefined,
      }

      if (recipe) {
        const updated = await recipeService.updateRecipe(recipe._id, recipeData)
        onRecipeUpdated?.(updated)
        showToast.success('Recipe updated successfully!')
      } else {
        const created = await recipeService.createRecipe(recipeData)
        onRecipeCreated?.(created)
        showToast.success('Recipe created successfully!')
      }

      onClose()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to save recipe'
      setError(errorMessage)
      showToast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      fullScreen={false}
      scroll="paper"
      PaperProps={{
        sx: {
          maxHeight: '90vh',
          m: { xs: 1, sm: 2 },
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {recipe ? 'Edit Recipe' : 'Add New Recipe'}
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
          helperText={`${title.length}/200 characters`}
          inputProps={{ maxLength: 200 }}
        />

        <Box mt={2} mb={1}>
          <Typography variant="subtitle1" gutterBottom>
            Rating
          </Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
          />
        </Box>

        <Box mt={3} mb={2}>
          <Typography variant="subtitle1" gutterBottom fontWeight="600">
            Ingredients
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Add at least one ingredient with name and amount
          </Typography>
        </Box>
        {ingredients.map((ingredient, index) => (
          <Box 
            key={index} 
            display="flex" 
            gap={1} 
            mb={1}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            <TextField
              label="Amount"
              value={ingredient.amount}
              onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
              size="small"
              sx={{ width: { xs: '100%', sm: '20%' } }}
            />
            <TextField
              label="Unit"
              value={ingredient.unit}
              onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              size="small"
              sx={{ width: { xs: '100%', sm: '20%' } }}
            />
            <TextField
              label="Ingredient"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              size="small"
              sx={{ flexGrow: 1 }}
            />
            <IconButton 
              onClick={() => removeIngredient(index)} 
              color="error" 
              size="small"
              sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={addIngredient} size="small" color="secondary">
          Add Ingredient
        </Button>

        <Box mt={3} mb={2}>
          <Typography variant="subtitle1" gutterBottom fontWeight="600">
            Instructions
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Add at least one step
          </Typography>
        </Box>
        {steps.map((step, index) => (
          <Box key={index} display="flex" gap={1} mb={1}>
            <Typography sx={{ pt: 1, minWidth: 30 }}>{index + 1}.</Typography>
            <TextField
              fullWidth
              multiline
              rows={2}
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              size="small"
            />
            <IconButton 
              onClick={() => removeStep(index)} 
              color="error" 
              size="small"
              sx={{ alignSelf: 'flex-start' }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={addStep} size="small" color="secondary">
          Add Step
        </Button>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading} size="large" color="secondary">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          size="large"
        >
          {loading ? 'Saving...' : recipe ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

