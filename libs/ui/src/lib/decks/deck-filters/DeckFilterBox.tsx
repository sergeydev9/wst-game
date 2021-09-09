import Box from '../../containers/box/Box';
import { Headline } from '../../typography/Typography';

const DeckFilterBox: React.FC = ({ children }) => {
    return (
        <Box boxstyle="white" className="p-8 w-max h-max">
            <Headline className="text-center mb-3">Filter Question Decks</Headline>
            <div className="flex flex-col md:flex-row gap-4">{children}</div>
        </Box>
    )
}

export default DeckFilterBox;