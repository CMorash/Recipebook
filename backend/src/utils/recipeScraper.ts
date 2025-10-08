import axios from 'axios'
import * as cheerio from 'cheerio'

interface ScrapedRecipe {
  name: string
  ingredients: string[]
  instructions: string[]
  image?: string
  servings?: string
  prepTime?: string
  cookTime?: string
}

/**
 * Scrapes recipe data from a URL using Schema.org JSON-LD markup
 * Most modern recipe sites use this standard format
 */
export async function scrapeRecipeFromUrl(url: string): Promise<ScrapedRecipe> {
  try {
    // Fetch the HTML content
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
      timeout: 15000, // 15 second timeout
    })

    const html = response.data
    const $ = cheerio.load(html)

    // Try to find Schema.org JSON-LD recipe data (most reliable method)
    let recipeData = findSchemaOrgRecipe($)

    // If Schema.org data not found, try parsing HTML directly
    if (!recipeData) {
      recipeData = parseRecipeFromHtml($)
    }

    // If still no data, try a more aggressive approach
    if (!recipeData) {
      recipeData = parseRecipeAggressively($)
    }

    if (!recipeData || !recipeData.name || !recipeData.ingredients || !recipeData.instructions) {
      throw new Error('Could not extract complete recipe data from this page')
    }

    return recipeData
  } catch (error: any) {
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to the recipe website')
    }
    if (error.code === 'ETIMEDOUT') {
      throw new Error('Request timed out while fetching the recipe')
    }
    throw error
  }
}

/**
 * Finds and parses Schema.org Recipe markup (JSON-LD format)
 * This is the standard used by most recipe websites
 */
function findSchemaOrgRecipe($: cheerio.CheerioAPI): ScrapedRecipe | null {
  const scriptTags = $('script[type="application/ld+json"]')

  for (let i = 0; i < scriptTags.length; i++) {
    try {
      const scriptContent = $(scriptTags[i]).html()
      if (!scriptContent) continue

      const jsonData = JSON.parse(scriptContent)

      // Handle both single recipe and array of items
      const recipes = Array.isArray(jsonData) ? jsonData : [jsonData]

      for (const item of recipes) {
        // Check if this item is a Recipe or contains a Recipe in @graph
        let recipe = null

        if (item['@type'] === 'Recipe' || (Array.isArray(item['@type']) && item['@type'].includes('Recipe'))) {
          recipe = item
        } else if (item['@graph']) {
          recipe = item['@graph'].find((graphItem: any) => 
            graphItem['@type'] === 'Recipe' || (Array.isArray(graphItem['@type']) && graphItem['@type'].includes('Recipe'))
          )
        }

        if (recipe) {
          return extractRecipeFromSchemaOrg(recipe)
        }
      }
    } catch (e: any) {
      // If JSON parsing fails, continue to next script tag
      continue
    }
  }

  return null
}

/**
 * Extracts recipe data from Schema.org Recipe object
 */
function extractRecipeFromSchemaOrg(recipe: any): ScrapedRecipe {
  // Extract ingredients (can be string array or object array)
  let ingredients: string[] = []
  if (recipe.recipeIngredient) {
    ingredients = Array.isArray(recipe.recipeIngredient)
      ? recipe.recipeIngredient
      : [recipe.recipeIngredient]
  }

  // Extract instructions (can be in various formats)
  let instructions: string[] = []
  if (recipe.recipeInstructions) {
    if (Array.isArray(recipe.recipeInstructions)) {
      instructions = recipe.recipeInstructions.map((instruction: any) => {
        if (typeof instruction === 'string') {
          return instruction
        } else if (instruction.text) {
          return instruction.text
        } else if (instruction['@type'] === 'HowToStep' && instruction.text) {
          return instruction.text
        } else if (instruction['@type'] === 'HowToStep' && instruction.name) {
          return instruction.name
        } else if (instruction.name) {
          return instruction.name
        }
        return ''
      }).filter((text: string) => text.length > 0)
    } else if (typeof recipe.recipeInstructions === 'string') {
      // If instructions are a single string, split by periods or newlines
      instructions = recipe.recipeInstructions
        .split(/\n+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 10) // Filter out very short strings
    }
  }

  // If no instructions found in recipeInstructions, try alternative fields
  if (instructions.length === 0) {
    if (recipe.step) {
      instructions = Array.isArray(recipe.step) ? recipe.step : [recipe.step]
    } else if (recipe.instructions) {
      instructions = Array.isArray(recipe.instructions) ? recipe.instructions : [recipe.instructions]
    } else if (recipe.directions) {
      instructions = Array.isArray(recipe.directions) ? recipe.directions : [recipe.directions]
    }
  }

  // Extract image (can be string, object, or array)
  let image: string | undefined
  if (recipe.image) {
    if (typeof recipe.image === 'string') {
      image = recipe.image
    } else if (Array.isArray(recipe.image)) {
      image = recipe.image[0]?.url || recipe.image[0]
    } else if (recipe.image.url) {
      image = recipe.image.url
    }
  }

  return {
    name: recipe.name || '',
    ingredients: ingredients.map((ing: string) => ing.trim()),
    instructions: instructions.map((inst: string) => inst.trim()),
    image,
    servings: recipe.recipeYield?.toString(),
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
  }
}

