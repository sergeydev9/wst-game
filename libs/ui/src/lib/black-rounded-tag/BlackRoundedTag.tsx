import React from 'react';
import tw from "tailwind-styled-components";

export interface TagProps {
    selected: boolean
}

export const BlackRoundedTagStyle = tw.button<TagProps>`
    ${(p) => p.selected ? "bg-black text-white" : "text-black bg-white"}
    border-2
    border-black
    rounded-full
    py-3
    px-6
`

const tag: React.FC<TagProps> = (props) => {
    return <BlackRoundedTagStyle {...props} type="button" />
}

export default tag;