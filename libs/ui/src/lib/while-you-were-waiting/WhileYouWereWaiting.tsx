import Box from '../containers/box/Box';
import fencer from './fencer.png';

const WhileYouWereWaiting: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    return (
        <Box boxstyle="purple-subtle" className="md:text-2xl sm:text-xl text-lg sm:py-6 sm:px-4 py-4 px-4 md:py-8 mt-8 md:px-6 mx-auto mb-14 w-max">
            <span>While you were waiting:</span>
            <div>
                <span className="font-bold inline-block">&#8220;tis but a flesh wound!&#8221;</span>
                <img className="inline-block ml-1" src={fencer} alt="fencer" width='25px' height='25px' />
            </div>
        </Box>
    )
}

export default WhileYouWereWaiting