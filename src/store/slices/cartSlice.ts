import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export type CartItem = {
  id: string
  menuId: number
  name: string
  price: number
  quantity: number
  restaurantId: number
  restaurantName: string
  image?: string
}

type CartState = {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<Omit<CartItem, "id">>) {
      const existing = state.items.find(
        (item) => item.menuId === action.payload.menuId
      )
      if (existing) {
        existing.quantity += action.payload.quantity
      } else {
        state.items.push({
          ...action.payload,
          id: `${action.payload.menuId}-${Date.now()}`,
        })
      }
    },
    updateQuantity(
      state,
      action: PayloadAction<{ menuId: number; quantity: number }>
    ) {
      const item = state.items.find(
        (cartItem) => cartItem.menuId === action.payload.menuId
      )
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity)
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.menuId !== action.payload
      )
    },
    clearCart(state) {
      state.items = []
    },
  },
})

export const { addItem, updateQuantity, removeItem, clearCart } =
  cartSlice.actions
export default cartSlice.reducer
