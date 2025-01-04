"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

interface UseInfiniteQueryOptions<T> {
  queryKey: string[];
  queryFn: (page: number, pageSize: number) => Promise<T[]>;
  pageSize?: number;
  enabled?: boolean;
}

export function useInfiniteList<T>({
  queryKey,
  queryFn,
  pageSize = 10,
  enabled = true,
}: UseInfiniteQueryOptions<T>) {
  const [hasNextPage, setHasNextPage] = useState(true);

  const query = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const items = await queryFn(pageParam as number, pageSize);
      if (items.length < pageSize) {
        setHasNextPage(false);
      }
      return items;
    },
    initialPageParam: 1,
    getNextPageParam: (_, pages) => (hasNextPage ? pages.length + 1 : undefined),
    enabled,
  });

  const items = query.data?.pages.flat() ?? [];

  return {
    items,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}