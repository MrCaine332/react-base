import { DefaultError, QueryKey } from "@tanstack/query-core"

import { MobxQueryConfig } from "./mobx-query.types"

export type QueryOptionsParams<TData, TError = DefaultError, TQueryKey extends QueryKey = QueryKey> = Omit<
    MobxQueryConfig<TData, TError, TQueryKey>,
    "queryClient"
>

export function queryOptions<TData, TError = DefaultError, TQueryKey extends QueryKey = QueryKey>(
    options: QueryOptionsParams<TData, TError, TQueryKey>
): QueryOptionsParams<TData, TError, TQueryKey>

export function queryOptions(options: unknown) {
    return options
}
