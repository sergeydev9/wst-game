import tw from "tailwind-styled-components";

export interface ITextInputProps {
    light?: boolean
}

export default tw.input<ITextInputProps>`
    ${(p) => p.light ? "border-gray-600 bg-gray-200" : "border-gray-300"}
    w-full 
    h-10 
    px-4
    py-6
    border-b-2 
    max-w-xs
    text-sm
    `;
