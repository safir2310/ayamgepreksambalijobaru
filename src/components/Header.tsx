'use client'

import { ChefHat, ShoppingCart, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface HeaderProps {
  cartCount?: number
  isLoggedIn?: boolean
  userRole?: 'USER' | 'ADMIN'
  onLogout?: () => void
  onNavigateToCart?: () => void
  onNavigateToLogin?: () => void
}

export default function Header({
  cartCount = 0,
  isLoggedIn = false,
  userRole,
  onLogout,
  onNavigateToCart,
  onNavigateToLogin,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState('')
  const router = useRouter()

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
      const day = days[now.getDay()]
      const time = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      })
      setCurrentTime(`${day}, ${time}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-orange-500 shadow-lg"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Store Name */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push('/')}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
              <ChefHat className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-white">
              AYAM GEPREK SAMBAL IJO
            </h1>
          </motion.div>

          {/* Center - Time Display */}
          <div className="hidden md:block">
            <div className="text-white text-sm font-medium bg-orange-600 px-4 py-2 rounded-lg">
              {currentTime}
            </div>
          </div>

          {/* Right Side - Cart, Dashboard, and Auth */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateToCart}
              className="relative p-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Dashboard Icon - Show when logged in */}
            {isLoggedIn && userRole && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(userRole === 'ADMIN' ? '/admin' : '/user')}
                className="flex items-center gap-2 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
                title={userRole === 'ADMIN' ? 'Dashboard Admin' : 'Dashboard User'}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {userRole === 'ADMIN' ? 'Admin' : 'Dashboard'}
                </span>
              </motion.button>
            )}

            {/* Login/Logout Button */}
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNavigateToLogin}
                className="flex items-center gap-2 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Time Display */}
        <div className="md:hidden mt-2">
          <div className="text-white text-sm font-medium text-center bg-orange-600 px-4 py-2 rounded-lg">
            {currentTime}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
