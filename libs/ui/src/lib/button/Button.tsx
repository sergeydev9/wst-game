import tw from "tailwind-styled-components";
import { ThemeColor } from "@whosaidtrue/app-interfaces";
import { genTextColor, genBorderColor, genBgColor } from "@whosaidtrue/util"

export interface ButtonProps {
    color: ThemeColor;
    $border?: boolean;
    $small?: boolean;
    $pill?: boolean;
    boxshadow?: 'shadow-sm' | 'shadow' | 'shadow-md' | 'shadow-lg' | 'shadow-xl' | 'shadow-2xl'
}

const colorHelper = (color: ThemeColor, border: boolean | undefined): string => {
    const borderBase = "border-2 bg-white";
    return border ? `${borderBase} ${genTextColor(color)} ${genBorderColor(color)}` : `${genBgColor(color)} text-white`
}

export default tw.button<ButtonProps>`
    box-content
    ${(p) => p.boxshadow ? p.boxshadow : ""}
    ${(p) => p.$small ? "py-1 px-2 text-sm" : "py-4 px-8"}
    ${(p) => colorHelper(p.color, p.$border)}
    ${(p) => p.$pill ? "rounded-full" : "rounded-lg"}


`