import "./App.css"
import { Route, Routes } from "react-router-dom"
import HomePage from "@/pages/HomePage"
import CategoryPage from "@/pages/CategoryPage"
import DetailPage from "@/pages/DetailPage"
import CartPage from "@/pages/CartPage"
import CheckoutPage from "@/pages/CheckoutPage"
import OrdersPage from "@/pages/OrdersPage"
import SuccessPage from "@/pages/SuccessPage"
import AuthPage from "@/pages/AuthPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/category" element={<CategoryPage />} />
      <Route path="/restaurant/:id" element={<DetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
    </Routes>
  )
}

export default App