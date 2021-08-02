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
    boxshadow?: 'shadow-sm' | 'shadow' | 'shadow-md' | 'shadow-lg' | 'shadow-xl' | 'shadow-2xl' | 'shadow-gameplay' // use shadow-gameplay for filled gameplay button
}

/**
 * Generate a border thickness tailwind class based on input prop
 *
 * @param {("thin" | "medium" | "thick")} border
 * @return {*}  {string}
 */
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

/**
 * Generate font size tailwind classes based on input props. Defaults to "text-headline"
 *
 * @param {(FontSize | undefined)} size
 * @return {*}  {string}
 */
const fontSizeHelper = (size: FontSize | undefined): string => {
    switch (size) {
        case "label-big":
            return "text-label-big font-roboto font-medium"
        case "label-small":
            return "text-label-small font-roboto font-medium"
        case "headline":
            return "text-headline font-bold"
        default:
            return "text-headline font-bold"
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
    ${(p) => p.$small ? "py-1 px-3" : "py-4 px-8"}
    ${(p) => colorHelper(p.color, p.border)}
    ${(p) => p.$pill ? "rounded-full" : "rounded-lg"}


`