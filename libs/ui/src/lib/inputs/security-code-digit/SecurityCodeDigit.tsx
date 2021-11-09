import { forwardRef } from 'react';
import tw from "tailwind-styled-components";

export interface SecurityCodeDigitProps extends React.InputHTMLAttributes<HTMLInputElement> {
    $hasError?: boolean
}

const Styled = tw.input<SecurityCodeDigitProps>`
    ${(p) => p.$hasError ? 'bg-red-subtle-fill border-red-base shadow-error' : 'bg-white-ish border-purple-base'}
    form-input
    border-1
    rounded-2xl
    sm:rounded-3xl
    h-24
    w-10
    sm:h-40
    sm:w-28
    text-title-1
    text-center
    cursor-pointer
`


export default Styled