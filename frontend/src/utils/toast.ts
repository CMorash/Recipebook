import { toast, ToastOptions } from 'react-toastify'

const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    borderRadius: '12px',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 500,
  },
}

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: '#10B981', // Bright green - matches theme primary
        color: '#F9FAFB',
      },
    })
  },
  
  error: (message: string) => {
    toast.error(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: '#EF4444', // Red for errors
        color: '#F9FAFB',
      },
    })
  },
  
  info: (message: string) => {
    toast.info(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: '#3B82F6', // Blue for info
        color: '#F9FAFB',
      },
    })
  },
  
  warning: (message: string) => {
    toast.warning(message, {
      ...defaultOptions,
      style: {
        ...defaultOptions.style,
        background: '#F59E0B', // Amber - matches theme secondary
        color: '#111827', // Dark text for contrast
      },
    })
  },
}

