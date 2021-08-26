import tw from "tailwind-styled-components";

export type TextInputProps = { $border?: boolean, error?: boolean }
export default tw.input<TextInputProps>`
        ${(p) => p.$border && !p.error ? 'border-purple-base' : ''}
        ${(p) => p.error ? 'bg-red-subtle-fill border-red-base shadow-error' : 'bg-purple-subtle-fill'}
        form-input
        w-full
        px-3
        py-4
        placeholder-basic-gray
        text-sm
        rounded-xl
    `;