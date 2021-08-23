import tw from "tailwind-styled-components";
import { ThemeColor } from "@whosaidtrue/app-interfaces";
import { genTextColor, genBorderColor, genBgColor } from "@whosaidtrue/util"

export type BorderThickness = "thin" | "medium" | "thick";
export type FontSize = "label-big" | "label-small" | "headline" | "jumbo"; // Font sizes corresponding to the names in the design language

export interface ButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    color?: ThemeColor;
    fontSize?: FontSize;
    border?: BorderThickness;
    $small?: boolean;
    $pill?: boolean;
}

/**
 * Generate a border thickness tailwind class based on input prop
 *
 * @param {("thin" | "medium" | "thick")} border
 * @return {*}  {string}
 */
const borderHelper = (border: BorderThickness): string => {
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
        case 'jumbo':
            return "font-bold text-2xl"
        case "label-big":
            return "text-label-big font-medium"
        case "label-small":
            return "text-label-small font-medium"
        case "headline":
            return "text-headline font-bold"
        default:
            return "text-headline font-bold"
    }
}

const colorHelper = (color?: ThemeColor, border?: BorderThickness): string => {
    return (border ?
        `bg-white ${borderHelper(border)} ${(color && genTextColor(color)) || "text-blue-base"} ${(color && genBorderColor(color)) || "border-blue-base"}` // if border is specified
        : `${(color && genBgColor(color)) || "bg-blue-base"} ${color === 'yellow-base' ? 'text-yellow-text' : 'text-white'}` // if no border specified, i.e. default
    )
}


/**
 * Default button component.
 *
 * If border is undefined, and color is 'yellow-base', text color
 * will be yellow-dark, otherwise, text will be white.
 *
 * TODO: Maybe refactoring this. It's starting to get clumsy with the new design.
 *
 * Could just make a new component specifically for the yellow buttons, since they're the outliers.
 */
export default tw.button<ButtonProps>`
    ${(p) => fontSizeHelper(p.fontSize)}
    ${(p) => p.$small ? "py-1 px-3" : "py-3 px-6"}
    ${(p) => colorHelper(p.color, p.border)}
    ${(p) => p.$pill ? "rounded-full" : "rounded-lg"}


`