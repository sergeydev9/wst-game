import React from 'react';
import tw from "tailwind-styled-components";

const Styled = tw.input`
    form-input
    border-1
    border-purple-base
    rounded-xl
    h-24
    w-20
    bg-purple-subtle-fill
    text-title-1
    text-center
    cursor-pointer
`
// TODO: Find out what validation styling should be for this.
const DigitInput: React.FC = (props) => <Styled {...props} type="text" maxLength={1} size={1} min={0} max={9} pattern="[0-9]{1}" />

export default DigitInput