'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChefHat, ArrowLeft, Lock, User as UserIcon, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useToast } from '@/hooks/use-toast'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent, role: 'USER' | 'ADMIN') => {
    e.preventDefault()
    setIsLoading(true)

    try {
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

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Registrasi Berhasil',
          description: 'Silakan login dengan akun Anda',
        })

        // Redirect to login page
        router.push('/login')
      } else {
        toast({
          title: 'Registrasi Gagal',
          description: data.error || 'Terjadi kesalahan saat registrasi',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Registrasi Gagal',
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

            {/* Tabs */}
            <Tabs value={userRole} onValueChange={(v) => setUserRole(v as 'USER' | 'ADMIN')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="USER">User</TabsTrigger>
                <TabsTrigger value="ADMIN">Admin</TabsTrigger>
              </TabsList>

              {/* User Form */}
              <TabsContent value="USER">
                <form onSubmit={(e) => handleSubmit(e, 'USER')} className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
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
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No HP
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Masukkan no HP"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg"
                    >
                      {isLoading ? 'Memproses...' : 'Daftar sebagai User'}
                    </Button>
                  </motion.div>
                </form>
              </TabsContent>

              {/* Admin Form */}
              <TabsContent value="ADMIN">
                <form onSubmit={(e) => handleSubmit(e, 'ADMIN')} className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
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
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      No HP
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Masukkan no HP"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Lahir
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Verifikasi
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        name="verificationCode"
                        value={formData.verificationCode}
                        onChange={handleChange}
                        placeholder="Kode Verifikasi"
                        className="pl-10"
                        maxLength={6}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        required
                      />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg"
                    >
                      {isLoading ? 'Memproses...' : 'Daftar sebagai Admin'}
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
