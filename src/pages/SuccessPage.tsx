import dayjs from "dayjs"
import { Check } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/store/hooks"

const SuccessPage = () => {
  const {
    lastCheckoutAt,
    lastPaymentMethod,
    lastSubtotal,
    lastDeliveryFee,
    lastServiceFee,
    lastTotal,
    lastItems,
  } = useAppSelector((state) => state.ui)

  const dateLabel = lastCheckoutAt
    ? dayjs(lastCheckoutAt).format("D MMMM YYYY, HH:mm")
    : dayjs().format("D MMMM YYYY, HH:mm")

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 text-neutral-900">
      <div className="w-full max-w-105">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="mx-auto flex h-16 w-full max-w-300 items-center justify-between px-4 sm:px-6 lg:h-20">
              <Link to="/" className="flex items-center gap-3 text-neutral-950">
                <img
                  src="/Logo.svg"
                  alt="Foody logo"
                  className="logo-primary h-10 w-10 lg:h-10.5 lg:w-10.5"
                />
                <span className="hidden text-display-md font-extrabold leading-10 md:inline">
                  Foody
                </span>
              </Link>
            </div>
          </div>
          <div className="w-full rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-green text-white">
                <Check className="h-6 w-6" />
              </div>
              <h1 className="mt-3 text-lg font-bold">Payment Success</h1>
              <p className="mt-1 text-md text-neutral-950">
                Your payment has been successfully processed.
              </p>
            </div>
            <div className="mt-6 space-y-3 border-t border-dashed border-neutral-200 pt-4 text-md text-neutral-950">
              <div className="flex items-center justify-between">
                <span>Date</span>
                <span className="text-neutral-950 text-md font-bold">{dateLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Method</span>
                <span className="text-neutral-950 text-md font-bold">
                  {lastPaymentMethod ?? "Bank Rakyat Indonesia"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Price ({lastItems ?? 2} items)</span>
                <span className="text-neutral-950 text-md font-bold">
                  Rp{(lastSubtotal ?? 100000).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery Fee</span>
                <span className="text-neutral-950 text-md font-bold">
                  Rp{(lastDeliveryFee ?? 10000).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Service Fee</span>
                <span className="text-neutral-950 text-md font-bold">
                  Rp{(lastServiceFee ?? 1000).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold text-neutral-900">
                <span>Total</span>
                <span className="text-neutral-950 text-md font-bold">Rp{(lastTotal ?? 101000).toLocaleString("id-ID")}</span>
              </div>
            </div>
            <Button
              asChild
              className="mt-6 w-full rounded-full bg-primary text-white hover:bg-primary/90"
            >
              <Link to="/orders">See My Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
