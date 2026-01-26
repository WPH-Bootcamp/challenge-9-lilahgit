export type EndpointMatrixEntry = {
  tag: string
  operationId: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  path: string
  auth: boolean
  request: {
    params?: string
    query?: string
    body?: string
  }
  responses: Record<
    string,
    { dataSchema?: string; errorSchema?: string; notes?: string }
  >
  notes?: string
}

export const endpointMatrix: EndpointMatrixEntry[] = [
  {
    tag: "Authentication",
    operationId: "not_specified",
    method: "POST",
    path: "/api/auth/register",
    auth: false,
    request: {
      body: "name, email, phone, password (all required)",
    },
    responses: {
      "201": { dataSchema: "AuthDataSchema" },
      "400": { errorSchema: "ErrorEnvelope" },
      "409": { errorSchema: "ErrorEnvelope" },
    },
  },
  {
    tag: "Authentication",
    operationId: "not_specified",
    method: "POST",
    path: "/api/auth/login",
    auth: false,
    request: {
      body: "email, password (both required)",
    },
    responses: {
      "200": { dataSchema: "AuthDataSchema" },
      "400": { errorSchema: "ErrorEnvelope" },
      "401": { errorSchema: "ErrorEnvelope" },
    },
  },
  {
    tag: "Restaurants",
    operationId: "not_specified",
    method: "GET",
    path: "/api/resto",
    auth: false,
    request: {
      query:
        "location, range, priceMin, priceMax, rating, category, page, limit",
    },
    responses: {
      "200": { dataSchema: "RestaurantListSchema" },
      "400": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
      "500": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
    },
    notes: "Supports pagination via page/limit.",
  },
  {
    tag: "Restaurants",
    operationId: "not_specified",
    method: "GET",
    path: "/api/resto/recommended",
    auth: true,
    request: {},
    responses: {
      "200": { dataSchema: "RecommendedResponseSchema" },
      "401": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
      "500": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
    },
  },
  {
    tag: "Restaurants",
    operationId: "not_specified",
    method: "GET",
    path: "/api/resto/nearby",
    auth: true,
    request: {
      query: "range (default 10), limit",
    },
    responses: {
      "200": { dataSchema: "RestaurantListSchema" },
      "400": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
      "401": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
      "500": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
    },
  },
  {
    tag: "Restaurants",
    operationId: "not_specified",
    method: "GET",
    path: "/api/resto/best-seller",
    auth: false,
    request: {
      query: "page, limit",
    },
    responses: {
      "200": { dataSchema: "RestaurantListSchema" },
      "400": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
      "500": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
    },
    notes: "Sorted by rating (highest first). Supports pagination.",
  },
  {
    tag: "Restaurants",
    operationId: "not_specified",
    method: "GET",
    path: "/api/resto/search",
    auth: false,
    request: {
      query: "q (required), page, limit",
    },
    responses: {
      "200": { dataSchema: "RestaurantListSchema" },
      "400": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
      "500": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
    },
    notes: "Returns searchQuery in data payload.",
  },
  {
    tag: "Restaurants",
    operationId: "not_specified",
    method: "GET",
    path: "/api/resto/{id}",
    auth: false,
    request: {
      params: "id (path)",
      query: "limitMenu, limitReview",
    },
    responses: {
      "200": { dataSchema: "RestaurantDetailSchema" },
      "400": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
      "404": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
      "500": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
    },
  },
  {
    tag: "Orders",
    operationId: "not_specified",
    method: "POST",
    path: "/api/order/checkout",
    auth: true,
    request: {
      body: "restaurants[{restaurantId, items[{menuId, quantity}]}], deliveryAddress (required), phone, paymentMethod, notes",
    },
    responses: {
      "201": { dataSchema: "CheckoutResponseSchema" },
      "400": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
      "401": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
      "500": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
    },
  },
  {
    tag: "Orders",
    operationId: "not_specified",
    method: "GET",
    path: "/api/order/my-order",
    auth: true,
    request: {
      query: "status (default done), page, limit",
    },
    responses: {
      "200": { dataSchema: "OrdersResponseSchema" },
      "400": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
      "401": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
      "500": { errorSchema: "ErrorEnvelope", notes: "Schema not specified" },
    },
    notes: "Returns orders grouped per transaction.",
  },
]
