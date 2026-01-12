'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChefHat, ArrowLeft, Lock, User as UserIcon } from 'lucide-react'
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
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        login({
          id: data.user.id,
          username: data.user.username,
          email: data.user.email,
          phone: data.user.phone,
          address: data.user.address,
          role: data.user.role as 'USER' | 'ADMIN',
          points: data.user.points,
        })

        toast({
          title: 'Login Berhasil',
          description: 'Selamat datang kembali!',
        })

        // Redirect based on role
        if (data.user.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/user')
        }
      } else {
        toast({
          title: 'Login Gagal',
          description: data.error || 'Terjadi kesalahan saat login',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Login Gagal',
        description: 'Terjadi kesalahan jaringan',
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
              Masuk ke AYAM GEPREK SAMBAL IJO
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Masukkan username"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Login Button */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg"
                >
                  {isLoading ? 'Memproses...' : 'Login'}
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
