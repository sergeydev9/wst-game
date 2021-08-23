import tw from "tailwind-styled-components"

export type BoxStyle = 'white' | 'light-gray' | 'purple-subtle';

export interface BoxProps {
    boxstyle: BoxStyle;
    $horizontal?: boolean;
    $dropShadow?: boolean;
}

const styleHelper = (style: BoxStyle) => {
    switch (style) {
        case 'white':
            return "bg-white-ish border-0"
        case 'light-gray':
            return "bg-light-gray border-0"
        case 'purple-subtle':
            return "bg-purple-subtle-fill border-2 border-purple-subtle-stroke"
        default:
            return "bg-white-ish border-0"
    }
}

export default tw.div<BoxProps>`
    ${(p) => styleHelper(p.boxstyle)}
    ${(p) => p.$horizontal ? "flex-row" : "flex-col"}
    ${(p) => p.$dropShadow ? "filter drop-shadow-light" : ""}
    flex
    rounded-3xl
    items-center
`