'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppStore } from '@/store/store'
import { useToast } from '@/hooks/use-toast'

export default function CartPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, isLoggedIn, user } = useAppStore()
  const { toast } = useToast()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
    toast({
      title: 'Item Dihapus',
      description: 'Item berhasil dihapus dari keranjang',
    })
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Keranjang Kosong',
        description: 'Silakan tambahkan item ke keranjang terlebih dahulu',
        variant: 'destructive',
      })
      return
    }

    if (!isLoggedIn || !user) {
      toast({
        title: 'Harus Login',
        description: 'Silakan login terlebih dahulu untuk checkout',
        variant: 'destructive',
      })
      router.push('/login')
      return
    }

    setIsCheckingOut(true)

    try {
      // Create order in database
      const totalAmount = getCartTotal()
      const orderData = {
        userId: user.id,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.discountPrice || item.price,
          subtotal: (item.discountPrice || item.price) * item.quantity,
        })),
        totalAmount,
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const orderResult = await response.json()

      // Generate numeric IDs
      const generateNumericId = (str: string, length: number = 6) => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i)
          hash = ((hash << 5) - hash) + char
          hash = hash & hash
        }
        return Math.abs(hash % Math.pow(10, length)).toString().padStart(length, '0')
      }

      const numericUserId = user?.id ? generateNumericId(user.id, 5) : '00000'
      const numericOrderId = generateNumericId(orderResult.id, 6)

      // Prepare WhatsApp message
      const storePhone = '6285260812758'
      const orderItemsText = cart
        .map(
          (item) =>
            `- ${item.name} x${item.quantity} = Rp ${((item.discountPrice || item.price) * item.quantity).toLocaleString('id-ID')}`
        )
        .join('\n')

      const message = `
*AYAM GEPREK SAMBAL IJO*
------------------------
Nama User: ${user.username}
ID User: #${numericUserId}
No HP: ${user.phone}
------------------------
*Daftar Pesanan:*
${orderItemsText}
------------------------
*Total: Rp ${totalAmount.toLocaleString('id-ID')}*
*ID Pesanan: #${numericOrderId}*
------------------------
Status: Menunggu Persetujuan

Terima Kasih Atas Pesanan Anda!
      `.trim()

      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')

      // Clear cart
      clearCart()

      toast({
        title: 'Pesanan Berhasil',
        description: 'Pesanan Anda telah dibuat dan akan diproses',
      })

      // Redirect to user dashboard
      router.push('/user')
    } catch (error) {
      console.error('Checkout error:', error)
      toast({
        title: 'Checkout Gagal',
        description: 'Terjadi kesalahan saat checkout',
        variant: 'destructive',
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-orange-400">
      <Header
        cartCount={cart.length}
        isLoggedIn={isLoggedIn}
        userRole={user?.role}
        onLogout={() => {
          useAppStore.getState().logout()
          router.push('/')
        }}
        onNavigateToCart={() => {}}
        onNavigateToLogin={() => router.push('/login')}
      />

      <main className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-4xl">
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

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Keranjang</h1>
            <p className="text-orange-100">
              {cart.length} item dalam keranjang
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="bg-white">
                <CardContent className="p-6">
                  <AnimatePresence>
                    {cart.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12"
                      >
                        <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-lg">Keranjang kosong</p>
                        <Button
                          onClick={() => router.push('/')}
                          className="mt-4 bg-orange-500 hover:bg-orange-600"
                        >
                          Mulai Belanja
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <motion.div
                            key={item.productId}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            {/* Product Image */}
                            <div className="w-20 h-20 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <span className="text-3xl">🍗</span>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Rp {(item.discountPrice || item.price).toLocaleString('id-ID')}
                                {item.discountPrice && (
                                  <span className="ml-2 line-through text-gray-400">
                                    Rp {item.price.toLocaleString('id-ID')}
                                  </span>
                                )}
                              </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                  handleQuantityChange(item.productId, item.quantity - 1)
                                }
                                className="w-8 h-8"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                  handleQuantityChange(item.productId, item.quantity + 1)
                                }
                                className="w-8 h-8"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Remove Button */}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="bg-white sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Ringkasan Pesanan
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>Rp {getCartTotal().toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Biaya Pengiriman</span>
                      <span>Gratis</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-800">
                      <span>Total</span>
                      <span>Rp {getCartTotal().toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || isCheckingOut}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    {isCheckingOut ? 'Memproses...' : 'Checkout WhatsApp'}
                  </Button>

                  <p className="text-sm text-gray-500 text-center mt-4">
                    Pesanan akan dikirim ke WhatsApp kami
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
