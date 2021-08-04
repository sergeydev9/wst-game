import tw from "tailwind-styled-components"

export interface BoxProps {
    $light?: boolean,
    $horizontal?: boolean
}

export default tw.div<BoxProps>`
    ${(p) => p.$light ? "bg-white-ish border-0" : "bg-subtle-primary border-2 border-subtle-stroke"}
    ${(p) => p.$horizontal ? "flex-row" : "flex-col"}
    filter
    flex
    rounded-3xl
    drop-shadow-light
    items-center
    py-8
    px-8
    w-max
`