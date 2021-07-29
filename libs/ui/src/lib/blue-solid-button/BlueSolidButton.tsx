import tw from "tailwind-styled-components";

export interface SolidButtonProps {
    light?: boolean
}

export default tw.button<SolidButtonProps>`
    ${(p) => p.light ? "bg-iris-light hover:bg-iris-very-light" : "bg-iris-dark hover:bg-iris-light"}
    font-light
    px-12
    py-2
    text-white
`