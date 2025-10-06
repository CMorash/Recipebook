import { Response } from 'express'
import Recipe from '../models/Recipe.model'
import { AuthRequest } from '../middleware/auth.middleware'

// Get all recipes for the authenticated user
export const getRecipes = async (req: AuthRequest, res: Response) => {
  try {
    const recipes = await Recipe.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json(recipes)
  } catch (error) {
    console.error('Get recipes error:', error)
    res.status(500).json({ message: 'Error fetching recipes' })
  }
}

// Get a single recipe by ID
export const getRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const recipe = await Recipe.findOne({ _id: id, userId: req.userId })

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }

    res.json(recipe)
  } catch (error) {
    console.error('Get recipe error:', error)
    res.status(500).json({ message: 'Error fetching recipe' })
  }
}

// Create a new recipe
export const createRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { title, ingredients, steps, rating } = req.body

    // Validation
    if (!title || !ingredients || !steps) {
      return res.status(400).json({ message: 'Title, ingredients, and steps are required' })
    }

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ message: 'At least one ingredient is required' })
    }

    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ message: 'At least one step is required' })
    }

    const recipe = new Recipe({
      userId: req.userId,
      title,
      ingredients,
      steps,
      rating,
      source: {
        type: 'manual',
      },
    })

    await recipe.save()

    res.status(201).json(recipe)
  } catch (error) {
    console.error('Create recipe error:', error)
    res.status(500).json({ message: 'Error creating recipe' })
  }
}

// Update a recipe
export const updateRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { title, ingredients, steps, rating } = req.body

    const recipe = await Recipe.findOne({ _id: id, userId: req.userId })

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }

    // Update fields
    if (title !== undefined) recipe.title = title
    if (ingredients !== undefined) recipe.ingredients = ingredients
    if (steps !== undefined) recipe.steps = steps
    if (rating !== undefined) recipe.rating = rating

    await recipe.save()

    res.json(recipe)
  } catch (error) {
    console.error('Update recipe error:', error)
    res.status(500).json({ message: 'Error updating recipe' })
  }
}

// Delete a recipe
export const deleteRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const recipe = await Recipe.findOneAndDelete({ _id: id, userId: req.userId })

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }

    res.json({ message: 'Recipe deleted successfully' })
  } catch (error) {
    console.error('Delete recipe error:', error)
    res.status(500).json({ message: 'Error deleting recipe' })
  }
}

