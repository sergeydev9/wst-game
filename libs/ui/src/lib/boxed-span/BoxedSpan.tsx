import tw from "tailwind-styled-components"

export interface BoxProps {
    light?: boolean
}

export default tw.span<BoxProps>`
    bg-subtle-primary
    flex
    flex-col
    rounded-3xl
    border-2
    border-subtle-stroke
    shadow-md
    items-center
    py-4
    px-7
`