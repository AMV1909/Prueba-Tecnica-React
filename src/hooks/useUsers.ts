import { useInfiniteQuery } from "@tanstack/react-query";
import { getUsers } from "../API/Users";

export const useUsers = () => {
    const { isLoading, isError, data, refetch, fetchNextPage, hasNextPage } =
        useInfiniteQuery({
            queryKey: ["users"],
            queryFn: ({ pageParam }) => getUsers(Number(pageParam)),
            initialPageParam: 1,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
        });

    return {
        isLoading,
        isError,
        users: data?.pages.flatMap((page) => page.users) ?? [],
        refetch,
        fetchNextPage,
        hasNextPage,
    };
};
