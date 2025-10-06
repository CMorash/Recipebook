import { Grid, Box, Typography } from '@mui/material'
import { Recipe } from '@/types/recipe.types'
import RecipeCard from './RecipeCard'

interface RecipeListProps {
  recipes: Recipe[]
  onRecipeClick: (id: string) => void
  onRecipeDeleted: (id: string) => void
}

export default function RecipeList({
  recipes,
  onRecipeClick,
  onRecipeDeleted,
}: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No recipes yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click "Add Recipe" to create your first recipe
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={3}>
      {recipes.map((recipe) => (
        <Grid item xs={12} sm={6} md={4} key={recipe._id}>
          <RecipeCard
            recipe={recipe}
            onClick={() => onRecipeClick(recipe._id)}
            onDeleted={() => onRecipeDeleted(recipe._id)}
          />
        </Grid>
      ))}
    </Grid>
  )
}