/**
 * Fallback: Parse recipe from HTML when Schema.org data is not available
 * This is less reliable but works for some sites
 */
function parseRecipeFromHtml($: cheerio.CheerioAPI): ScrapedRecipe | null {
  try {
    // Try to find recipe title
    const name = 
      $('h1[class*="recipe"]').first().text().trim() ||
      $('h1[class*="title"]').first().text().trim() ||
      $('h1').first().text().trim() ||
      $('title').first().text().trim().split('|')[0].trim()

    // Try to find ingredients
    const ingredients: string[] = []
    $('li[class*="ingredient"], .ingredient, [itemprop="recipeIngredient"]').each((_, elem) => {
      const text = $(elem).text().trim()
      if (text && text.length > 2) {
        ingredients.push(text)
      }
    })

    // Try to find instructions
    const instructions: string[] = []
    $('li[class*="instruction"], li[class*="step"], .instruction, .step, [itemprop="recipeInstructions"] li, ol[class*="instructions"] li').each((_, elem) => {
      const text = $(elem).text().trim()
      if (text && text.length > 10) {
        instructions.push(text)
      }
    })

    // Try to find image
    let image: string | undefined
    const imgSrc = $('img[class*="recipe"]').first().attr('src') ||
                   $('meta[property="og:image"]').attr('content') ||
                   $('img[itemprop="image"]').attr('src')
    if (imgSrc) {
      image = imgSrc
    }

    // Only return if we found meaningful data
    if (name && ingredients.length > 0 && instructions.length > 0) {
      return {
        name,
        ingredients,
        instructions,
        image,
      }
    }

    return null
  } catch (error) {
    return null
  }
}

/**
 * Aggressive parsing: Try multiple selectors and patterns
 * This is the last resort when other methods fail
 */
function parseRecipeAggressively($: cheerio.CheerioAPI): ScrapedRecipe | null {
  try {
    // Try multiple title selectors
    const name = 
      $('h1').first().text().trim() ||
      $('h2').first().text().trim() ||
      $('.recipe-title').text().trim() ||
      $('.post-title').text().trim() ||
      $('title').text().trim().split('|')[0].split('-')[0].trim()

    // Try multiple ingredient selectors
    const ingredients: string[] = []
    const ingredientSelectors = [
      'li[class*="ingredient"]',
      '.ingredient',
      '[itemprop="recipeIngredient"]',
      '.recipe-ingredients li',
      '.ingredients li',
      'ul.ingredients li',
      'ol.ingredients li',
      '.recipe-ingredient',
      '.ingredient-item'
    ]

    ingredientSelectors.forEach(selector => {
      $(selector).each((_, elem) => {
        const text = $(elem).text().trim()
        if (text && text.length > 2 && !ingredients.includes(text)) {
          ingredients.push(text)
        }
      })
    })

    // Try multiple instruction selectors
    const instructions: string[] = []
    const instructionSelectors = [
      'li[class*="instruction"]',
      'li[class*="step"]',
      '.instruction',
      '.step',
      '[itemprop="recipeInstructions"] li',
      '.recipe-instructions li',
      '.instructions li',
      'ol.instructions li',
      '.recipe-step',
      '.cooking-step',
      '.directions li'
    ]

    instructionSelectors.forEach(selector => {
      $(selector).each((_, elem) => {
        const text = $(elem).text().trim()
        if (text && text.length > 10 && !instructions.includes(text)) {
          instructions.push(text)
        }
      })
    })

    // Try to find image
    let image: string | undefined
    const imageSelectors = [
      'img[class*="recipe"]',
      'meta[property="og:image"]',
      'img[itemprop="image"]',
      '.recipe-image img',
      '.post-image img',
      'img[alt*="recipe"]'
    ]

    for (const selector of imageSelectors) {
      const imgSrc = $(selector).first().attr('src') || $(selector).first().attr('content')
      if (imgSrc && imgSrc.startsWith('http')) {
        image = imgSrc
        break
      }
    }

    // Only return if we found meaningful data
    if (name && ingredients.length > 0 && instructions.length > 0) {
      return {
        name,
        ingredients,
        instructions,
        image,
      }
    }

    return null
  } catch (error) {
    return null
  }
}
