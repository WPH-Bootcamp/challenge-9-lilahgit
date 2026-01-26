import { Minus, Plus, Utensils } from "lucide-react"
import { Link } from "react-router-dom"
import Footer from "@/components/layout/Footer"
import SolidHeader from "@/components/layout/SolidHeader"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { removeItem, updateQuantity } from "@/store/slices/cartSlice"

const CartPage = () => {
  const dispatch = useAppDispatch()
  const items = useAppSelector((state) => state.cart.items)

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = `${item.restaurantId}-${item.restaurantName}`
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <SolidHeader />
      <main className="mx-auto w-full max-w-180 px-4 pb-12 pt-8 sm:px-6">
        <h1 className="text-2xl font-bold">My Cart</h1>
        <div className="mt-6 space-y-6">
          {Object.entries(grouped).length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-center text-sm text-neutral-500 shadow-sm">
              Your cart is empty. Browse restaurants to add items.
            </div>
          )}
          {Object.entries(grouped).map(([key, group]) => {
            const [restaurantName] = key.split("-").slice(1)
            const subtotal = group.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )
            return (
              <div key={key} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Utensils className="h-4 w-4 text-primary" />
                  {restaurantName}
                </div>
                <div className="mt-4 space-y-4">
                  {group.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image ?? "/hero-image.svg"}
                          alt={item.name}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                        <div>
                          <p className="text-xs font-semibold text-neutral-900">
                            {item.name}
                          </p>
                          <p className="text-xs font-semibold text-neutral-900">
                            Rp{item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200"
                          onClick={() => {
                            if (item.quantity === 1) {
                              dispatch(removeItem(item.menuId))
                            } else {
                              dispatch(
                                updateQuantity({
                                  menuId: item.menuId,
                                  quantity: item.quantity - 1,
                                })
                              )
                            }
                          }}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                menuId: item.menuId,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-dashed border-neutral-200 pt-4 text-xs text-neutral-500">
                  <span>Total</span>
                  <span className="text-sm font-semibold text-neutral-900">
                    Rp{subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    asChild
                    className="rounded-full bg-primary px-8 text-white hover:bg-primary/90"
                  >
                    <Link to="/checkout">Checkout</Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CartPage