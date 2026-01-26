import { useMemo, useState } from "react"
import { Minus, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Footer from "@/components/layout/Footer"
import SolidHeader from "@/components/layout/SolidHeader"
import { Button } from "@/components/ui/button"
import { useCheckoutOrder } from "@/hooks/useOrders"
import ApiErrorNotice from "@/components/ApiErrorNotice"
import { toApiError } from "@/lib/toApiError"
import FormErrorSummary from "@/components/form/FormErrorSummary"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { clearCart, updateQuantity } from "@/store/slices/cartSlice"
import { setLastCheckoutAt, setLastCheckoutSummary } from "@/store/slices/uiSlice"

const paymentMethods = [
  { id: "BNI", label: "Bank Negara Indonesia", logo: "/components/bank-logo/BNI.png" },
  { id: "BRI", label: "Bank Rakyat Indonesia", logo: "/components/bank-logo/BRI.png" },
  { id: "BCA", label: "Bank Central Asia", logo: "/components/bank-logo/BCA.png" },
  { id: "Mandiri", label: "Mandiri", logo: "/components/bank-logo/Mandiri.png" },
]

const CheckoutPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const items = useAppSelector((state) => state.cart.items)
  const [address] = useState("Jl. Sudirman No. 25, Jakarta Pusat, 10220")
  const [phone] = useState("0812-3456-7890")
  const [payment] = useState(paymentMethods[0].label)
  const [notes] = useState("")

  const grouped = useMemo(() => {
    return items.reduce<Record<number, typeof items>>((acc, item) => {
      if (!acc[item.restaurantId]) acc[item.restaurantId] = []
      acc[item.restaurantId].push(item)
      return acc
    }, {})
  }, [items])

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const deliveryFee = items.length ? 10000 : 0
  const serviceFee = items.length ? 1000 : 0
  const total = subtotal + deliveryFee + serviceFee

  const mutation = useCheckoutOrder()
  const apiError = toApiError(mutation.error)
  const formErrorMessage = apiError?.message

  const handleCheckout = () => {
    const payload = {
      restaurants: Object.entries(grouped).map(([restaurantId, group]) => ({
        restaurantId: Number(restaurantId),
        items: group.map((item) => ({
          menuId: item.menuId,
          quantity: item.quantity,
        })),
      })),
      deliveryAddress: address,
      phone,
      paymentMethod: payment,
      notes: notes || undefined,
    }
    mutation.mutate(payload, {
      onSuccess: () => {
        dispatch(
          setLastCheckoutSummary({
            paymentMethod: payment,
            subtotal,
            deliveryFee,
            serviceFee,
            total,
            items: items.length,
          })
        )
        dispatch(clearCart())
        dispatch(setLastCheckoutAt(new Date().toISOString()))
      },
    })
    navigate("/success")
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <SolidHeader />
      <main className="mx-auto w-full max-w-300 px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-extrabold">Checkout</h1>
        {apiError && (
          <div className="mb-6 space-y-3">
            <FormErrorSummary message={formErrorMessage} />
            {!apiError.fieldErrors && <ApiErrorNotice error={apiError} />}
          </div>
        )}
        <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-2xl bg-white py-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="px-5">
                  <div className="flex items-center gap-2 text-lg font-bold pb-2">
                  <img src="public/delivery.svg"
                  className="h-8 w-8"/>
                  <p className="text-lg font-extrabold text-neutral-950">
                    Delivery Address </p>
                  </div>
                  <p className="mt-1 text-md text-neutral-950">{address}</p>
                  <p className="mt-1 text-md text-neutral-950">{phone}</p>
                  <Button
                    variant="outline"
                    className="rounded-full border-neutral-950 text-md font-bold text-neutral-950 my-6"
                    >Change
                  </Button>
                </div>
              </div>
            </div>

            {Object.entries(grouped).map(([restaurantId, group]) => (
              <div key={restaurantId} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <img src="public/shop.svg"
                  className="h-8 w-8"/>
                  {group[0]?.restaurantName ?? "Restaurant"}
                </div>
                  <Button
                    variant="outline"
                    className="rounded-full border-neutral-200 text-md text-neutral-950 font-bold"
                  >
                    Add item
                  </Button>
                </div>
                <div className="mt-4 space-y-4">
                  {group.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image ?? "/hero-image.svg"}
                          alt={item.name}
                          className="h-20 w-20 rounded-xl object-cover"
                        />
                        <div>
                          <p className="text-md font-medium text-neutral-900">
                            {item.name}
                          </p>
                          <p className="text-lg font-extrabold text-neutral-900">
                            Rp{item.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200"
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                menuId: item.menuId,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white"
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
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-lg font-extrabold text-neutral-950">Payment Method</p>
              <div className="mt-3 space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center justify-between border-t border-neutral-200 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 text-md text-neutral-950">
                      <img src={method.logo} alt={method.label} className="h-10 w-10 object-contain" />
                      {method.label}
                    </div>
                    <input
                      type="radio"
                      className="accent-primary w-6 h-6"
                      name="payment"
                      checked={payment === method.label}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-lg font-extrabold text-neutral-950">Payment Summary</p>
              <div className="mt-4 space-y-2 text-md font-medium text-neutral-950">
                <div className="flex items-center justify-between">
                  <span>Price ({items.length} items)</span>
                  <span className="text-neutral-950 text-md font-bold">
                    Rp{subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-neutral-950 text-md font-bold">
                    Rp{deliveryFee.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Service Fee</span>
                  <span className="text-neutral-950 text-md font-bold">
                    Rp{serviceFee.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-neutral-900">
                  <span className="text-neutral-950 text-md font-regular">Total</span>
                  <span className="text-neutral-950 text-lg font-extrabold">Rp{total.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <Button
                className="mt-4 w-full rounded-full bg-primary text-white text-md font-bold hover:bg-primary/90"
                onClick={handleCheckout}
                disabled={items.length === 0 || mutation.isPending}
              >
                {mutation.isPending ? "Processing..." : "Buy"}
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default CheckoutPage