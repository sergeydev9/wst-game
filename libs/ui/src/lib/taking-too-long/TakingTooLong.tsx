import tw from 'tailwind-styled-components';
import loudspeaker from '../assets/loudspeaker.png';
import Button from '../button/Button';

const Container = tw.div`
    shadow-md
    py-4
    sm:px-5
    px-2
    bg-white
    text-center
    sm:w-max
    w-full
    text-headline
    font-bold
    flex
    flex-col
    sm:flex-row
    gap-2
    sm:gap-4
    items-center
    rounded-xl
`

interface TakingTooLongProps {
    handler: () => void;
}

/**
 * A message modal that displays a button for the host to skip to results
 *
 * @param handler function that triggers the skip to results event
 * @returns
 */
const TakingTooLong: React.FC<TakingTooLongProps> = ({ handler }) => {
    return (
        <Container>
            <span>
                <img
                    src={loudspeaker}
                    className="inline-block mr-4"
                    alt="loudspeaker"
                    width="25px"
                    height="25px" />
                If users are taking too long, you can skip them
            </span>
            <Button buttonStyle="inline" onClick={handler}>
                Skip to results
            </Button>
        </Container>
    )
}

export default TakingTooLong;
