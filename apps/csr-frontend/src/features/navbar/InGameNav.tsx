import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectPlayerName } from '../game/gameSlice';
import { Title2 } from '@whosaidtrue/ui';


const InGameNav: React.FC = () => {
    const name = useAppSelector(selectPlayerName);

    return (
        <>
            <Title2>{name}</Title2>
        </>
    )
}

export default InGameNav;