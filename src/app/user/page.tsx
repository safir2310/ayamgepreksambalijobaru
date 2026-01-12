'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  User as UserIcon,
  ShoppingCart,
  UtensilsCrossed,
  Star,
  Receipt,
  LogOut,
  Download,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAppStore } from '@/store/store'
import { useToast } from '@/hooks/use-toast'

interface Order {
  id: string
  status: string
  totalAmount: number
  createdAt: string
  items: {
    id: string
    product: {
      name: string
    } | null
    quantity: number
    price: number
    subtotal: number
  }[]
}

export default function UserDashboardPage() {
  const router = useRouter()
  const { user, isLoggedIn, logout, cart, updateUser } = useAppStore()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [profileData, setProfileData] = useState({
    address: user?.address || '',
    phone: user?.phone || '',
  })

  useEffect(() => {
    if (!isLoggedIn || !user) {
      router.push('/login')
      return
    }
    fetchOrders()
  }, [isLoggedIn, user?.id])

  const fetchOrders = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/orders?userId=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update profile in database
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: profileData.address, phone: profileData.phone }),
      })

      if (response.ok) {
        const userData = await response.json()
        updateUser(userData)
        toast({
          title: 'Profil Berhasil Diperbarui',
          description: 'Data profil Anda telah diperbarui',
        })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Gagal Memperbarui Profil',
        description: 'Terjadi kesalahan saat memperbarui profil',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      MENUNGGU_PERSETUJUAN: { color: 'bg-yellow-500', icon: Clock, label: 'Menunggu Persetujuan' },
      DISETUJUI: { color: 'bg-blue-500', icon: CheckCircle2, label: 'Disetujui' },
      SEDANG_DIPROSES: { color: 'bg-purple-500', icon: Package, label: 'Sedang Diproses' },
      SELESAI: { color: 'bg-green-500', icon: CheckCircle2, label: 'Selesai' },
      CANCEL: { color: 'bg-red-500', icon: XCircle, label: 'Cancel' },
    }

    const config = statusConfig[status] || statusConfig.MENUNGGU_PERSETUJUAN
    const Icon = config.icon

    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  // Generate numeric ID from string
  const generateNumericId = (str: string, length: number = 6) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash % Math.pow(10, length)).toString().padStart(length, '0')
  }

  const handlePrintReceipt = (order: Order) => {
    const numericReceiptId = generateNumericId(order.id, 6)
    const numericUserId = user?.id ? generateNumericId(user.id, 5) : '00000'

    const receiptContent = `
AYAM GEPREK SAMBAL IJO
---------------------
ID Struk: #${numericReceiptId}
ID User: #${numericUserId}
Nama User: ${user?.username}
---------------------
${order.items.map((item) => `
  ${item.product.name} x${item.quantity}
  Rp ${item.subtotal.toLocaleString('id-ID')}
`).join('')}
---------------------
Total: Rp ${order.totalAmount.toLocaleString('id-ID')}
Status: ${order.status}
---------------------
Pedasnya Bikin Nagih!

Terima Kasih Atas Pesanan Anda!
    `.trim()

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <style>
            .store-name { color: #f97316; font-weight: bold; font-size: 18px; }
            pre { font-family: monospace; white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre class="store-name">AYAM GEPREK SAMBAL IJO</pre>
          <pre>${receiptContent.split('\n').slice(1).join('\n')}</pre>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleDownloadReceipt = (order: Order) => {
    const numericReceiptId = generateNumericId(order.id, 6)
    const numericUserId = user?.id ? generateNumericId(user.id, 5) : '00000'

    const receiptContent = `
AYAM GEPREK SAMBAL IJO
---------------------
ID Struk: #${numericReceiptId}
ID User: #${numericUserId}
Nama User: ${user?.username}
---------------------
${order.items.map((item) => `
  ${item.product.name} x${item.quantity}
  Rp ${item.subtotal.toLocaleString('id-ID')}
`).join('')}
---------------------
Total: Rp ${order.totalAmount.toLocaleString('id-ID')}
Status: ${order.status}
---------------------
Pedasnya Bikin Nagih!

Terima Kasih Atas Pesanan Anda!
    `.trim()

    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `struk-${order.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-orange-400">
      <Header
        cartCount={cart.length}
        isLoggedIn={isLoggedIn}
        userRole={user?.role}
        onLogout={handleLogout}
        onNavigateToCart={() => router.push('/cart')}
        onNavigateToLogin={() => router.push('/login')}
      />

      <main className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-6xl">
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

          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-2">
              Selamat Datang, {user.username}!
            </h1>
            <p className="text-orange-100">
              Kelola profil dan pesanan Anda di sini
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Star className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Poin Anda</p>
                    <p className="text-2xl font-bold text-gray-800">{user.points}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ShoppingCart className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Pesanan</p>
                    <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pesanan Selesai</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {orders.filter((o) => o.status === 'SELESAI').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Card className="bg-white">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 h-16">
                <TabsTrigger value="profile" className="flex flex-col items-center justify-center gap-1 h-full data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <span className="text-2xl">👤</span>
                  <span className="text-xs">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="menu" className="flex flex-col items-center justify-center gap-1 h-full data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <span className="text-2xl">🍗</span>
                  <span className="text-xs">Menu</span>
                </TabsTrigger>
                <TabsTrigger value="points" className="flex flex-col items-center justify-center gap-1 h-full data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <span className="text-2xl">⭐</span>
                  <span className="text-xs">Poin</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex flex-col items-center justify-center gap-1 h-full data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <span className="text-2xl">🧾</span>
                  <span className="text-xs">Struk</span>
                </TabsTrigger>
              </TabsList>

              {/* Edit Profile Tab */}
              <TabsContent value="profile">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Edit Profil
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <Label>Username</Label>
                      <Input value={user.username} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={user.email} disabled className="bg-gray-50" />
                    </div>
                    <div>
                      <Label>No HP</Label>
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="Masukkan no HP Anda"
                      />
                    </div>
                    <div>
                      <Label>Alamat</Label>
                      <Textarea
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        placeholder="Masukkan alamat Anda"
                        rows={4}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {isLoading ? 'Memproses...' : 'Simpan Perubahan'}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>

              {/* Menu Tab */}
              <TabsContent value="menu">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5" />
                    Menu Makanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <UtensilsCrossed className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">
                      Lihat menu lengkap di halaman utama
                    </p>
                    <Button
                      onClick={() => router.push('/')}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Lihat Menu
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>

              {/* Points Tab */}
              <TabsContent value="points">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Tukar Poin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Star className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                    <p className="text-2xl font-bold text-gray-800 mb-2">
                      {user.points} Poin
                    </p>
                    <p className="text-gray-500 mb-4">
                      Fitur tukar poin akan segera hadir!
                    </p>
                  </div>
                </CardContent>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Receipt className="w-5 h-5" />
                      Struk & Transaksi
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={fetchOrders}
                    >
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Receipt className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">Belum ada pesanan</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {orders.map((order) => (
                        <Card key={order.id} className="bg-gray-50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.createdAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handlePrintReceipt(order)}
                                  className="text-blue-500 hover:text-blue-600"
                                >
                                  <Printer className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDownloadReceipt(order)}
                                  className="text-green-500 hover:text-green-600"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2 mb-3">
                              {order.items?.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <span className="text-gray-700">{item.product?.name || 'Produk Terhapus'} x{item.quantity}</span>
                                  <span className="font-medium text-gray-900">
                                    Rp {item.subtotal.toLocaleString('id-ID')}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-300">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Status:</span>
                                {getStatusBadge(order.status)}
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Total:</p>
                                <p className="text-xl font-bold text-orange-600">
                                  Rp {order.totalAmount.toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
