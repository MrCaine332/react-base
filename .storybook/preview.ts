import type { Preview } from "@storybook/react"
import "@/shared/global.css"

const preview: Preview = {
    parameters: {
        options: {
            storySort: {
                method: "alphabetical",
            },
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
}

export default preview
