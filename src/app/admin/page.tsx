'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Package,
  Users,
  ShoppingCart,
  Store,
  LogOut,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Download,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useToast } from '@/hooks/use-toast'

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

interface User {
  id: string
  username: string
  email: string
  phone: string
  role: string
  points: number
  createdAt: string
}

interface Order {
  id: string
  status: string
  totalAmount: number
  createdAt: string
  user: {
    username: string
    email: string
    phone: string
    address?: string
  }
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

export default function AdminDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditingProduct, setIsEditingProduct] = useState(false)
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'MAKANAN',
    image: '',
    isPromotion: false,
    isNew: false,
  })
  const [userPasswordData, setUserPasswordData] = useState('')
  const [storeProfile, setStoreProfile] = useState({
    name: 'AYAM GEPREK SAMBAL IJO',
    slogan: 'Pedasnya Bikin Nagih!',
    address: '',
    phone: '085260812758',
    instagram: '',
    facebook: '',
  })

  useEffect(() => {
    fetchProducts()
    fetchUsers()
    fetchOrders()
    fetchStoreProfile()
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

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const fetchStoreProfile = async () => {
    try {
      const response = await fetch('/api/store-profile')
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setStoreProfile(data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching store profile:', error)
    }
  }

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsEditingProduct(true)
    setProductFormData({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      category: 'MAKANAN',
      image: '',
      isPromotion: false,
      isNew: false,
    })
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsEditingProduct(true)
    setProductFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      discountPrice: product.discountPrice?.toString() || '',
      category: product.category,
      image: product.image || '',
      isPromotion: product.isPromotion,
      isNew: product.isNew,
    })
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Produk Dihapus',
          description: 'Produk berhasil dihapus',
        })
        fetchProducts()
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: 'Gagal Menghapus Produk',
        description: 'Terjadi kesalahan saat menghapus produk',
        variant: 'destructive',
      })
    }
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const url = selectedProduct
        ? `/api/products/${selectedProduct.id}`
        : '/api/products'
      const method = selectedProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productFormData),
      })

      if (response.ok) {
        toast({
          title: selectedProduct ? 'Produk Diupdate' : 'Produk Ditambahkan',
          description: 'Produk berhasil disimpan',
        })
        setIsEditingProduct(false)
        fetchProducts()
      } else {
        throw new Error('Failed to save product')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      toast({
        title: 'Gagal Menyimpan Produk',
        description: 'Terjadi kesalahan saat menyimpan produk',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'User Dihapus',
          description: 'User berhasil dihapus',
        })
        fetchUsers()
      } else {
        throw new Error('Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: 'Gagal Menghapus User',
        description: 'Terjadi kesalahan saat menghapus user',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateUserPassword = async (userId: string) => {
    if (!userPasswordData) {
      toast({
        title: 'Password Kosong',
        description: 'Silakan masukkan password baru',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: userPasswordData }),
      })

      if (response.ok) {
        toast({
          title: 'Password Diupdate',
          description: 'Password user berhasil diupdate',
        })
        setUserPasswordData('')
      } else {
        throw new Error('Failed to update password')
      }
    } catch (error) {
      console.error('Error updating password:', error)
      toast({
        title: 'Gagal Mengupdate Password',
        description: 'Terjadi kesalahan saat mengupdate password',
        variant: 'destructive',
      })
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast({
          title: 'Status Diupdate',
          description: 'Status pesanan berhasil diupdate',
        })
        fetchOrders()
      } else {
        throw new Error('Failed to update order status')
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      toast({
        title: 'Gagal Mengupdate Status',
        description: 'Terjadi kesalahan saat mengupdate status pesanan',
        variant: 'destructive',
      })
    }
  }

  const handleSaveStoreProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/store-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeProfile),
      })

      if (response.ok) {
        toast({
          title: 'Profil Toko Diupdate',
          description: 'Profil toko berhasil diperbarui',
        })
      } else {
        throw new Error('Failed to update store profile')
      }
    } catch (error) {
      console.error('Error updating store profile:', error)
      toast({
        title: 'Gagal Mengupdate Profil',
        description: 'Terjadi kesalahan saat mengupdate profil toko',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
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
    const numericUserId = order.user.id ? generateNumericId(order.user.id, 5) : '00000'

    const receiptContent = `
AYAM GEPREK SAMBAL IJO
---------------------
ID Struk: #${numericReceiptId}
ID User: #${numericUserId}
Nama User: ${order.user.username}
No HP: ${order.user.phone}
Alamat: ${order.user.address || '-'}
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
    const numericUserId = order.user.id ? generateNumericId(order.user.id, 5) : '00000'

    const receiptContent = `
AYAM GEPREK SAMBAL IJO
---------------------
ID Struk: #${numericReceiptId}
ID User: #${numericUserId}
Nama User: ${order.user.username}
No HP: ${order.user.phone}
Alamat: ${order.user.address || '-'}
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

  const handleLogout = () => {
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-orange-400">
      <Header
        cartCount={0}
        isLoggedIn={true}
        userRole="ADMIN"
        onLogout={handleLogout}
        onNavigateToCart={() => {}}
        onNavigateToLogin={() => router.push('/login')}
      />

      <main className="flex-1 px-4 py-8">
        <div className="container mx-auto max-w-7xl">
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
              Dashboard Admin
            </h1>
            <p className="text-orange-100">
              Kelola toko AYAM GEPREK SAMBAL IJO
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Package className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Produk</p>
                    <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total User</p>
                    <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <ShoppingCart className="w-6 h-6 text-purple-500" />
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
                <TabsTrigger value="products" className="flex items-center justify-center gap-2 h-full data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <Package className="w-4 h-4" />
                  <span>Produk</span>
                </TabsTrigger>
                <TabsTrigger value="users" className="flex items-center justify-center gap-2 h-full data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <Users className="w-4 h-4" />
                  <span>User</span>
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center justify-center gap-2 h-full data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Pesanan</span>
                </TabsTrigger>
                <TabsTrigger value="store" className="flex items-center justify-center gap-2 h-full data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                  <Store className="w-4 h-4" />
                  <span>Profil Toko</span>
                </TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products">
                <div className="p-6">
                  {isEditingProduct ? (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-4">
                        {selectedProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                      </h3>
                      <form onSubmit={handleSaveProduct} className="space-y-4">
                        <div>
                          <Label>Nama Produk</Label>
                          <Input
                            type="text"
                            value={productFormData.name}
                            onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                            placeholder="Masukkan nama produk"
                            required
                          />
                        </div>
                        <div>
                          <Label>Deskripsi</Label>
                          <Textarea
                            value={productFormData.description}
                            onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                            placeholder="Masukkan deskripsi produk"
                            rows={3}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Harga</Label>
                            <Input
                              type="number"
                              value={productFormData.price}
                              onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                              placeholder="Harga normal"
                              required
                            />
                          </div>
                          <div>
                            <Label>Harga Diskon</Label>
                            <Input
                              type="number"
                              value={productFormData.discountPrice}
                              onChange={(e) => setProductFormData({ ...productFormData, discountPrice: e.target.value })}
                              placeholder="Harga diskon (opsional)"
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Kategori</Label>
                          <select
                            value={productFormData.category}
                            onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                          >
                            <option value="MAKANAN">MAKANAN</option>
                            <option value="MINUMAN">MINUMAN</option>
                          </select>
                        </div>
                        <div>
                          <Label>URL Gambar</Label>
                          <Input
                            type="text"
                            value={productFormData.image}
                            onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                            placeholder="URL gambar produk (opsional)"
                          />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={productFormData.isPromotion}
                              onCheckedChange={(checked) => setProductFormData({ ...productFormData, isPromotion: checked })}
                            />
                            <Label>Promosi</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={productFormData.isNew}
                              onCheckedChange={(checked) => setProductFormData({ ...productFormData, isNew: checked })}
                            />
                            <Label>Produk Baru</Label>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit" disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
                            {isLoading ? 'Menyimpan...' : 'Simpan'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditingProduct(false)}
                          >
                            Batal
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <Button onClick={handleAddProduct} className="mb-6 bg-orange-500 hover:bg-orange-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Produk
                    </Button>
                  )}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {products.map((product) => (
                      <Card key={product.id} className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-gray-800">{product.name}</h4>
                                {product.isPromotion && (
                                  <Badge className="bg-red-500 text-white">Promosi</Badge>
                                )}
                                {product.isNew && (
                                  <Badge className="bg-green-500 text-white">Baru</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {product.category}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-orange-600">
                                  Rp {product.price.toLocaleString('id-ID')}
                                </span>
                                {product.discountPrice && (
                                  <span className="line-through text-gray-400 text-sm">
                                    Rp {product.discountPrice.toLocaleString('id-ID')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users">
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <Card key={user.id} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-800">{user.username}</h4>
                              <Badge className={user.role === 'ADMIN' ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'}>
                                {user.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-600">{user.phone}</p>
                            <p className="text-sm text-gray-600">Poin: {user.points}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <div className="flex gap-1">
                              <Input
                                type="password"
                                placeholder="Password baru"
                                value={userPasswordData}
                                onChange={(e) => setUserPasswordData(e.target.value)}
                                className="w-32 text-sm"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleUpdateUserPassword(user.id)}
                                className="bg-orange-500 hover:bg-orange-600"
                              >
                                Update
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Pesanan
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
                      <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
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
                                  })}
                                </p>
                                <p className="font-semibold text-gray-800">{order.user.username}</p>
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
                            <div className="pt-3 border-t border-gray-300">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="w-full p-2 border rounded bg-white"
                              >
                                <option value="MENUNGGU_PERSETUJUAN">Menunggu Persetujuan</option>
                                <option value="DISETUJUI">Disetujui</option>
                                <option value="SEDANG_DIPROSES">Sedang Diproses</option>
                                <option value="SELESAI">Selesai</option>
                                <option value="CANCEL">Cancel</option>
                              </select>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </TabsContent>

              {/* Store Profile Tab */}
              <TabsContent value="store">
                <div className="p-6">
                  <form onSubmit={handleSaveStoreProfile} className="space-y-4">
                    <div>
                      <Label>Nama Toko</Label>
                      <Input
                        type="text"
                        value={storeProfile.name}
                        onChange={(e) => setStoreProfile({ ...storeProfile, name: e.target.value })}
                        placeholder="Masukkan nama toko"
                        required
                      />
                    </div>
                    <div>
                      <Label>Slogan</Label>
                      <Input
                        type="text"
                        value={storeProfile.slogan}
                        onChange={(e) => setStoreProfile({ ...storeProfile, slogan: e.target.value })}
                        placeholder="Masukkan slogan"
                        required
                      />
                    </div>
                    <div>
                      <Label>Alamat</Label>
                      <Textarea
                        value={storeProfile.address}
                        onChange={(e) => setStoreProfile({ ...storeProfile, address: e.target.value })}
                        placeholder="Masukkan alamat toko"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label>No HP</Label>
                      <Input
                        type="tel"
                        value={storeProfile.phone}
                        onChange={(e) => setStoreProfile({ ...storeProfile, phone: e.target.value })}
                        placeholder="Masukkan no HP toko"
                        required
                      />
                    </div>
                    <div>
                      <Label>Instagram</Label>
                      <Input
                        type="text"
                        value={storeProfile.instagram}
                        onChange={(e) => setStoreProfile({ ...storeProfile, instagram: e.target.value })}
                        placeholder="Username Instagram"
                      />
                    </div>
                    <div>
                      <Label>Facebook</Label>
                      <Input
                        type="text"
                        value={storeProfile.facebook}
                        onChange={(e) => setStoreProfile({ ...storeProfile, facebook: e.target.value })}
                        placeholder="URL Facebook"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
