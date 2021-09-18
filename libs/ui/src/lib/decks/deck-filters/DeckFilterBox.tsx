import Box from '../../containers/box/Box';
import { Headline } from '../../typography/Typography';

const DeckFilterBox: React.FC = ({ children }) => {
    return (
        <Box boxstyle="purple-subtle" className="pt-2 pb-4 px-4 w-max h-max select-none">
            <h2 className="text-center text-xl mb-1 font-black tracking-wide text-basic-black">Filter Decks</h2>
            <div className="flex flex-col md:flex-row gap-2">{children}</div>
        </Box>
    )
}

export default DeckFilterBox;