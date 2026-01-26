import { useMemo, useState } from "react";
import { Share2, Star } from "lucide-react";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import SolidHeader from "@/components/layout/SolidHeader";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useRestaurantDetail } from "@/hooks/useRestaurants";
import {
  MenuItemSchema,
  ReviewItemSchema,
} from "@/lib/schemas/models/restaurant";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem, updateQuantity } from "@/store/slices/cartSlice";
import { closeMenuDetail, openMenuDetail } from "@/store/slices/uiSlice";
import ApiErrorNotice from "@/components/ApiErrorNotice";
import { toApiError } from "@/lib/toApiError";
import type { z } from "zod";

type MenuItem = z.infer<typeof MenuItemSchema>;

const DetailPage = () => {
  const { id } = useParams();
  const numericId = Number(id);
  const isMock = typeof id === "string" && id.startsWith("sample-");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "food" | "drink">("all");
  const searchQuery = useAppSelector((state) => state.search.query);
  const cartItems = useAppSelector((state) => state.cart.items);
  const uiState = useAppSelector((state) => state.ui);

  const { data, isLoading, error, refetch } = useRestaurantDetail(
    !isMock ? numericId : undefined,
  );
  const apiError = toApiError(error);
  const errorStatus = apiError?.status;

  const mockRestaurant = useMemo(
    () => ({
      id: 0,
      name: "Burger King",
      star: 4.9,
      place: "Jakarta Selatan · 2.4 km",
      images: [
        "/detail-page/detail-frame-1.svg",
        "/detail-page/detail-frame-2.svg",
        "/detail-page/detail-frame-3.svg",
        "/detail-page/detail-frame-4.svg",
      ],
      logo: "/burger-king-logo.svg",
    }),
    [],
  );
  const mockMenus = useMemo<MenuItem[]>(
    () => [
      {
        id: 1,
        foodName: "Food Name",
        price: 50000,
        type: "food",
        image: "/detail-page/menu1.svg",
      },
      {
        id: 2,
        foodName: "Food Name",
        price: 50000,
        type: "food",
        image: "/detail-page/menu2.svg",
      },
      {
        id: 3,
        foodName: "Food Name",
        price: 50000,
        type: "food",
        image: "/detail-page/menu3.svg",
      },
      {
        id: 4,
        foodName: "Food Name",
        price: 50000,
        type: "food",
        image: "/detail-page/menu4.svg",
      },
      {
        id: 5,
        foodName: "Food Name",
        price: 50000,
        type: "food",
        image: "/detail-page/menu5.svg",
      },
      {
        id: 6,
        foodName: "Food Name",
        price: 50000,
        type: "drink",
        image: "/detail-page/menu6.svg",
      },
      {
        id: 7,
        foodName: "Food Name",
        price: 50000,
        type: "food",
        image: "/detail-page/menu7.svg",
      },
      {
        id: 8,
        foodName: "Food Name",
        price: 50000,
        type: "food",
        image: "/detail-page/menu8.svg",
      },
    ],
    [],
  );
  const mockReviews = useMemo(
    () => [
      {
        id: 1,
        star: 5,
        comment:
          "What a fantastic place! The food was delicious, and the ambiance was delightful.",
        createdAt: "2025-08-25T06:38:00.000Z",
        user: {
          name: "Michael Brown",
          avatar: "/john-doe.svg",
        },
      },
      {
        id: 2,
        star: 5,
        comment:
          "I can't say enough good things! The service was exceptional, and the menu had so many great options.",
        createdAt: "2025-08-25T06:38:00.000Z",
        user: {
          name: "Sarah Davis",
          avatar: "/john-doe.svg",
        },
      },
      {
        id: 3,
        star: 5,
        comment:
          "This place exceeded my expectations! The staff were welcoming, and the vibe was just right.",
        createdAt: "2025-08-25T06:38:00.000Z",
        user: {
          name: "David Wilson",
          avatar: "/john-doe.svg",
        },
      },
      {
        id: 4,
        star: 5,
        comment:
          "Absolutely loved my visit! The staff were friendly and attentive, making sure everything was just right.",
        createdAt: "2025-08-25T06:38:00.000Z",
        user: {
          name: "Emily Johnson",
          avatar: "/john-doe.svg",
        },
      },
      {
        id: 5,
        star: 5,
        comment:
          "A wonderful experience overall! The food was exquisite, and the service was impeccable.",
        createdAt: "2025-08-25T06:38:00.000Z",
        user: {
          name: "Jessica Taylor",
          avatar: "/john-doe.svg",
        },
      },
      {
        id: 6,
        star: 5,
        comment:
          "I had an amazing experience! The service was top-notch, and the atmosphere was perfect.",
        createdAt: "2025-08-25T06:38:00.000Z",
        user: {
          name: "Alex Smith",
          avatar: "/john-doe.svg",
        },
      },
    ],
    [],
  );

  const restaurant = isMock ? mockRestaurant : data;
  const menus = useMemo(
    () => (isMock ? mockMenus : data?.menus ?? []),
    [data, isMock, mockMenus],
  );
  const reviews = useMemo(
    () => (isMock ? mockReviews : data?.reviews ?? []),
    [data, isMock, mockReviews],
  );
  const galleryImages = useMemo(() => {
    if (restaurant?.images && restaurant.images.length > 0) {
      return restaurant.images;
    }
    return mockRestaurant.images;
  }, [restaurant, mockRestaurant.images]);
  const reviewList: z.infer<typeof ReviewItemSchema>[] = reviews;

  const filters = useAppSelector((state) => state.filters);

  const filteredMenus = useMemo(() => {
    return menus.filter((item) => {
      const name = item.foodName ?? item.foodName ?? "";
      const matchesQuery = searchQuery
        ? name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesType =
        activeTab === "all"
          ? true
          : (item.type ?? "").toLowerCase() === activeTab;
      return matchesQuery && matchesType;
    });
  }, [menus, searchQuery, activeTab]);

  const sortedMenus = useMemo(() => {
    const list = [...filteredMenus];
    if (filters.sort === "price-asc") {
      return list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    }
    if (filters.sort === "price-desc") {
      return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }
    if (filters.sort === "rating-desc" || filters.sort === "rating-asc") {
      return list;
    }
    return list;
  }, [filteredMenus, filters.sort]);

  const menuList: MenuItem[] = sortedMenus as MenuItem[];

  const restaurantIdForCart = isMock ? 0 : numericId;
  const totalItems = cartItems
    .filter((item) => item.restaurantId === restaurantIdForCart)
    .reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartItems
    .filter((item) => item.restaurantId === restaurantIdForCart)
    .reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <SolidHeader />
      <main className="mx-auto w-full max-w-300 px-4 pb-12 pt-8 sm:px-6">
        {!isMock && isLoading && (
          <div className="rounded-2xl bg-white p-6 text-sm text-neutral-500 shadow-sm">
            Loading restaurant details...
          </div>
        )}
        {!isMock && apiError && errorStatus !== 404 && (
          <ApiErrorNotice error={apiError} onRetry={() => refetch()} />
        )}
        {!isMock &&
          !isLoading &&
          (errorStatus === 404 || (!apiError && !restaurant)) && (
          <div className="rounded-2xl bg-white p-6 text-sm text-neutral-500 shadow-sm">
            Restaurant not found.
          </div>
        )}
        {(isMock || (!isLoading && !apiError && restaurant)) && (
          <>
            <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <div className="overflow-hidden rounded-3xl lg:mx-0 h-auto w-full lg:rounded-3xl">
                <img
                  src={galleryImages[0] ?? "/detail-page/detail-frame-1.svg"}
                  alt={restaurant?.name ?? "Restaurant"}
                  className="h-full w-full rounded-3xl object-cover lg:h-full lg:rounded-none"
                />
              </div>
              <div className="hidden grid-cols-1 gap-5 lg:grid">
                <img
                  src={galleryImages[1] ?? "/detail-page/detail-frame-2.svg"}
                  alt="Menu highlight"
                  className="h-75.5 w-132.25 rounded-3xl object-cover"
                />
                <div className="grid grid-cols-2 gap-5">
                  <img
                    src={galleryImages[2] ?? "/detail-page/detail-frame-3.svg"}
                    alt="Menu highlight"
                    className="h-37 w-64 rounded-3xl object-cover"
                  />
                  <img
                    src={galleryImages[3] ?? "/detail-page/detail-frame-4.svg"}
                    alt="Menu highlight"
                    className="h-37 w-64 rounded-3xl object-cover"
                  />
                </div>
              </div>
            </section>

            <section className="mt-6 flex gap-4 border-b border-neutral-200 pb-6 flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={mockRestaurant.logo}
                  alt="Burger King"
                  className="lg:h-30 lg:w-30 h-22.5 w-22.5 rounded-full"
                />
                <div>
                  <h1 className="sm:text-lg font-bold text-display-md lg:font-extrabold text-neutral-900">
                    {restaurant?.name ?? "Burger King"}
                  </h1>
                  <div className="flex items-center gap-2 text-lg font-semibold text-neutral-500">
                    <img
                      src="/components/icons/Star-1.png"
                      alt=""
                      className="h-6 w-6"
                    />
                    <span>{restaurant?.star?.toFixed(1) ?? "4.9"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-neutral-500">
                    <span>{restaurant?.place ?? "Jakarta Selatan · 2.4 km"}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                className="rounded-full border-neutral-200 px-4 text-md text-bold text-neutral-950"
              >
                <Share2 className="mr-2 h-6 w-6" />
                Share
              </Button>
            </section>

            <section className="mt-8">
              <h2 className="text-display-xs md:text-display-lg font-extrabold text-neutral-900">
                Menu
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: "All Menu", value: "all" },
                  { label: "Food", value: "food" },
                  { label: "Drink", value: "drink" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    className={`rounded-full border px-4 py-2 text-md font-bold ${
                      activeTab === tab.value
                        ? "border-primary bg-primary-50 text-primary"
                        : "border-neutral-200 bg-white text-neutral-500"
                    }`}
                    onClick={() =>
                      setActiveTab(tab.value as "all" | "food" | "drink")
                    }
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-4">
                {menuList.length === 0 && (
                  <div className="col-span-full text-md text-neutral-500">
                    No menu items available.
                  </div>
                )}
                {menuList.map((menu) => (
                  <MenuCard
                    key={menu.id ?? `menu-${menu.foodName ?? "item"}`}
                    menu={menu}
                    onAdd={(menuItem) => {
                      if (menuItem.id === undefined) return;
                      dispatch(
                        addItem({
                          menuId: menuItem.id,
                          name: menuItem.foodName ?? "Food Name",
                          price: menuItem.price ?? 0,
                          quantity: 1,
                          restaurantId: restaurantIdForCart,
                          restaurantName: restaurant?.name ?? "Restaurant",
                          image: menuItem.image,
                        }),
                      );
                    }}
                    onQtyChange={(menuId, qty) =>
                      dispatch(updateQuantity({ menuId, quantity: qty }))
                    }
                    currentQty={
                      cartItems.find((item) => item.menuId === menu?.id)
                        ?.quantity ?? 0
                    }
                    onOpen={() =>
                      menu.id !== undefined &&
                      dispatch(
                        openMenuDetail({
                          menuId: menu.id,
                          restaurantId: restaurantIdForCart,
                        }),
                      )
                    }
                  />
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Button className="h-12 rounded-full border border-neutral-300 bg-white px-8 text-md font-bold text-neutral-950">
                  Show More
                </Button>
              </div>
            </section>

            <section className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-display-md font-extrabold text-neutral-900">
                  Review
                </h2>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-neutral-700">
                <img
                  src="/components/icons/Star-1.png"
                  alt=""
                  className="h-8 w-8"
                />
                <span className="text-md font-semibold">
                  {restaurant?.star?.toFixed(1) ?? "4.9"} ({reviews.length}{" "}
                  Ulasan)
                </span>
              </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-2">
                {reviewList.length === 0 && (
                  <div className="col-span-full text-sm text-neutral-500">
                    No reviews yet.
                  </div>
                )}
                {reviewList.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={review.user?.avatar ?? "/john-doe.svg"}
                          alt={review.user?.name ?? "User"}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-lg font-extrabold text-neutral-900">
                            {review.user?.name ?? "Michael Brown"}
                          </p>
                          <p className="text-md text-neutral-950">
                            {review.createdAt
                              ? dayjs(review.createdAt).format(
                                  "D MMM YYYY, HH:mm",
                                )
                              : "26 August 2025, 13:08"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-row justify-between mt-4">
                    <div className="flex items-center gap-1 text-xs text-accent-yellow">
                        {Array.from({ length: review.star ?? 5 }).map(
                          (_, idx) => (
                            <Star
                              key={idx}
                              className="h-6 w-6 fill-accent-yellow"
                            />
                          ),
                        )}
                      </div>
                    <p className="mt-3 text-md text-neutral-950">
                      {review.comment ??
                        "A wonderful experience. The flavors were exceptional and the service was superb."}
                    </p>
                  </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center">
                <Button className="h-12 rounded-full border border-neutral-300 bg-white px-8 text-md font-bold text-neutral-950">
                  Show More
                </Button>
              </div>
            </section>
          </>
        )}
      </main>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white shadow-[0_-12px_24px_rgba(15,23,42,0.08)]">
          <div className="mx-auto flex w-full max-w-300 items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs text-neutral-500">{totalItems} Items</p>
              <p className="text-lg font-bold text-neutral-900">
                Rp{totalPrice.toLocaleString("id-ID")}
              </p>
            </div>
            <Button
              className="rounded-full bg-primary px-10 text-white hover:bg-primary/90"
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}

      {uiState.isMenuDetailOpen && (
        <MenuDetailModal
          menu={
            menus.find((menu) => menu.id === uiState.activeMenuId) as MenuItem
          }
          restaurantName={restaurant?.name ?? "Restaurant"}
          currentQty={
            cartItems.find((item) => item.menuId === uiState.activeMenuId)
              ?.quantity ?? 0
          }
          onClose={() => dispatch(closeMenuDetail())}
          onAdd={(menuItem) => {
            if (menuItem.id === undefined) return;
            dispatch(
              addItem({
                menuId: menuItem.id,
                name: menuItem.foodName ?? "Food Name",
                price: menuItem.price ?? 0,
                quantity: 1,
                restaurantId: Number(id),
                restaurantName: restaurant?.name ?? "Restaurant",
                image: menuItem.image,
              }),
            );
          }}
          onQtyChange={(menuId, qty) =>
            dispatch(updateQuantity({ menuId, quantity: qty }))
          }
        />
      )}

      <Footer />
    </div>
  );
};

const MenuCard = ({
  menu,
  onAdd,
  onQtyChange,
  currentQty,
  onOpen,
}: {
  menu: MenuItem;
  onAdd: (menu: MenuItem) => void;
  onQtyChange: (menuId: number, quantity: number) => void;
  currentQty: number;
  onOpen: () => void;
}) => {
  const name = menu.foodName ?? "Food Name";
  const menuId = menu.id ?? 0;
  const hasId = menu.id !== undefined;
  return (
    <div className="h-80 w-55 lg:h-95 lg:w-71.25 rounded-2xl bg-white pb-3 shadow-sm">
      <button
        className="h-55 w-55 lg:h-71.25 lg:w-71.25 overflow-hidden rounded-t-xl bg-neutral-100"
        onClick={() => {
          if (!hasId) return;
          onOpen();
        }}
        aria-label="Open menu details"
      >
        <img
          src={menu.image ?? "/detail-page/menu1.svg"}
          alt={name}
          className="h-full w-full object-cover"
        />
      </button>
      <div className="flex items-center justify-between px-3">
        <button
          className="space-y-1 text-left"
          onClick={() => {
            if (!hasId) return;
            onOpen();
          }}
          aria-label="Open menu details"
        >
          <p className="text-md font-semibold text-neutral-900">{name}</p>
          <p className="text-lg font-extrabold text-neutral-900">
            Rp{(menu.price ?? 0).toLocaleString("id-ID")}
          </p>
        </button>
        {currentQty > 0 ? (
          <div className="flex items-center gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 text-lg text-neutral-700"
              onClick={() => {
                if (!hasId) return;
                onQtyChange(menuId, Math.max(1, currentQty - 1));
              }}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="text-lg font-semibold text-neutral-900">
              {currentQty}
            </span>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg text-white"
              onClick={() => {
                if (!hasId) return;
                onQtyChange(menuId, currentQty + 1);
              }}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        ) : (
          <Button
            className="h-10 rounded-full bg-primary px-4 text-md text-white"
            onClick={() => {
              if (!hasId) return;
              onAdd(menu);
            }}
          >
            Add
          </Button>
        )}
      </div>
    </div>
  );
};

const MenuDetailModal = ({
  menu,
  currentQty,
  onAdd,
  onQtyChange,
}: {
  menu: MenuItem;
  restaurantName: string;
  currentQty: number;
  onClose: () => void;
  onAdd: (menu: MenuItem) => void;
  onQtyChange: (menuId: number, quantity: number) => void;
}) => {
  if (!menu) return null;
  const name = menu.foodName ?? "Food Name";
  const menuId = menu.id ?? 0;
  const hasId = menu.id !== undefined;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-0">
      <div className="w-full max-w-105 rounded-3xl bg-white p-0 shadow-xl">
        <div className="overflow-hidden rounded-t-2xl bg-neutral-100">
          <img
            src={menu.image ?? "/detail-page/menu1.svg"}
            alt={name}
            className="h-48 w-full object-cover"
          />
        </div>
        <div className="mt-4 p-5">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="mt-1 text-xs text-neutral-500">
            Chef's signature menu with fresh ingredients and balanced
            flavors.
          </p>
          <p className="mt-3 text-base font-bold text-neutral-900">
            Rp{(menu.price ?? 0).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="mt-4">
          {currentQty > 0 ? (
            <div className="flex items-center gap-2">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200"
                onClick={() => {
                  if (!hasId) return;
                  onQtyChange(menuId, Math.max(1, currentQty - 1));
                }}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="text-sm font-semibold">{currentQty}</span>
              <button
                className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white"
                onClick={() => {
                  if (!hasId) return;
                  onQtyChange(menuId, currentQty + 1);
                }}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <Button
              className="w-85 rounded-full bg-primary text-white hover:bg-primary/90 mb-10 mx-10"
              onClick={() => {
                if (!hasId) return;
                onAdd(menu);
              }}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
