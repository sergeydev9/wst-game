import tw from "tailwind-styled-components"

export interface BoxProps {
    light: boolean
}

export default tw.span<BoxProps>`
    ${(p) => p.light ? "bg-light-grey" : "bg-dark-grey"}
    flex
    flex-col
    items-center
    border-2
    border-black
    py-4
    px-7
`