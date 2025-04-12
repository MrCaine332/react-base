import { MobxQueryClient } from "@/shared/lib/mobx/mobx-query"
import { hashKey } from "@tanstack/query-core"

const MAX_FAILURE_COUNT = 3

export const queryClient = new MobxQueryClient({
    defaultOptions: {
        queries: {
            throwOnError: true,
            queryKeyHashFn: hashKey,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            staleTime: 5 * 60 * 1000,
            retry: (failureCount, error) => {
                if (error instanceof Response && error.status >= 500) {
                    return MAX_FAILURE_COUNT - failureCount > 0
                }
                return false
            },
        },
        mutations: {
            throwOnError: true,
        },
    },
})
