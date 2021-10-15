import tw from 'tailwind-styled-components';
import { useEffect, useState } from 'react';
import { GrFormClose } from '@react-icons/all-files/gr/GrFormClose';
import CelebrationIcons from '../../celebration-icons/CelebrationIcons';
import './winner.css'

export interface WinnerAnnouncementProps {
    name: string;
    onRequestClose?: () => void;
}

const Container = tw.div`
font-black
relative
select-none
w-full
sm:w-28rem
h-32rem
sm:h-36rem
text-center
rounded-3xl
bg-purple-subtle-fill
leading-normal
`

const WinnerAnnouncement: React.FC<WinnerAnnouncementProps> = ({ name, onRequestClose }) => {
    const [countDownOver, setCountdownOver] = useState(false);
    // e
    useEffect(() => {
        const timer = setTimeout(() => setCountdownOver(true), 2800)
        return () => {
            clearTimeout(timer)
        }
    })
    return (
        countDownOver ? <Container className="flex flex-col justify-center">
            <GrFormClose className="absolute right-1 sm:right-6 sm:top-8 top-4 text-4xl z-10 font-black cursor-pointer" onClick={onRequestClose} />
            <span className="text-3xl mb-6">{name}!</span>
            <CelebrationIcons />
        </Container> :
            <Container className="text-6xl sm:text-8xl p-10 text-purple-base flex flex-col justify-center gap-2 sm:gap-4">
                <div>And</div><div>the</div><div>Winner</div><div className="wnr-announce-txt w-1/2 self-center text-left">Is</div>
            </Container>
    )
}

export default WinnerAnnouncement;