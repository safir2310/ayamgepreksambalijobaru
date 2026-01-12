// Zustand Store for AYAM GEPREK SAMBAL IJO
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  price: number
  discountPrice?: number
  quantity: number
  image?: string
}

interface AppState {
  // User state
  isLoggedIn: boolean
  user: {
    id: string
    username: string
    email: string
    phone: string
    address?: string
    role: 'USER' | 'ADMIN'
    points: number
  } | null

  // Cart state
  cart: CartItem[]

  // Actions
  login: (user: AppState['user']) => void
  logout: () => void
  updateUser: (user: Partial<AppState['user']>) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemCount: () => number
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoggedIn: false,
      user: null,
      cart: [],

      // Login action
      login: (user) => {
        set({
          isLoggedIn: true,
          user,
        })
      },

      // Logout action
      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
        })
      },

      // Update user action
      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          })
        }
      },

      // Add to cart action
      addToCart: (item) => {
        const cart = get().cart
        const existingItem = cart.find((i) => i.productId === item.productId)

        if (existingItem) {
          set({
            cart: cart.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          })
        } else {
          set({ cart: [...cart, item] })
        }
      },

      // Remove from cart action
      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter((item) => item.productId !== productId),
        })
      },

      // Update quantity action
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
        } else {
          set({
            cart: get().cart.map((item) =>
              item.productId === productId ? { ...item, quantity } : item
            ),
          })
        }
      },

      // Clear cart action
      clearCart: () => {
        set({ cart: [] })
      },

      // Get cart total
      getCartTotal: () => {
        const cart = get().cart
        return cart.reduce((total, item) => {
          const price = item.discountPrice || item.price
          return total + price * item.quantity
        }, 0)
      },

      // Get cart item count
      getCartItemCount: () => {
        const cart = get().cart
        return cart.reduce((total, item) => total + item.quantity, 0)
      },
    }),
    {
      name: 'ayam-geprek-storage',
    }
  )
)
