import { MovieRating } from '@whosaidtrue/app-interfaces';
import tw from 'tailwind-styled-components';
import Box from '../../containers/box/Box';
import { Title3, Headline } from '../../typography/Typography';

export interface DetailsProps {
    description: string;
    sfw: boolean;
    example_question?: string;
    movie_rating: MovieRating
}

const Label = tw.span`
    rounded-full
    px-3
    py-1
    text-center
    text-true-white
    text-sm
    font-semibold
`

// The UI says sample question, but in the DB, and everywhere else, it's example_question
const DeckDetails: React.FC<DetailsProps> = ({ description, sfw, example_question, movie_rating }) => {

    const backgroundHelper = () => {
        switch (movie_rating) {
            case 'PG13':
                return 'bg-yellow-base border-yellow-base';
            case 'PG':
                return 'bg-green-base border-green-base';
            case 'R':
                return 'bg-pink-base border-pink-base';
            default:
                return 'bg-purple-base border-purple-base';
        }

    }
    return (
        <Box boxstyle='purple-subtle' className="w-full py-5 px-8 gap-4 text-center">
            <Title3 >{description}</Title3>
            <div className="flex flex-row gap-2">
                <Label className={backgroundHelper()}>{movie_rating}</Label>
                {sfw && <Label className="bg-blue-base border-blue-base">SFW</Label>}
            </div>
            {example_question && <div>
                <Headline>Sample Question</Headline>
                <p>"{example_question}"</p>
            </div>}
        </Box>
    )
}

export default DeckDetails