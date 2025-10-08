import { Response } from 'express'
import Recipe from '../models/Recipe.model'
import { AuthRequest } from '../middleware/auth.middleware'
import { scrapeRecipeFromUrl } from '../utils/recipeScraper'

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
    const { title, ingredients, steps, rating, tags } = req.body

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
      tags: tags || [],
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
    const { title, ingredients, steps, rating, tags } = req.body

    const recipe = await Recipe.findOne({ _id: id, userId: req.userId })

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }

    // Update fields
    if (title !== undefined) recipe.title = title
    if (ingredients !== undefined) recipe.ingredients = ingredients
    if (steps !== undefined) recipe.steps = steps
    if (rating !== undefined) recipe.rating = rating
    if (tags !== undefined) recipe.tags = tags

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

// Scrape a recipe from a URL
export const scrapeRecipe = async (req: AuthRequest, res: Response) => {
  try {
    const { url } = req.body

    // Validation
    if (!url) {
      return res.status(400).json({ message: 'URL is required' })
    }

    // Basic URL validation
    try {
      const parsedUrl = new URL(url)
      if (!parsedUrl.protocol.startsWith('http')) {
        return res.status(400).json({ message: 'Invalid URL protocol. Must be http or https' })
      }
    } catch (err) {
      return res.status(400).json({ message: 'Invalid URL format' })
    }

    // Scrape the recipe using our custom scraper
    let scrapedData
    try {
      scrapedData = await scrapeRecipeFromUrl(url)
    } catch (scrapeError: any) {
      console.error('Recipe scraping error:', scrapeError)
      
      // Provide user-friendly error messages
      const errorMessage = scrapeError.message || 'Failed to scrape recipe from this URL'
      return res.status(400).json({
        message: errorMessage.includes('extract') || errorMessage.includes('connect') || errorMessage.includes('timed out')
          ? errorMessage
          : 'Failed to scrape recipe from this URL. The site may not be supported or the page may not contain recipe data.',
      })
    }

    // Normalize ingredients to match our schema
    const ingredients = scrapedData.ingredients.map((ing: string) => {
      const trimmedIng = ing.trim()
      
      // Common cooking units - this helps us identify where the unit ends
      const commonUnits = [
        'cup', 'cups', 'tablespoon', 'tablespoons', 'tbsp', 'tbsps',
        'teaspoon', 'teaspoons', 'tsp', 'tsps', 'pound', 'pounds', 'lb', 'lbs',
        'ounce', 'ounces', 'oz', 'gram', 'grams', 'g', 'kilogram', 'kilograms', 'kg',
        'milliliter', 'milliliters', 'ml', 'liter', 'liters', 'l',
        'fluid ounce', 'fluid ounces', 'fl oz', 'pint', 'pints', 'pt', 'pts',
        'quart', 'quarts', 'qt', 'qts', 'gallon', 'gallons', 'gal', 'gals',
        'pinch', 'pinches', 'dash', 'dashes', 'drop', 'drops',
        'slice', 'slices', 'piece', 'pieces', 'clove', 'cloves',
        'can', 'cans', 'package', 'packages', 'bag', 'bags',
        'bunch', 'bunches', 'head', 'heads', 'stalk', 'stalks'
      ]
      
      // Try to match amount + unit + name pattern
      const match = trimmedIng.match(/^([\d/.\s¼½¾⅓⅔⅛⅜⅝⅞]+)\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)*)\s+(.+)$/)
      
      if (match) {
        let [, amount = '', unit = '', name = ''] = match
        
        // Clean up the parsed values
        amount = amount.trim()
        unit = unit.trim()
        name = name.trim()
        
        // Check if the unit is a recognized cooking unit
        const unitWords = unit.toLowerCase().split(/\s+/)
        const recognizedUnit = unitWords.find(word => commonUnits.includes(word))
        
        if (recognizedUnit && amount && name && name.length > 1) {
          // If we found a recognized unit, use it and put the rest in the name
          const unitIndex = unitWords.indexOf(recognizedUnit)
          const actualUnit = unitWords.slice(0, unitIndex + 1).join(' ')
          const remainingUnitWords = unitWords.slice(unitIndex + 1)
          const fullName = remainingUnitWords.length > 0 
            ? (remainingUnitWords.join(' ') + ' ' + name).trim()
            : name
            
          return {
            amount,
            unit: actualUnit,
            name: fullName,
          }
        }
      }
      
      // Try a simpler approach for single-word units
      const simpleMatch = trimmedIng.match(/^([\d/.\s¼½¾⅓⅔⅛⅜⅝⅞]+)\s+([a-zA-Z]+)\s+(.+)$/)
      if (simpleMatch) {
        const [, amount = '', unit = '', name = ''] = simpleMatch
        if (commonUnits.includes(unit.toLowerCase()) && amount.trim() && name.trim()) {
          return {
            amount: amount.trim(),
            unit: unit.trim(),
            name: name.trim(),
          }
        }
      }
      
      // Try to handle cases like "2 eggs" where we have a number but no recognized unit
      const numberMatch = trimmedIng.match(/^([\d/.\s¼½¾⅓⅔⅛⅜⅝⅞]+)\s+(.+)$/)
      if (numberMatch) {
        const [, amount = '', name = ''] = numberMatch
        if (amount.trim() && name.trim()) {
          return {
            amount: amount.trim(),
            unit: '',
            name: name.trim(),
          }
        }
      }
      
      // If no clear amount/unit/name structure, put everything in the name field
      return {
        amount: '',
        unit: '',
        name: trimmedIng,
      }
    })

    // Normalize steps - remove step numbers and clean up
    const steps = scrapedData.instructions.map((instruction: string) => {
      // Remove step numbers if present (e.g., "1. Mix flour" -> "Mix flour")
      let cleaned = instruction.replace(/^\d+\.\s*/, '').trim()
      // Remove "Step X:" patterns
      cleaned = cleaned.replace(/^Step\s+\d+:?\s*/i, '').trim()
      return cleaned
    }).filter(step => step.length > 0) // Remove empty steps

    // Validate that we got meaningful data
    if (!scrapedData.name || ingredients.length === 0 || steps.length === 0) {
      return res.status(400).json({
        message: 'Unable to extract complete recipe data from this URL. Please try a different recipe or add it manually.',
      })
    }

    // Create the recipe
    const recipe = new Recipe({
      userId: req.userId,
      title: scrapedData.name,
      ingredients,
      steps,
      rating: undefined,
      source: {
        type: 'scraped',
        url,
      },
      imageUrl: scrapedData.image || undefined,
    })

    await recipe.save()

    res.status(201).json(recipe)
  } catch (error) {
    console.error('Scrape recipe error:', error)
    res.status(500).json({ message: 'Error processing recipe' })
  }
}

