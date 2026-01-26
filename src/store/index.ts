import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./slices/cartSlice"
import filterReducer from "./slices/filterSlice"
import searchReducer from "./slices/searchSlice"
import uiReducer from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    filters: filterReducer,
    search: searchReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
