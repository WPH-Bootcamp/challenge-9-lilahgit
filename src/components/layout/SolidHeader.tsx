import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/store/hooks"

const SolidHeader = () => {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const isLoggedIn = Boolean(
    localStorage.getItem("auth_token") || localStorage.getItem("user")
  )
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  )
  const desktopProfileRef = useRef<HTMLDivElement | null>(null)
  const mobileProfileRef = useRef<HTMLDivElement | null>(null)

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

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    setProfileOpen(false)
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-20 bg-white shadow-sm">
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

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <div ref={desktopProfileRef} className="relative flex items-center gap-3">
                <button
                  className="relative flex h-12 w-12 items-center justify-center"
                  aria-label="Open cart"
                  onClick={() => navigate("/cart")}
                >
                  <img
                    src="/components/icons/Bag.png"
                    alt=""
                    className="h-8 w-8"
                  />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                      {cartCount}
                    </span>
                  )}
                </button>
              <button
                className="flex items-center gap-3 text-neutral-950"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-label="Open profile menu"
              >
                <img
                  src="/john-doe.svg"
                  alt="John Doe avatar"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <span className="text-[18px] font-semibold">John Doe</span>
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
                className="h-12 w-40.75 rounded-full border-2 border-primary bg-white px-2 text-md font-bold leading-7.5 text-primary"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                className="h-12 w-40.75 rounded-full bg-primary px-2 text-md font-bold leading-7.5 text-white"
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
                onClick={() => navigate("/cart")}
              >
                <img
                  src="/components/icons/Bag.png"
                  alt=""
                  className="h-7 w-7"
                />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
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
                className="h-12 w-12.5 rounded-full border-2 border-neutral-300 bg-white px-2 text-[14px] font-bold leading-7 text-neutral-950"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                className="h-12 w-12.5 rounded-full bg-white px-2 text-[14px] font-bold leading-7 text-neutral-950"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default SolidHeader
