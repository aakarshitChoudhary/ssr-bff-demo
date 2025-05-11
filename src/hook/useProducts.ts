"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import type { Product } from "@/lib/types";
import { getProducts } from "@/lib/product.service";

export function useProducts(): UseQueryResult<Product[], Error> {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: getProducts,
    retry: false,
  });
}
