import tw from 'tailwind-styled-components';
import { MovieRating } from '@whosaidtrue/app-interfaces';

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
    const background = () => {
        switch (filterValue) {
            case 'PG13':
                return 'bg-yellow-base border-yellow-base';
            case 'PG':
                return 'bg-green-base border-green-base';
            case 'R':
                return 'bg-pink-base border-pink-base';
            case 'SFW':
                return 'bg-blue-base border-blue-base'
            case 'ALL':
                return 'bg-purple-base border-purple-base'
        }
    }

    const border = () => {
        switch (filterValue) {
            case 'PG13':
                return 'text-yellow-base border-yellow-base'
            case 'PG':
                return 'text-green-base border-green-base'
            case 'R':
                return 'text-pink-base border-pink-base'
            case 'SFW':
                return 'text-blue-base border-blue-base'
            case 'ALL':
                return 'text-purple-base border-purple-base'
        }
    }
    return <Base
        {...rest}
        className={selected ? `${background()} text-white` : `${border()} bg-white`}>
        {filterValue}
    </Base>
}

export default DeckFilterButton;