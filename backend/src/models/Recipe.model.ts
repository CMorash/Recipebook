import mongoose, { Schema, Document } from 'mongoose'

export interface IIngredient {
  name: string
  amount: string
  unit: string
}

export interface IRecipe extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  ingredients: IIngredient[]
  steps: string[]
  rating?: number
  source: {
    type: 'manual' | 'scraped'
    url?: string
  }
  imageUrl?: string
  tags?: string[]
  createdAt: Date
  updatedAt: Date
}

const IngredientSchema = new Schema<IIngredient>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
)

const RecipeSchema = new Schema<IRecipe>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Recipe title is required'],
      trim: true,
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    ingredients: {
      type: [IngredientSchema],
      required: [true, 'At least one ingredient is required'],
      validate: {
        validator: function (v: IIngredient[]) {
          return v && v.length > 0
        },
        message: 'At least one ingredient is required',
      },
    },
    steps: {
      type: [String],
      required: [true, 'At least one step is required'],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0
        },
        message: 'At least one step is required',
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    source: {
      type: {
        type: String,
        enum: ['manual', 'scraped'],
        default: 'manual',
      },
      url: String,
    },
    imageUrl: String,
    tags: [String],
  },
  {
    timestamps: true,
  }
)

// Index for efficient querying
RecipeSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.model<IRecipe>('Recipe', RecipeSchema)

