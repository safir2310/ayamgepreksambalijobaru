'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChefHat, ArrowLeft, Lock, User as UserIcon, Mail, Phone, Calendar, Shield, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<'USER' | 'ADMIN'>('USER')
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    address: '',
    birthDate: '',
    verificationCode: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    setError(null)
  }

  const validateForm = (role: 'USER' | 'ADMIN') => {
    // Basic validation for all roles
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
    if (!formData.email.trim()) {
      setError('Email harus diisi')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Email tidak valid')
      return false
    }
    if (!formData.phone.trim()) {
      setError('No HP harus diisi')
      return false
    }
    if (formData.phone.length < 10) {
      setError('No HP minimal 10 digit')
      return false
    }

    // Additional validation for USER
    if (role === 'USER') {
      if (!formData.address.trim()) {
        setError('Alamat harus diisi')
        return false
      }
    }

    // Additional validation for ADMIN
    if (role === 'ADMIN') {
      if (!formData.birthDate) {
        setError('Tanggal lahir harus diisi')
        return false
      }
      if (!formData.verificationCode.trim()) {
        setError('Kode verifikasi harus diisi')
        return false
      }
      if (formData.verificationCode.length !== 6) {
        setError('Kode verifikasi harus 6 digit')
        return false
      }
      if (!/^\d{6}$/.test(formData.verificationCode)) {
        setError('Kode verifikasi harus angka 6 digit')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent, role: 'USER' | 'ADMIN') => {
    e.preventDefault()

    // Validate form
    if (!validateForm(role)) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      console.log('Registering as:', role)
      console.log('Form data:', { ...formData, password: '***' })

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role,
          verificationCode: role === 'ADMIN' ? formData.verificationCode : undefined,
          birthDate: role === 'ADMIN' ? formData.birthDate : undefined,
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      const data = await response.json()

      console.log('Response data:', data)
      console.log('Response has error:', !!data.error)
      console.log('Response has user:', !!data.user)

      if (response.ok) {
        // Check if there's an error message in success response
        if (data.error) {
          setError(data.error)

          toast({
            title: 'Registrasi Gagal',
            description: data.error,
            variant: 'destructive',
          })

          console.error('Registration failed with error in success response:', data)
        } else {
          // Success - no error message
          toast({
            title: 'Registrasi Berhasil',
            description: data.message || 'Silakan login dengan akun Anda',
          })

          // Redirect to login page
          router.push('/login')
        }
      } else {
        // HTTP error
        const errorMsg = data.error || data.message || 'Terjadi kesalahan saat registrasi'

        setError(errorMsg)

        toast({
          title: 'Registrasi Gagal',
          description: errorMsg,
          variant: 'destructive',
        })

        console.error('HTTP Error:', response.status)
        console.error('Response data:', data)
      }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMsg = error instanceof Error ? error.message : 'Terjadi kesalahan jaringan'

      setError(errorMsg)

      toast({
        title: 'Registrasi Gagal',
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
          className="w-full max-w-2xl"
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

          {/* Register Card */}
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
              Registrasi
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Bergabunglah dengan AYAM GEPREK SAMBAL IJO
            </p>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
              >
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {/* Tabs */}
            <Tabs value={userRole} onValueChange={(v) => {
              setUserRole(v as 'USER' | 'ADMIN')
              setError(null)
              setFormData(prev => ({
                ...prev,
                verificationCode: '',
                birthDate: '',
              }))
            }}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="USER" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  User
                </TabsTrigger>
                <TabsTrigger value="ADMIN" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  Admin
                </TabsTrigger>
              </TabsList>

              {/* User Form */}
              <TabsContent value="USER">
                <form onSubmit={(e) => handleSubmit(e, 'USER')} className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Masukkan email"
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No HP <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Masukkan no HP (minimal 10 digit)"
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Masukkan alamat lengkap"
                        className="pl-4"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

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
                          <Shield className="w-5 h-5" />
                          <span>Daftar sebagai User</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>

              {/* Admin Form */}
              <TabsContent value="ADMIN">
                <form onSubmit={(e) => handleSubmit(e, 'ADMIN')} className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Masukkan email"
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No HP <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Masukkan no HP (minimal 10 digit)"
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      * Kode verifikasi = DDMMYY dari tanggal lahir Anda
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Verifikasi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        name="verificationCode"
                        value={formData.verificationCode}
                        onChange={handleChange}
                        placeholder="6 digit kode (DDMMYY dari tanggal lahir)"
                        className="pl-10"
                        disabled={isLoading}
                        required
                        maxLength={6}
                        pattern="[0-9]*"
                        inputMode="numeric"
                      />
                    </div>
                  </div>

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
                          <Shield className="w-5 h-5" />
                          <span>Daftar sebagai Admin</span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>
            </Tabs>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Sudah punya akun?{' '}
                <button
                  onClick={() => router.push('/login')}
                  className="text-orange-500 hover:text-orange-600 font-medium"
                >
                  Login sekarang
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
