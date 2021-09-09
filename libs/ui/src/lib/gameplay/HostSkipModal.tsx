import tw from 'tailwind-styled-components';
import Button from '../button/Button';
import loudspeaker from './loudspeaker.png';

export interface HostSkipModalProps {
    clickHandler: () => void;
}

const Container = tw.div`
bg-white
absolute
items-center
top-4
left-1/2
transform
-translate-x-1/2
rounded-xl
w-11/12
sm:w-max
flex
flex-col
sm:flex-row
select-none
gap-1
md:gap-4
text-basic-black
p-3
text-sm
`

const HostSkipModal: React.FC<HostSkipModalProps> = ({ clickHandler }) => {
    return (
        <Container>
            <div className="flex flex-row gap-2 items-start sm:items-center">
                <img width="25px" height="25px" src={loudspeaker} alt="loudspeaker" />
                <span className="font-bold text-center">If users are taking too long, you can skip them</span>
            </div>
            <Button type='button' onClick={clickHandler} buttonStyle="inline">Skip to results</Button>
        </Container>
    )
}

export default HostSkipModal