import api from './api'
import { Recipe, CreateRecipeData, UpdateRecipeData } from '@/types/recipe.types'

export const recipeService = {
  async getRecipes(): Promise<Recipe[]> {
    const response = await api.get<Recipe[]>('/recipes')
    return response.data
  },

  async getRecipe(id: string): Promise<Recipe> {
    const response = await api.get<Recipe>(`/recipes/${id}`)
    return response.data
  },

  async createRecipe(data: CreateRecipeData): Promise<Recipe> {
    const response = await api.post<Recipe>('/recipes', data)
    return response.data
  },

  async updateRecipe(id: string, data: UpdateRecipeData): Promise<Recipe> {
    const response = await api.put<Recipe>(`/recipes/${id}`, data)
    return response.data
  },

  async deleteRecipe(id: string): Promise<void> {
    await api.delete(`/recipes/${id}`)
  },
}

