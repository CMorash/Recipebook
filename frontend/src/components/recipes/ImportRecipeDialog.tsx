import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Typography,
  Link,
} from '@mui/material'
import { CloudDownload as ImportIcon } from '@mui/icons-material'
import { recipeService } from '@/services/recipeService'
import { Recipe } from '@/types/recipe.types'
import { showToast } from '@/utils/toast'

interface ImportRecipeDialogProps {
  open: boolean
  onClose: () => void
  onRecipeImported: (recipe: Recipe) => void
}

export default function ImportRecipeDialog({
  open,
  onClose,
  onRecipeImported,
}: ImportRecipeDialogProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImport = async () => {
    setError('')

    // Validation
    if (!url.trim()) {
      const msg = 'Please enter a recipe URL'
      setError(msg)
      showToast.error(msg)
      return
    }

    // Basic URL format check
    try {
      const parsedUrl = new URL(url.trim())
      if (!parsedUrl.protocol.startsWith('http')) {
        const msg = 'Please enter a valid http or https URL'
        setError(msg)
        showToast.error(msg)
        return
      }
    } catch (err) {
      const msg = 'Please enter a valid URL'
      setError(msg)
      showToast.error(msg)
      return
    }

    setLoading(true)

    try {
      const recipe = await recipeService.scrapeRecipe(url.trim())
      onRecipeImported(recipe)
      showToast.success('Recipe imported successfully!')
      setUrl('')
      onClose()
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Failed to import recipe from URL'
      setError(errorMessage)
      showToast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setUrl('')
      setError('')
      onClose()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleImport()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <ImportIcon />
          Import Recipe from URL
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter the URL of a recipe from a supported website. The recipe will be
          automatically extracted and added to your cookbook.
        </Typography>

        <TextField
          fullWidth
          label="Recipe URL"
          placeholder="https://www.example.com/recipe"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          autoFocus
          helperText="Paste the full URL of the recipe page"
        />

        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            Supported sites include AllRecipes, Food Network, Bon Appétit, and many
            others with standard recipe markup.
          </Typography>
        </Box>

        {loading && (
          <Box display="flex" alignItems="center" gap={2} mt={3}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary">
              Importing recipe... This may take a few seconds.
            </Typography>
          </Box>
        )}

        <Box mt={2} p={2} sx={{ bgcolor: 'info.lighter', borderRadius: 1 }}>
          <Typography variant="caption" color="info.dark">
            <strong>Tip:</strong> After importing, you can edit the recipe to adjust
            ingredients, steps, or add a rating.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={loading} size="large">
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={loading}
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <ImportIcon />}
        >
          {loading ? 'Importing...' : 'Import Recipe'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
