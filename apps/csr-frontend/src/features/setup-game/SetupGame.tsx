import { Title1, Button } from '@whosaidtrue/ui';
import React from 'react';
import { useHistory } from 'react-router-dom';

const SetUpGame: React.FC = () => {
    const history = useHistory();

    const handler = () => {
        history.push('/decks')
    }
    return (
        <section className="flex flex-col gap-4 items-center p-8">
            <Title1>Host a Game</Title1>
            <Button type="button" className="w-max" onClick={handler}>Get Started!</Button>
        </section>
    )
}

export default SetUpGame