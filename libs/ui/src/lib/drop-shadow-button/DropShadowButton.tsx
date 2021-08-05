import tw from "tailwind-styled-components";

type DSButtonStyle = "solid" | "border-light" | "border-thick";
export interface IDSButtonProps {
    buttonstyle: DSButtonStyle
}


const styleHelper = (style: DSButtonStyle) => {
    switch (style) {
        case "solid":
            return "bg-primary text-white"
        case "border-light":
            return "bg-white border border-subtle-stroke text-primary"
        case "border-thick":
            return "bg-white border-2 border-primary text-primary"
        default:
            return "bg-primary text-white"
    }
}

export default tw.button<IDSButtonProps>`
    text-body-small
    font-bold
    filter
    rounded-full
    drop-shadow-subtle-stroke
    py-2
    px-4
    ${(p) => styleHelper(p.buttonstyle)}
`