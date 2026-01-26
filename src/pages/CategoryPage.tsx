import { Filter} from "lucide-react"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "@/components/layout/Footer"
import SolidHeader from "@/components/layout/SolidHeader"
import { useRestaurantList } from "@/hooks/useRestaurants"
import { toApiError } from "@/lib/toApiError"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  setDistance,
  setPriceMax,
  setPriceMin,
  setRating,
} from "@/store/slices/filterSlice"
import { toggleFilter } from "@/store/slices/uiSlice"

const distanceOptions = [
  { label: "Nearby", value: "nearby", range: 1 },
  { label: "Within 1 km", value: "1km", range: 1 },
  { label: "Within 3 km", value: "3km", range: 3 },
  { label: "Within 5 km", value: "5km", range: 5 },
]

const ratingOptions = [5, 4, 3, 2, 1]

const CategoryPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const filters = useAppSelector((state) => state.filters)
  const searchQuery = useAppSelector((state) => state.search.query)
  const isFilterOpen = useAppSelector((state) => state.ui.isFilterOpen)

  const {
    data,
    isLoading,
    error,
  } = useRestaurantList(
    {
      priceMin: filters.priceMin ?? undefined,
      priceMax: filters.priceMax ?? undefined,
      rating: filters.rating ?? undefined,
      range: distanceOptions.find((item) => item.value === filters.distance)
        ?.range,
      category: filters.category ?? undefined,
    },
    searchQuery
  )

  const restaurants = useMemo(
    () => data?.restaurants ?? [],
    [data]
  )
  const sampleRestaurants = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, index) => ({
        id: `sample-${index}`,
        name: "Burger King",
        star: 4.9,
        place: "Jakarta Selatan",
        distanceKm: 2.4,
        imageUrl: "/burger-king-logo.svg",
      })),
    []
  )
  const apiError = toApiError(error)
  const errorStatus = apiError?.status

  const sortedRestaurants = useMemo(() => {
    const items = [...restaurants]
    if (filters.sort === "price-asc") {
      return items.sort((a, b) => (a.star ?? 0) - (b.star ?? 0))
    }
    if (filters.sort === "price-desc") {
      return items.sort((a, b) => (b.star ?? 0) - (a.star ?? 0))
    }
    if (filters.sort === "rating-desc") {
      return items.sort((a, b) => (b.star ?? 0) - (a.star ?? 0))
    }
    if (filters.sort === "rating-asc") {
      return items.sort((a, b) => (a.star ?? 0) - (b.star ?? 0))
    }
    return items
  }, [restaurants, filters.sort])

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <SolidHeader />
      <main className="mx-auto w-full max-w-300 px-4 pb-55 pt-10 sm:px-6 lg:px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-display-md font-extrabold mb-8">All Restaurant</h1>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white md:hidden"
            onClick={() => dispatch(toggleFilter(true))}
            aria-label="Open filters"
          >
            <Filter className="h-4 w-4 text-neutral-700" />
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr]">
          <aside className="hidden h-fit rounded-2xl bg-white p-4 shadow-sm md:block">
            <div className="flex items-center justify-between">
              <p className="text-md font-extrabold text-neutral-950">FILTER</p>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-lg font-extrabold text-neutral-900">Distance</p>
                <div className="mt-2 space-y-2">
                  {distanceOptions.map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center gap-2 text-md text-neutral-950"
                    >
                      <input
                        type="checkbox"
                        name="distance"
                        className="accent-primary"
                        checked={filters.distance === item.value}
                        onChange={() => dispatch(setDistance(item.value))}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className= "my-6 py-6 border-y border-accent-neutral-300">
                <p className="text-lg font-extrabold text-neutral-900">Price</p>
                <div className="mt-2 space-y-2">
                  <div className="flex h-12 w-66.5 items-center gap-2 rounded-xl border border-neutral-300 p-2 md:h-13.5 md:w-58.5">
                    <div className="flex h-9.5 w-9.5 items-center justify-center rounded-lg bg-neutral-100 p-2 text-xs font-semibold text-neutral-700">
                      Rp
                    </div>
                    <input
                      className="h-full w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
                      placeholder="Minimum Price"
                      value={filters.priceMin?.toString() ?? ""}
                      onChange={(event) =>
                        dispatch(
                          setPriceMin(
                            event.target.value
                              ? Number(event.target.value)
                              : null
                          )
                        )
                      }
                    />
                  </div>
                  <div className="flex h-12 w-66.5 items-center gap-2 rounded-xl border border-neutral-300 p-2 md:h-13.5 md:w-58.5">
                    <div className="flex h-9.5 w-9.5 items-center justify-center rounded-lg bg-neutral-100 p-2 text-xs font-semibold text-neutral-700">
                      Rp
                    </div>
                    <input
                      className="h-full w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
                      placeholder="Maximum Price"
                      value={filters.priceMax?.toString() ?? ""}
                      onChange={(event) =>
                        dispatch(
                          setPriceMax(
                            event.target.value
                              ? Number(event.target.value)
                              : null
                          )
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-lg font-extrabold text-neutral-900">Rating</p>
                <div className="mt-2 space-y-2">
                  {ratingOptions.map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 text-md text-neutral-950"
                    >
                      <input
                        type="checkbox"
                        name="rating"
                        className="accent-primary"
                        checked={filters.rating === rating}
                        onChange={() => dispatch(setRating(rating))}
                      />
                      <span className="text-accent-yellow text-2xl">★</span>
                      {rating}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
            <div className="grid gap-5 md:grid-cols-2">
              {isLoading && (
                <div className="col-span-full text-sm text-neutral-500">
                  Loading restaurants...
                </div>
              )}
              {!isLoading &&
                (errorStatus === 404 || (!apiError && restaurants.length === 0)) && (
                <div className="col-span-full text-sm text-neutral-500">
                  No restaurants found.
                </div>
              )}
              {!isLoading &&
                (apiError ? sampleRestaurants : sortedRestaurants)
                  .slice(0, 8)
                  .map((item, index) => (
                    <button
                      key={item.id ?? `resto-${item.name}-${index}`}
                      className={`flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm lg:h-38 lg:w-92.5 ${
                        index >= 5 ? "hidden md:flex" : "flex"
                      }`}
                      onClick={() => {
                        if (item.id) {
                          navigate(`/restaurant/${item.id}`)
                        }
                      }}
                    >
                      <div className="flex h-22.5 w-22.5 items-center justify-center rounded-4 bg-neutral-50 lg:h-30 lg:w-30">
                        <img
                          src={
                            "imageUrl" in item && item.imageUrl
                              ? item.imageUrl
                              : "/burger-king-logo.svg"
                          }
                          alt={item.name ?? "Restaurant"}
                          className="h-22.5 w-22.5 rounded-xl object-contain lg:h-30 lg:w-30 lg:rounded-2xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[18px] font-extrabold text-neutral-900">
                          {item.name ?? "Restaurant"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-md text-neutral-700">
                          <img
                            src="/components/icons/Star-1.png"
                            alt=""
                            className="h-6 w-6"
                          />
                          <span>{item.star?.toFixed(1) ?? "0.0"}</span>
                          <span>
                            {item.place ?? "Jakarta Selatan"} {" "}
                            {"distanceKm" in item
                              ? item.distanceKm
                              : 2.4}{" "}
                            km
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
            </div>
        </div>
      </main>

      {isFilterOpen && (
        <div className="fixed inset-0 z-40 bg-black/30">
          <div className="absolute left-0 top-0 h-full w-[320px] bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-md font-bold text-neutral-950">FILTER</p>
              <button
                className="text-lg font-semibold text-neutral-950"
                onClick={() => dispatch(toggleFilter(false))}
              >
                X
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-md font-extrabold text-neutral-950">Distance</p>
                <div className="mt-2 space-y-2">
                  {distanceOptions.map((item) => (
                    <label
                      key={item.value}
                      className="flex items-center gap-2 text-sm text-neutral-950"
                    >
                      <input
                        type="checkbox"
                        name="distance-mobile"
                        className="accent-primary"
                        checked={filters.distance === item.value}
                        onChange={() => dispatch(setDistance(item.value))}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>
              <div className="my-6 py-6 border-y border-accent-neutral-300">
                <p className="text-md font-extrabold text-neutral-950">Price</p>
                <div className="mt-2 space-y-2">
                  <div className="flex h-12 w-66.5 items-center gap-2 rounded-xl border border-neutral-300 p-2 md:h-13.5 md:w-58.5">
                    <div className="flex h-9.5 w-9.5 items-center justify-center rounded-lg bg-neutral-100 p-2 text-xs font-semibold text-neutral-700">
                      Rp
                    </div>
                    <input
                      className="h-full w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
                      placeholder="Minimum Price"
                      value={filters.priceMin?.toString() ?? ""}
                      onChange={(event) =>
                        dispatch(
                          setPriceMin(
                            event.target.value
                              ? Number(event.target.value)
                              : null
                          )
                        )
                      }
                    />
                  </div>
                  <div className="flex h-12 w-66.5 items-center gap-2 rounded-xl border border-neutral-300 p-2 md:h-13.5 md:w-58.5">
                    <div className="flex h-9.5 w-9.5 items-center justify-center rounded-lg bg-neutral-100 p-2 text-xs font-semibold text-neutral-700">
                      Rp
                    </div>
                    <input
                      className="h-full w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none"
                      placeholder="Maximum Price"
                      value={filters.priceMax?.toString() ?? ""}
                      onChange={(event) =>
                        dispatch(
                          setPriceMax(
                            event.target.value
                              ? Number(event.target.value)
                              : null
                          )
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-md font-extrabold text-neutral-950">Rating</p>
                <div className="mt-2 space-y-2">
                  {ratingOptions.map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 text-sm text-neutral-950"
                    >
                      <input
                        type="checkbox"
                        name="rating-mobile"
                        className="accent-primary"
                        checked={filters.rating === rating}
                        onChange={() => dispatch(setRating(rating))}
                      />
                      <span className="text-accent-yellow text-2xl">★</span>
                      {rating}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default CategoryPage
