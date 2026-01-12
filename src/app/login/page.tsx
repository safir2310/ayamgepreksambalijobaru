'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChefHat, ArrowLeft, Lock, User as UserIcon, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppStore } from '@/store/store'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAppStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error when user types
    setError(null)
  }

  const validateForm = () => {
    // Basic validation
    if (!formData.username.trim()) {
      setError('Username harus diisi')
      return false
    }
    if (formData.username.length < 3) {
      setError('Username minimal 3 karakter')
      return false
    }
    if (!formData.password.trim()) {
      setError('Password harus diisi')
      return false
    }
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('='.repeat(50))
      console.log('LOGIN REQUEST')
      console.log('='.repeat(50))
      console.log('Username:', formData.username)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      const data = await response.json()

      console.log('Response data:', data)
      console.log('Response has error:', !!data.error)
      console.log('Response has user:', !!data.user)
      console.log('='.repeat(50))

      if (response.ok) {
        // Check if there's an error message in success response
        if (data.error) {
          setError(data.error)

          toast({
            title: 'Login Gagal',
            description: data.error,
            variant: 'destructive',
          })

          console.error('Login failed with error in success response:', data)
        } else {
          // Success - no error message
          toast({
            title: 'Login Berhasil',
            description: data.message || 'Selamat datang kembali!',
          })

          // Store user data in Zustand store
          login({
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            phone: data.user.phone,
            address: data.user.address,
            role: data.user.role as 'USER' | 'ADMIN',
            points: data.user.points,
          })

          console.log('User logged in successfully:', data.user.username)
          console.log('User role:', data.user.role)

          // Redirect based on role
          setTimeout(() => {
            if (data.user.role === 'ADMIN') {
              router.push('/admin')
            } else {
              router.push('/user')
            }
          }, 500)
        }
      } else {
        // HTTP error
        const errorMsg = data.error || data.message || 'Terjadi kesalahan saat login'

        setError(errorMsg)

        toast({
          title: 'Login Gagal',
          description: errorMsg,
          variant: 'destructive',
        })

        console.error('HTTP Error:', response.status)
        console.error('Response data:', data)
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Terjadi kesalahan jaringan'

      setError(errorMsg)

      toast({
        title: 'Login Gagal',
        description: errorMsg,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-orange-400">
      <Header
        cartCount={0}
        isLoggedIn={false}
        userRole={undefined}
        onLogout={() => {}}
        onNavigateToCart={() => {}}
        onNavigateToLogin={() => {}}
      />

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white mb-6 hover:text-orange-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </motion.button>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-8"
          >
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center justify-center w-20 h-20 bg-orange-500 rounded-full"
              >
                <ChefHat className="w-10 h-10 text-white" />
              </motion.div>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Login
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Masuk ke akun AYAM GEPREK SAMBAL IJO
            </p>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
              >
                <p className="text-sm font-medium flex items-center gap-2">
                  <Loader2 className="w-4 h-4" />
                  {error}
                </p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Masukkan username (minimal 3 karakter)"
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan password (minimal 6 karakter)"
                    className="pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Login Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Login</span>
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Belum punya akun?{' '}
                <button
                  onClick={() => router.push('/register')}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Daftar sekarang
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
