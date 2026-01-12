'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UtensilsCrossed, Coffee, Flame, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppStore } from '@/store/store'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  discountPrice?: number
  category: string
  image?: string
  isPromotion: boolean
  isNew: boolean
}

type Category = 'SEMUA' | 'MAKANAN' | 'MINUMAN' | 'PROMOSI' | 'TERBARU'

export default function Home() {
  const router = useRouter()
  const { addToCart, isLoggedIn, user, logout, getCartItemCount } = useAppStore()
  const [selectedCategory, setSelectedCategory] = useState<Category>('SEMUA')
  const [products, setProducts] = useState<Product[]>([])

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // Filter products based on category
  const filteredProducts = products.filter((product) => {
    switch (selectedCategory) {
      case 'MAKANAN':
        return product.category === 'MAKANAN'
      case 'MINUMAN':
        return product.category === 'MINUMAN'
      case 'PROMOSI':
        return product.isPromotion
      case 'TERBARU':
        return product.isNew
      default:
        return true
    }
  })

  const handleAddToCart = (product: {
    productId: string
    name: string
    price: number
    discountPrice?: number
    quantity: number
    image?: string
  }) => {
    addToCart(product)
  }

  const handleNavigateToCart = () => {
    router.push('/cart')
  }

  const handleNavigateToLogin = () => {
    router.push('/login')
  }

  const handleLogout = () => {
    logout()
  }

  const categories = [
    { id: 'SEMUA', label: 'Semua', icon: UtensilsCrossed },
    { id: 'MAKANAN', label: 'Makanan', icon: UtensilsCrossed },
    { id: 'MINUMAN', label: 'Minuman', icon: Coffee },
    { id: 'PROMOSI', label: 'Promosi', icon: Flame },
    { id: 'TERBARU', label: 'Terbaru', icon: Sparkles },
  ] as const

  return (
    <div className="min-h-screen flex flex-col bg-orange-400">
      <Header
        cartCount={getCartItemCount()}
        isLoggedIn={isLoggedIn}
        userRole={user?.role}
        onLogout={handleLogout}
        onNavigateToCart={handleNavigateToCart}
        onNavigateToLogin={handleNavigateToLogin}
      />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-orange-500 py-8 px-4"
      >
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Selamat Datang di AYAM GEPREK SAMBAL IJO
          </h1>
          <p className="text-orange-100 text-lg">Pedasnya Bikin Nagih!</p>
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="flex-1 bg-orange-400 py-8 px-4">
        <div className="container mx-auto">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Tabs
              value={selectedCategory}
              onValueChange={(value) =>
                setSelectedCategory(value as Category)
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5 bg-white/90">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                  >
                    <category.icon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{category.label}</span>
                    <span className="sm:hidden">
                      {category.label.substring(0, 4)}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {filteredProducts.map((product, index) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <ProductCard
                                id={product.id}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                discountPrice={product.discountPrice}
                                image={product.image}
                                isPromotion={product.isPromotion}
                                isNew={product.isNew}
                                onAddToCart={handleAddToCart}
                              />
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-white text-lg">Tidak ada produk tersedia</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
