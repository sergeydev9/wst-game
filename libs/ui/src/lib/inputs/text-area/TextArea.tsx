import tw from "tailwind-styled-components";
export interface TextAreaProps {
    $hasError?: boolean;
}
export default tw.textarea<TextAreaProps>`
    form-textarea
    ${(p) => p.$hasError ? 'bg-red-subtle-fill border-red-base shadow-error' : 'bg-purple-subtle-fill border-purple-base'}
    bg-purple-subtle-fill
    text-sm
    rounded-xl
    w-full
    h-32
`