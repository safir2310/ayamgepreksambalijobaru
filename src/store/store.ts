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
  // User State
  isLoggedIn: boolean
  user: {
    id: string
    username: string
    email: string
    role: 'USER' | 'ADMIN'
    points: number
  } | null

  // Cart State
  cart: CartItem[]

  // Actions
  login: (user: AppState['user']) => void
  logout: () => void
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      isLoggedIn: false,
      user: null,
      cart: [],

      // Login
      login: (user) => {
        set({
          isLoggedIn: true,
          user,
        })
      },

      // Logout
      logout: () => {
        set({
          isLoggedIn: false,
          user: null,
        })
      },

      // Add to Cart
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

      // Remove from Cart
      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter((item) => item.productId !== productId),
        })
      },

      // Update Quantity
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

      // Clear Cart
      clearCart: () => {
        set({ cart: [] })
      },

      // Get Cart Total
      getCartTotal: () => {
        const cart = get().cart
        return cart.reduce((total, item) => {
          const price = item.discountPrice || item.price
          return total + price * item.quantity
        }, 0)
      },
    }),
    {
      name: 'ayam-geprek-storage',
    }
  )
)
