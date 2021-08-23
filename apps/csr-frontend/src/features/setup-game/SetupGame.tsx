import { Title1, WrappedButton } from '@whosaidtrue/ui';
import React from 'react';
import { useHistory } from 'react-router-dom';

const SetUpGame: React.FC = () => {
    const history = useHistory();

    // TODO: finish
    const handler = () => {
        // history.push('/game/choose-deck')
    }
    return (
        <section className="flex flex-col gap-4 items-center p-8">
            <Title1>Host a Game</Title1>
            <WrappedButton type="button" color="blue" className="w-max" fontSize="label-big" onClick={handler}>Get Started</WrappedButton>
        </section>
    )
}

export default SetUpGame