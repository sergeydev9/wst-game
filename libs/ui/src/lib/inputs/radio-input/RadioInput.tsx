import tw from "tailwind-styled-components";

export default tw.input`
    form-radio
    text-purple-base
    bg-purple-subtle-fill
    cursor-pointer
    w-8
    h-8
    border-1
    border-purple-subtle-stroke
    checked:bg-none
    checked:ring-purple-subtle-fill
    checked:ring-8
    ring-inset
    checked:p-1
    checked:bg-clip-content
    checked:border-2
    checked:border-purple-subtle-stroke
    checked:ring-opacity-100
    focus:ring-0
`;