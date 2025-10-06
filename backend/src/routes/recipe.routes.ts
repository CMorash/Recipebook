import { Router } from 'express'
import {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from '../controllers/recipe.controller'
import { auth } from '../middleware/auth.middleware'

const router = Router()

// All routes require authentication
router.use(auth)

router.get('/', getRecipes)
router.get('/:id', getRecipe)
router.post('/', createRecipe)
router.put('/:id', updateRecipe)
router.delete('/:id', deleteRecipe)

export default router

