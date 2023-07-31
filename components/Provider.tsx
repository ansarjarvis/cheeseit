"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

let queryClient = new QueryClient();
let Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Provider;
