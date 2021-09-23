import tw from "tailwind-styled-components";

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    $border?: boolean,
    $hasError?: boolean
}

export default tw.input<TextInputProps>`
        ${(p) => p.$border && !p.$hasError ? 'border-purple-base' : ''}
        ${(p) => p.$hasError ? 'bg-red-subtle-fill border-red-base shadow-error' : 'bg-purple-subtle-fill'}
        form-input
        w-full
        px-3
        py-3
        placeholder-basic-gray
        text-sm
        rounded-xl
    `;