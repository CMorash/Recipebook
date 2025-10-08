export interface Ingredient {
  name: string
  amount: string
  unit: string
}

export interface Recipe {
  _id: string
  userId: string
  title: string
  ingredients: Ingredient[]
  steps: string[]
  rating?: number
  source: {
    type: 'manual' | 'scraped'
    url?: string
  }
  imageUrl?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateRecipeData {
  title: string
  ingredients: Ingredient[]
  steps: string[]
  rating?: number
  tags?: string[]
}

export interface UpdateRecipeData extends Partial<CreateRecipeData> {}

export const RECIPE_TAGS = ['breakfast', 'lunch', 'dinner', 'appetizer', 'dessert', 'drink'] as const
export type RecipeTag = typeof RECIPE_TAGS[number]

