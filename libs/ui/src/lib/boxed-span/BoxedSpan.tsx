import tw from "tailwind-styled-components"

export interface BoxProps {
    $light?: boolean
}

export default tw.span<BoxProps>`
    ${(p) => p.$light ? "bg-white-ish border-0" : "bg-subtle-primary border-2 border-subtle-stroke"}
    filter
    flex
    flex-col
    rounded-3xl
    drop-shadow-light
    items-center
    py-4
    px-7
`