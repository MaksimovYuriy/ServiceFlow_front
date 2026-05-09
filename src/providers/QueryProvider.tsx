import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query";
import { useSnackbar } from "../context/SnackbarContext";

export function QueryProvider({ children }: { children: ReactNode }) {
  const { showSnackbar } = useSnackbar();

  const [queryClient] = useState(() => new QueryClient({
    mutationCache: new MutationCache({
      onError: (error, _vars, _ctx, mutation) => {
        if (mutation.meta?.skipGlobalErrorHandler) return;
        const axiosErr = error as { response?: { data?: { error?: string } } };
        const message = axiosErr.response?.data?.error ?? "Произошла ошибка";
        showSnackbar(message, "error");
      },
    }),
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
