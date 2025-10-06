import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Paper } from '@mui/material'
import { useAuth } from '@/contexts/AuthContext'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          <RegisterForm />
        </Paper>
      </Container>
    </Box>
  )
}

