import tw from 'tailwind-styled-components';

export interface FilterButtonProps {
    selected: boolean
}
export default tw.button<FilterButtonProps>`
    rounded-full
    border-2
    font-semibold
    hover:bg-basic-black
    hover:text-true-white
    ${(p) => p.selected ? 'bg-basic-black text-true-white' : 'text-basic-black bg-true-white'}
    border-basic-black
    py-4
    px-7
`