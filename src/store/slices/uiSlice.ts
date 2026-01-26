import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

type UiState = {
  isMenuDetailOpen: boolean
  activeMenuId: number | null
  activeRestaurantId: number | null
  isFilterOpen: boolean
  lastCheckoutAt?: string
  lastPaymentMethod?: string
  lastSubtotal?: number
  lastDeliveryFee?: number
  lastServiceFee?: number
  lastTotal?: number
  lastItems?: number
}

const initialState: UiState = {
  isMenuDetailOpen: false,
  activeMenuId: null,
  activeRestaurantId: null,
  isFilterOpen: false,
  lastCheckoutAt: undefined,
  lastPaymentMethod: undefined,
  lastSubtotal: undefined,
  lastDeliveryFee: undefined,
  lastServiceFee: undefined,
  lastTotal: undefined,
  lastItems: undefined,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openMenuDetail(
      state,
      action: PayloadAction<{ menuId: number; restaurantId?: number }>
    ) {
      state.isMenuDetailOpen = true
      state.activeMenuId = action.payload.menuId
      state.activeRestaurantId = action.payload.restaurantId ?? null
    },
    closeMenuDetail(state) {
      state.isMenuDetailOpen = false
      state.activeMenuId = null
      state.activeRestaurantId = null
    },
    toggleFilter(state, action: PayloadAction<boolean | undefined>) {
      state.isFilterOpen = action.payload ?? !state.isFilterOpen
    },
    setLastCheckoutAt(state, action: PayloadAction<string | undefined>) {
      state.lastCheckoutAt = action.payload
    },
    setLastCheckoutSummary(
      state,
      action: PayloadAction<{
        paymentMethod?: string
        subtotal?: number
        deliveryFee?: number
        serviceFee?: number
        total?: number
        items?: number
      }>
    ) {
      state.lastPaymentMethod = action.payload.paymentMethod
      state.lastSubtotal = action.payload.subtotal
      state.lastDeliveryFee = action.payload.deliveryFee
      state.lastServiceFee = action.payload.serviceFee
      state.lastTotal = action.payload.total
      state.lastItems = action.payload.items
    },
  },
})

export const {
  openMenuDetail,
  closeMenuDetail,
  toggleFilter,
  setLastCheckoutAt,
  setLastCheckoutSummary,
} = uiSlice.actions
export default uiSlice.reducer
