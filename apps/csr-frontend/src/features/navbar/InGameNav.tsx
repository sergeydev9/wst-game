import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectPlayerName } from '../game/gameSlice';
import { Title2, OptionsWheel } from '@whosaidtrue/ui';


const InGameNav: React.FC = () => {
    const name = useAppSelector(selectPlayerName);

    return (
        <>
            <Title2>{name}</Title2>
            <DropShadowButton buttonstyle="border-light"><span className="flex flex-row items-center h-full gap-2"><OptionsWheel />Game Options</span></DropShadowButton>
        </>
    )
}

export default InGameNav;