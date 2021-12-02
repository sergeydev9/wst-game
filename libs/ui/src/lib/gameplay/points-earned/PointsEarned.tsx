import { useEffect, useState } from 'react';
import tw from 'tailwind-styled-components';

const Text = tw.h2`
    font-extrabold
    text-large-title
    text-green-base
    text-center
    mb-4
`

export interface PointsEarnedProps {
    points: number;
}

/**
 * Animated display for the number of points earned.
 */
const PointsEarned: React.FC<PointsEarnedProps> = ({ points }) => {
    const [displayPoints, setDisplayPoints] = useState(0);
    const [startTimestamp, setStartTimestamp] = useState(0);

    const duration = 1100; // total time the animation takes to run in ms

    useEffect(() => {

        const step = (timestamp: number) => {
            if (!startTimestamp) setStartTimestamp(timestamp);
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setDisplayPoints(Math.floor(progress * points));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    }, [points, startTimestamp])

    return <Text>+{displayPoints} pts</Text>
}

export default PointsEarned;