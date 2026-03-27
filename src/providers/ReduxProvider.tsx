"use client"
import React, { useMemo } from "react"
import { Provider } from "react-redux"
import { store } from "@/store/store"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create QueryClient outside the component to prevent recreating it on each render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Use React.memo to prevent unnecessary re-renders
export const ReduxProvider = React.memo(({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {children}
      </Provider>
    </QueryClientProvider>
  )
});