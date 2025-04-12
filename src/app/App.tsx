import React from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/shared/api/queryClient"
import { observer } from "mobx-react-lite"

const Main = observer(() => {
    return <div>App</div>
})

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Main />
        </QueryClientProvider>
    )
}
