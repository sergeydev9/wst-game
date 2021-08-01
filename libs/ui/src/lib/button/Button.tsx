import tw from "tailwind-styled-components";
import { ThemeColor } from "@whosaidtrue/app-interfaces";
import { genTextColor, genBorderColor, genBgColor } from "@whosaidtrue/util"

type BorderThickness = "thin" | "medium" | "thick" | undefined;
type FontSize = "label-big" | "label-small" | "headline"; // Font sizes corresponding to the names in the design language

export interface ButtonProps {
    color?: ThemeColor;
    fontSize?: FontSize;
    border?: BorderThickness;
    $small?: boolean;
    $pill?: boolean;
    boxshadow?: 'shadow-sm' | 'shadow' | 'shadow-md' | 'shadow-lg' | 'shadow-xl' | 'shadow-2xl'
}

const borderHelper = (border: "thin" | "medium" | "thick"): string => {
    switch (border) {
        case "thin":
            return "border"
        case "medium":
            return "border-2"
        case "thick":
            return "border-4"
    }
}

const fontSizeHelper = (size: FontSize | undefined): string => {
    switch (size) {
        case "label-big":
            return "text-label-big"
        case "label-small":
            return "text-label-small"
        case "headline":
            return "text-headline"
        default:
            return "text-headline"
    }
}

const colorHelper = (color: ThemeColor | undefined, border: BorderThickness): string => {
    return (border ?
        `bg-white ${borderHelper(border)} ${(color && genTextColor(color)) || "text-primary"} ${(color && genBorderColor(color)) || "border-primary"}` // if border is specified
        : `${(color && genBgColor(color)) || "bg-primary"} text-white` // if no border specified, i.e. default
    )
}

export default tw.button<ButtonProps>`
    ${(p) => fontSizeHelper(p.fontSize)}
    ${(p) => p.boxshadow ? p.boxshadow : ""}
    ${(p) => p.$small ? "py-1 px-2" : "py-4 px-8"}
    ${(p) => colorHelper(p.color, p.border)}
    ${(p) => p.$pill ? "rounded-full" : "rounded-lg"}


`