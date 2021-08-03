import { Title1, TextInput, Button } from '@whosaidtrue/ui';
import React from 'react';

const JoinGame: React.FC = () => {
    return (
        <section className="flex flex-col gap-4 items-center">
            <Title1>Join a Game</Title1>
            <p>Join an active game</p>
            <div className="flex flex-row gap-4">
                <TextInput placeholder="4 Letter Game Code" />
                <Button>Join</Button>
            </div>
        </section>
    )
}

export default JoinGame