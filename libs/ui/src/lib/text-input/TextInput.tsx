import tw from "tailwind-styled-components";

export type TextInputProps = { $border?: boolean }
export default tw.input<TextInputProps>`
        ${(p) => p.$border ? 'border-purple-base' : 'border-0'}
        form-input
        w-full
        px-3
        py-4
        placeholder-basic-gray
        bg-purple-subtle-fill
        text-sm
        rounded-xl
    `;