import tw from "tailwind-styled-components";

export default tw.input`
    form-radio
    text-primary
    bg-subtle-primary
    cursor-pointer
    w-8
    h-8
    border-0
    checked:bg-none
    checked:ring-8
    ring-inset
    checked:p-1
    checked:bg-clip-content
    checked:ring-subtle-primary
    checked:ring-opacity-100
`;