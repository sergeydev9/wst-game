import { useEffect, useState } from 'react';

export interface WinnerAnnouncementProps {
    name: string;
}

const WinnerAnnouncement: React.FC<WinnerAnnouncementProps> = ({ name }) => {
    const [dots, setDots] = useState('.');
    const [countDownOver, setCountdownOver] = useState(false);

    useEffect(() => {
        const timer1 = setTimeout(() => setDots('..'), 1000)
        const timer2 = setTimeout(() => setDots('...'), 2000)
        const timer3 = setTimeout(() => setCountdownOver(true))
    })
    return (
        <div>
            And the Winner Is{dots}
        </div>
    )
}

export default WinnerAnnouncement;