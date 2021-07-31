import tw from "tailwind-styled-components"

export interface BoxProps {
    light?: boolean
}

export default tw.span<BoxProps>`
    bg-subtle-primary
    flex
    flex-col
    items-center
    py-4
    px-7
`