import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App.tsx"
import { queryClient } from "./lib/queryClient"
import { store } from "./store"
import { setAuthToken } from "./lib/api"

setAuthToken(import.meta.env.VITE_API_TOKEN)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
