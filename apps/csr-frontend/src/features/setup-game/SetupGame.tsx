import { SectionHeader, BlueSolidButton } from '@whosaidtrue/ui';
import React from 'react';

const SetUpGame: React.FC = () => {
    return (
        <section className="flex flex-col gap-4 items-center">
            <SectionHeader>Set Up a Game</SectionHeader>
            <p>Create a new game for your group</p>
            <BlueSolidButton>Create Game</BlueSolidButton>
        </section>
    )
}

export default SetUpGame