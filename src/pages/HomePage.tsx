import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Footer from "@/components/layout/Footer"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setQuery } from "@/store/slices/searchSlice"
import { setCategory } from "@/store/slices/filterSlice"
import { useRecommended } from "@/features/resto/recommended"
import { toApiError } from "@/lib/toApiError"

const categories = [
  { label: "All Restaurant", icon: "/components/category-icons/all-food.svg" },
  { label: "Nearby", icon: "/components/category-icons/location.svg" },
  { label: "Discount", icon: "/components/category-icons/discount.svg" },
  { label: "Best Seller", icon: "/components/category-icons/best-seller.svg" },
  { label: "Delivery", icon: "/components/category-icons/delivery.svg" },
  { label: "Lunch", icon: "/components/category-icons/lunch.svg" },
]

const HomePage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const query = useAppSelector((state) => state.search.query)
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const isLoggedIn = Boolean(
    localStorage.getItem("auth_token") || localStorage.getItem("user")
  )
  const [profileOpen, setProfileOpen] = useState(false)
  const desktopProfileRef = useRef<HTMLDivElement | null>(null)
  const mobileProfileRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const onScroll = () => {
      setShowStickyHeader(window.scrollY > 160)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!profileOpen) return
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      const desktopContains = desktopProfileRef.current?.contains(target)
      const mobileContains = mobileProfileRef.current?.contains(target)
      if (!desktopContains && !mobileContains) {
        setProfileOpen(false)
      }
    }
    window.addEventListener("mousedown", handleClick)
    return () => window.removeEventListener("mousedown", handleClick)
  }, [profileOpen])

  const { data: restaurants, isLoading, error } = useRecommended()
  const apiError = toApiError(error)
  const errorStatus = apiError?.status
  const errorMessage = apiError?.message ?? "Unknown error"
  const sampleRecommendations = Array.from({ length: 12 }).map((_, index) => ({
    id: `sample-${index}`,
    name: "Burger King",
    rating: 4.9,
    place: "Jakarta Selatan",
    distanceKm: 2.4,
    imageUrl: "/burger-king-logo.svg",
  }))

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setProfileOpen(false)
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header
        className={`fixed left-0 right-0 top-0 z-30 ${
          showStickyHeader ? "bg-white shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 lg:h-20 lg:px-30">
          <div className="flex items-center gap-3">
            <img
              src="/Logo.svg"
              alt="Foody logo"
              className={`h-10 w-10 lg:h-10.5 lg:w-10.5 ${
                showStickyHeader ? "logo-primary" : ""
              }`}
            />
            <span
              className={`hidden text-display-md font-extrabold leading-10 md:inline ${
                showStickyHeader ? "text-neutral-950" : "text-white"
              }`}
            >
              Foody
            </span>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isLoggedIn ? (
              <div ref={desktopProfileRef} className="relative flex items-center gap-3">
                <button
                  className="relative flex h-12 w-12 items-center justify-center"
                  aria-label="Open cart"
                >
                  <img
                    src="/components/icons/Bag.png"
                    alt=""
                    className={`h-8 w-8 ${
                      showStickyHeader ? "" : "brightness-0 invert"
                    }`}
                  />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                    1
                  </span>
                </button>
                <button
                  className="flex items-center gap-3"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-label="Open profile menu"
                >
                  <img
                    src="/john-doe.svg"
                    alt="John Doe avatar"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <span
                    className={`text-[18px] font-semibold ${
                      showStickyHeader ? "text-neutral-950" : "text-white"
                    }`}
                  >
                    John Doe
                  </span>
                </button>
                {profileOpen && (
                  <div className="absolute top-16 h-50 w-50 rounded-3xl bg-white p-4 shadow-[0_0_20px_rgba(203,202,202,0.25)]">
                    <div className="flex items-center gap-3 pb-3">
                      <img
                        src="/john-doe.svg"
                        alt="John Doe avatar"
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <span className="text-[16px] font-bold text-neutral-900">
                        John Doe
                      </span>
                    </div>
                    <div className="space-y-3 text-sm font-medium text-neutral-900">
                      <Link to="/checkout" className="flex items-center gap-3">
                        <img
                          src="/components/icons/marker-pin-01.png"
                          alt=""
                          className="h-5 w-5"
                        />
                        Delivery Address
                      </Link>
                      <Link to="/orders" className="flex items-center gap-3">
                        <img
                          src="/components/icons/file-05.png"
                          alt=""
                          className="h-5 w-5"
                        />
                        My Orders
                      </Link>
                      <button
                        className="flex items-center gap-3"
                        onClick={handleLogout}
                      >
                        <img
                          src="/components/icons/arrow-circle-broken-left.png"
                          alt=""
                          className="h-5 w-5"
                        />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  className={`h-12 w-40.75 rounded-full border-2 px-2 text-[16px] font-bold leading-7.5 ${
                    showStickyHeader
                      ? "border-primary bg-white text-primary"
                      : "border-neutral-300 bg-transparent text-white"
                  }`}
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button
                  className={`h-12 w-40.75 rounded-full px-2 text-[16px] font-bold leading-7.5 ${
                    showStickyHeader
                      ? "bg-primary text-white"
                      : "bg-white text-neutral-950"
                  }`}
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {isLoggedIn ? (
              <>
                <button
                  className="relative flex h-10 w-10 items-center justify-center"
                  aria-label="Open cart"
                >
                  <img
                    src="/components/icons/Bag.png"
                    alt=""
                    className={`h-7 w-7 ${
                      showStickyHeader ? "" : "brightness-0 invert"
                    }`}
                  />
                </button>
                <div ref={mobileProfileRef} className="relative">
                  <button
                    className="cursor-pointer"
                    aria-label="Open user menu"
                    onClick={() => setProfileOpen((prev) => !prev)}
                  >
                    <img
                      src="/john-doe.svg"
                      alt="John Doe avatar"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </button>
                  {profileOpen && (
                    <div className="absolute left-45.5 top-16 h-50 w-49.25 rounded-3xl bg-white p-4 shadow-[0_0_20px_rgba(203,202,202,0.25)]">
                      <div className="flex items-center gap-3 pb-3">
                        <img
                          src="/john-doe.svg"
                          alt="John Doe avatar"
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <span className="text-[16px] font-bold text-neutral-900">
                          John Doe
                        </span>
                      </div>
                      <div className="space-y-3 text-sm font-medium text-neutral-900">
                        <Link to="/checkout" className="flex items-center gap-3">
                          <img
                            src="/components/icons/marker-pin-01.png"
                            alt=""
                            className="h-5 w-5"
                          />
                          Delivery Address
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3">
                          <img
                            src="/components/icons/file-05.png"
                            alt=""
                            className="h-5 w-5"
                          />
                          My Orders
                        </Link>
                        <button
                          className="flex items-center gap-3"
                          onClick={handleLogout}
                        >
                          <img
                            src="/components/icons/arrow-circle-broken-left.png"
                            alt=""
                            className="h-5 w-5"
                          />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button
                  className={`h-12 w-12.5 rounded-full border-2 px-2 text-[14px] font-bold leading-7 ${
                    showStickyHeader
                      ? "border-primary bg-white text-primary"
                      : "border-neutral-300 bg-transparent text-white"
                  }`}
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
                <Button
                  className={`h-12 w-12.5 rounded-full px-2 text-[14px] font-bold leading-7 ${
                    showStickyHeader
                      ? "bg-primary text-white"
                      : "bg-white text-neutral-950"
                  }`}
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <img
          src="/hero-image.svg"
          alt="Burger background"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <div className="mx-auto flex min-h-206 w-full max-w-300 flex-col items-center justify-center px-4 pt-24 text-center text-white sm:px-6 lg:px-8">
          <h1 className="mt-2 text-display-2xl font-extrabold leading-9.5 tracking-[-0.02em] sm:text-[32px] sm:leading-10 lg:text-[36px] lg:leading-11">
            Explore Culinary Experiences
          </h1>
          <p className="mt-2 max-w-3xl text-display-xs font-bold leading-5 text-white sm:mt-3 sm:text-[14px] sm:leading-5.5">
            Search and refine your choice to discover the perfect restaurant.
          </p>
          <div className="mt-6 flex w-full max-w-130 items-center gap-2 rounded-full bg-white px-4 py-3 text-left text-[12px] text-neutral-500 shadow-sm">
            <img
              src="/components/icons/search-lg.png"
              alt=""
              className="h-4 w-4"
            />
            <input
              className="w-full bg-transparent text-md text-neutral-600 placeholder:text-neutral-600 focus:outline-none"
              placeholder="Search restaurants, food and drink"
              aria-label="Search restaurants, food and drink"
              value={query}
              onChange={(event) => dispatch(setQuery(event.target.value))}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  navigate("/category")
                }
              }}
            />
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mx-auto w-full max-w-300">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4 sm:p-6 md:gap-5 px-4 sm:px-6">
            {categories.map((item) => (
              <button
                key={item.label}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white shadow-sm px-3 py-4 text-center"
                onClick={() => {
                  dispatch(setCategory(item.label))
                  navigate("/category")
                }}
              >
                <img src={item.icon} alt={item.label} className="h-12 w-12 md:h-16.25 md:w-16.25" />
                <span className="text-sm font-bold text-neutral-800 lg:text-lg">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto w-full max-w-300 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="sm:text-display-xs text-display-md font-extrabold text-neutral-950">Recommended</h2>
            <button
              className="text-lg font-extrabold text-primary"
              onClick={() => navigate("/category")}
            >
              See All
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {error && (
              <div className="rounded-2xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                We couldn't load recommendations right now. Showing sample recommendations to preserve the UI. Please try again later.
                <div className="mt-1 text-xs text-neutral-600">
                  {errorStatus ? `Error ${errorStatus}: ` : "Error: "}
                  {errorMessage}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 px-0">
              {isLoading &&
                Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="h-19 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-neutral-100" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-3/4 rounded bg-neutral-100" />
                        <div className="h-3 w-1/2 rounded bg-neutral-100" />
                      </div>
                    </div>
                  </div>
                ))}
              {!isLoading && !error && restaurants && restaurants.length === 0 && (
                <div className="col-span-full text-sm text-neutral-500">
                  No recommendations available.
                </div>
              )}
              {!isLoading &&
                (error ? sampleRecommendations : restaurants ?? [])
                  .slice(0, 12)
                  .map((item, index) => (
                  <button
                    key={item.id}
                    className={`rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm lg:h-38 lg:w-92.5 ${
                      index >= 5 ? "hidden md:block" : ""
                    }`}
                    onClick={() => navigate(`/restaurant/${item.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-22.5 w-22.5 lg:h-30 lg:w-30 items-center justify-center rounded-4">
                        <img
                          src={item.imageUrl ?? "/burger-king-logo.svg"}
                          alt={item.name}
                          className="h-22.5 w-22.5 rounded-xl object-contain lg:h-30 lg:w-30 lg:rounded-2xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[18px] font-extrabold text-neutral-900">
                          {item.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-md text-neutral-700">
                          <img
                            src="/components/icons/Star-1.png"
                            alt=""
                            className="h-6 w-6"
                          />
                          <span>{(item.rating ?? 4.9).toFixed(1)}</span>
                          <span>
                            {item.place ?? "Jakarta Selatan"} · {" "}
                            {item.distanceKm ?? 2.4} km
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
          <div className="mt-6 flex justify-center">
          <Button className="h-12 rounded-full border border-neutral-300 bg-white px-8 text-md font-bold text-neutral-950"
              onClick={() => navigate("/category")}>
              Show More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage
