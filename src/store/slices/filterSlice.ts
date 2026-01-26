import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export type SortOption = "price-asc" | "price-desc" | "rating-desc" | "rating-asc"

type FilterState = {
  category: string | null
  priceMin: number | null
  priceMax: number | null
  rating: number | null
  sort: SortOption | null
  distance: string | null
}

const initialState: FilterState = {
  category: null,
  priceMin: null,
  priceMax: null,
  rating: null,
  sort: null,
  distance: null,
}

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategory(state, action: PayloadAction<string | null>) {
      state.category = action.payload
    },
    setPriceMin(state, action: PayloadAction<number | null>) {
      state.priceMin = action.payload
    },
    setPriceMax(state, action: PayloadAction<number | null>) {
      state.priceMax = action.payload
    },
    setRating(state, action: PayloadAction<number | null>) {
      state.rating = action.payload
    },
    setSort(state, action: PayloadAction<SortOption | null>) {
      state.sort = action.payload
    },
    setDistance(state, action: PayloadAction<string | null>) {
      state.distance = action.payload
    },
    resetFilters() {
      return initialState
    },
  },
})

export const {
  setCategory,
  setPriceMin,
  setPriceMax,
  setRating,
  setSort,
  setDistance,
  resetFilters,
} = filterSlice.actions
export default filterSlice.reducer
