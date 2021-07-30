import { SectionHeader, TextInput, BlueSolidButton } from '@whosaidtrue/ui';
import React from 'react';

const JoinGame: React.FC = () => {
    return (
        <section className="flex flex-col gap-4 items-center">
            <SectionHeader>Join a Game</SectionHeader>
            <p>Join an active game</p>
            <div className="flex flex-row gap-4">
                <TextInput light={true} placeholder="4 Letter Game Code" />
                <BlueSolidButton>Join</BlueSolidButton>
            </div>
        </section>
    )
}

export default JoinGame