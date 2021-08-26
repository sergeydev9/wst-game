import tw from "tailwind-styled-components";
export interface TextAreaProps {
    error?: boolean;
}
export default tw.textarea<TextAreaProps>`
    form-textarea
    ${(p) => p.error ? 'bg-red-subtle-fill border-red-base shadow-error' : 'bg-purple-subtle-fill border-purple-base'}
    bg-purple-subtle-fill
    text-sm
    rounded-xl
    w-full
    h-32
`