import tw from 'tailwind-styled-components';
import { MovieRating } from '@whosaidtrue/app-interfaces';
import { borderAndTextColorPicker, backgroundColorPicker } from '@whosaidtrue/util';

export interface FilterButtonProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    selected: boolean;
    filterValue: MovieRating | 'ALL' | 'SFW'
}

const Base = tw.button`
    rounded-full
    border-2
    text-sm
    cursor-pointer
    font-bold
    py-1
    px-4
`

const DeckFilterButton: React.FC<FilterButtonProps> = ({ filterValue, selected, ...rest }) => {
    return <Base
        {...rest}
        className={selected ? `${backgroundColorPicker(filterValue)} text-white` : `${borderAndTextColorPicker(filterValue)} bg-white`}>
        {filterValue}
    </Base>
}

export default DeckFilterButton;