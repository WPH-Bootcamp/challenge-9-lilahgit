const Footer = () => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-white">
      <div className="mx-auto lg:mx-8 grid w-full max-w-360 gap-6 px-4 py-10 lg:grid-cols-3 lg:justify-items-center lg:px-30 lg:py-20 lg:gap-0">
        <div className="w-full lg:w-100 space-y-5.5">
          <div className="flex items-center gap-2">
            <img
                src="/Logo.svg"
                alt="Foody logo"
                className="logo-primary h-10.5 w-10.5"
              />
            <span className="text-display-md font-extrabold">Foody</span>
          </div>
          <p className="text-md font-regular text-neutral-25">
            Enjoy homemade flavors & chef's signature dishes, freshly
            prepared every day. Order online or visit our nearest branch.
          </p>
          <p className="text-md font-extrabold text-neutral-25">
            Follow on Social Media
          </p>
          <div className="flex gap-3 text-white/70">
            <img src="/FB.svg" alt="Facebook" className="h-10 w-10" />
            <img src="/IG.svg" alt="Instagram" className="h-10 w-10" />
            <img src="/IN.svg" alt="LinkedIn" className="h-10 w-10" />
            <img src="/TikTok.svg" alt="TikTok" className="h-10 w-10" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 lg:contents">
          <div>
            <p className="text-md font-extrabold">Explore</p>
            <ul className="mt-3 space-y-2 text-md text-neutral-25">
              <li>All Food</li>
              <li>Nearby</li>
              <li>Discount</li>
              <li>Best Seller</li>
              <li>Delivery</li>
              <li>Lunch</li>
            </ul>
          </div>
          <div>
            <p className="text-md font-extrabold">Help</p>
            <ul className="mt-3 space-y-2 text-md text-neutral-25">
              <li>How to Order</li>
              <li>Payment Methods</li>
              <li>Track My Order</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
