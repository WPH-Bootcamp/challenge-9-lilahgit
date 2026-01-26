import { Search, Utensils } from "lucide-react"
import dayjs from "dayjs"
import { useState } from "react"
import Footer from "@/components/layout/Footer"
import SolidHeader from "@/components/layout/SolidHeader"
import { Input } from "@/components/ui/input"
import { useMyOrders } from "@/hooks/useOrders"
import ApiErrorNotice from "@/components/ApiErrorNotice"
import { toApiError } from "@/lib/toApiError"

const statusOptions = [
  { label: "Preparing", value: "preparing" },
  { label: "On the Way", value: "on_the_way" },
  { label: "Delivered", value: "delivered" },
  { label: "Done", value: "done" },
  { label: "Canceled", value: "cancelled" },
]

const OrdersPage = () => {
  const [status, setStatus] = useState("done")
  const [search, setSearch] = useState("")

  const { data, isLoading, error, refetch } = useMyOrders(status)
  const apiError = toApiError(error)
  const errorStatus = apiError?.status

  const orders = data?.orders ?? []

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <SolidHeader />
      <main className="mx-auto w-full max-w-300 px-4 pb-12 pt-8 sm:px-6">
        <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
          <aside className="hidden h-fit rounded-2xl bg-white p-4 shadow-sm md:block">
            <div className="flex items-center gap-2">
              <img
                src="/john-doe.svg"
                alt="John Doe avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-sm font-semibold">John Doe</span>
            </div>
            <div className="mt-4 space-y-2 text-xs text-neutral-700">
              <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-neutral-100">
                <img
                  src="/components/icons/marker-pin-01.png"
                  alt=""
                  className="h-4 w-4"
                />
                Delivery Address
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg bg-primary-50 px-2 py-2 text-primary">
                <img
                  src="/components/icons/file-05.png"
                  alt=""
                  className="h-4 w-4"
                />
                My Orders
              </button>
              <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-neutral-100">
                <img
                  src="/components/icons/arrow-circle-broken-left.png"
                  alt=""
                  className="h-4 w-4"
                />
                Logout
              </button>
            </div>
          </aside>

          <div>
            <h1 className="text-display-md font-extrabold pb-6">My Orders</h1>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-2">
                <Search className="h-4 w-4 text-neutral-400" />
                <Input
                  className="border-0 px-0 py-0 shadow-none focus-visible:ring-0"
                  placeholder="Search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-md font-semibold text-neutral-950">
                <p className="text-neutral-950 font-extrabold px-2"> Status </p>
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`rounded-full border px-4 py-2 ${
                      status === option.value
                        ? "border-primary bg-primary-50 text-primary font-bold"
                        : "border-neutral-200 bg-white text-neutral-950 font-semibold"
                    }`}
                    onClick={() => setStatus(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {isLoading && (
                <div className="rounded-2xl bg-white p-6 text-sm text-neutral-500 shadow-sm">
                  Loading orders...
                </div>
              )}
              {apiError && errorStatus !== 404 && (
                <ApiErrorNotice error={apiError} onRetry={() => refetch()} />
              )}
              {!isLoading &&
                (errorStatus === 404 || (!apiError && orders.length === 0)) && (
                <div className="rounded-2xl bg-white p-6 text-sm text-neutral-500 shadow-sm">
                  No orders found.
                </div>
              )}
              {!isLoading &&
                !error &&
                orders.map((order) => (
                  <div
                    key={order.transactionId ?? `order-${order.id}`}
                    className="rounded-2xl bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Utensils className="h-4 w-4 text-primary" />
                      {order.restaurants?.[0]?.restaurant?.name ??
                        "Restaurant"}
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <img
                        src={
                          order.restaurants?.[0]?.items?.[0]?.image ??
                          "/hero-image.svg"
                        }
                        alt="Food"
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div>
                        <p className="text-xs font-semibold text-neutral-900">
                          {order.restaurants?.[0]?.items?.[0]?.menuName ??
                            "Food Name"}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {order.restaurants?.[0]?.items?.[0]?.quantity ?? 0} x
                          Rp
                          {order.restaurants?.[0]?.items?.[0]?.price?.toLocaleString(
                            "id-ID"
                          ) ?? "0"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-dashed border-neutral-200 pt-4 text-xs text-neutral-500">
                      <div>
                        <p>Total</p>
                        <p className="text-sm font-semibold text-neutral-900">
                          Rp
                          {order.pricing?.totalPrice?.toLocaleString("id-ID") ??
                            "0"}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-400">
                          {order.createdAt
                            ? dayjs(order.createdAt).format("D MMM YYYY, HH:mm")
                            : "25 August 2025, 15:51"}
                        </p>
                      </div>
                      <button className="rounded-full bg-primary px-6 py-2 text-xs font-semibold text-white hover:bg-primary/90">
                        Give Review
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrdersPage
