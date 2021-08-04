import { Title1, Button } from '@whosaidtrue/ui';
import React from 'react';

const SetUpGame: React.FC = () => {
    return (
        <section className="flex flex-col gap-4 items-center">
            <Title1>Set Up a Game</Title1>
            <p>Create a new game for your group</p>
            <Button>Create Game</Button>
        </section>
    )
}

export default SetUpGame