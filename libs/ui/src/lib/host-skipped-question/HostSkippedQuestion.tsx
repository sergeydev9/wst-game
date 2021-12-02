import tw from 'tailwind-styled-components';
import loudspeaker from '../assets/loudspeaker.png';

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
    z-100
`

/**
 * Announcement modal that notifies players the host skipped the current question.
 *
 */
const HostSkippedQuestion: React.FC = () => {
    return (
        <Container>
            <img
                src={loudspeaker}
                className="inline-block mr-4"
                alt="loudspeaker"
                width="25px"
                height="25px" />
            The Host has Skipped that question for the group
        </Container>
    )
}

export default HostSkippedQuestion;