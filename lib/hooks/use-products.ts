"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/lib/services/product-service";
import { Database } from "@/lib/supabase/database.types";

type Product = Database["public"]["Tables"]["products"]["Row"];
const productService = new ProductService();

export function useProducts(barbershopId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["products", barbershopId];

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey,
    queryFn: () => productService.getProducts(barbershopId),
  });

  const createMutation = useMutation<Product, Error, Partial<Product>>({
    mutationFn: (product) => productService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateMutation = useMutation<Product, Error, { id: string; updates: Partial<Product> }>({
    mutationFn: ({ id, updates }) => productService.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateStockMutation = useMutation<Product, Error, { id: string; quantity: number }>({
    mutationFn: ({ id, quantity }) => productService.updateStock(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    products,
    isLoading,
    error,
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    updateStock: updateStockMutation.mutateAsync,
  };
}