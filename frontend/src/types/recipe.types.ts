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
}

export interface UpdateRecipeData extends Partial<CreateRecipeData> {}

